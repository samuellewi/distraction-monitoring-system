import { Request, Response } from "express";
import { loginUser, registerUser } from "../services/authService";
import { sendCreated, sendSuccess } from "../utils/apiResponse";

export async function register(req: Request, res: Response) {
  const result = await registerUser(req.body);
  return sendCreated(res, result);
}

export async function login(req: Request, res: Response) {
  const result = await loginUser(req.body);
  return sendSuccess(res, result);
}

export async function me(req: Request, res: Response) {
  return sendSuccess(res, { user: req.user });
}
