export function ok(res, data = {}, pagination = undefined, status = 200) {
  const payload = { success: true, data };
  if (pagination) payload.pagination = pagination;
  return res.status(status).json(payload);
}

export function fail(res, error, status = 400) {
  return res.status(status).json({
    success: false,
    error: {
      code: error.code || "ERROR",
      message: error.message || "Request failed.",
      details: error.details || []
    }
  });
}
