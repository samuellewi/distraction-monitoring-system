import { Request, Response } from "express";
import {
  createActivity,
  deleteActivity,
  getActivity,
  listActivities,
  updateActivity
} from "../services/activityService";
import { sendCreated, sendSuccess } from "../utils/apiResponse";

function userId(req: Request) {
  return req.user!.id;
}

export async function getActivities(req: Request, res: Response) {
  const result = await listActivities(userId(req), req.query as never);
  return sendSuccess(res, result);
}

export async function postActivity(req: Request, res: Response) {
  const activity = await createActivity(userId(req), req.body);
  return sendCreated(res, activity);
}

export async function getActivityById(req: Request, res: Response) {
  const activity = await getActivity(userId(req), String(req.params.id));
  return sendSuccess(res, activity);
}

export async function putActivity(req: Request, res: Response) {
  const activity = await updateActivity(userId(req), String(req.params.id), req.body);
  return sendSuccess(res, activity);
}

export async function removeActivity(req: Request, res: Response) {
  const result = await deleteActivity(userId(req), String(req.params.id));
  return sendSuccess(res, result);
}
