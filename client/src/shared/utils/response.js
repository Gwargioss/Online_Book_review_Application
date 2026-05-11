export function normalizeApiResponse(payload) {
  if (!payload) {
    return { success: false, data: null, message: "Empty response payload." };
  }

  if (typeof payload.success === "boolean") {
    return {
      success: payload.success,
      data: payload.data ?? null,
      message: payload.error?.message || payload.message || "",
      pagination: payload.pagination || null
    };
  }

  const hasError = Boolean(payload.error);
  const foundBooks = payload.foundBooks || payload.bookReview;
  const data = payload.data || foundBooks || payload;

  return {
    success: !hasError,
    data,
    message: payload.message || payload.error?.message || "",
    pagination: payload.pagination || null
  };
}

export function extractErrorMessage(error) {
  if (error?.response?.data?.error?.message) return error.response.data.error.message;
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.message) return error.message;
  return "Something went wrong. Please try again.";
}
