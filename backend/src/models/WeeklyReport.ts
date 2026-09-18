import mongoose, { Schema, Model } from "mongoose";
import { IWeeklyReport } from "../types/index.js";

const WeeklyReportSchema = new Schema<IWeeklyReport>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    weekStart: {
      type: Date,
      required: true,
    },
    topWeakChapters: [
      {
        chapterId: { type: Schema.Types.ObjectId, ref: "Chapter", required: true },
        chapterName: { type: String, required: true },
        count: { type: Number, required: true },
      },
    ],
    mistakeTypeBreakdown: {
      CONCEPT_GAP: { type: Number, default: 0 },
      CALCULATION_ERROR: { type: Number, default: 0 },
      MISREAD: { type: Number, default: 0 },
      FORGOT_FORMULA: { type: Number, default: 0 },
    },
    rankImpactScore: {
      type: Number,
      required: true,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

WeeklyReportSchema.index({ userId: 1, weekStart: -1 });

export const WeeklyReport: Model<IWeeklyReport> =
  (mongoose.models.WeeklyReport as Model<IWeeklyReport>) ||
  mongoose.model<IWeeklyReport>("WeeklyReport", WeeklyReportSchema);
