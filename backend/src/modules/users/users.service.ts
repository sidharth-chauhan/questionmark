import { User } from "../../models/User.js";
import { Subject } from "../../models/Subject.js";
import { Chapter } from "../../models/Chapter.js";

export async function getUserProfile(userId: string) {
  const user = await User.findById(userId)
    .select("-passwordHash")
    .populate("coachingCenterId");

  if (!user) {
    const error: any = new Error("User profile not found");
    error.statusCode = 404;
    error.code = "USER_NOT_FOUND";
    throw error;
  }

  const subjects = await Subject.find().sort({ name: 1 });
  const totalChapters = await Chapter.countDocuments();

  return {
    user,
    subjects,
    totalChapters,
  };
}

export async function updateUserProfile(
  userId: string,
  updateData: {
    name?: string;
    targetExam?: "JEE_MAIN" | "JEE_ADVANCED";
    targetYear?: number;
  }
) {
  const user = await User.findByIdAndUpdate(
    userId,
    { $set: updateData },
    { new: true, runValidators: true }
  ).select("-passwordHash");

  if (!user) {
    const error: any = new Error("User not found");
    error.statusCode = 404;
    error.code = "USER_NOT_FOUND";
    throw error;
  }

  return user;
}
