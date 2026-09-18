import mongoose, { Schema, Model } from "mongoose";
import { IPracticeQuestion } from "../types/index.js";

const PracticeQuestionSchema = new Schema<IPracticeQuestion>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    chapterId: {
      type: Schema.Types.ObjectId,
      ref: "Chapter",
      required: true,
      index: true,
    },
    questionText: {
      type: String,
      required: true,
      trim: true,
    },
    answerText: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "SOLVED", "SKIPPED"],
      default: "PENDING",
      index: true,
    },
    generatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

export const PracticeQuestion: Model<IPracticeQuestion> =
  (mongoose.models.PracticeQuestion as Model<IPracticeQuestion>) ||
  mongoose.model<IPracticeQuestion>("PracticeQuestion", PracticeQuestionSchema);
