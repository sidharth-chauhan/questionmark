import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "./env.js";

let genAIInstance: GoogleGenerativeAI | null = null;

export function getGeminiAI(): GoogleGenerativeAI | null {
  const apiKey = env.GEMINI_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!genAIInstance) {
    genAIInstance = new GoogleGenerativeAI(apiKey);
  }
  return genAIInstance;
}

export function getGeminiModel() {
  const ai = getGeminiAI();
  if (!ai) return null;
  const modelName = env.GEMINI_MODEL || "gemini-2.0-flash";
  return ai.getGenerativeModel({ model: modelName });
}
