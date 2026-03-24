import prisma from "../config/database";
import { AppError } from "../middlewares/errorHandler";
import { CreateActivityInput, UpdateActivityInput } from "../validators/activities.validators";

export class ActivityService {
    /**
     * Create a new activity in a group.
     * @param groupId -  ID of the group where the activity will be created
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
