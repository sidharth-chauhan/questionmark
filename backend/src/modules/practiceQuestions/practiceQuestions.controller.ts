import { Response, NextFunction } from "express";
import { AuthRequest } from "../../middleware/auth.js";
import {
  generatePracticeForUser,
  getPracticeQuestionsForUser,
  updatePracticeQuestionStatus,
} from "./practiceQuestions.service.js";

export async function generatePracticeHandler(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.id;
    const { chapterId, count } = req.body;
    const questions = await generatePracticeForUser(userId, chapterId, count || 3);
    res.status(201).json({
      success: true,
      message: `Generated ${questions.length} practice questions`,
      questions,
    });
  } catch (error) {
    next(error);
  }
}

export async function getPracticeQuestionsHandler(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.id;
    const { chapterId, status } = req.query as any;
    const questions = await getPracticeQuestionsForUser({
      userId,
      chapterId,
      status,
    });
    res.status(200).json(questions);
  } catch (error) {
    next(error);
  }
}

export async function updateQuestionStatusHandler(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    const { status } = req.body;
    const updated = await updatePracticeQuestionStatus(userId, id, status);
    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
}
