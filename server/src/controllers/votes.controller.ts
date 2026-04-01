import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import voteService from "../services/votes.service";
import { logger } from "../config/logger";
import { ApiResponse } from "../types/api.types";

/**
 * Add a vote for the authenticated user on an activity.
 * POST /api/v1/groups/:id/activities/:activityId/vote
 */
export const addVote = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const activityId = req.activity!.id;

    logger.info(`Add vote attempt by user: ${userId} on activity: ${activityId}`);

    const result = await voteService.addVote(userId, activityId);

    logger.info(`Vote added by user: ${userId} on activity: ${activityId}. Total votes: ${result.voteCount}`);

    const response: ApiResponse<typeof result> = {
        success: true,
        message: "Vote added",
        data: result,
    };

    res.status(200).json(response);
});

/**
 * Remove a vote for the authenticated user on an activity.
 * DELETE /api/v1/groups/:id/activities/:activityId/vote
 */
export const removeVote = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const activityId = req.activity!.id;

    logger.info(`Remove vote attempt by user: ${userId} on activity: ${activityId}`);

    const result = await voteService.removeVote(userId, activityId);

    logger.info(`Vote removed by user: ${userId} on activity: ${activityId}. Total votes: ${result.voteCount}`);

    const response: ApiResponse<typeof result> = {
        success: true,
        message: "Vote removed",
        data: result,
    };

    res.status(200).json(response);
});
