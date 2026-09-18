import { Router } from "express";
import { z } from "zod";
import { authMiddleware } from "../../middleware/auth.js";
import { validateBody } from "../../middleware/validate.js";
import { createTestHandler, getTestsHandler } from "./tests.controller.js";

const createTestSchema = z.object({
  testName: z.string().optional(),
  testDate: z.string().or(z.date()).optional(),
});

const router = Router();

router.use(authMiddleware);

router.post("/", validateBody(createTestSchema), createTestHandler);
router.get("/", getTestsHandler);

export default router;
