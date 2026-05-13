import { Request, Response } from "express";
import {
  createCategory,
  deleteCategory,
  listCategories,
  updateCategory
} from "../services/categoryService";
import { sendCreated, sendSuccess } from "../utils/apiResponse";

function userId(req: Request) {
  return req.user!.id;
}

export async function getCategories(req: Request, res: Response) {
  const categories = await listCategories(userId(req));
  return sendSuccess(res, categories);
}

export async function postCategory(req: Request, res: Response) {
  const category = await createCategory(userId(req), req.body);
  return sendCreated(res, category);
}

export async function putCategory(req: Request, res: Response) {
  const category = await updateCategory(userId(req), String(req.params.id), req.body);
  return sendSuccess(res, category);
}

export async function removeCategory(req: Request, res: Response) {
  const result = await deleteCategory(userId(req), String(req.params.id));
  return sendSuccess(res, result);
}
