import { Response, NextFunction } from "express";
import { AuthRequest } from "../../middleware/auth.js";
import {
  processAndCreateMistake,
  getMistakesForUser,
  getMistakeByIdForUser,
} from "./mistakes.service.js";

export async function createMistakeHandler(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.id;
    const file = req.file;

    const {
      testId,
      notes,
      questionText,
      chapterId,
      mistakeType,
      difficulty,
    } = req.body;

    const mistake = await processAndCreateMistake({
      userId,
      imageBuffer: file?.buffer,
      mimeType: file?.mimetype,
      testId,
      notes,
      manualQuestionText: questionText,
      manualChapterId: chapterId,
      manualMistakeType: mistakeType,
      manualDifficulty: difficulty,
    });

    res.status(201).json({
      success: true,
      message: "Mistake processed and saved successfully",
      mistake,
    });
  } catch (error) {
    next(error);
  }
}

export async function getMistakesHandler(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.id;
    const { subjectId, chapterId, mistakeType, testId, limit, page } = req.query as any;

    const result = await getMistakesForUser({
      userId,
      subjectId: subjectId as string,
      chapterId: chapterId as string,
      mistakeType: mistakeType as string,
      testId: testId as string,
      limit: parseInt(limit, 10) || 50,
      page: parseInt(page, 10) || 1,
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function getMistakeByIdHandler(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    const mistake = await getMistakeByIdForUser(userId, id);
    res.status(200).json(mistake);
  } catch (error) {
    next(error);
  }
}
