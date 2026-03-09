import { api } from "./axios";
import type { ApiResponse, AuthData, MeData } from "@/types/api";

/**
 * API wrapper for authentication endpoints
 */
export const authAPI = {
    /**
     * Register a new user
     * @param email User email
     * @param password User password
     * @param name Optional user name
     * @returns API response with AuthData
     */
    async register(email: string, password: string, name?: string): Promise<ApiResponse<AuthData>> {
        return api.post("/auth/register", { email, password, name });
    },

    /**
     * Log in a user
     * @param email User email
     * @param password User password
     * @returns API response with AuthData
     */
    async login(email: string, password: string): Promise<ApiResponse<AuthData>> {
        return api.post("/auth/login", { email, password });
    },

    /**
     * Get currently authenticated user
     * @returns API response with MeData
     */
    async me(): Promise<ApiResponse<MeData>> {
        return api.get("/auth/me");
    },

    /**
     * Update the authenticated user's profile
     * @param name Optional display name
     * @param avatar Optional avatar URL
     * @returns API response with updated MeData
     */
    async updateProfile(name?: string, avatar?: string): Promise<ApiResponse<MeData>> {
        return api.put("/auth/profile", { name, avatar });
    },

    /**
     * Delete the authenticated user's account permanently
     * @returns API response with success message
     */
    async deleteAccount(): Promise<ApiResponse<{ message: string }>> {
        return api.delete("/auth/account");
    },
};
