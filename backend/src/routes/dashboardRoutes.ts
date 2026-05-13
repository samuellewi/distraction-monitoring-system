import { Router } from "express";
import {
  categoryBreakdown,
  daily,
  summary,
  topApps
} from "../controllers/dashboardController";
import { requireAuth } from "../middleware/authMiddleware";
import { asyncHandler } from "../utils/asyncHandler";
import { dashboardSchemas } from "../utils/schemas";
import { validate } from "../utils/validation";

export const dashboardRouter = Router();

dashboardRouter.use(requireAuth);
dashboardRouter.get("/summary", validate(dashboardSchemas.range), asyncHandler(summary));
dashboardRouter.get("/daily", validate(dashboardSchemas.range), asyncHandler(daily));
dashboardRouter.get("/top-apps", validate(dashboardSchemas.range), asyncHandler(topApps));
dashboardRouter.get(
  "/category-breakdown",
  validate(dashboardSchemas.range),
  asyncHandler(categoryBreakdown)
);
