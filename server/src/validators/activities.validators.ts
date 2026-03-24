import { z } from "zod";

/**
 * Zod schema for creating a new activity.
 */
export const createActivitySchema = z.object({
    body: z.object({
        title: z
            .string()
            .min(1, "Activity title is required")
            .max(255, "Activity title must not exceed 255 characters")
            .trim(),
        description: z.string().trim().optional(),
        proposedTime: z.iso.datetime(),
    }),
});

/**
 * Zod schema for updating an existing activity (name, description, and/or proposedTime).
 */
export const updateActivitySchema = z.object({
    body: z.object({
        title: z
            .string()
            .min(1, "Activity title is required")
            .max(255, "Activity title must not exceed 255 characters")
            .trim()
            .optional(),
        description: z.string().trim().optional(),
        proposedTime: z.iso.datetime().optional(),
    })
});

export type CreateActivityInput = z.infer<typeof createActivitySchema>["body"];
export type UpdateActivityInput = z.infer<typeof updateActivitySchema>["body"];;
