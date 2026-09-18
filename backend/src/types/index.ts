import { Types } from "mongoose";

export type MistakeType = "CONCEPT_GAP" | "CALCULATION_ERROR" | "MISREAD" | "FORGOT_FORMULA";
export type DifficultyLevel = "EASY" | "MEDIUM" | "HARD";
export type PracticeStatus = "PENDING" | "SOLVED" | "SKIPPED";
export type TargetExam = "JEE_MAIN" | "JEE_ADVANCED";

export interface IUser {
  _id?: Types.ObjectId | string;
  name: string;
  email: string;
  passwordHash: string;
  targetExam?: TargetExam;
  targetYear?: number;
  coachingCenterId?: Types.ObjectId | string;
  createdAt: Date;
}

export interface ICoachingCenter {
  _id?: Types.ObjectId | string;
  name: string;
  joinCode: string;
  city?: string;
  createdAt: Date;
}

export interface ISubject {
  _id?: Types.ObjectId | string;
  name: "Physics" | "Chemistry" | "Math";
}

export interface IChapter {
  _id?: Types.ObjectId | string;
  subjectId: Types.ObjectId | string;
  name: string;
}

export interface ITest {
  _id?: Types.ObjectId | string;
  userId: Types.ObjectId | string;
  testName?: string;
  testDate?: Date;
  createdAt: Date;
}

export interface IMistake {
  _id?: Types.ObjectId | string;
  userId: Types.ObjectId | string;
  testId?: Types.ObjectId | string;
  questionText: string;
  chapterId: Types.ObjectId | string;
  subTopic?: string;
  mistakeType: MistakeType;
  difficulty: DifficultyLevel;
  aiExplanation: string;
  photoUrl?: string;
  createdAt: Date;
}

export interface IPracticeQuestion {
  _id?: Types.ObjectId | string;
  userId: Types.ObjectId | string;
  chapterId: Types.ObjectId | string;
  questionText: string;
  answerText: string;
  status: PracticeStatus;
  generatedAt: Date;
}

export interface IWeeklyReport {
  _id?: Types.ObjectId | string;
  userId: Types.ObjectId | string;
  weekStart: Date;
  topWeakChapters: Array<{
    chapterId: Types.ObjectId | string;
    chapterName: string;
    count: number;
  }>;
  mistakeTypeBreakdown: {
    CONCEPT_GAP: number;
    CALCULATION_ERROR: number;
    MISREAD: number;
    FORGOT_FORMULA: number;
  };
  rankImpactScore: number;
  createdAt: Date;
}

export interface IDailyPlan {
  _id?: Types.ObjectId | string;
  userId: Types.ObjectId | string;
  date: Date;
  chapterIds: Array<Types.ObjectId | string>;
  minutesEach: number;
  durations?: Record<string, number>;
  done: boolean;
  streakDay: number;
  createdAt: Date;
}

export interface GeminiMistakeTag {
  questionText: string;
  subject: "Physics" | "Chemistry" | "Math";
  chapter: string;
  subTopic: string | null;
  mistakeType: MistakeType;
  difficulty: DifficultyLevel;
  explanation: string;
}
