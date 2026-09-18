import mongoose, { Schema, Model } from "mongoose";
import { IUser } from "../types/index.js";

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: { type: String, required: true },
    targetExam: {
      type: String,
      enum: ["JEE_MAIN", "JEE_ADVANCED"],
      default: "JEE_MAIN",
    },
    targetYear: { type: Number },
    coachingCenterId: { type: Schema.Types.ObjectId, ref: "CoachingCenter" },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

export const User: Model<IUser> =
  (mongoose.models.User as Model<IUser>) || mongoose.model<IUser>("User", UserSchema);
