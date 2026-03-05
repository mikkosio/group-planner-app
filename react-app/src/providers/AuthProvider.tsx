import { useState, useEffect, createContext, useContext } from "react";
import { authAPI } from "@/lib/auth";
import type { User } from "@/types/models"

/**
 * Shape of the AuthContext
 */
interface AuthContextValue {
    /** Currently authenticated user, or null if not logged in */
    user: User | null;

    /**
     * Log in a user
     * @param email User's email
     * @param password User's password
     */
    login: (email: string, password: string) => void;

    /** Log out the current user */
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
    const [loading, setLoading] = useState<boolean>(true);

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
        localStorage.removeItem("authToken");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {loading ? <div>Loading...</div> : children}
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