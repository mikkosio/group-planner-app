/**
 * Vitest setup file
 * Runs before all tests to set up the test environment
 */

import { beforeAll, afterAll } from 'vitest';

// Global test timeout
const TEST_TIMEOUT = 30000;

beforeAll(async () => {
    console.log('===================');
    console.log('Starting test suite...');
    console.log('===================');
}, TEST_TIMEOUT);

afterAll(async () => {
    console.log('===================');
    console.log('Test suite completed!');
    console.log('===================');

});

// Global error handler
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection in tests:', reason);
    throw reason;
});
