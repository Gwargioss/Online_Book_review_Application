import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { AppError } from "./app-error.js";

export function signAccessToken(payload) {
  return jwt.sign(payload, env.ACCESS_TOKEN_SECRET, { expiresIn: env.ACCESS_TOKEN_EXPIRES_IN });
}

export function signRefreshToken(payload) {
  return jwt.sign(payload, env.REFRESH_TOKEN_SECRET, { expiresIn: env.REFRESH_TOKEN_EXPIRES_IN });
}

export function verifyAccessToken(token) {
  try {
    return jwt.verify(token, env.ACCESS_TOKEN_SECRET);
  } catch {
    throw new AppError({ code: "UNAUTHORIZED", status: 401, message: "Invalid or expired access token." });
  }
}

export function verifyRefreshToken(token) {
  try {
    return jwt.verify(token, env.REFRESH_TOKEN_SECRET);
  } catch {
    throw new AppError({ code: "UNAUTHORIZED", status: 401, message: "Invalid or expired refresh token." });
  }
}
