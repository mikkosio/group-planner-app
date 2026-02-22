import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';

/**
 * Custom error class for application-specific errors
 * Used to create consistent error responses for known error scenarios
 * (e.g. validation errors, authentication errors, etc.)
 */
export class AppError extends Error {
    statusCode: number;
    isOperational: boolean;

    constructor(message: string, statusCode: number = 500) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}


/**
 * Global error handling middleware for Express.
 * @param err - The error object that was thrown in the application.
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The next middleware function in the Express stack.
 */
export const errorHandler = (
    err: Error | AppError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Log error
    logger.error('Error occurred:', {
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
    });

    // Default error values
    let statusCode = 500;
    let message = 'Internal Server Error';
    let errors: any = undefined;

    // ==== Handle custom AppError ====
    if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
    }

    // ==== Handle Zod validation errors ====
    else if (err instanceof ZodError) {
        statusCode = 400;
        message = 'Validation Error';
        errors = err.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message,
        }));
    }

    // ====  Handle Prisma errors - Database related errors ====
    else if (err instanceof Prisma.PrismaClientKnownRequestError) {
        statusCode = 400;
        switch (err.code) {
            case 'P2002':
                message = 'Unique constraint violation';
                errors = {
                    field: (err.meta?.target as string[])?.join(', '),
                    message: 'A record with this value already exists',
                };
                break;
            case 'P2025':
                message = 'Record not found';
                statusCode = 404;
                break;
            case 'P2003':
                message = 'Foreign key constraint violation';
                break;
            default:
                message = 'Database error';
        }
    }

    // ====  Handle Prisma validation errors ====
    else if (err instanceof Prisma.PrismaClientValidationError) {
        statusCode = 400;
        message = 'Invalid data provided';
    }

    // Send error response
    const response: any = {
        success: false,
        message,
        ...(errors && { errors }),
        ...(process.env.NODE_ENV === 'development' && {
            stack: err.stack,
        }),
    };

    res.status(statusCode).json(response);
};