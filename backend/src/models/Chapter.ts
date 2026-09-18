import mongoose, { Schema, Model } from "mongoose";
import { IChapter } from "../types/index.js";

const ChapterSchema = new Schema<IChapter>(
  {
    subjectId: {
      type: Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

ChapterSchema.index({ subjectId: 1, name: 1 }, { unique: true });

export const Chapter: Model<IChapter> =
  (mongoose.models.Chapter as Model<IChapter>) || mongoose.model<IChapter>("Chapter", ChapterSchema);
