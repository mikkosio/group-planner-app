/**
 * Smoke test to verify test infrastructure is working
 */

import { describe, it, expect } from 'vitest';
import { createTestRequest } from './helpers';

describe('Test Infrastructure', () => {
    it('should have vitest configured correctly', () => {
        expect(true).toBe(true);
    });

    it('should be able to import app and make requests', async () => {
        const response = await createTestRequest().get('/health');
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('status');
        expect(response.body.status).toBe('healthy');
    });
});
