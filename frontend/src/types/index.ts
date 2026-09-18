export type MistakeType =
  | "CONCEPT_GAP"
  | "CALCULATION_ERROR"
  | "MISREAD"
  | "FORGOT_FORMULA";

export type TargetExam = "JEE_MAIN" | "JEE_ADVANCED";

export interface User {
  _id: string;
  name: string;
  email: string;
  targetExam: TargetExam;
  targetYear: number;
}

export interface Subject {
  _id: string;
  name: "Physics" | "Chemistry" | "Math";
}

export interface Chapter {
  _id: string;
  subjectId: string | Subject;
  name: string;
  weightage?: number;
}

export interface Test {
  _id: string;
  userId: string;
  testName: string;
  testDate?: string;
  mistakesCount?: number;
}

export interface Mistake {
  _id: string;
  userId: string;
  testId?: string | Test;
  chapterId: {
    _id: string;
    name: string;
    subjectId?: string | { _id: string; name: string };
  };
  mistakeType: MistakeType;
  questionText: string;
  aiExplanation: string;
  difficulty?: string;
  photoUrl?: string;
  createdAt: string;
}

export interface WeakChapterStat {
  chapterId: string;
  chapterName: string;
  subjectName: string;
  count: number;
  weightage: number;
  carelessCount: number;
}

export type WeakChapter = WeakChapterStat;

export interface MistakeTypeBreakdown {
  CONCEPT_GAP: number;
  CALCULATION_ERROR: number;
  MISREAD: number;
  FORGOT_FORMULA: number;
}

export interface RankImpactData {
  score: number;
  carelessMistakesCount: number;
  marksLost: number;
  formula: string;
}

export interface WeeklyReport {
  _id: string;
  userId: string;
  weekStartDate: string;
  rankImpactScore: number;
  topWeakChapters: {
    chapterId: string;
    count: number;
  }[];
  mistakeTypeBreakdown: MistakeTypeBreakdown;
  generatedAt: string;
}

export interface WeakSpotsReport {
  rankImpactScore?: number;
  topWeakChapters?: WeakChapterStat[];
  mistakeTypeBreakdown?: MistakeTypeBreakdown;
  rankImpact?: RankImpactData;
  report?: WeeklyReport;
}

export interface DailyPlan {
  _id: string;
  userId: string;
  date: string;
  chapterIds: {
    _id: string;
    name: string;
    subjectId?: string;
  }[];
  done: boolean;
  completedAt?: string;
}

export interface DailyPlanHistoryItem {
  _id?: string;
  date: string;
  done: boolean;
  dayLabel?: string;
  isToday?: boolean;
}

export interface PracticeQuestion {
  _id: string;
  userId: string;
  chapterId: string;
  questionText: string;
  answerText: string;
  status: "UNSOLVED" | "SOLVED" | "SKIPPED";
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
