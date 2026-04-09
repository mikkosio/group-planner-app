import { beforeEach, describe, expect, it } from "vitest";
import prisma from "../config/database";
import { authHeader, createTestRequest, registerAndLogin } from "./helpers";

describe("Activities & Votes API", () => {
    beforeEach(async () => {
        await prisma.vote.deleteMany();
        await prisma.activity.deleteMany();
        await prisma.membership.deleteMany();
        await prisma.group.deleteMany();
        await prisma.user.deleteMany();
    });

    const futureTime = () => new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    async function setupGroupWithMember() {
        const creator = await registerAndLogin({
            name: "Creator User",
            email: "creator@test.com",
            password: "Password123",
        });
        const member = await registerAndLogin({
            name: "Member User",
            email: "member@test.com",
            password: "Password123",
        });

        const groupRes = await createTestRequest()
            .post("/api/v1/groups")
            .set(authHeader(creator.token))
            .send({ name: "Activity Group", description: "Testing activities" });

        const groupId = groupRes.body.data.group.id as string;
        const inviteCode = groupRes.body.data.group.inviteCode as string;

        await createTestRequest()
            .post("/api/v1/groups/join")
            .set(authHeader(member.token))
            .send({ inviteCode });

        return { creator, member, groupId };
    }

    it("creates an activity in a group", async () => {
        const { creator, groupId } = await setupGroupWithMember();

        const response = await createTestRequest()
            .post(`/api/v1/groups/${groupId}/activities`)
            .set(authHeader(creator.token))
            .send({
                title: "Bowling Night",
                description: "Friendly bowling match",
                proposedTime: futureTime(),
            });

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe("Activity created successfully");
        expect(response.body.data.activity.title).toBe("Bowling Night");
        expect(response.body.data.activity.groupId).toBe(groupId);
    });

    it("lists group activities and includes group status", async () => {
        const { creator, groupId } = await setupGroupWithMember();

        await createTestRequest()
            .post(`/api/v1/groups/${groupId}/activities`)
            .set(authHeader(creator.token))
            .send({
                title: "Hiking Trip",
                proposedTime: futureTime(),
            });

        const response = await createTestRequest()
            .get(`/api/v1/groups/${groupId}/activities`)
            .set(authHeader(creator.token));

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe("Activities retrieved successfully");
        expect(Array.isArray(response.body.data.activities)).toBe(true);
        expect(response.body.data.activities.length).toBe(1);
        expect(response.body.data.activities[0].title).toBe("Hiking Trip");
        expect(response.body.data.groupStatus).toBe("WIP");
    });

    it("adds a vote and then removes it", async () => {
        const { creator, member, groupId } = await setupGroupWithMember();

        const activityRes = await createTestRequest()
            .post(`/api/v1/groups/${groupId}/activities`)
            .set(authHeader(creator.token))
            .send({
                title: "Escape Room",
                proposedTime: futureTime(),
            });

        const activityId = activityRes.body.data.activity.id as string;

        const addVote = await createTestRequest()
            .post(`/api/v1/groups/${groupId}/activities/${activityId}/vote`)
            .set(authHeader(member.token))
            .send();

        expect(addVote.status).toBe(200);
        expect(addVote.body.success).toBe(true);
        expect(addVote.body.message).toBe("Vote added");
        expect(addVote.body.data.hasVoted).toBe(true);
        expect(addVote.body.data.voteCount).toBe(1);

        const removeVote = await createTestRequest()
            .delete(`/api/v1/groups/${groupId}/activities/${activityId}/vote`)
            .set(authHeader(member.token));

        expect(removeVote.status).toBe(200);
        expect(removeVote.body.success).toBe(true);
        expect(removeVote.body.message).toBe("Vote removed");
        expect(removeVote.body.data.hasVoted).toBe(false);
        expect(removeVote.body.data.voteCount).toBe(0);
    });

    it("keeps vote operation idempotent on repeated add", async () => {
        const { creator, member, groupId } = await setupGroupWithMember();

        const activityRes = await createTestRequest()
            .post(`/api/v1/groups/${groupId}/activities`)
            .set(authHeader(creator.token))
            .send({
                title: "Movie Night",
                proposedTime: futureTime(),
            });
        const activityId = activityRes.body.data.activity.id as string;

        const first = await createTestRequest()
            .post(`/api/v1/groups/${groupId}/activities/${activityId}/vote`)
            .set(authHeader(member.token));
        const second = await createTestRequest()
            .post(`/api/v1/groups/${groupId}/activities/${activityId}/vote`)
            .set(authHeader(member.token));

        expect(first.status).toBe(200);
        expect(second.status).toBe(200);
        expect(first.body.data.voteCount).toBe(1);
        expect(second.body.data.voteCount).toBe(1);
        expect(second.body.data.hasVoted).toBe(true);
    });

    it("blocks creating activities after group finalization", async () => {
        const { creator, groupId } = await setupGroupWithMember();

        const winnerRes = await createTestRequest()
            .post(`/api/v1/groups/${groupId}/activities`)
            .set(authHeader(creator.token))
            .send({
                title: "Winner Candidate",
                proposedTime: futureTime(),
            });
        const winnerActivityId = winnerRes.body.data.activity.id as string;

        const finalizeRes = await createTestRequest()
            .patch(`/api/v1/groups/${groupId}/finalize`)
            .set(authHeader(creator.token))
            .send({ activityId: winnerActivityId });

        expect(finalizeRes.status).toBe(200);
        expect(finalizeRes.body.data.group.status).toBe("FINALIZED");

        const blockedCreate = await createTestRequest()
            .post(`/api/v1/groups/${groupId}/activities`)
            .set(authHeader(creator.token))
            .send({
                title: "Should Fail",
                proposedTime: futureTime(),
            });

        expect(blockedCreate.status).toBe(400);
        expect(blockedCreate.body.success).toBe(false);
        expect(blockedCreate.body.message).toBe("Cannot modify a finalized group");
    });

    it("blocks voting after group finalization", async () => {
        const { creator, member, groupId } = await setupGroupWithMember();

        const activityRes = await createTestRequest()
            .post(`/api/v1/groups/${groupId}/activities`)
            .set(authHeader(creator.token))
            .send({
                title: "Voting Locked Candidate",
                proposedTime: futureTime(),
            });
        const activityId = activityRes.body.data.activity.id as string;

        await createTestRequest()
            .patch(`/api/v1/groups/${groupId}/finalize`)
            .set(authHeader(creator.token))
            .send({ activityId });

        const voteRes = await createTestRequest()
            .post(`/api/v1/groups/${groupId}/activities/${activityId}/vote`)
            .set(authHeader(member.token));

        expect(voteRes.status).toBe(400);
        expect(voteRes.body.success).toBe(false);
        expect(voteRes.body.message).toBe("Cannot modify a finalized group");
    });
});
