import { Request, Response, NextFunction } from "express";
import { env } from "../config/env.js";

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
}

export function errorHandler(
  err: AppError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void {
  const statusCode = err.statusCode || 500;
  const message = err.message || "An unexpected error occurred";
  const code = err.code || (statusCode >= 500 ? "INTERNAL_SERVER_ERROR" : "BAD_REQUEST");

  if (env.NODE_ENV !== "production") {
    console.error(`[Error] ${req.method} ${req.originalUrl}:`, err);
  }

  res.status(statusCode).json({
    error: {
      message,
      code,
      ...(env.NODE_ENV !== "production" && { stack: err.stack }),
    },
  });
}
