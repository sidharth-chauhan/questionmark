import { Types } from "mongoose";
import { Mistake } from "../../models/Mistake.js";
import { WeeklyReport } from "../../models/WeeklyReport.js";
import { Chapter } from "../../models/Chapter.js";
import { calculateRankImpact } from "../../lib/rankImpact.js";
import { env } from "../../config/env.js";

function getStartOfWeek(date: Date = new Date()): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday start
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export async function recomputeWeakSpotsForUser(userId: string) {
  const userObjectId = new Types.ObjectId(userId);
  const weekStart = getStartOfWeek();

  // 1. Calculate careless mistakes in window for rank impact
  const windowDate = new Date();
  windowDate.setDate(windowDate.getDate() - env.CARELESS_MISTAKE_WINDOW_DAYS);

  const carelessCount = await Mistake.countDocuments({
    userId: userObjectId,
    mistakeType: { $in: ["CALCULATION_ERROR", "MISREAD"] },
    createdAt: { $gte: windowDate },
  });

  const rankImpact = calculateRankImpact(carelessCount);

  // 2. Aggregate mistakes by Chapter to find top weak chapters
  const chapterAgg = await Mistake.aggregate([
    { $match: { userId: userObjectId } },
    {
      $group: {
        _id: "$chapterId",
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
    { $limit: 3 },
  ]);

  const topWeakChapters: Array<{
    chapterId: Types.ObjectId;
    chapterName: string;
    count: number;
  }> = [];

  for (const item of chapterAgg) {
    const chap = await Chapter.findById(item._id);
    topWeakChapters.push({
      chapterId: item._id,
      chapterName: chap ? chap.name : "Core JEE Chapter",
      count: item.count,
    });
  }

  // 3. Aggregate mistakes by mistakeType
  const typeAgg = await Mistake.aggregate([
    { $match: { userId: userObjectId } },
    {
      $group: {
        _id: "$mistakeType",
        count: { $sum: 1 },
      },
    },
  ]);

  const mistakeTypeBreakdown = {
    CONCEPT_GAP: 0,
    CALCULATION_ERROR: 0,
    MISREAD: 0,
    FORGOT_FORMULA: 0,
  };

  let totalMistakes = 0;
  for (const t of typeAgg) {
    if (t._id in mistakeTypeBreakdown) {
      mistakeTypeBreakdown[t._id as keyof typeof mistakeTypeBreakdown] = t.count;
      totalMistakes += t.count;
    }
  }

  // 4. Upsert into WeeklyReport for current week
  const updatedReport = await WeeklyReport.findOneAndUpdate(
    { userId: userObjectId, weekStart },
    {
      $set: {
        topWeakChapters,
        mistakeTypeBreakdown,
        rankImpactScore: rankImpact.rankImpactScore,
        createdAt: new Date(),
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  return {
    report: updatedReport,
    rankImpact,
    totalMistakes,
  };
}

export async function getLatestWeakSpotsReport(userId: string) {
  const userObjectId = new Types.ObjectId(userId);
  let latest = await WeeklyReport.findOne({ userId: userObjectId }).sort({ weekStart: -1 });

  if (!latest) {
    // Generate fresh report
    const generated = await recomputeWeakSpotsForUser(userId);
    latest = generated.report;
  }

  // Calculate detailed impact metrics
  const windowDate = new Date();
  windowDate.setDate(windowDate.getDate() - env.CARELESS_MISTAKE_WINDOW_DAYS);
  const carelessCount = await Mistake.countDocuments({
    userId: userObjectId,
    mistakeType: { $in: ["CALCULATION_ERROR", "MISREAD"] },
    createdAt: { $gte: windowDate },
  });
  const rankImpact = calculateRankImpact(carelessCount);

  return {
    report: latest,
    rankImpact,
  };
}
