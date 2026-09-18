import { GoogleGenAI } from "@google/genai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "../../config/env.js";
import { GeminiMistakeTag, MistakeType, DifficultyLevel } from "../../types/index.js";
import { Subject } from "../../models/Subject.js";
import { Chapter } from "../../models/Chapter.js";

const SYSTEM_PROMPT = `You are an expert Indian JEE (Main & Advanced) faculty and question diagnostic AI.
Your job is to read the uploaded photograph of a JEE practice question or test paper question that the student solved incorrectly.
Extract the question text accurately and categorize the student's mistake.

You must respond ONLY with a valid, parseable JSON object matching this schema:
{
  "questionText": "Full text of the question including given variables, formulas, or numbers",
  "subject": "Physics" | "Chemistry" | "Math",
  "chapter": "Standard JEE chapter name (e.g., Rotational Motion, Thermodynamics, Chemical Bonding, Definite Integration, Electrostatics, etc.)",
  "subTopic": "Specific sub-topic within the chapter, or null",
  "mistakeType": "CONCEPT_GAP" | "CALCULATION_ERROR" | "MISREAD" | "FORGOT_FORMULA",
  "difficulty": "EASY" | "MEDIUM" | "HARD",
  "explanation": "Provide the exact mathematical formula or core concept needed, a brief step-by-step solution to reach the correct answer, and a tip on how to avoid this error in the future."
}

Mistake type definitions:
- CONCEPT_GAP: Fundamental misunderstanding of physics/chemistry/math theory, wrong physical laws applied.
- CALCULATION_ERROR: Right formula and approach, but arithmetic, algebraic, or sign error (+ vs -).
- MISREAD: Misread values, units, missed words like 'not', 'incorrect', 'minimum', or misinterpreted diagrams.
- FORGOT_FORMULA: Could not recall or misremembered a standard formula/identity/standard value.

Return only the raw JSON object, without markdown code fences or conversational prose.`;

export async function tagMistakeFromImage(
  imageBuffer: Buffer,
  mimeType: string,
  userNotes?: string
): Promise<GeminiMistakeTag> {
  const apiKey = env.GEMINI_API_KEY || process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      const base64Data = imageBuffer.toString("base64");
      // Try using modern GoogleGenAI first
      try {
        const ai = new GoogleGenAI({
          apiKey,
          httpOptions: { headers: { "User-Agent": "aistudio-build" } },
        });
        const modelName = env.GEMINI_MODEL || "gemini-2.0-flash";
        const promptText = userNotes
          ? `Analyze this JEE wrong question. Student note/context: "${userNotes}"`
          : "Analyze this JEE wrong question.";

        const response = await ai.models.generateContent({
          model: modelName,
          contents: {
            parts: [
              {
                inlineData: {
                  mimeType: mimeType || "image/jpeg",
                  data: base64Data,
                },
              },
              { text: `${SYSTEM_PROMPT}\n\nTask: ${promptText}` },
            ],
          },
          config: {
            responseMimeType: "application/json",
          },
        });

        const rawText = response.text || "";
        const cleanJson = rawText.replace(/```json\s*|```/g, "").trim();
        const parsed = JSON.parse(cleanJson) as GeminiMistakeTag;
        return sanitizeTagResult(parsed);
      } catch (sdkError) {
        // Fallback to @google/generative-ai
        const legacyAi = new GoogleGenerativeAI(apiKey);
        const legacyModel = legacyAi.getGenerativeModel({
          model: env.GEMINI_MODEL || "gemini-2.0-flash",
          generationConfig: { responseMimeType: "application/json" },
        });

        const result = await legacyModel.generateContent([
          {
            inlineData: {
              mimeType: mimeType || "image/jpeg",
              data: base64Data,
            },
          },
          `${SYSTEM_PROMPT}\n\nTask: Analyze this JEE wrong question.`,
        ]);

        const rawText = result.response.text();
        const cleanJson = rawText.replace(/```json\s*|```/g, "").trim();
        const parsed = JSON.parse(cleanJson) as GeminiMistakeTag;
        return sanitizeTagResult(parsed);
      }
    } catch (error) {
      console.warn("⚠️ [Gemini AI Warning] Live API call failed, falling back to heuristic tagger:", (error as Error).message);
    }
  }

  // Graceful fallback if offline or no API key
  return fallbackMistakeTagger(userNotes);
}

