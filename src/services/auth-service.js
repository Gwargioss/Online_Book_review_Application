import { AppError } from "../utils/app-error.js";
import { hashPassword, verifyPassword } from "../utils/password.js";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/jwt.js";
import * as userRepo from "../repositories/user-repository.js";

export async function register({ username, password }) {
  const existing = await userRepo.findByUsername(username);
  if (existing) {
    throw new AppError({ code: "USERNAME_TAKEN", status: 409, message: "Username is already registered." });
  }
  const passwordHash = await hashPassword(password);
  const user = await userRepo.createUser({ username, passwordHash });
  return { user: { id: user.id, username: user.username } };
}

export async function login({ username, password }) {
  const user = await userRepo.findByUsername(username, { withPassword: true });
  if (!user) throw new AppError({ code: "INVALID_CREDENTIALS", status: 401, message: "Invalid credentials." });

  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) throw new AppError({ code: "INVALID_CREDENTIALS", status: 401, message: "Invalid credentials." });

  const accessToken = signAccessToken({ sub: user.id, username: user.username, tokenVersion: user.tokenVersion });
  const refreshToken = signRefreshToken({ sub: user.id, tokenVersion: user.tokenVersion });

  return {
    user: { id: user.id, username: user.username },
    accessToken,
    refreshToken
  };
}

export async function refresh(refreshToken) {
  const payload = verifyRefreshToken(refreshToken);
  const user = await userRepo.findById(payload.sub);
  if (!user) throw new AppError({ code: "UNAUTHORIZED", status: 401, message: "Session not found." });
  if (user.tokenVersion !== payload.tokenVersion) {
    throw new AppError({ code: "UNAUTHORIZED", status: 401, message: "Session has been revoked." });
  }

  const accessToken = signAccessToken({ sub: user.id, username: user.username, tokenVersion: user.tokenVersion });
  const nextRefreshToken = signRefreshToken({ sub: user.id, tokenVersion: user.tokenVersion });

  return { accessToken, refreshToken: nextRefreshToken };
}

export async function logout(userId) {
  await userRepo.incrementTokenVersion(userId);
}

export async function me(userId) {
  const user = await userRepo.findById(userId);
  if (!user) throw new AppError({ code: "UNAUTHORIZED", status: 401, message: "User not found." });
  return {
    id: user.id,
    username: user.username,
    name: user.name || "",
    email: user.email || "",
    profilePicture: user.profilePicture || ""
  };
}

export async function updateProfile(userId, payload) {
  const user = await userRepo.updateProfile(userId, payload);
  if (!user) throw new AppError({ code: "UNAUTHORIZED", status: 401, message: "User not found." });
  return {
    id: user.id,
    username: user.username,
    name: user.name || "",
    email: user.email || "",
    profilePicture: user.profilePicture || ""
  };
}
