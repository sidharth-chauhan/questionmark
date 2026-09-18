# QuestionMark

> **Turn JEE test mistakes into rank improvements.**  
> Built for JEE Main & Advanced aspirants. Upload photos of questions you got wrong, let Gemini AI extract and tag them with conceptual diagnostics, view your rank impact, and receive a nightly 25-minute targeted revision plan.

---

## 1. Features

- 📸 **AI Mistake Analysis**: Photograph or upload any question from your mock test papers. Gemini AI automatically parses question text, subject, chapter, mistake type (`CONCEPT_GAP`, `CALCULATION_ERROR`, `MISREAD`, `FORGOT_FORMULA`), and provides key takeaways.
- 📉 **Rank-Impact Engine**: Computes exact marks lost to careless arithmetic and misread traps, quantifying ranks lost based on JEE distribution curves.
- 🎯 **Weak-Spots Diagnostic**: Aggregates test performance into top weak chapters and mistake-type distributions.
- 🌙 **Nightly Revision Plan**: Automated nightly schedule (cron-powered) generating 1-2 focused revision blocks (15 & 10 min) with streak tracking.
- 💡 **Targeted Practice**: Generate JEE-standard practice questions on demand for any flagged weak chapter.
- 👤 **Student Profiles**: Track mock test series, target exam year, and subject milestones.

---

## 2. Architecture

```
QuestionMark (Monorepo)
├── backend/           # Node.js 20, TypeScript, Express, Mongoose (MongoDB)
│   ├── src/
│   │   ├── config/    # DB, env parsing, Gemini client
│   │   ├── lib/       # Gemini mistake tagging, practice generation & rank impact
│   │   ├── models/    # Mongoose schemas (User, Mistake, WeeklyReport, DailyPlan, etc.)
│   │   ├── modules/   # Feature modules (auth, mistakes, weakSpots, dailyPlan, etc.)
│   │   └── seed/      # JEE syllabus & chapter seeding
│   └── Dockerfile     # Multi-stage Node 20 alpine runner with healthchecks
├── frontend/          # React 19, TypeScript, Tailwind CSS, Vite
│   ├── src/
│   │   ├── api/       # Configured Axios client with JWT interceptor
│   │   ├── auth/      # AuthContext & ProtectedRoute
│   │   ├── components/# UploadCard, RankImpactCard, WeakChapterRow, NavBar, etc.
│   │   └── pages/     # Track, WeakSpots, TonightsPlan, Profile, Login, Register
│   ├── nginx.conf     # Nginx reverse proxy + SPA routing
│   └── Dockerfile     # Multi-stage build with Nginx runner
└── docker-compose.yml # Orchestrates MongoDB, Backend, and Frontend
```

---

## 3. Prerequisites

- [Docker](https://docs.docker.com/get-docker/) & [Docker Compose](https://docs.docker.com/compose/)
- *(Optional for local dev)*: Node.js 20+, MongoDB 7+

---

## 4. Quick Start (One Command Run)

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/questionmark.git
   cd questionmark
   ```

2. **Configure Environment**:
   ```bash
   cp .env.example .env
   ```
   Add your `GEMINI_API_KEY` to `.env`. (If none is provided, the backend falls back gracefully to deterministic heuristic JEE diagnostics for offline testing).

3. **Start with Docker Compose**:
   ```bash
   docker-compose up --build
   ```

4. **Access the App**:
   - **Frontend**: [http://localhost:8080](http://localhost:8080)
   - **Backend API**: [http://localhost:3000](http://localhost:3000)
   - **Health Check**: [http://localhost:3000/api/health](http://localhost:3000/api/health)

---

## 5. Environment Variables

| Variable | Description | Default |
|---|---|---|
| `MONGODB_URI` | MongoDB connection string | `mongodb://mongo:27017/questionmark` |
| `JWT_SECRET` | Secret key used to sign authentication tokens | *Required in production* |
| `GEMINI_API_KEY` | Google Gemini API Key | *Server-side secret* |
| `GEMINI_MODEL` | Gemini model name | `gemini-2.0-flash` |
| `PORT` | Backend HTTP port | `3000` |
| `NODE_ENV` | Application environment (`development` / `production`) | `production` |
| `CLIENT_URL` | Allowed client URL for CORS | `http://localhost:8080` |
| `RANKS_PER_MARK_CONSTANT` | Estimated JEE ranks lost per mark deducted | `500` |
| `CARELESS_MISTAKE_WINDOW_DAYS` | Lookback window for rank impact | `14` |
| `CRON_SCHEDULE` | Cron expression for nightly plan generation | `30 15 * * *` (9:00 PM IST) |
| `VITE_API_URL` | Base API endpoint for the frontend | `/api` |

---

## 6. Seed Data

The backend automatically seeds standard JEE Main and JEE Advanced syllabus chapters (Physics, Chemistry, Math) on initialization. You can also manually re-run the seed script:

```bash
cd backend
npm run seed
```

---

## 7. API Endpoints

- `POST /api/auth/register` - Create student account
- `POST /api/auth/login` - Authenticate with email & password
- `POST /api/mistakes` - Upload wrong question photo for AI tagging
- `GET /api/mistakes` - List mistakes (filterable by subject, chapter, type)
- `GET /api/weak-spots` - Retrieve rank-impact metrics & weak chapters
- `POST /api/weak-spots/recompute` - Manually recalculate weak spots
- `GET /api/daily-plan/today` - Today's 25-minute nightly revision plan
- `POST /api/daily-plan/:id/complete` - Mark plan complete and maintain streak
- `POST /api/practice-questions/generate` - Generate JEE practice items for weak chapter
- `GET /api/users/me` - Student profile & milestone settings
- `GET /api/health` - Server liveness health check
