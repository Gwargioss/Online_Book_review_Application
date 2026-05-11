import Review from "../models/review.js";

export async function upsertReview({ userId, bookId, review_text }) {
  return Review.findOneAndUpdate(
    { userId, bookId },
    { userId, bookId, review_text },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  ).exec();
}

export async function deleteReview({ userId, bookId }) {
  return Review.deleteOne({ userId, bookId }).exec();
}

export async function listReviewsForBook({ bookId, limit = 100 }) {
  return Review.find({ bookId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .select("review_text createdAt updatedAt")
    .exec();
}
