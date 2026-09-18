import { Types } from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import { Mistake } from "../../models/Mistake.js";
import { Chapter } from "../../models/Chapter.js";
import { Subject } from "../../models/Subject.js";
import { tagMistakeFromImage, resolveSubjectAndChapter } from "../../lib/gemini/tagMistake.js";
import { recomputeWeakSpotsForUser } from "../weakSpots/weakSpots.service.js";
import { env } from "../../config/env.js";

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = (buffer: Buffer): Promise<string> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "questionmark_mistakes" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result!.secure_url);
      }
    );
    uploadStream.end(buffer);
  });
};

export async function processAndCreateMistake(params: {
  userId: string;
  imageBuffer?: Buffer;
  mimeType?: string;
  testId?: string;
  notes?: string;
  manualQuestionText?: string;
  manualChapterId?: string;
  manualMistakeType?: "CONCEPT_GAP" | "CALCULATION_ERROR" | "MISREAD" | "FORGOT_FORMULA";
  manualDifficulty?: "EASY" | "MEDIUM" | "HARD";
}) {
  let questionText = params.manualQuestionText || "";
  let chapterId = params.manualChapterId;
  let subTopic: string | null = null;
  let mistakeType = params.manualMistakeType || "CALCULATION_ERROR";
  let difficulty = params.manualDifficulty || "MEDIUM";
  let aiExplanation = "";
  let photoUrl = "";

  if (params.imageBuffer && params.imageBuffer.length > 0) {
    try {
      photoUrl = await uploadToCloudinary(params.imageBuffer);
    } catch (uploadError) {
      console.error("Cloudinary upload failed:", uploadError);
    }

    const tagged = await tagMistakeFromImage(
      params.imageBuffer,
      params.mimeType || "image/jpeg",
      params.notes
    );

    questionText = tagged.questionText;
    mistakeType = tagged.mistakeType;
    difficulty = tagged.difficulty;
    subTopic = tagged.subTopic;
    aiExplanation = tagged.explanation;

    if (!params.manualChapterId) {
      const { chapter } = await resolveSubjectAndChapter(tagged.subject, tagged.chapter);
      chapterId = chapter._id.toString();
    }
  } else if (!chapterId) {
    // If no image, resolve default chapter
    const { chapter } = await resolveSubjectAndChapter("Physics", "Rotational Motion");
    chapterId = chapter._id.toString();
    aiExplanation = "Diagnosed review entry. Ensure fundamental conceptual rigor.";
  }

  const newMistake = await Mistake.create({
    userId: new Types.ObjectId(params.userId),
    testId: params.testId ? new Types.ObjectId(params.testId) : undefined,
    questionText: questionText || "Question text extracted from uploaded material",
    chapterId: new Types.ObjectId(chapterId),
    subTopic: subTopic || undefined,
    mistakeType,
    difficulty,
    photoUrl,
    aiExplanation: aiExplanation || "Conceptual diagnostic complete. Focus on precise formulas and sign conventions.",
    createdAt: new Date(),
  });

  // Automatically update weak spots in background
  try {
    await recomputeWeakSpotsForUser(params.userId);
  } catch (err) {
    console.warn("⚠️ [WeakSpots Recompute Warning]:", (err as Error).message);
  }

  return await Mistake.findById(newMistake._id)
    .populate({
      path: "chapterId",
      populate: { path: "subjectId" },
    })
    .populate("testId");
}

export async function getMistakesForUser(params: {
  userId: string;
  subjectId?: string;
  chapterId?: string;
  mistakeType?: string;
  testId?: string;
  limit: number;
  page: number;
}) {
  const query: any = { userId: new Types.ObjectId(params.userId) };

  if (params.chapterId) {
    query.chapterId = new Types.ObjectId(params.chapterId);
  } else if (params.subjectId) {
    const chaptersInSubject = await Chapter.find({ subjectId: new Types.ObjectId(params.subjectId) }).select("_id");
    query.chapterId = { $in: chaptersInSubject.map((c) => c._id) };
  }

  if (params.mistakeType) {
    query.mistakeType = params.mistakeType;
  }

  if (params.testId) {
    query.testId = new Types.ObjectId(params.testId);
  }

  const skip = (params.page - 1) * params.limit;
  const [mistakes, total] = await Promise.all([
    Mistake.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(params.limit)
      .populate({
        path: "chapterId",
        populate: { path: "subjectId" },
      })
      .populate("testId"),
    Mistake.countDocuments(query),
  ]);

  return {
    mistakes,
    pagination: {
      total,
      page: params.page,
      limit: params.limit,
      totalPages: Math.ceil(total / params.limit) || 1,
    },
  };
}

export async function getMistakeByIdForUser(userId: string, mistakeId: string) {
  const mistake = await Mistake.findOne({
    _id: new Types.ObjectId(mistakeId),
    userId: new Types.ObjectId(userId),
  })
    .populate({
      path: "chapterId",
      populate: { path: "subjectId" },
    })
    .populate("testId");

  if (!mistake) {
    const error: any = new Error("Mistake record not found");
    error.statusCode = 404;
    error.code = "MISTAKE_NOT_FOUND";
    throw error;
  }

  return mistake;
}