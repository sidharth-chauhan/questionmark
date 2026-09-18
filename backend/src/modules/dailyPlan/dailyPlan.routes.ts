import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.js";
import { getTodayPlanHandler, completePlanHandler, addCustomChapterHandler, removeCustomChapterHandler, updatePlanTimeHandler } from "./dailyPlan.controller.js";

const router = Router();

router.use(authMiddleware);

router.get("/today", getTodayPlanHandler);
router.post("/:id/complete", completePlanHandler);
router.post("/add", addCustomChapterHandler);
router.post("/remove", removeCustomChapterHandler);
router.post("/update-time", updatePlanTimeHandler);

export default router;