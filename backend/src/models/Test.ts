import mongoose, { Schema, Model } from "mongoose";
import { ITest } from "../types/index.js";

const TestSchema = new Schema<ITest>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    testName: {
      type: String,
      trim: true,
    },
    testDate: {
      type: Date,
      default: Date.now,
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

export const Test: Model<ITest> =
  (mongoose.models.Test as Model<ITest>) || mongoose.model<ITest>("Test", TestSchema);
