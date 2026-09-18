import { Response, NextFunction } from "express";
import { AuthRequest } from "../../middleware/auth.js";
import { generateOrGetDailyPlan, markPlanComplete, addCustomChapter, removeCustomChapter, updatePlanTime } from "./dailyPlan.service.js";

export async function getTodayPlanHandler(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.id;
    const date = req.query.date as string | undefined;
    const result = await generateOrGetDailyPlan(userId, date);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function completePlanHandler(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    const result = await markPlanComplete(userId, id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function addCustomChapterHandler(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.id;
    const { date, chapterId } = req.body;
    const result = await addCustomChapter(userId, date, chapterId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function removeCustomChapterHandler(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.id;
    const { date, chapterId } = req.body;
    const result = await removeCustomChapter(userId, date, chapterId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function updatePlanTimeHandler(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.id;
    const { date, chapterId, minutes } = req.body;
    const result = await updatePlanTime(userId, date, chapterId, minutes);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}