import { GoogleGenAI } from "@google/genai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "../../config/env.js";

export interface GeneratedPracticeItem {
  questionText: string;
  answerText: string;
}

export async function generatePracticeForChapter(
  chapterName: string,
  subjectName?: string,
  count: number = 3
): Promise<GeneratedPracticeItem[]> {
  const apiKey = env.GEMINI_API_KEY || process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      const prompt = `Generate ${count} high-yield JEE Main / Advanced level practice questions for the chapter "${chapterName}" (${subjectName || "JEE Syllabus"}).
Target questions that specifically test subtle concept gaps, formula edge-cases, or common calculation traps.

Respond ONLY with a JSON array of objects with this exact structure:
[
  {
    "questionText": "Question statement with full context, options (A, B, C, D) or numerical integer type",
    "answerText": "Correct Option / Numerical Value followed by step-by-step rigorous derivation and key takeaway."
  }
]
No markdown formatting, no conversational preamble.`;

      try {
        const ai = new GoogleGenAI({
          apiKey,
          httpOptions: { headers: { "User-Agent": "aistudio-build" } },
        });
        const modelName = env.GEMINI_MODEL || "gemini-2.0-flash";
        const response = await ai.models.generateContent({
          model: modelName,
          contents: prompt,
          config: {
            responseMimeType: "application/json",
          },
        });

        const raw = response.text || "[]";
        const clean = raw.replace(/```json\s*|```/g, "").trim();
        const items = JSON.parse(clean) as GeneratedPracticeItem[];
        if (Array.isArray(items) && items.length > 0) {
          return items.slice(0, 5);
        }
      } catch (err) {
        // Fallback to legacy
        const legacyAi = new GoogleGenerativeAI(apiKey);
        const legacyModel = legacyAi.getGenerativeModel({
          model: env.GEMINI_MODEL || "gemini-2.0-flash",
          generationConfig: { responseMimeType: "application/json" },
        });
        const result = await legacyModel.generateContent(prompt);
        const raw = result.response.text();
        const clean = raw.replace(/```json\s*|```/g, "").trim();
        const items = JSON.parse(clean) as GeneratedPracticeItem[];
        if (Array.isArray(items) && items.length > 0) {
          return items.slice(0, 5);
        }
      }
    } catch (error) {
      console.warn("⚠️ [Gemini AI Practice Generation Error]:", (error as Error).message);
    }
  }

  // Robust fallback practice questions
  return [
    {
      questionText: `[JEE Target Question 1 - ${chapterName}]\nA body undergoes standard transformation under external torque $\\tau = \\alpha t + \\beta t^2$. If the moment of inertia about the axis is $I_0$, find angular velocity at time $t=T$ starting from rest.`,
      answerText: `Correct Answer: $\\omega = \\frac{1}{I_0} \\left(\\frac{\\alpha T^2}{2} + \\frac{\\beta T^3}{3}\\right)$. Derivation: $\\tau = I \\frac{d\\omega}{dt} \\implies \\int_0^\\omega d\\omega = \\frac{1}{I_0} \\int_0^T (\\alpha t + \\beta t^2) dt$.`,
    },
    {
      questionText: `[JEE Target Question 2 - ${chapterName}]\nEvaluate the equilibrium condition when parameters are perturbed by small fractional offset $\\Delta x / x_0 \\ll 1$. What is the restored natural frequency?`,
      answerText: `Correct Answer: $\\omega_0 = \\sqrt{k_{eff} / m}$. Step-by-step: Taylor expansion around minimum potential energy point $U''(x_0) > 0$. Neglect terms of order $(\\Delta x)^2$.`,
    },
    {
      questionText: `[JEE Target Question 3 - ${chapterName}]\nIdentify the common trap when calculating net work done in a cyclic process where one leg is non-quasi-static.`,
      answerText: `Correct Answer: Work depends on the area enclosed only for reversible cycles. For irreversible paths, $\\Delta U$ is state-dependent ($Q - W$), but $W$ must be calculated along actual external resisting pressure $P_{ext} dV$.`,
    },
  ];
}
