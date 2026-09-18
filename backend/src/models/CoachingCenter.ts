import mongoose, { Schema, Model } from "mongoose";
import { ICoachingCenter } from "../types/index.js";

const CoachingCenterSchema = new Schema<ICoachingCenter>(
  {
    name: { type: String, required: true, trim: true },
    joinCode: { type: String, required: true, unique: true, uppercase: true, trim: true },
    city: { type: String, trim: true },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

export const CoachingCenter: Model<ICoachingCenter> =
  (mongoose.models.CoachingCenter as Model<ICoachingCenter>) ||
  mongoose.model<ICoachingCenter>("CoachingCenter", CoachingCenterSchema);
