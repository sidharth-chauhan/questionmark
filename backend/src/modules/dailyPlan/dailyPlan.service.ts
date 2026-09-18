import { Types } from "mongoose";
import { DailyPlan } from "../../models/DailyPlan.js";
import { WeeklyReport } from "../../models/WeeklyReport.js";
import { Chapter } from "../../models/Chapter.js";

function getMidnightDate(date: Date = new Date()): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export async function generateOrGetDailyPlan(userId: string, dateStr?: string) {
  const userObjectId = new Types.ObjectId(userId);
  const targetDate = dateStr ? getMidnightDate(new Date(dateStr)) : getMidnightDate();

  let plan = await DailyPlan.findOne({
    userId: userObjectId,
    date: targetDate,
  }).populate({
    path: "chapterIds",
    populate: { path: "subjectId" },
  });

  if (plan) {
    const history = await getSevenDayHistory(userId);
    return { plan, history };
  }

  // Determine streak from yesterday
  const yesterday = new Date(targetDate);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayPlan = await DailyPlan.findOne({
    userId: userObjectId,
    date: yesterday,
  });

  let nextStreak = 0;
  if (yesterdayPlan && yesterdayPlan.done) {
    nextStreak = yesterdayPlan.streakDay + 1;
  } else {
    // If starting fresh or yesterday missed
    nextStreak = 1;
  }

  // Get top 2 weak chapters from WeeklyReport
  const latestReport = await WeeklyReport.findOne({ userId: userObjectId }).sort({ weekStart: -1 });

  let selectedChapterIds: Types.ObjectId[] = [];

  if (latestReport && latestReport.topWeakChapters && latestReport.topWeakChapters.length > 0) {
    selectedChapterIds = latestReport.topWeakChapters.slice(0, 2).map((c) => new Types.ObjectId(c.chapterId));
  }

  // Fallback if no chapters in report yet
  if (selectedChapterIds.length === 0) {
    const fallbackChapters = await Chapter.find().limit(2);
    selectedChapterIds = fallbackChapters.map((c) => new Types.ObjectId(c._id as any));
  }

  try {
    const newPlan = await DailyPlan.create({
      userId: userObjectId,
      date: targetDate,
      chapterIds: selectedChapterIds,
      minutesEach: 20,
      done: false,
      streakDay: nextStreak,
      createdAt: new Date(),
    });

    plan = await DailyPlan.findById(newPlan._id).populate({
      path: "chapterIds",
      populate: { path: "subjectId" },
    });
  } catch (err) {
    // If race condition created it
    plan = await DailyPlan.findOne({ userId: userObjectId, date: targetDate }).populate({
      path: "chapterIds",
      populate: { path: "subjectId" },
    });
  }

  const history = await getSevenDayHistory(userId);

  return { plan, history };
}

export async function addCustomChapter(userId: string, dateStr: string, chapterId: string) {
  const userObjectId = new Types.ObjectId(userId);
  const targetDate = getMidnightDate(new Date(dateStr));
  let plan = await DailyPlan.findOne({ userId: userObjectId, date: targetDate });

  if (!plan) {
    plan = await DailyPlan.create({
      userId: userObjectId,
      date: targetDate,
      chapterIds: [new Types.ObjectId(chapterId)],
      minutesEach: 20,
      done: false,
      streakDay: 1,
      createdAt: new Date()
    });
  } else {
    const exists = plan.chapterIds.some((id: any) => id.toString() === chapterId);
    if (!exists) {
      plan.chapterIds.push(new Types.ObjectId(chapterId) as any);
      await plan.save();
    }
  }

  const populated = await DailyPlan.findById(plan._id).populate({
    path: "chapterIds",
    populate: { path: "subjectId" },
  });

  const history = await getSevenDayHistory(userId);
  return { plan: populated, history };
}

export async function removeCustomChapter(userId: string, dateStr: string, chapterId: string) {
  const userObjectId = new Types.ObjectId(userId);
  const targetDate = getMidnightDate(new Date(dateStr));
  
  let plan = await DailyPlan.findOne({ userId: userObjectId, date: targetDate });

  if (plan) {
    plan.chapterIds = plan.chapterIds.filter((id: any) => id.toString() !== chapterId) as any;
    await plan.save();
  }

  const populated = plan ? await DailyPlan.findById(plan._id).populate({
    path: "chapterIds",
    populate: { path: "subjectId" },
  }) : null;

  const history = await getSevenDayHistory(userId);
  return { plan: populated, history };
}

export async function updatePlanTime(userId: string, dateStr: string, chapterId: string, minutes: number) {
  const userObjectId = new Types.ObjectId(userId);
  const targetDate = getMidnightDate(new Date(dateStr));
  
  let plan = await DailyPlan.findOne({ userId: userObjectId, date: targetDate });

  if (plan) {
    if (!plan.durations) {
      plan.durations = new Map();
    }
    plan.durations.set(chapterId, Math.max(5, minutes));
    await plan.save();
  }

  const populated = plan ? await DailyPlan.findById(plan._id).populate({
    path: "chapterIds",
    populate: { path: "subjectId" },
  }) : null;

  const history = await getSevenDayHistory(userId);
  return { plan: populated, history };
}

export async function markPlanComplete(userId: string, planId: string) {
  const plan = await DailyPlan.findOne({
    _id: new Types.ObjectId(planId),
    userId: new Types.ObjectId(userId),
  });

  if (!plan) {
    const error: any = new Error("Daily revision plan not found");
    error.statusCode = 404;
    error.code = "PLAN_NOT_FOUND";
    throw error;
  }

  plan.done = true;
  await plan.save();

  const populated = await DailyPlan.findById(plan._id).populate({
    path: "chapterIds",
    populate: { path: "subjectId" },
  });

  const history = await getSevenDayHistory(userId);

  return { plan: populated, history };
}

export async function getSevenDayHistory(userId: string) {
  const userObjectId = new Types.ObjectId(userId);
  const today = getMidnightDate();

  const days: Array<{ date: string; dayLabel: string; done: boolean; isToday: boolean }> = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const dayLabel = d.toLocaleDateString("en-US", { weekday: "short" });

    const found = await DailyPlan.findOne({
      userId: userObjectId,
      date: d,
    });

    days.push({
      date: dateStr,
      dayLabel,
      done: Boolean(found && found.done),
      isToday: i === 0,
    });
  }

  return days;
}