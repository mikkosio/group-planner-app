import prisma from "../config/database";

export class VoteService {
    /**
     * Add a vote for a user on an activity.
     * Idempotent: if vote already exists, returns success without error.
     * @param userId - ID of the user voting
     * @param activityId - ID of the activity being voted on
     * @returns voteCount and hasVoted status
     */
    async addVote(userId: string, activityId: string) {
        // Check if vote already exists
        const existingVote = await prisma.vote.findUnique({
            where: {
                userId_activityId: { userId, activityId }
            }
        });

        // If vote doesn't exist, create it
        if (!existingVote) {
            await prisma.vote.create({
                data: {
                    userId,
                    activityId
                }
            });
        }

        // Count total votes for this activity
        const voteCount = await prisma.vote.count({
            where: { activityId }
        });

        return {
            voteCount,
            hasVoted: true
        };
    }

    /**
     * Remove a vote for a user on an activity.
     * Idempotent: if vote doesn't exist, returns success without error.
     * @param userId - ID of the user unvoting
     * @param activityId - ID of the activity being unvoted
     * @returns voteCount and hasVoted status
     */
    async removeVote(userId: string, activityId: string) {
        // Delete vote if it exists (deleteMany won't error if no rows found)
        await prisma.vote.deleteMany({
            where: {
                userId,
                activityId
            }
        });

        // Count total votes for this activity
        const voteCount = await prisma.vote.count({
            where: { activityId }
        });

        return {
            voteCount,
            hasVoted: false
        };
    }
}

export default new VoteService();
