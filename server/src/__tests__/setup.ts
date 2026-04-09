/**
 * Vitest setup file
 * Runs before all tests to set up the test environment
 */

import { beforeAll, afterAll } from "vitest";

// Global test timeout
const TEST_TIMEOUT = 30000;

beforeAll(async () => {
    process.env.NODE_ENV = "test";
    process.env.API_VERSION = process.env.API_VERSION || "v1";
    process.env.JWT_SECRET =
        process.env.JWT_SECRET ||
        "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";
    process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

    console.log("===================");
    console.log("Starting test suite...");
    console.log("===================");
}, TEST_TIMEOUT);

afterAll(async () => {
    console.log("===================");
    console.log("Test suite completed!");
    console.log("===================");

});

// Global error handler
process.on("unhandledRejection", (reason) => {
    console.error("Unhandled Rejection in tests:", reason);
    throw reason;
});
