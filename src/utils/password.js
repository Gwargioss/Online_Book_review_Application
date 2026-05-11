import bcrypt from "bcrypt";
import { env } from "../config/env.js";
import { AppError } from "./app-error.js";

export async function hashPassword(password) {
  if (typeof password !== "string" || password.length < 8) {
    throw new AppError({ code: "WEAK_PASSWORD", status: 422, message: "Password must be at least 8 characters." });
  }
  return bcrypt.hash(password, env.SALT_ROUNDS);
}

export async function verifyPassword(password, passwordHash) {
  return bcrypt.compare(password, passwordHash);
}
