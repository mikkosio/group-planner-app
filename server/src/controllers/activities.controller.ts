import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import activityService from "../services/activities.service";
import { logger } from "../config/logger";
import { ApiResponse } from "../types/api.types";


/**
 * List all activities in the group.
 * GET /api/v1/groups/:id/activities
 */
export const getGroupActivities = asyncHandler(async (req: Request, res: Response) => {
    const groupId = req.group!.id;
    const userId = req.user!.id;

    logger.info(`Get group activities attempt by user: ${userId} in group: ${groupId}`);

    const activities = await activityService.getGroupActivities(groupId, userId);

    logger.info(`Retrieved ${activities.length} activity(s) for user: ${userId}`);

    const response: ApiResponse<{ activities: typeof activities; groupStatus: string }> = {
        success: true,
        message: "Activities retrieved successfully",
        data: { 
            activities,
            groupStatus: req.group!.status // Include group status for frontend
        },
    };

    res.status(200).json(response);
});

/**
 * Create a new activity.
 * POST /api/v1/groups/:id/activities
 */
export const createActivity = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const groupId = req.group!.id;

    logger.info(`Create activity attempt by user: ${userId} in group: ${groupId}`);

    const activity = await activityService.createActivity(groupId, userId, req.body);

    logger.info(`Activity created: ${activity.id} by user: ${userId} in group: ${groupId}`);

    const response: ApiResponse<{ activity: typeof activity }> = {
        success: true,
        message: "Activity created successfully",
        data: { activity },
    };

    res.status(201).json(response);
});

/**
 * Get the winner activity of a group.
 * GET /api/v1/groups/:id/activities/winner
 */
export const getWinnerActivity = asyncHandler(async (req: Request, res: Response) => {
    const groupId = req.group!.id;
    const userId = req.user!.id;

    logger.info(`Fetching winner activity from group: ${groupId} for user: ${userId}`);

    const activity = await activityService.getWinnerActivity(groupId, userId);

    logger.info(`Winner activity retrieved: ${activity.id}`);

    const response: ApiResponse<{ activity: typeof activity }> = {
        success: true,
        message: "Winner activity retrieved successfully",
        data: { activity },
    };

    res.status(200).json(response);
});

/**
 * Set the winner activity of a group.
 * POST /api/v1/groups/:id/activities/:activityId/set-winner
 */
export const setWinnerActivity = asyncHandler(async (req: Request, res: Response) => {
    const groupId = req.group!.id;
    const activityId = req.activity!.id;

    logger.info(`Set winner attempt in group: ${groupId} on activity: ${activityId}`);

    const activity = await activityService.setWinnerActivity(groupId, activityId);

    logger.info(`Selected winner activity: ${activity.id} in group: ${groupId}`);

    const response: ApiResponse<{ activity: typeof activity }> = {
        success: true,
        message: "Set winner activity successfully",
        data: { activity },
    };

    res.status(200).json(response);
});

/**
 * Get full details of an activity.
 * GET /api/v1/groups/:id/activities/:activityId
 */
export const getActivityById = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const activityId = req.activity!.id;

    logger.info(`Fetching activity: ${activityId} for user: ${userId}`);

    const activity = await activityService.getActivityById(userId, activityId);

    logger.info(`Activity retrieved: ${activity.id}`);

    const response: ApiResponse<{ activity: typeof activity }> = {
        success: true,
        message: "Activity retrieved successfully",
        data: { activity },
    };

    res.status(200).json(response);
});

/**
 * Update an existing activity's details (activity creator only).
 * PUT /api/v1/groups/:id/activities/:activityId
 */
export const updateActivity = asyncHandler(async (req: Request, res: Response) => {
    const activityId = req.activity!.id;

    logger.info(`Update activity attempt: ${activityId}`);

    const activity = await activityService.updateActivity(activityId, req.body);

    logger.info(`Activity updated: ${activity.id}`);

    const response: ApiResponse<{ activity: typeof activity }> = {
        success: true,
        message: "Activity updated successfully",
        data: { activity },
    };

    res.status(200).json(response);
});

/**
 * Delete an activity (group or activity creator only).
 * DELETE /api/v1/groups/:id/activities/:activityId
 */
export const deleteActivity = asyncHandler(async (req: Request, res: Response) => {
    const activityId = req.activity!.id;

    logger.info(`Delete activity attempt: ${activityId}`);

    await activityService.deleteActivity(activityId);

    logger.info(`Activity deleted: ${activityId}`);

    const response: ApiResponse = {
        success: true,
        message: "Activity deleted successfully",
    };

    res.status(204).json(response);
});