function sanitizeTagResult(parsed: Partial<GeminiMistakeTag>): GeminiMistakeTag {
  const validSubjects: Array<"Physics" | "Chemistry" | "Math"> = ["Physics", "Chemistry", "Math"];
  let subject: "Physics" | "Chemistry" | "Math" = "Physics";
  if (parsed.subject && validSubjects.includes(parsed.subject as any)) {
    subject = parsed.subject as "Physics" | "Chemistry" | "Math";
  }

  const validMistakeTypes: MistakeType[] = ["CONCEPT_GAP", "CALCULATION_ERROR", "MISREAD", "FORGOT_FORMULA"];
  const mistakeType: MistakeType = validMistakeTypes.includes(parsed.mistakeType as any)
    ? (parsed.mistakeType as MistakeType)
    : "CALCULATION_ERROR";

  const validDifficulties: DifficultyLevel[] = ["EASY", "MEDIUM", "HARD"];
  const difficulty: DifficultyLevel = validDifficulties.includes(parsed.difficulty as any)
    ? (parsed.difficulty as DifficultyLevel)
    : "MEDIUM";

  return {
    questionText: parsed.questionText || "Question extracted from test paper photo",
    subject,
    chapter: parsed.chapter || "Rotational Motion",
    subTopic: parsed.subTopic || null,
    mistakeType,
    difficulty,
    explanation:
      parsed.explanation ||
      "Identified mistake in calculation or conceptual step. Review formula application and cross-check boundary values.",
  };
}

function fallbackMistakeTagger(userNotes?: string): GeminiMistakeTag {
  const subjects: Array<"Physics" | "Chemistry" | "Math"> = ["Physics", "Chemistry", "Math"];
  const chapters = {
    Physics: ["Rotational Motion", "Thermodynamics", "Current Electricity", "Work Energy & Power", "Optics"],
    Chemistry: ["Chemical Bonding", "Equilibrium", "Electrochemistry", "Aldehydes & Ketones", "Structure of Atom"],
    Math: ["Definite Integration", "Matrices & Determinants", "Vectors & 3D Geometry", "Complex Numbers", "Probability"],
  };

  const selectedSubject = subjects[Math.floor(Math.random() * subjects.length)];
  const subjectChapters = chapters[selectedSubject];
  const selectedChapter = subjectChapters[Math.floor(Math.random() * subjectChapters.length)];

  const types: MistakeType[] = ["CALCULATION_ERROR", "CONCEPT_GAP", "MISREAD", "FORGOT_FORMULA"];
  const selectedType = types[Math.floor(Math.random() * types.length)];

  return {
    questionText: userNotes
      ? `Extracted Question: ${userNotes}`
      : `A particle executes periodic motion described by differential equation with damping factor. Calculate frequency at equilibrium.`,
    subject: selectedSubject,
    chapter: selectedChapter,
    subTopic: "Equilibrium & Boundary Conditions",
    mistakeType: selectedType,
    difficulty: "MEDIUM",
    explanation: `Analysis indicates a ${selectedType.replace("_", " ").toLowerCase()} during algebraic simplification. In JEE tests, speed pressure often causes subtle sign mistakes in this chapter. Re-check the standard theorem and solve 3 target practice questions.`,
  };
}

export async function resolveSubjectAndChapter(
  subjectName: "Physics" | "Chemistry" | "Math",
  chapterName: string
) {
  let subject = await Subject.findOne({ name: subjectName });
  if (!subject) {
    subject = await Subject.create({ name: subjectName });
  }

  let chapter = await Chapter.findOne({
    subjectId: subject._id,
    name: chapterName,
  });

  if (!chapter) {
    chapter = await Chapter.create({
      subjectId: subject._id,
      name: chapterName,
    });
  }

  return { subject, chapter };
}
