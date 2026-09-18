import mongoose, { Schema, Model } from "mongoose";
import { ISubject } from "../types/index.js";

const SubjectSchema = new Schema<ISubject>(
  {
    name: {
      type: String,
      required: true,
      enum: ["Physics", "Chemistry", "Math"],
      unique: true,
    },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

export const Subject: Model<ISubject> =
  (mongoose.models.Subject as Model<ISubject>) || mongoose.model<ISubject>("Subject", SubjectSchema);
