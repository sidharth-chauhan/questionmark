import { Response, NextFunction } from "express";
import { AuthRequest } from "../../middleware/auth.js";
import { getUserProfile, updateUserProfile } from "./users.service.js";

export async function getMeHandler(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.id;
    const profile = await getUserProfile(userId);
    res.status(200).json(profile);
  } catch (error) {
    next(error);
  }
}

export async function updateMeHandler(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.id;
    const { name, targetExam, targetYear } = req.body;
    const updated = await updateUserProfile(userId, { name, targetExam, targetYear });
    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
}
