import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "./errorHandler";
import prisma from "../config/database";
import { Activity } from "@prisma/client";

// Extend Express Request to include activity
declare global {
    namespace Express {
        interface Request {
            activity?: Activity;
        }
    }
}

/**
 * Middleware to verify the activity to be acted upon is in the corresponding group id.
 * Fetches the activity and attaches it to req.activity for downstream handlers.
 */
export const isActivityInGroup = asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
    const groupId = req.group!.id;
    const activityId = req.params.activityId as string;

    const activity = await prisma.activity.findUnique({ where: {id: activityId }});
    if (!activity || activity.groupId !== groupId) {
        throw new AppError("Activity not found in this group", 404);
    }

    req.activity = activity;
    next();
});

/**
 * Middleware to verify the authenticated user is the creator of req.activity.
 * Must always be chained after isActivityInGroup (relies on req.activity being set).
 */
export const isActivityCreator = asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
    const userId = req.user!.id;
    const activity = req.activity!;

    if (userId !== activity.userId) {
        throw new AppError("Only the activity creator can edit activity details", 403);
    }

    next();
});


/**
 * Middleware to verify the authenticated user is the creator of req.activity or req.group.
 * Must always be chained after isActivityInGroup and isGroupMember (relies on req.activity and req.group being set).
 */
export const isGroupCreatorOrActivityCreator = asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
    const userId = req.user!.id;
    const group = req.group!;
    const activity = req.activity!;

    if (userId !== group.creatorId && userId !== activity.userId) {
        throw new AppError("Only group creator or activity creator can delete this activity", 403);
    }

    next();
});
