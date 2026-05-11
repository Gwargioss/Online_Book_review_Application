import { fail } from "../utils/api-response.js";

export function notFound(req, res) {
  return fail(
    res,
    { code: "NOT_FOUND", message: "Route not found.", details: [{ path: req.originalUrl }] },
    404
  );
}
