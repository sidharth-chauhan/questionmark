import { Router } from "express";
import multer from "multer";
import { authMiddleware } from "../../middleware/auth.js";
import { aiGenerationRateLimiter } from "../../middleware/rateLimiter.js";
import {
  createMistakeHandler,
  getMistakesHandler,
  getMistakeByIdHandler,
} from "./mistakes.controller.js";
import { validateQuery } from "../../middleware/validate.js";
import { getMistakesQuerySchema } from "./mistakes.schema.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
});

const router = Router();

router.use(authMiddleware);

router.post(
  "/",
  aiGenerationRateLimiter,
  upload.single("photo"),
  createMistakeHandler
);

router.get("/", validateQuery(getMistakesQuerySchema), getMistakesHandler);
router.get("/:id", getMistakeByIdHandler);

export default router;
