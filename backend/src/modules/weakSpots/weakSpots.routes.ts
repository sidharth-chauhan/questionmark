import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.js";
import { getWeakSpotsHandler, recomputeWeakSpotsHandler } from "./weakSpots.controller.js";

const router = Router();

router.use(authMiddleware);

router.get("/", getWeakSpotsHandler);
router.post("/recompute", recomputeWeakSpotsHandler);

export default router;
