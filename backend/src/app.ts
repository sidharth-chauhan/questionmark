import express, { Express, Request, Response } from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import { env } from "./config/env.js";
import { globalRateLimiter } from "./middleware/rateLimiter.js";
import { errorHandler } from "./middleware/errorHandler.js";

// Routes imports
import authRoutes from "./modules/auth/auth.routes.js";
import mistakesRoutes from "./modules/mistakes/mistakes.routes.js";
import weakSpotsRoutes from "./modules/weakSpots/weakSpots.routes.js";
import dailyPlanRoutes from "./modules/dailyPlan/dailyPlan.routes.js";
import practiceQuestionsRoutes from "./modules/practiceQuestions/practiceQuestions.routes.js";
import usersRoutes from "./modules/users/users.routes.js";
import testsRoutes from "./modules/tests/tests.routes.js";
import { Subject } from "./models/Subject.js";
import { Chapter } from "./models/Chapter.js";

export function createApp(): Express {
  const app = express();

  // Security Headers
  app.use(
    helmet({
      contentSecurityPolicy: false, // Allows flexible integration in dev & iframe preview
      crossOriginResourcePolicy: { policy: "cross-origin" },
    })
  );

  // CORS configuration
  const allowedOrigins = [env.CLIENT_URL, "http://localhost:8080", "http://localhost:3000"];
  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, server-to-server) or matching allowed
        if (!origin || allowedOrigins.includes(origin) || env.NODE_ENV !== "production") {
          callback(null, true);
        } else {
          callback(new Error("CORS policy: Not allowed by CORS"));
        }
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );

  // Logging
  const logFormat = env.NODE_ENV === "production" ? "combined" : "dev";
  app.use(morgan(logFormat));

  // Body Parsing
  app.use(express.json({ limit: "15mb" }));
  app.use(express.urlencoded({ extended: true, limit: "15mb" }));

  // Global Rate Limiting
  app.use(globalRateLimiter);

  // Health check endpoint (No Auth required, used by Docker healthcheck)
  app.get("/api/health", (_req: Request, res: Response) => {
    res.status(200).json({ status: "ok" });
  });

  // Public syllabus lookup route (helper for UI filtering)
  app.get("/api/syllabus", async (_req: Request, res: Response, next) => {
    try {
      const subjects = await Subject.find().sort({ name: 1 });
      const chapters = await Chapter.find().sort({ name: 1 });
      res.status(200).json({ subjects, chapters });
    } catch (err) {
      next(err);
    }
  });

  // API Modules
  app.use("/api/auth", authRoutes);
  app.use("/api/mistakes", mistakesRoutes);
  app.use("/api/weak-spots", weakSpotsRoutes);
  app.use("/api/daily-plan", dailyPlanRoutes);
  app.use("/api/practice-questions", practiceQuestionsRoutes);
  app.use("/api/users", usersRoutes);
  app.use("/api/tests", testsRoutes);

  // 404 Route Handler for undefined API paths
  app.use("/api/*", (_req: Request, res: Response) => {
    res.status(404).json({
      error: {
        message: "Requested API endpoint not found",
        code: "NOT_FOUND",
      },
    });
  });

  // Centralized Error Handling
  app.use(errorHandler);

  return app;
}
