import { describe, expect, it } from "vitest";
import { createTestRequest } from "./helpers";
import { registerSchema } from "../validators/auth.validator";
import { createGroupSchema, finalizeGroupSchema } from "../validators/groups.validator";
import { createActivitySchema, updateActivitySchema } from "../validators/activities.validators";

describe("Validation Schemas", () => {
    it("accepts valid register payload", () => {
        const result = registerSchema.safeParse({
            body: {
                email: "valid@test.com",
                password: "Password123",
                name: "Valid User",
            },
        });

        expect(result.success).toBe(true);
    });

    it("rejects register payload with weak password", () => {
        const result = registerSchema.safeParse({
            body: {
                email: "valid@test.com",
                password: "weak",
                name: "Valid User",
            },
        });

        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues.some((issue) => issue.path.join(".") === "body.password")).toBe(
                true,
            );
        }
    });

    it("accepts valid create group payload", () => {
        const result = createGroupSchema.safeParse({
            body: {
                name: "Weekend Group",
                description: "Some description",
            },
        });

        expect(result.success).toBe(true);
    });

    it("rejects finalize payload with non-uuid activityId", () => {
        const result = finalizeGroupSchema.safeParse({
            body: {
                activityId: "not-a-uuid",
            },
        });

        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues.some((issue) => issue.path.join(".") === "body.activityId")).toBe(
                true,
            );
        }
    });

    it("rejects create activity payload with invalid proposedTime", () => {
        const result = createActivitySchema.safeParse({
            body: {
                title: "Bowling",
                proposedTime: "invalid-datetime",
            },
        });

        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues.some((issue) => issue.path.join(".") === "body.proposedTime")).toBe(
                true,
            );
        }
    });

    it("accepts partial update activity payload", () => {
        const result = updateActivitySchema.safeParse({
            body: {
                title: "Updated title only",
            },
        });

        expect(result.success).toBe(true);
    });

    it("returns standardized validation error payload shape from API", async () => {
        const response = await createTestRequest().post("/api/v1/auth/register").send({
            email: "bad-email",
            password: "weak",
            name: "A",
        });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("Validation Error");
        expect(Array.isArray(response.body.errors)).toBe(true);
        expect(response.body.errors.length).toBeGreaterThan(0);
        expect(response.body.errors[0]).toHaveProperty("field");
        expect(response.body.errors[0]).toHaveProperty("message");
    });
});
