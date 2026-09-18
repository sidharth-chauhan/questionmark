# QuestionMark Backend

Production-quality Express + TypeScript + MongoDB + Gemini backend for **QuestionMark** (JEE Mistake Tracker & Revision Planning).

## Features
- **JWT Authentication**: Secure bcrypt password hashing & jsonwebtoken token generation.
- **Gemini AI Integration**: Multi-modal vision analysis of test paper photos into structured tags (subject, chapter, sub-topic, mistake type, difficulty, and actionable explanation).
- **Rank Impact Engine**: Pure mathematical computation mapping careless calculation/misread mistakes to marks lost and JEE rank loss.
- **Nightly Revision Cron Job**: `node-cron` scheduled automated daily revision plans based on weak-spot aggregation.
- **JEE Practice Generator**: On-demand 3-5 JEE level questions generated for targeted weak chapters.

## Local Development
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Seed JEE Subjects and Chapters:
   ```bash
   npm run seed
   ```
4. Start dev server:
   ```bash
   npm run dev
   ```

## Production Build & Run
```bash
npm run build
npm start
```
