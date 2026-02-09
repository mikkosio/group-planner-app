import { Request, Response, NextFunction } from "express";

type AsyncFunction = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<any>;

/**
 * Wrapper for async route handlers to catch errors
 * Use to avoid repetitive try-catch blocks in each controller
 *
 * Usage:
 * export const myHandler = asyncHandler(async (req, res, next) => {
 *   // Your async code here
 *   const data = await someAsyncOperation();
 *   res.json(data);
 * });
 * @param fn Async route handler function
 * @return Wrapped function with error handling
 */
export const asyncHandler = (fn: AsyncFunction) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
