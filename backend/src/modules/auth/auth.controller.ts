import { Request, Response, NextFunction } from "express";
import { registerUser, loginUser } from "./auth.service.js";

export async function registerHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { name, email, password, targetExam, targetYear } = req.body;
    const result = await registerUser({ name, email, password, targetExam, targetYear });
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

export async function loginHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password } = req.body;
    const result = await loginUser({ email, password });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}
