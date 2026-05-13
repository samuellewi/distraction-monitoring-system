import { Router } from "express";
import {
  getCategories,
  postCategory,
  putCategory,
  removeCategory
} from "../controllers/categoryController";
import { requireAuth } from "../middleware/authMiddleware";
import { asyncHandler } from "../utils/asyncHandler";
import { categorySchemas } from "../utils/schemas";
import { validate } from "../utils/validation";

export const categoryRouter = Router();

categoryRouter.use(requireAuth);
categoryRouter.get("/", asyncHandler(getCategories));
categoryRouter.post("/", validate(categorySchemas.create), asyncHandler(postCategory));
categoryRouter.put("/:id", validate(categorySchemas.update), asyncHandler(putCategory));
categoryRouter.delete("/:id", validate(categorySchemas.id), asyncHandler(removeCategory));
