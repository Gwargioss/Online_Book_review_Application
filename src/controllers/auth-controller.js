// Takes request then send it to server and finally reply with response
// Request → Controller → Service → Controller → Response
import { ok } from "../utils/api-response.js";
import { env } from "../config/env.js";
import * as authService from "../services/auth-service.js";

function cookieOptions() {
  const secure = env.COOKIE_SECURE === "true";
  const base = {
    httpOnly: true, // XSS
    sameSite: "lax", // Same Domain
    secure, // For only https 
    path: "/api/v1/auth/refresh" //this cookie onlu active on these pathes
  };
  if (env.COOKIE_DOMAIN) base.domain = env.COOKIE_DOMAIN;
  return base;
}

export async function register(req, res) {
  const result = await authService.register(req.body);
  return ok(res, result, undefined, 201);
}
//put refresh token in cookie and then send acceess token in response
export async function login(req, res) {
  const result = await authService.login(req.body);
  res.cookie(env.COOKIE_NAME, result.refreshToken, cookieOptions());
  return ok(res, { user: result.user, token: result.accessToken });
}
// first check refresh from cookie and take new access token 
export async function refresh(req, res) {
  const token = req.cookies?.[env.COOKIE_NAME];
  const result = await authService.refresh(token);
  res.cookie(env.COOKIE_NAME, result.refreshToken, cookieOptions());
  return ok(res, { token: result.accessToken });
}

export async function logout(req, res) {
  await authService.logout(req.auth.userId);
  res.clearCookie(env.COOKIE_NAME, cookieOptions());
  return ok(res, { loggedOut: true });
}

export async function me(req, res) {
  const user = await authService.me(req.auth.userId);
  return ok(res, user);
}

export async function updateProfile(req, res) {
  const user = await authService.updateProfile(req.auth.userId, req.body);
  return ok(res, user);
}
