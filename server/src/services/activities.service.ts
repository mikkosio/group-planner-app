import prisma from "../config/database";
import { AppError } from "../middlewares/errorHandler";
import { CreateActivityInput, UpdateActivityInput } from "../validators/activities.validators";

export class ActivityService {
    /**
     * Return all the activities in the group (include vote count and if user voted it).
     * @param groupId - ID of the group where the activities will be fetched from
     * @param userId - ID of the authenticated user
     */
    async getGroupActivities(groupId: string, userId: string) {
        return prisma.activity.findMany({ 
            where: { groupId },
            orderBy: { createdAt: "desc" },
            include: {
                _count: { select: { votes: true }},
                votes: { where: { userId } },
            },
        });
    }

    /**
     * Create a new activity in a group.
     * @param groupId - ID of the group where the activity will be created
     * @param userId - ID of the authenticated user creating the group
     * @param data - Activity title, proposed meetup datetime, and optional description
     */
    async createActivity(groupId: string, userId: string, input: CreateActivityInput) {
        const proposedTime = new Date(input.proposedTime);

        if (proposedTime < new Date()) {
            throw new AppError("Proposed time cannot be in the past", 400)
        }

        return prisma.activity.create({
            data: {
                groupId,
                userId,
                title: input.title,
                description: input.description,
                proposedTime,
            },
        })
    }

    /**
     * Return the winner activity in the group (include vote count and if user voted it).
     * @param groupId - ID of the group
     * @param userId - ID of the authenticated user
     */
    async getWinnerActivity(groupId: string, userId: string) {
        const activity = await prisma.activity.findFirst({ 
            where: { groupId, isWinner: true },
            include: {
                _count: { select: { votes: true } },
                votes: { where: { userId } },
            },
        });

        if (!activity) {
            throw new AppError("Winner activity not found", 404);
        }

        return activity;
    }

    /**
     * Set the winner activity of the group.
     * Resets all activities' isWinner to false to ensure one winner.
     * @param groupId - ID of the group
     * @param userId - ID of the authenticated user
     */
    async setWinnerActivity(groupId: string, activityId: string) {
        return prisma.$transaction(async (tx) => {
            await tx.activity.updateMany({
                where: { groupId, isWinner: true },
                data: { isWinner: false },
            });

            return tx.activity.update({
                where: { id: activityId },
                data: { isWinner: true },
            });
        });
    }

    /**
     * Return full details of an activity (include vote count and if user voted it).
     * @param userId - ID of the authenticated user
     * @param activityId - ID of the activity to fetch
     */
    async getActivityById(userId: string, activityId: string) {
        const activity = await prisma.activity.findUnique({
            where: { id: activityId },
            include: {
                _count: { select: { votes: true } },
                votes: { where: { userId } },
            },
        });

        if (!activity) {
            throw new AppError("Activity not found", 404);
        }

        return activity;
    }

    /**
     * Update an activity's title, proposed meetup, and/or description.
     * Authorization (activity creator check) is handled by middleware before this is called.
     * @param activityId - ID of the activity to update
     * @param data - Fields to update
     */
    async updateActivity(activityId: string, input: UpdateActivityInput) {
        if (input.proposedTime !== undefined) {
            const proposedTime = new Date(input.proposedTime);

            if (proposedTime < new Date()) {
                throw new AppError("Proposed time cannot be in the past", 400)
            }
        }

        return prisma.activity.update({
            where: { id: activityId },
            data: {
                ...(input.title !== undefined && { title: input.title }),
                ...(input.description !== undefined && { description: input.description }),
                ...(input.proposedTime !== undefined && { proposedTime: new Date(input.proposedTime) }),
            }
        })
    }

    /**
     * Delete an activity.
     * Authorization (activity or group creator check) is handled by middleware before this is called.
     * @param activityId - ID of the activity to delete
     */
    async deleteActivity(activityId: string) {
        await prisma.activity.delete({ where: { id: activityId }});
    }
}

export default new ActivityService();
