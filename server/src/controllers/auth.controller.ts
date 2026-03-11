import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import authService from "../services/auth.service";
import { logger } from "../config/logger";
import { AppError } from "../middlewares/errorHandler";
import { ApiResponse } from "../types/api.types";

/**
 * Register a new user
 * POST /api/v1/auth/register
 */
export const register = asyncHandler(async (req: Request, res: Response) => {
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
});

/**
 * Login an existing user
 * POST /api/v1/auth/login
 */
export const login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    logger.info(`Login attempt for email: ${email}`);

    const { user, token } = await authService.login(email, password);

    logger.info(`User logged in successfully: ${user.id}`);

    res.status(200).json({
        success: true,
        message: "Login successful",
        data: {
            user,
            token,
        },
    });
});

/**
 * Get current logged in user (send User from Express.Request in authMiddleware)
 * GET /api/v1/auth/me
 */
export const getMe = asyncHandler(async (req: Request, res: Response) => {
    const user = req.user;

    logger.info(`User profile fetched: ${user?.id}`);

    const response: ApiResponse<{ user: typeof user }> = {
        success: true,
        message: "User profile retrieved successfully",
        data: { user },
    };

    res.status(200).json(response);
});

/**
 * Delete the current user's account
 * DELETE /api/v1/auth/account
 */
export const deleteAccount = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
        throw new AppError("User not authenticated", 401);
    }

    logger.info(`Account deletion request for user: ${userId}`);
    await authService.deleteUserById(userId);
    logger.info(`Account deleted successfully: ${userId}`);

    res.status(204).send();
});

/**
 * Update current user's profile
 * PUT /api/v1/auth/profile
 */
export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
        throw new AppError("User not authenticated", 401);
    }

    const { name, email, avatar } = req.body;
    logger.info(`Profile update attempt for user: ${userId}`);
    const updatedUser = await authService.updateProfile(userId, {
        name,
        email,
        avatar,
    });

    logger.info(`Profile updated successfully: ${userId}`);
    res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        data: {
            user: updatedUser,
        },
    });
});
