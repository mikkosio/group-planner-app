/**
 * Vitest setup file
 * Runs before all tests to set up the test environment
 */

import { beforeAll, afterAll } from 'vitest';

// Global test timeout
const TEST_TIMEOUT = 30000;

beforeAll(async () => {
    console.log('🧪 Starting test suite...');
}, TEST_TIMEOUT);

afterAll(async () => {
    console.log('✅ Test suite completed');
});

// Global error handler
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection in tests:', reason);
    throw reason;
});
