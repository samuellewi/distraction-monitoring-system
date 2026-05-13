import { Request, Response } from "express";
import {
  getCategoryBreakdown,
  getDaily,
  getSummary,
  getTopApps
} from "../services/dashboardService";
import { sendSuccess } from "../utils/apiResponse";

function userId(req: Request) {
  return req.user!.id;
}

export async function summary(req: Request, res: Response) {
  const result = await getSummary(userId(req), req.query as never);
  return sendSuccess(res, result);
}

export async function daily(req: Request, res: Response) {
  const result = await getDaily(userId(req), req.query as never);
  return sendSuccess(res, result);
}

export async function topApps(req: Request, res: Response) {
  const result = await getTopApps(userId(req), req.query as never);
  return sendSuccess(res, result);
}

export async function categoryBreakdown(req: Request, res: Response) {
  const result = await getCategoryBreakdown(userId(req), req.query as never);
  return sendSuccess(res, result);
}
