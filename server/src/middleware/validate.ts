import type { NextFunction, Request, Response } from "express";
import type { ZodType } from "zod";
import { ApiError } from "../utils/ApiError";

/** Validates req.body against a Zod schema and replaces it with the parsed value. */
export const validate =
  (schema: ZodType) => (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body ?? {});
    if (!result.success) {
      const errors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = issue.path.join(".") || "body";
        if (!errors[key]) errors[key] = issue.message;
      }
      return next(ApiError.badRequest("Validation failed", errors));
    }
    req.body = result.data;
    next();
  };
