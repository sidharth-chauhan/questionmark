import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export interface AuthRequest extends Request {
  user?: {
    id: string;
  };
}

interface JwtPayload {
  userId: string;
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({
      error: {
        message: "Authentication token missing or invalid",
        code: "UNAUTHORIZED",
      },
    });
    return;
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    if (!decoded || !decoded.userId) {
      res.status(401).json({
        error: {
          message: "Invalid token payload",
          code: "UNAUTHORIZED",
        },
      });
      return;
    }
    req.user = { id: decoded.userId };
    next();
  } catch (error) {
    res.status(401).json({
      error: {
        message: "Token expired or signature invalid",
        code: "UNAUTHORIZED",
      },
    });
    return;
  }
}
