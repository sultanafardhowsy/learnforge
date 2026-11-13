import type { NextFunction, Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { ApiError } from "../utils/ApiError";

export function notFound(req: Request, _res: Response, next: NextFunction) {
  next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.details ? { errors: err.details } : {}),
    });
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // P2025: record to update/delete not found
    if (err.code === "P2025") {
      return res.status(404).json({ success: false, message: "Resource not found" });
    }
    if (err.code === "P2002") {
      return res.status(409).json({ success: false, message: "Duplicate value" });
    }
  }

  if (err instanceof SyntaxError && "body" in err) {
    return res.status(400).json({ success: false, message: "Malformed JSON body" });
  }

  console.error(err);
  res.status(500).json({ success: false, message: "Internal server error" });
}
