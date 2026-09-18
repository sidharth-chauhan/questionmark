import cron from "node-cron";
import { User } from "../../models/User.js";
import { env } from "../../config/env.js";
import { generateOrGetDailyPlan } from "./dailyPlan.service.js";

export function initDailyPlanCronJob() {
  const schedule = env.CRON_SCHEDULE || "30 15 * * *";

  console.log(`⏱️ [Cron] Initializing Nightly Revision Plan job on schedule: "${schedule}"`);

  cron.schedule(schedule, async () => {
    console.log("🌙 [Cron] Running nightly revision plan generation for all users...");
    try {
      const users = await User.find({}, "_id");
      let count = 0;
      for (const user of users) {
        try {
          await generateOrGetDailyPlan(user._id.toString());
          count++;
        } catch (uErr) {
          console.error(`Failed plan generation for user ${user._id}:`, uErr);
        }
      }
      console.log(`✅ [Cron] Nightly plans successfully generated for ${count} users.`);
    } catch (err) {
      console.error("❌ [Cron] Error running nightly plan job:", err);
    }
  });
}
