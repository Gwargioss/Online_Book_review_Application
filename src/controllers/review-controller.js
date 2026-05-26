import { ok } from "../utils/api-response.js";
import * as reviewService from "../services/review-service.js";

export async function listForBook(req, res) {
  const result = await reviewService.listReviews({ bookId: req.params.id });
  return ok(res, result.reviews);
}

export async function create(req, res) {
  const result = await reviewService.createReview({
    userId: req.auth.userId,
    bookId: req.params.id,
    review_text: req.body.review_text,
    rating: req.body.rating
  });
  return ok(res, result);
}

export async function remove(req, res) {
  const result = await reviewService.deleteReview({
    userId: req.auth.userId,
    bookId: req.params.id,
    reviewId: req.params.reviewId
  });
  return ok(res, result);
}
