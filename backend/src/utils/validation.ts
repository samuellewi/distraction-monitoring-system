import { NextFunction, Request, Response } from "express";
import { AnyZodObject, ZodError } from "zod";
import { badRequest } from "./errors";

export function validate(schema: AnyZodObject) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      const result = schema.parse({
        body: req.body,
        params: req.params,
        query: req.query
      });

      req.body = result.body ?? req.body;
      req.params = result.params ?? req.params;
      req.query = result.query ?? req.query;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(badRequest("Request validation failed.", error.flatten()));
        return;
      }

      next(error);
    }
  };
}
