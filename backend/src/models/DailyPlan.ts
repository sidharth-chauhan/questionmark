import mongoose, { Schema, Model } from "mongoose";
import { IDailyPlan } from "../types/index.js";

const DailyPlanSchema = new Schema<IDailyPlan>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    chapterIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "Chapter",
      },
    ],
    minutesEach: {
      type: Number,
      default: 15,
    },
    durations: {
      type: Map,
      of: Number,
      default: {},
    },
    done: {
      type: Boolean,
      default: false,
    },
    streakDay: {
      type: Number,
      default: 1,
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

DailyPlanSchema.index({ userId: 1, date: 1 }, { unique: true });

export const DailyPlan: Model<IDailyPlan> =
  (mongoose.models.DailyPlan as Model<IDailyPlan>) ||
  mongoose.model<IDailyPlan>("DailyPlan", DailyPlanSchema);
