import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { AdminModel } from "../models/admin.model";
import { ApiError } from "../utils/ApiError";

export type AuthPayload = { sub: string; role: "admin" };

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      admin?: { id: string; name: string; email: string };
    }
  }
}

/** Requires a valid "Authorization: Bearer <token>" header from an existing admin. */
export async function requireAdmin(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return next(ApiError.unauthorized("Authentication required"));
  }

  try {
    const payload = jwt.verify(header.slice(7), env.jwtSecret) as AuthPayload;
    if (payload.role !== "admin") throw new Error("Wrong role");

    const admin = await AdminModel.findById(payload.sub);
    if (!admin) return next(ApiError.unauthorized("Admin account no longer exists"));

    req.admin = { id: admin.id, name: admin.name, email: admin.email };
    next();
  } catch {
    next(ApiError.unauthorized("Invalid or expired token"));
  }
}
