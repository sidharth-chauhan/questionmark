import mongoose from "mongoose";
import { connectDB, disconnectDB } from "../config/db.js";
import { Subject } from "../models/Subject.js";
import { Chapter } from "../models/Chapter.js";

const syllabus = {
  Physics: [
    "Units & Measurements",
    "Kinematics",
    "Laws of Motion",
    "Work Energy & Power",
    "Rotational Motion",
    "Gravitation",
    "Properties of Solids & Fluids",
    "Thermodynamics & Kinetic Theory",
    "Oscillations & Waves",
    "Electrostatics",
    "Current Electricity",
    "Magnetic Effects of Current & Magnetism",
    "Electromagnetic Induction & AC",
    "Electromagnetic Waves",
    "Optics (Ray & Wave)",
    "Modern Physics (Dual Nature & Atoms/Nuclei)",
    "Semiconductors & Electronic Devices",
  ],
  Chemistry: [
    "Some Basic Concepts of Chemistry",
    "Structure of Atom",
    "Classification of Elements & Periodicity",
    "Chemical Bonding & Molecular Structure",
    "Chemical Thermodynamics",
    "Equilibrium (Chemical & Ionic)",
    "Redox Reactions & Electrochemistry",
    "Chemical Kinetics",
    "Solutions",
    "p-Block, d-Block & f-Block Elements",
    "Coordination Compounds",
    "Purification & Characterization of Organic Compounds",
    "Hydrocarbons",
    "Organic Compounds Containing Halogens",
    "Alcohols, Phenols & Ethers",
    "Aldehydes, Ketones & Carboxylic Acids",
    "Organic Compounds Containing Nitrogen",
    "Biomolecules & Polymers",
  ],
  Math: [
    "Sets, Relations & Functions",
    "Complex Numbers & Quadratic Equations",
    "Matrices & Determinants",
    "Permutations & Combinations",
    "Binomial Theorem & Simple Applications",
    "Sequence & Series",
    "Limit, Continuity & Differentiability",
    "Integral Calculus (Definite & Indefinite)",
    "Differential Equations",
    "Coordinate Geometry (Circles, Conics)",
    "Vector Algebra",
    "Three Dimensional Geometry",
    "Probability & Statistics",
    "Trigonometry",
  ],
};

export async function seedSubjectsAndChapters() {
  console.log("🌱 [Seed] Starting JEE Subjects & Chapters seeding...");
  await connectDB();

  for (const [subjectName, chapterNames] of Object.entries(syllabus)) {
    const validSubject = subjectName as "Physics" | "Chemistry" | "Math";
    let subject = await Subject.findOne({ name: validSubject });
    if (!subject) {
      subject = await Subject.create({ name: validSubject });
      console.log(`+ Added Subject: ${validSubject}`);
    }

    const subjectId = (subject as any)._id;

    for (const chapterName of chapterNames) {
      const existing = await Chapter.findOne({
        subjectId,
        name: chapterName,
      });

      if (!existing) {
        await Chapter.create({
          subjectId,
          name: chapterName,
        });
      }
    }
  }

  const subjectCount = await Subject.countDocuments();
  const chapterCount = await Chapter.countDocuments();
  console.log(`✅ [Seed] Successfully verified ${subjectCount} subjects and ${chapterCount} chapters in DB.`);
}

// If run directly
if (process.argv[1]?.endsWith("seedSubjectsAndChapters.ts") || process.argv[1]?.endsWith("seedSubjectsAndChapters.js")) {
  seedSubjectsAndChapters()
    .then(async () => {
      await disconnectDB();
      process.exit(0);
    })
    .catch(async (err) => {
      console.error("❌ [Seed Error]:", err);
      await disconnectDB();
      process.exit(1);
    });
}
