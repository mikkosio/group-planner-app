import { Router } from 'express';
import { register, login } from '../controllers/auth.controller';
import { validateRequest } from '../middlewares/validateRequest';
import { registerSchema, loginSchema } from '../validators/auth.validator';

const router = Router();

// POST /api/v1/auth/register
router.post('/register', validateRequest(registerSchema), register);

// POST /api/v1/auth/login
router.post('/login', validateRequest(loginSchema), login);

export default router;