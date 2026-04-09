import axios from "axios";

interface ErrorResponse {
    success: false;
    message: string;
    errors?: {
        field: string;
        message: string;
    } | Array<{
        field: string;
        message: string;
    }>;
}

/**
 * General error handler that extracts and returns a user-friendly error message
 * from backend API responses, axios errors, or generic errors.
 *
 * @param error - The error object (can be AxiosError, Error, or unknown)
 * @param defaultMessage - Fallback message if no error details can be extracted
 * @returns Error message string
 */
export const handleError = (
    error: unknown,
    defaultMessage: string = "Something went wrong. Please try again."
): string => {
    // Handle axios errors from server
    if (axios.isAxiosError(error)) {
        const data = error.response?.data as ErrorResponse | undefined;

        // Extract field-specific validation errors from zod
        if (data?.errors) {
            if (Array.isArray(data.errors) && data.errors.length > 0) {
                return data.errors.map((err) => err.message).join(", ");
            }

            if (!Array.isArray(data.errors) && data.errors.message) {
                return data.errors.message;
            }
        }

        // Extract main message from response
        if (data?.message) {
            return data.message;
        }

        // Fallback to axios error message
        if (error.message) {
            return error.message;
        }
    }

    // Handle native errors
    if (error instanceof Error) {
        return error.message;
    }

    // Fallback to default generic error message
    return defaultMessage;
};
