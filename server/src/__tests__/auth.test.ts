import { beforeEach, describe, expect, it } from "vitest";
import prisma from "../config/database";
import { authHeader, createTestRequest } from "./helpers";

describe("Auth API", () => {
    beforeEach(async () => {
        await prisma.vote.deleteMany();
        await prisma.activity.deleteMany();
        await prisma.membership.deleteMany();
        await prisma.group.deleteMany();
        await prisma.user.deleteMany();
    });

    it("registers a user successfully", async () => {
        const response = await createTestRequest().post("/api/v1/auth/register").send({
            name: "Alice Tester",
            email: "alice@test.com",
            password: "Password123",
        });

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.data.token).toBeTypeOf("string");
        expect(response.body.data.user.email).toBe("alice@test.com");
        expect(response.body.data.user).not.toHaveProperty("password");
    });

    it("rejects duplicate email registration", async () => {
        const payload = {
            name: "Alice Tester",
            email: "alice@test.com",
            password: "Password123",
        };

        await createTestRequest().post("/api/v1/auth/register").send(payload);
        const response = await createTestRequest().post("/api/v1/auth/register").send(payload);

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("User with this email already exists");
    });

    it("rejects registration with invalid payload", async () => {
        const response = await createTestRequest().post("/api/v1/auth/register").send({
            name: "A",
            email: "not-an-email",
            password: "weak",
        });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("Validation Error");
        expect(Array.isArray(response.body.errors)).toBe(true);
    });

    it("logs in with valid credentials", async () => {
        await createTestRequest().post("/api/v1/auth/register").send({
            name: "Bob Tester",
            email: "bob@test.com",
            password: "Password123",
        });

        const response = await createTestRequest().post("/api/v1/auth/login").send({
            email: "bob@test.com",
            password: "Password123",
        });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.token).toBeTypeOf("string");
        expect(response.body.data.user.email).toBe("bob@test.com");
        expect(response.body.data.user).not.toHaveProperty("password");
    });

    it("rejects login with wrong password", async () => {
        await createTestRequest().post("/api/v1/auth/register").send({
            name: "Bob Tester",
            email: "bob@test.com",
            password: "Password123",
        });

        const response = await createTestRequest().post("/api/v1/auth/login").send({
            email: "bob@test.com",
            password: "WrongPass123",
        });

        expect(response.status).toBe(401);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("Invalid email or password");
    });

    it("rejects login for unknown user", async () => {
        const response = await createTestRequest().post("/api/v1/auth/login").send({
            email: "unknown@test.com",
            password: "Password123",
        });

        expect(response.status).toBe(401);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("Invalid email or password");
    });

    it("returns current user profile with valid token", async () => {
        await createTestRequest().post("/api/v1/auth/register").send({
            name: "Carol Tester",
            email: "carol@test.com",
            password: "Password123",
        });
        const login = await createTestRequest().post("/api/v1/auth/login").send({
            email: "carol@test.com",
            password: "Password123",
        });

        const response = await createTestRequest()
            .get("/api/v1/auth/me")
            .set(authHeader(login.body.data.token));

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.user.email).toBe("carol@test.com");
    });

    it("rejects /auth/me without token", async () => {
        const response = await createTestRequest().get("/api/v1/auth/me");

        expect(response.status).toBe(401);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("No token provided. Please login.");
    });

    it("rejects /auth/me with invalid token", async () => {
        const response = await createTestRequest()
            .get("/api/v1/auth/me")
            .set(authHeader("invalid-token"));

        expect(response.status).toBe(401);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("Invalid or expired token");
    });

    it("updates profile with valid token", async () => {
        await createTestRequest().post("/api/v1/auth/register").send({
            name: "Dora Tester",
            email: "dora@test.com",
            password: "Password123",
        });
        const login = await createTestRequest().post("/api/v1/auth/login").send({
            email: "dora@test.com",
            password: "Password123",
        });

        const response = await createTestRequest()
            .put("/api/v1/auth/profile")
            .set(authHeader(login.body.data.token))
            .send({ name: "Dora Updated" });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.user.name).toBe("Dora Updated");
        expect(response.body.data.user.email).toBe("dora@test.com");
    });

    it("rejects profile update without token", async () => {
        const response = await createTestRequest().put("/api/v1/auth/profile").send({
            name: "Unauthorized Update",
        });

        expect(response.status).toBe(401);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("No token provided. Please login.");
    });

    it("deletes account and blocks subsequent login", async () => {
        await createTestRequest().post("/api/v1/auth/register").send({
            name: "Evan Tester",
            email: "evan@test.com",
            password: "Password123",
        });
        const login = await createTestRequest().post("/api/v1/auth/login").send({
            email: "evan@test.com",
            password: "Password123",
        });

        const deleteResponse = await createTestRequest()
            .delete("/api/v1/auth/account")
            .set(authHeader(login.body.data.token));

        expect(deleteResponse.status).toBe(204);

        const relogin = await createTestRequest().post("/api/v1/auth/login").send({
            email: "evan@test.com",
            password: "Password123",
        });

        expect(relogin.status).toBe(401);
        expect(relogin.body.message).toBe("Invalid email or password");
    });
});
