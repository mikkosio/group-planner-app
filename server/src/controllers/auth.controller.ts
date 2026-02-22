import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import authService from "../services/auth.service";
import { logger } from "../config/logger";

/**
 * Register a new user
 * POST /api/v1/auth/register
 */
export const register = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password, name } = req.body;

    logger.info(`Registration attempt for email: ${email}`);

    const { user, token } = await authService.register(email, password, name);

    logger.info(`User registered successfully: ${user.id}`);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user,
        token,
      },
    });
  },
);

/**
 * Login an existing user
 * POST /api/v1/auth/login
 */
export const login = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { email, password } = req.body;

        logger.info(`Login attempt for email: ${email}`);

        const { user, token } = await authService.login(email, password);

        logger.info(`User logged in successfully: ${user.id}`);

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                user,
                token,
            },
        });
    }
);

/**
 * Get current logged in user (send User from Express.Request in authMiddleware)
 * GET /api/v1/auth/me
 */
export const getMe = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        // User is already attached by protect middleware
        const user = req.user;

        logger.info(`User profile fetched: ${user?.id}`);

        res.status(200).json({
            success: true,
            data: {
                user,
            },
        });
    }
);
