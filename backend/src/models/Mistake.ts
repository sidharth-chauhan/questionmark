import mongoose, { Schema, Model } from "mongoose";
import { IMistake } from "../types/index.js";

const MistakeSchema = new Schema<IMistake>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    testId: {
      type: Schema.Types.ObjectId,
      ref: "Test",
    },
    questionText: {
      type: String,
      required: true,
      trim: true,
    },
    chapterId: {
      type: Schema.Types.ObjectId,
      ref: "Chapter",
      required: true,
    },
    subTopic: {
      type: String,
      trim: true,
    },
    mistakeType: {
      type: String,
      required: true,
      enum: ["CONCEPT_GAP", "CALCULATION_ERROR", "MISREAD", "FORGOT_FORMULA"],
    },
    difficulty: {
      type: String,
      required: true,
      enum: ["EASY", "MEDIUM", "HARD"],
      default: "MEDIUM",
    },
    aiExplanation: {
      type: String,
      required: true,
      trim: true,
    },
    photoUrl: {
      type: String,
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

MistakeSchema.index({ userId: 1, createdAt: -1 });

export const Mistake: Model<IMistake> =
  (mongoose.models.Mistake as Model<IMistake>) || mongoose.model<IMistake>("Mistake", MistakeSchema);
