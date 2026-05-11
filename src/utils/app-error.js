export class AppError extends Error {
  constructor({ code = "ERROR", message = "Request failed.", status = 400, details = [] } = {}) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.status = status;
    this.details = details;
  }
}
