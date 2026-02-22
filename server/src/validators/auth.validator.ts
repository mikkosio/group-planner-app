import { z } from 'zod';
import { PASSWORD_REGEX } from '../config/constants';
/**
 * Zod schema for user registration validation.
 * Validates the request body for registering a new user.
 * @param body - The request body containing email, password, and name.
 */
export const registerSchema = z.object({
    body: z.object({
        email: z
            .string()
            .email('Invalid email format')
            .toLowerCase()
            .trim(),
        password: z
            .string()
            .min(8, 'Password must be at least 8 characters')
            .regex(
                new RegExp(PASSWORD_REGEX),
                'Password must contain at least one uppercase letter, one lowercase letter, and one number'
            ),
        name: z
            .string()
            .min(2, 'Name must be at least 2 characters')
            .max(100, 'Name must not exceed 100 characters')
            .trim(),
    }),
});

export const loginSchema = z.object({
    body: z.object({
        email: z
            .string()
            .email('Invalid email format')
            .toLowerCase()
            .trim(),
        password: z.string(),
    }),
});

// Export type for TypeScript
export type RegisterInput = z.infer<typeof registerSchema>['body'];
export type LoginInput = z.infer<typeof loginSchema>['body'];