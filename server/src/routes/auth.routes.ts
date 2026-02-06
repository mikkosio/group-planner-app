import { Router } from "express";
import { register } from "../controllers/auth.controller";
import { validateRequest } from '../middlewares/validateRequest';
import { registerSchema } from '../validators/auth.validator';

const router = Router();

// POST /api/v1/auth/register
// todo add validation middleware
router.post('/register', validateRequest(registerSchema), register);
export default router;
