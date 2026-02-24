import { Request, Response, NextFunction } from 'express';
import {ZodObject, ZodError } from 'zod';

/**
 * Middleware to validate request data using Zod schemas
 * 
 * Usage:
 * router.post('/register', validateRequest(registerSchema), register);
 */
export const validateRequest = (schema: ZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate request body, query params, and URL params
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      
      // If validation passes, continue to next middleware/controller
      next();
    } catch (error) {
      // If validation fails, pass error to error handler
      next(error);
    }
  };
};