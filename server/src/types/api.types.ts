/**
 * Standard API response envelope used across all controllers.
 */
export interface ApiResponse<T = undefined> {
    success: boolean;
    message: string;
    data?: T;
}
