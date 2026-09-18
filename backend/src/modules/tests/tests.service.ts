import { Types } from "mongoose";
import { Test } from "../../models/Test.js";
import { Mistake } from "../../models/Mistake.js";

export async function createTestForUser(userId: string, data: { testName?: string; testDate?: Date }) {
  const test = await Test.create({
    userId: new Types.ObjectId(userId),
    testName: data.testName || "JEE Mock Test",
    testDate: data.testDate ? new Date(data.testDate) : new Date(),
    createdAt: new Date(),
  });
  return test;
}

export async function getTestsForUser(userId: string) {
  const userObjectId = new Types.ObjectId(userId);
  const tests = await Test.find({ userId: userObjectId }).sort({ testDate: -1 });

  // Augment with mistakes count
  const results = await Promise.all(
    tests.map(async (t) => {
      const mistakesCount = await Mistake.countDocuments({ testId: t._id });
      return {
        ...t.toObject(),
        mistakesCount,
      };
    })
  );

  return results;
}
