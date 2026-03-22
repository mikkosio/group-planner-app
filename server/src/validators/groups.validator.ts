import { z } from "zod";

/**
 * Zod schema for creating a new group.
 */
export const createGroupSchema = z.object({
    body: z.object({
        name: z
            .string()
            .min(1, "Group name is required")
            .max(255, "Group name must not exceed 255 characters")
            .trim(),
        description: z.string().trim().optional(),
    }),
});

/**
 * Zod schema for updating an existing group (name and/or description).
 */
export const updateGroupSchema = z.object({
    body: z.object({
        name: z
            .string()
            .min(1, "Group name cannot be empty")
            .max(255, "Group name must not exceed 255 characters")
            .trim()
            .optional(),
        description: z.string().trim().nullable().optional(),
    }),
});

/**
 * Zod schema for joining a group via invite code.
 */
export const joinGroupSchema = z.object({
    body: z.object({
        inviteCode: z.string().min(1, "Invite code is required"),
    }),
});

export type CreateGroupInput = z.infer<typeof createGroupSchema>["body"];
export type UpdateGroupInput = z.infer<typeof updateGroupSchema>["body"];
export type JoinGroupInput = z.infer<typeof joinGroupSchema>["body"];
