import { beforeEach, describe, expect, it } from "vitest";
import prisma from "../config/database";
import { authHeader, createTestRequest, registerAndLogin } from "./helpers";

describe("Groups API", () => {
    beforeEach(async () => {
        await prisma.vote.deleteMany();
        await prisma.activity.deleteMany();
        await prisma.membership.deleteMany();
        await prisma.group.deleteMany();
        await prisma.user.deleteMany();
    });

    it("creates a group successfully", async () => {
        const creator = await registerAndLogin({
            name: "Group Creator",
            email: "creator@test.com",
            password: "Password123",
        });

        const response = await createTestRequest()
            .post("/api/v1/groups")
            .set(authHeader(creator.token))
            .send({
                name: "Weekend Plan",
                description: "Group for weekend activities",
            });

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe("Group created successfully");
        expect(response.body.data.group.name).toBe("Weekend Plan");
        expect(response.body.data.group.inviteCode).toHaveLength(6);
    });

    it("lists groups for the authenticated user", async () => {
        const creator = await registerAndLogin({
            name: "Group Creator",
            email: "creator@test.com",
            password: "Password123",
        });

        await createTestRequest().post("/api/v1/groups").set(authHeader(creator.token)).send({
            name: "Trip Team",
            description: "Travel planning",
        });

        const response = await createTestRequest()
            .get("/api/v1/groups")
            .set(authHeader(creator.token));

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.groups.length).toBe(1);
        expect(response.body.data.groups[0].name).toBe("Trip Team");
        expect(response.body.data.groups[0].role).toBe("Admin");
        expect(response.body.data.groups[0].memberCount).toBe(1);
    });

    it("joins a group with a valid invite code", async () => {
        const creator = await registerAndLogin({
            name: "Group Creator",
            email: "creator@test.com",
            password: "Password123",
        });
        const joiner = await registerAndLogin({
            name: "Joiner User",
            email: "joiner@test.com",
            password: "Password123",
        });

        const createdGroup = await createTestRequest()
            .post("/api/v1/groups")
            .set(authHeader(creator.token))
            .send({ name: "Joinable Group" });

        const inviteCode = createdGroup.body.data.group.inviteCode;

        const response = await createTestRequest()
            .post("/api/v1/groups/join")
            .set(authHeader(joiner.token))
            .send({ inviteCode });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe("Joined group successfully");
        expect(response.body.data.membership.role).toBe("Member");
        expect(response.body.data.membership.groupId).toBe(createdGroup.body.data.group.id);
    });

    it("rejects join with invalid invite code", async () => {
        const joiner = await registerAndLogin({
            name: "Joiner User",
            email: "joiner@test.com",
            password: "Password123",
        });

        const response = await createTestRequest()
            .post("/api/v1/groups/join")
            .set(authHeader(joiner.token))
            .send({ inviteCode: "BAD999" });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("Invalid invite code");
    });

    it("prevents non-creator from finalizing a group", async () => {
        const creator = await registerAndLogin({
            name: "Group Creator",
            email: "creator@test.com",
            password: "Password123",
        });
        const member = await registerAndLogin({
            name: "Normal Member",
            email: "member@test.com",
            password: "Password123",
        });

        const groupRes = await createTestRequest()
            .post("/api/v1/groups")
            .set(authHeader(creator.token))
            .send({ name: "Finalize Test Group" });
        const groupId = groupRes.body.data.group.id;
        const inviteCode = groupRes.body.data.group.inviteCode;

        await createTestRequest()
            .post("/api/v1/groups/join")
            .set(authHeader(member.token))
            .send({ inviteCode });

        const creatorUser = await prisma.user.findUniqueOrThrow({
            where: { email: "creator@test.com" },
        });
        const activity = await prisma.activity.create({
            data: {
                groupId,
                userId: creatorUser.id,
                title: "Bowling Night",
                description: "Friendly game",
                proposedTime: new Date("2026-04-20T18:00:00Z"),
            },
        });

        const response = await createTestRequest()
            .patch(`/api/v1/groups/${groupId}/finalize`)
            .set(authHeader(member.token))
            .send({ activityId: activity.id });

        expect(response.status).toBe(403);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("Only the group creator can perform this action");
    });

    it("allows creator to finalize group with valid activity", async () => {
        const creator = await registerAndLogin({
            name: "Group Creator",
            email: "creator@test.com",
            password: "Password123",
        });

        const groupRes = await createTestRequest()
            .post("/api/v1/groups")
            .set(authHeader(creator.token))
            .send({ name: "Finalize Success Group" });
        const groupId = groupRes.body.data.group.id;

        const creatorUser = await prisma.user.findUniqueOrThrow({
            where: { email: "creator@test.com" },
        });
        const activity = await prisma.activity.create({
            data: {
                groupId,
                userId: creatorUser.id,
                title: "Hiking Trip",
                description: "Mountain trail",
                proposedTime: new Date("2026-04-21T09:00:00Z"),
            },
        });

        const response = await createTestRequest()
            .patch(`/api/v1/groups/${groupId}/finalize`)
            .set(authHeader(creator.token))
            .send({ activityId: activity.id });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe("Group finalized successfully");
        expect(response.body.data.group.status).toBe("FINALIZED");

        const winner = await prisma.activity.findUniqueOrThrow({ where: { id: activity.id } });
        expect(winner.isWinner).toBe(true);
    });

    it("rejects finalize when activity belongs to a different group", async () => {
        const creator = await registerAndLogin({
            name: "Group Creator",
            email: "creator@test.com",
            password: "Password123",
        });

        const groupA = await createTestRequest()
            .post("/api/v1/groups")
            .set(authHeader(creator.token))
            .send({ name: "Group A" });
        const groupB = await createTestRequest()
            .post("/api/v1/groups")
            .set(authHeader(creator.token))
            .send({ name: "Group B" });

        const creatorUser = await prisma.user.findUniqueOrThrow({
            where: { email: "creator@test.com" },
        });
        const activityInB = await prisma.activity.create({
            data: {
                groupId: groupB.body.data.group.id,
                userId: creatorUser.id,
                title: "Other Group Activity",
                proposedTime: new Date("2026-04-22T10:00:00Z"),
            },
        });

        const response = await createTestRequest()
            .patch(`/api/v1/groups/${groupA.body.data.group.id}/finalize`)
            .set(authHeader(creator.token))
            .send({ activityId: activityInB.id });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("Activity does not belong to this group");
    });
});
