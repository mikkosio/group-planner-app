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
    login: (email: string, password: string) => void;
    logout: () => void;
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
                const { exp } = jwtDecode<JwtPayload>(token);

                // Logout if token has no exp or expired
                if (!exp || Date.now() >= exp * 1000) {
                    logout();
                    return;
                } else {
                    // Token is valid, set auto timeout
                    setLogoutTimer(exp);
                }

                // Fetch current user from /me endpoint
                const res = await authAPI.me();
                setUser(res.data.user);
            } catch (error) {
                // Token invalid or expired, remove it
                localStorage.removeItem("authToken");
            } finally {
                setLoading(false);
            }

        };
        
        checkAuth();
        
        return () => {
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
        <AuthContext.Provider value={{ user, isLoading, login, logout }}>
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