import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "../config/env";
import { AdminModel } from "../models/admin.model";
import { ApiError } from "../utils/ApiError";

export async function login(req: Request, res: Response) {
  const { email, password } = req.body as { email: string; password: string };

  const admin = await AdminModel.findByEmail(email);
  // Same message for unknown email and wrong password, so emails can't be probed.
  if (!admin || !(await bcrypt.compare(password, admin.password))) {
    throw ApiError.unauthorized("Invalid email or password");
  }

  const token = jwt.sign({ sub: admin.id, role: "admin" }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn as SignOptions["expiresIn"],
  });

  res.json({
    success: true,
    data: { token, admin: { id: admin.id, name: admin.name, email: admin.email } },
  });
}

export async function me(req: Request, res: Response) {
  res.json({ success: true, data: req.admin });
}
