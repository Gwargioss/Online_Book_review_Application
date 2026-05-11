//check that user logged in before arriving
import { AppError } from "../utils/app-error.js";
import { verifyAccessToken } from "../utils/jwt.js";

export function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const [type, token] = header.split(" ");

  if (type !== "Bearer" || !token) {
    return next(new AppError({ code: "UNAUTHORIZED", status: 401, message: "Missing bearer token." }));
  }

  const payload = verifyAccessToken(token);
  req.auth = { userId: payload.sub, username: payload.username, tokenVersion: payload.tokenVersion };
  return next();
}
