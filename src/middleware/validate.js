import { AppError } from "../utils/app-error.js";

export function validate(schemas = {}) {
  return (req, res, next) => {
    try {
      for (const key of ["body", "params", "query"]) {
        if (schemas[key]) req[key] = schemas[key].parse(req[key]);
      }
      next();
    } catch (err) {
      const details = err?.issues?.map((i) => ({
        path: i.path.join("."),
        message: i.message,
      })) || [];

      next(new AppError({
        code: "VALIDATION_ERROR",
        status: 422,
        message: "Invalid request payload.",
        details,
      }));
    }
  };
}
