import { Types } from "mongoose";
import { PracticeQuestion } from "../../models/PracticeQuestion.js";
import { Chapter } from "../../models/Chapter.js";
import { Subject } from "../../models/Subject.js";
import { generatePracticeForChapter } from "../../lib/gemini/generatePractice.js";
import { PracticeStatus } from "../../types/index.js";

export async function generatePracticeForUser(userId: string, chapterId: string, count: number = 3) {
  const chapter = await Chapter.findById(chapterId);
  if (!chapter) {
    const error: any = new Error("Chapter not found");
    error.statusCode = 404;
    error.code = "CHAPTER_NOT_FOUND";
    throw error;
  }

  const subject = await Subject.findById(chapter.subjectId);
  const subjectName = subject ? subject.name : "JEE";

  const generatedItems = await generatePracticeForChapter(chapter.name, subjectName, count);

  const docs = generatedItems.map((item) => ({
    userId: new Types.ObjectId(userId),
    chapterId: new Types.ObjectId(chapterId),
    questionText: item.questionText,
    answerText: item.answerText,
    status: "PENDING" as PracticeStatus,
    generatedAt: new Date(),
  }));

  const saved = await PracticeQuestion.insertMany(docs);
  return saved;
}

export async function getPracticeQuestionsForUser(params: {
  userId: string;
  chapterId?: string;
  status?: PracticeStatus;
}) {
  const query: any = { userId: new Types.ObjectId(params.userId) };

  if (params.chapterId) {
    query.chapterId = new Types.ObjectId(params.chapterId);
  }

  if (params.status) {
    query.status = params.status;
  }

  return await PracticeQuestion.find(query)
    .sort({ generatedAt: -1 })
    .populate({
      path: "chapterId",
      populate: { path: "subjectId" },
    });
}

export async function updatePracticeQuestionStatus(
  userId: string,
  questionId: string,
  status: PracticeStatus
) {
  const question = await PracticeQuestion.findOneAndUpdate(
    {
      _id: new Types.ObjectId(questionId),
      userId: new Types.ObjectId(userId),
    },
    { $set: { status } },
    { new: true }
  ).populate({
    path: "chapterId",
    populate: { path: "subjectId" },
  });

  if (!question) {
    const error: any = new Error("Practice question not found");
    error.statusCode = 404;
    error.code = "QUESTION_NOT_FOUND";
    throw error;
  }

  return question;
}
