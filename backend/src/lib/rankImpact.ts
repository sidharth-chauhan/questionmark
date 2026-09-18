import { env } from "../config/env.js";

export interface RankImpactResult {
  carelessCount: number;
  marksLost: number;
  rankImpactScore: number;
  ranksPerMark: number;
  windowDays: number;
}

export function calculateRankImpact(
  carelessMistakesCount: number,
  ranksPerMarkConstant: number = env.RANKS_PER_MARK_CONSTANT,
  windowDays: number = env.CARELESS_MISTAKE_WINDOW_DAYS
): RankImpactResult {
  // In JEE, every wrong answer costs 4 marks (+4 for correct, -1 for wrong = 5 or 4 lost net marks; formula specifies: count x 4)
  const marksLost = carelessMistakesCount * 4;
  const rankImpactScore = marksLost * ranksPerMarkConstant;

  return {
    carelessCount: carelessMistakesCount,
    marksLost,
    rankImpactScore,
    ranksPerMark: ranksPerMarkConstant,
    windowDays,
  };
}
