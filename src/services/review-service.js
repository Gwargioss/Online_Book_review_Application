import { AppError } from "../utils/app-error.js";
import { isValidObjectId } from "../utils/mongo.js";
import * as bookRepo from "../repositories/book-repository.js";
import * as reviewRepo from "../repositories/review-repository.js";

export async function listReviews({ bookId }) {
  if (!isValidObjectId(bookId)) {
    throw new AppError({ code: "INVALID_ID", status: 422, message: "Invalid book id." });
  }
  const book = await bookRepo.findBookById(bookId);
  if (!book) throw new AppError({ code: "NOT_FOUND", status: 404, message: "Book not found." });

  const reviews = await reviewRepo.listReviewsForBook({ bookId });
  return { reviews };
}

export async function upsertReview({ userId, bookId, review_text }) {
  if (!isValidObjectId(bookId)) {
    throw new AppError({ code: "INVALID_ID", status: 422, message: "Invalid book id." });
  }
  const book = await bookRepo.findBookById(bookId);
  if (!book) throw new AppError({ code: "NOT_FOUND", status: 404, message: "Book not found." });

  await reviewRepo.upsertReview({ userId, bookId, review_text });
  return { saved: true };
}

export async function deleteReview({ userId, bookId }) {
  if (!isValidObjectId(bookId)) {
    throw new AppError({ code: "INVALID_ID", status: 422, message: "Invalid book id." });
  }
  const result = await reviewRepo.deleteReview({ userId, bookId });
  if (!result?.deletedCount) {
    throw new AppError({ code: "NOT_FOUND", status: 404, message: "No review found to delete." });
  }
  return { deleted: true };
}
