import { z } from "zod";

export const getMistakesQuerySchema = z.object({
  subjectId: z.string().optional(),
  chapterId: z.string().optional(),
  mistakeType: z.enum(["CONCEPT_GAP", "CALCULATION_ERROR", "MISREAD", "FORGOT_FORMULA"]).optional(),
  testId: z.string().optional(),
  limit: z.coerce.number().min(1).max(100).default(50),
  page: z.coerce.number().min(1).default(1),
});
