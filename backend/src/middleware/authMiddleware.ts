import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { getUserById } from "../services/authService";
import { config } from "../utils/config";
import { unauthorized } from "../utils/errors";

type JwtPayload = {
  sub?: string;
};

export async function requireAuth(req: Request, _res: Response, next: NextFunction) {
  try {
    const header = req.header("authorization");

    if (!header?.startsWith("Bearer ")) {
      throw unauthorized("Missing Bearer token.");
    }

    const token = header.slice("Bearer ".length);
    const decoded = jwt.verify(token, config.jwtSecret) as JwtPayload;

    if (!decoded.sub) {
      throw unauthorized("Invalid token.");
    }

    req.user = await getUserById(decoded.sub);
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError) {
      next(unauthorized("Invalid or expired token."));
      return;
    }

    next(error);
  }
}
