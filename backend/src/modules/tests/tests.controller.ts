import { Response, NextFunction } from "express";
import { AuthRequest } from "../../middleware/auth.js";
import { createTestForUser, getTestsForUser } from "./tests.service.js";

export async function createTestHandler(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.id;
    const { testName, testDate } = req.body;
    const test = await createTestForUser(userId, { testName, testDate });
    res.status(201).json(test);
  } catch (error) {
    next(error);
  }
}

export async function getTestsHandler(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.id;
    const tests = await getTestsForUser(userId);
    res.status(200).json(tests);
  } catch (error) {
    next(error);
  }
}
