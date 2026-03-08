import { useState, useEffect, createContext, useContext, useRef } from "react";
import { authAPI } from "@/lib/auth";
import type { User } from "@/types/models"
import { jwtDecode, type JwtPayload } from "jwt-decode";

/**
 * Shape of the AuthContext
 */
interface AuthContextValue {
    user: User | null;
    isLoading: boolean;
    authError: string | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    register: (email: string, password: string, name?: string) => Promise<void>;
    updateProfile: (name?: string, avatar?: string) => Promise<void>;
}

/** Props for AuthProvider component */
interface AuthProviderProps {
    children: React.ReactNode;
}

/** React context for authentication */
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * Provides authentication state and functions to children
 */
export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setLoading] = useState<boolean>(true);
    const [authError, setAuthError] = useState<string | null>(null);
    const logoutTimerRef = useRef<number | null>(null);

    /**
     * Sets a timeout to automatically log out the user when the token expires
     * @param exp JWT expiration time in seconds
     */
    const setLogoutTimer = (exp: number) => {
        // Clear logout timer
        if (logoutTimerRef.current) {
            clearTimeout(logoutTimerRef.current);
        }

        const timeout = exp * 1000 - Date.now();
        if (timeout > 0) {
            logoutTimerRef.current = window.setTimeout(() => logout(), timeout);
        } else {
            logout();
        }
    }

    /**
     * Check if user is already authenticated on mount
     */
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem("authToken");
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                let exp: number | undefined;
                try {
                    ({ exp } = jwtDecode<JwtPayload>(token));
                } catch {
                    // Malformed token — clear and bail out
                    localStorage.removeItem("authToken");
                    setLoading(false);
                    return;
                }

                // Logout if token has no exp or is expired
                if (!exp || Date.now() >= exp * 1000) {
                    logout();
                    return;
                }

                // Token is valid — set auto-logout timer
                setLogoutTimer(exp);

                // Fetch current user from /me endpoint
                const res = await authAPI.me();
                setUser(res.data.user);
            } catch (error: unknown) {
                // 401 means token is rejected by server — clear it
                // Any other error (network, 5xx) — keep token, surface error
                const status =
                    error instanceof Object &&
                    "response" in error &&
                    (error as { response?: { status?: number } }).response?.status;
                if (status === 401 || status === undefined) {
                    localStorage.removeItem("authToken");
                } else {
                    setAuthError("Could not verify session. Please try again.");
                }
            } finally {
                setLoading(false);
            }

        };
        
        checkAuth();

        // Auto-logout when axios receives a 401 (server-side token rejection)
        window.addEventListener("auth:logout", logout);

        return () => {
            window.removeEventListener("auth:logout", logout);
            // Clear logout timer on unmount
            if (logoutTimerRef.current) {
                clearTimeout(logoutTimerRef.current);
            };
        }
    }, []);

    /**
     * Log in a user and store the auth token
     * @param email User email
     * @param password User password
     */
    const login = async (email: string, password: string) => {
        setAuthError(null);
        const res = await authAPI.login(email, password);
        const { token, user: userData } = res.data;

        // Save token to localStorage
        localStorage.setItem("authToken", token);

        // Update user state
        setUser({
            id: userData.id,
            email: userData.email,
            name: userData.name,
            avatar: userData.avatar,
            createdAt: userData.createdAt,
            updatedAt: userData.updatedAt,
        });

        // Set auto logout timer
        const { exp } = jwtDecode<JwtPayload>(token);
        if (exp) {
            setLogoutTimer(exp);
        }
    };

    /**
     * Register a new user, store the auth token, and set the session
     * @param email User email
     * @param password User password
     * @param name Optional display name
     */
    const register = async (email: string, password: string, name?: string) => {
        setAuthError(null);
        const res = await authAPI.register(email, password, name);
        const { token, user: userData } = res.data;

        localStorage.setItem("authToken", token);

        setUser({
            id: userData.id,
            email: userData.email,
            name: userData.name,
            avatar: userData.avatar,
            createdAt: userData.createdAt,
            updatedAt: userData.updatedAt,
        });

        const { exp } = jwtDecode<JwtPayload>(token);
        if (exp) {
            setLogoutTimer(exp);
        }
    };

    /**
     * Update the current user's profile and sync state
     * @param name Optional display name
     * @param avatar Optional avatar URL
     */
    const updateProfile = async (name?: string, avatar?: string) => {
        const res = await authAPI.updateProfile(name, avatar);
        setUser(res.data.user);
    };

    /**
     * Log out the current user
     */
    const logout = () => {
        if (logoutTimerRef.current) {
            clearTimeout(logoutTimerRef.current);
            logoutTimerRef.current = null;
        };

        localStorage.removeItem("authToken");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, authError, login, logout, register, updateProfile }}>
            {isLoading ? <div>Loading...</div> : children}
        </AuthContext.Provider>
    );
};

/**
 * Hook to access the authentication context
 * @throws Error if used outside AuthProvider
 */
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
};