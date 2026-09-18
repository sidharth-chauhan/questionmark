import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { connectDB, disconnectDB } from "./config/db.js";
import { initDailyPlanCronJob } from "./modules/dailyPlan/dailyPlan.job.js";
import { seedSubjectsAndChapters } from "./seed/seedSubjectsAndChapters.js";

async function startServer() {
  await connectDB();

  // Seed syllabus automatically on first run
  try {
    await seedSubjectsAndChapters();
  } catch (seedErr) {
    console.warn("⚠️ [Seed warning]:", (seedErr as Error).message);
  }

  // Start cron jobs
  initDailyPlanCronJob();

  const app = createApp();
  const PORT = env.PORT || 3000;

  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 [QuestionMark Backend] Server running on http://0.0.0.0:${PORT}`);
    console.log(`📡 [Healthcheck] GET http://0.0.0.0:${PORT}/api/health`);
  });

  // Graceful shutdown
  const gracefulShutdown = async (signal: string) => {
    console.log(`\n🛑 Received ${signal}. Starting graceful shutdown...`);
    server.close(async () => {
      console.log("🔌 HTTP server closed.");
      await disconnectDB();
      process.exit(0);
    });

    // Force shutdown if taking too long
    setTimeout(() => {
      console.error("⚠️ Forcing shutdown after 10s timeout.");
      process.exit(1);
    }, 10000);
  };

  process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
  process.on("SIGINT", () => gracefulShutdown("SIGINT"));
}

startServer().catch((err) => {
  console.error("❌ Fatal error starting QuestionMark backend:", err);
  process.exit(1);
});
