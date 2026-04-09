/**
 * Test helpers and utilities
 */

import request from "supertest";
import app from "../app";

/**
 * Get the Express app instance for testing
 */
export function getTestApp() {
    return app;
}

/**
 * Create a test request helper
 */
export function createTestRequest() {
    return request(app);
}

/**
 * Helper to register and login a test user
 */
export async function registerAndLogin(userData: {
    name: string;
    email: string;
    password: string;
}) {
    const registerResponse = await request(app)
        .post("/api/v1/auth/register")
        .send(userData);

    if (!registerResponse.body.success) {
        throw new Error(`Failed to register user: ${registerResponse.body.message}`);
    }

    const loginResponse = await request(app)
        .post("/api/v1/auth/login")
        .send({
            email: userData.email,
            password: userData.password,
        });

    if (!loginResponse.body.success) {
        throw new Error(`Failed to login user: ${loginResponse.body.message}`);
    }

    return {
        user: loginResponse.body.data.user,
        token: loginResponse.body.data.token,
    };
}

/**
 * Helper to create authorization header
 */
export function authHeader(token: string) {
    return { Authorization: `Bearer ${token}` };
}
