import { Router } from "express";
import { z } from "zod";
import { authMiddleware } from "../../middleware/auth.js";
import { aiGenerationRateLimiter } from "../../middleware/rateLimiter.js";
import { validateBody } from "../../middleware/validate.js";
import {
  generatePracticeHandler,
  getPracticeQuestionsHandler,
  updateQuestionStatusHandler,
} from "./practiceQuestions.controller.js";

const generateSchema = z.object({
  chapterId: z.string().min(1, "chapterId is required"),
  count: z.number().min(1).max(5).optional(),
});

const updateStatusSchema = z.object({
  status: z.enum(["PENDING", "SOLVED", "SKIPPED"]),
});

const router = Router();

router.use(authMiddleware);

router.get("/", getPracticeQuestionsHandler);
router.post("/generate", aiGenerationRateLimiter, validateBody(generateSchema), generatePracticeHandler);
router.patch("/:id/status", validateBody(updateStatusSchema), updateQuestionStatusHandler);

export default router;
