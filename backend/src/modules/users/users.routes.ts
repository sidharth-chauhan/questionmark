import { Router } from "express";
import { z } from "zod";
import { authMiddleware } from "../../middleware/auth.js";
import { validateBody } from "../../middleware/validate.js";
import { getMeHandler, updateMeHandler } from "./users.controller.js";

const updateProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  targetExam: z.enum(["JEE_MAIN", "JEE_ADVANCED"]).optional(),
  targetYear: z.coerce.number().min(2024).max(2035).optional(),
});

const router = Router();

router.use(authMiddleware);

router.get("/me", getMeHandler);
router.patch("/me", validateBody(updateProfileSchema), updateMeHandler);

export default router;
