import { http } from "../../api/http-client";
import { normalizeApiResponse } from "../../shared/utils/response";

export async function getBookReviews(bookId, signal) {
  const res = await http.get(`/books/${bookId}/reviews`, { signal });
  return normalizeApiResponse(res.data);
}

export async function createBookReview(bookId, review_text, rating) {
  const res = await http.put(`/books/${bookId}/reviews`, { review_text, rating });
  return normalizeApiResponse(res.data);
}

export async function removeBookReview(bookId, reviewId) {
  const res = await http.delete(`/books/${bookId}/reviews/${reviewId}`);
  return normalizeApiResponse(res.data);
}
