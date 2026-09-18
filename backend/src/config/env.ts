import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  MONGODB_URI: z.string().default("mongodb://mongo:27017/questionmark"),
  JWT_SECRET: z.string().default("questionmark-secret-jwt-key-jee-aspirants-2026"),
  GEMINI_API_KEY: z.string().optional().default(""),
  GEMINI_MODEL: z.string().default("gemini-3.6-flash"),
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  CLIENT_URL: z.string().default("http://localhost:8080"),
  APP_NAME: z.string().default("QuestionMark"),
  RANKS_PER_MARK_CONSTANT: z.coerce.number().default(500),
  CARELESS_MISTAKE_WINDOW_DAYS: z.coerce.number().default(14),
  CRON_SCHEDULE: z.string().default("30 15 * * *"),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.warn("⚠️ [ENV WARNING] Invalid environment variables:", parsedEnv.error.format());
}

export const env = parsedEnv.success ? parsedEnv.data : envSchema.parse({});
