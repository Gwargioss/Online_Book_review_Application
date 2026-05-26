import Review from "../models/review.js";

export async function createReview({ userId, bookId, review_text, rating }) {
  return Review.create({ userId, bookId, review_text, rating });
}

export async function deleteReviewById({ reviewId, userId, bookId }) {
  return Review.deleteOne({ _id: reviewId, userId, bookId }).exec();
}

export async function deleteReviewsForBook({ bookId }) {
  return Review.deleteMany({ bookId }).exec();
}

export async function listReviewsForBook({ bookId, limit = 100 }) {
  return Review.find({ bookId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .select("review_text rating userId createdAt updatedAt")
    .exec();
}
