import { Response, NextFunction } from "express";
import { AuthRequest } from "../../middleware/auth.js";
import { getLatestWeakSpotsReport, recomputeWeakSpotsForUser } from "./weakSpots.service.js";

export async function getWeakSpotsHandler(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.id;
    const result = await getLatestWeakSpotsReport(userId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function recomputeWeakSpotsHandler(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.id;
    const result = await recomputeWeakSpotsForUser(userId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}
