import { Router } from 'express';

const router = Router();

// Health check for API
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    version: process.env.API_VERSION || 'v1',
  });
});

export default router;