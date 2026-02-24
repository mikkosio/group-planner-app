import { Request, Response, NextFunction } from 'express';

/**
 * Global error handling middleware for Express.
 * @param err - The error object that was thrown in the application.
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The next middleware function in the Express stack.
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', err.message);
  
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
};