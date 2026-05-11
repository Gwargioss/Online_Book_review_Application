import { http } from "../../api/http-client";
import { normalizeApiResponse } from "../../shared/utils/response";

export async function getBookReviews(bookId, signal) {
  const res = await http.get(`/books/${bookId}/reviews`, { signal });
  return normalizeApiResponse(res.data);
}

export async function upsertBookReview(bookId, review_text) {
  const res = await http.put(`/books/${bookId}/reviews`, { review_text });
  return normalizeApiResponse(res.data);
}

export async function removeBookReview(bookId) {
  const res = await http.delete(`/books/${bookId}/reviews`);
  return normalizeApiResponse(res.data);
}
