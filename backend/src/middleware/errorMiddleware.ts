import { NextFunction, Request, Response } from "express";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { ZodError } from "zod";
import { ApiError } from "../utils/errors";
import { config } from "../utils/config";

export function notFoundHandler(req: Request, _res: Response, next: NextFunction) {
  next(new ApiError(404, `Route ${req.method} ${req.originalUrl} not found.`));
}

export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({
      success: false,
      error: {
        message: error.message,
        details: error.details
      }
    });
  }

  if (error instanceof ZodError) {
    return res.status(400).json({
      success: false,
      error: {
        message: "Request validation failed.",
        details: error.flatten()
      }
    });
  }

  if (error instanceof PrismaClientKnownRequestError) {
    return res.status(400).json({
      success: false,
      error: {
        message: "Database request failed.",
        code: error.code
      }
    });
  }

  console.error(error);

  return res.status(500).json({
    success: false,
    error: {
      message: config.isProduction ? "Internal server error." : "Internal server error. Check server logs."
    }
  });
}
