import { fail } from "../utils/api-response.js";
import { AppError } from "../utils/app-error.js";

export function errorHandler(err, req, res, _next) {
  const isAppError = err instanceof AppError;
  const status = isAppError ? err.status : 500;
  const code = isAppError ? err.code : "INTERNAL_SERVER_ERROR";
  const message = isAppError ? err.message : "Internal server error.";
  const details = isAppError ? err.details : [];

  if (process.env.NODE_ENV !== "production") {
    console.error(err);
  }

  return fail(res, { code, message, details }, status);
}
