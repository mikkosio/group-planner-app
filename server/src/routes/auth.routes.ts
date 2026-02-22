import { Router } from 'express';
import { register, login, getMe } from '../controllers/auth.controller';
import { validateRequest } from '../middlewares/validateRequest';
import { registerSchema, loginSchema } from '../validators/auth.validator';
import { protect } from '../middlewares/authMiddleware';

const router = Router();

//=============================== PUBLIC ROUTES ===============================
// POST /api/v1/auth/register
router.post('/register', validateRequest(registerSchema), register);

// POST /api/v1/auth/login
router.post('/login', validateRequest(loginSchema), login);


//=============================== PROTECTED ROUTES ===============================
// GET /api/v1/auth/me
router.get('/me', protect, getMe)

export default router;