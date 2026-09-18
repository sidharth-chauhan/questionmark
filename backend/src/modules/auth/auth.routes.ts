import { Router } from "express";
import { z } from "zod";
import { registerHandler, loginHandler } from "./auth.controller.js";
import { validateBody } from "../../middleware/validate.js";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  targetExam: z.enum(["JEE_MAIN", "JEE_ADVANCED"]).optional(),
  targetYear: z.coerce.number().optional(),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const router = Router();

router.post("/register", validateBody(registerSchema), registerHandler);
router.post("/login", validateBody(loginSchema), loginHandler);

export default router;
