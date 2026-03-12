import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import groupService from "../services/groups.service";
import { logger } from "../config/logger";
import { ApiResponse } from "../types/api.types";

/**
 * Create a new group and auto-enrol the creator as Admin.
 * POST /api/v1/groups
 */
export const createGroup = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;

    logger.info(`Create group attempt by user: ${userId}`);

    const group = await groupService.createGroup(userId, req.body);

    logger.info(`Group created: ${group.id} by user: ${userId}`);

    const response: ApiResponse<{ group: typeof group }> = {
        success: true,
        message: "Group created successfully",
        data: { group },
    };

    res.status(201).json(response);
});

/**
 * List all groups the authenticated user is a member of.
 * GET /api/v1/groups
 */
export const getMyGroups = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;

    logger.info(`Fetching groups for user: ${userId}`);

    const groups = await groupService.getMyGroups(userId);

    logger.info(`Retrieved ${groups.length} group(s) for user: ${userId}`);

    const response: ApiResponse<{ groups: typeof groups }> = {
        success: true,
        message: "Groups retrieved successfully",
        data: { groups },
    };

    res.status(200).json(response);
});

/**
 * Get full details of a group (members only).
 * GET /api/v1/groups/:id
 */
export const getGroupById = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const groupId = req.params.id as string;

    logger.info(`Fetching group ${groupId} for user: ${userId}`);

    const group = await groupService.getGroupById(groupId, userId);

    logger.info(`Group retrieved: ${groupId}`);

    const response: ApiResponse<{ group: typeof group }> = {
        success: true,
        message: "Group retrieved successfully",
        data: { group },
    };

    res.status(200).json(response);
});

/**
 * Update a group's name and/or description (creator only).
 * PUT /api/v1/groups/:id
 */
export const updateGroup = asyncHandler(async (req: Request, res: Response) => {
    const groupId = req.params.id as string;

    logger.info(`Update group attempt: ${groupId}`);

    const group = await groupService.updateGroup(groupId, req.body);

    logger.info(`Group updated: ${groupId}`);

    const response: ApiResponse<{ group: typeof group }> = {
        success: true,
        message: "Group updated successfully",
        data: { group },
    };

    res.status(200).json(response);
});

/**
 * Delete a group (creator only).
 * DELETE /api/v1/groups/:id
 */
export const deleteGroup = asyncHandler(async (req: Request, res: Response) => {
    const groupId = req.params.id as string;

    logger.info(`Delete group attempt: ${groupId}`);

    await groupService.deleteGroup(groupId);

    logger.info(`Group deleted: ${groupId}`);

    const response: ApiResponse = {
        success: true,
        message: "Group deleted successfully",
    };

    res.status(200).json(response);
});

/**
 * Join a group via invite code.
 * POST /api/v1/groups/:id/join
 */
export const joinGroup = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { inviteCode } = req.body;

    logger.info(`Join group attempt with invite code by user: ${userId}`);

    const membership = await groupService.joinGroup(userId, inviteCode);

    logger.info(`User ${userId} joined group: ${membership.groupId}`);

    const response: ApiResponse<{ membership: typeof membership }> = {
        success: true,
        message: "Joined group successfully",
        data: { membership },
    };

    res.status(200).json(response);
});

/**
 * Leave a group (creator blocked).
 * POST /api/v1/groups/:id/unjoin
 */
export const unjoinGroup = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const groupId = req.params.id as string;

    logger.info(`Unjoin group attempt: ${groupId} by user: ${userId}`);

    await groupService.unjoinGroup(groupId, userId);

    logger.info(`User ${userId} left group: ${groupId}`);

    const response: ApiResponse = {
        success: true,
        message: "Left group successfully",
    };

    res.status(200).json(response);
});
