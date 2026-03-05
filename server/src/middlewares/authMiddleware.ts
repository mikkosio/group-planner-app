import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from './errorHandler';
import authService from '../services/auth.service';
import prisma from '../config/database';

// Extend Express Request type to include user
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
                name: string | null;
                avatar: string | null;
            };
        }
    }
}

/**
 * Middleware to protect routes - requires valid JWT token
 * Usage: router.get('/protected', protect, controller)
 * @returns Middleware function that verifies JWT token and attaches user to request object
 */
export const protect = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new AppError('No token provided. Please login.', 401);
        }

        // Extract token "Bearer <token>"
        const token = authHeader.split(' ')[1];
        if (!token) {
            throw new AppError('No token provided. Please login.', 401);
        }

        const decoded = authService.verifyToken(token);
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: {
                id: true,
                email: true,
                name: true,
                avatar: true,
            },
        });

        if (!user) {
            throw new AppError('User no longer exists. Please login again.', 401);
        }

        req.user = user;
        next();
    }
);