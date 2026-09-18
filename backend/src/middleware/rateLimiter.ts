import rateLimit from "express-rate-limit";
import { AuthRequest } from "./auth.js";

// Global limiter: 100 requests per 15 minutes per IP
export const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: {
      message: "Too many requests from this IP, please try again later.",
      code: "RATE_LIMIT_EXCEEDED",
    },
  },
});

// Stricter per-user / per-IP rate limiter for heavy AI endpoints
export const aiGenerationRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, // 20 requests per 15 min
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    const authReq = req as AuthRequest;
    return authReq.user?.id || req.ip || "unknown";
  },
  message: {
    error: {
      message: "AI analysis rate limit reached. Please wait a few minutes before submitting more questions.",
      code: "AI_RATE_LIMIT_EXCEEDED",
    },
  },
});
