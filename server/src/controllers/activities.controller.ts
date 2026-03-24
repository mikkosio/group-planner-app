import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import activityService from "../services/activities.service";
import { logger } from "../config/logger";
import { ApiResponse } from "../types/api.types";


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
        message: "Activity updated successfully",
    };

    res.status(200).json(response);
});
