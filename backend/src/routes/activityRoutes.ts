import { Router } from "express";
import {
  getActivities,
  getActivityById,
  postActivity,
  putActivity,
  removeActivity
} from "../controllers/activityController";
import { requireAuth } from "../middleware/authMiddleware";
import { asyncHandler } from "../utils/asyncHandler";
import { activitySchemas } from "../utils/schemas";
import { validate } from "../utils/validation";

export const activityRouter = Router();

activityRouter.use(requireAuth);
activityRouter.get("/", validate(activitySchemas.list), asyncHandler(getActivities));
activityRouter.post("/", validate(activitySchemas.create), asyncHandler(postActivity));
activityRouter.get("/:id", validate(activitySchemas.id), asyncHandler(getActivityById));
activityRouter.put("/:id", validate(activitySchemas.update), asyncHandler(putActivity));
activityRouter.delete("/:id", validate(activitySchemas.id), asyncHandler(removeActivity));
