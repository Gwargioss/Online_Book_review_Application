import { AppError } from "../utils/app-error.js";
import { isValidObjectId } from "../utils/mongo.js";
import * as bookRepo from "../repositories/book-repository.js";
import * as reviewRepo from "../repositories/review-repository.js";

export async function listBooks({ page = 1, limit = 24 }) {
  const safeLimit = Math.min(Math.max(Number(limit) || 24, 1), 60);
  const safePage = Math.max(Number(page) || 1, 1);

  const { items, total } = await bookRepo.findBooksPaginated({ page: safePage, limit: safeLimit });
  const pages = Math.max(Math.ceil(total / safeLimit), 1);
  return {
    items,
    pagination: { page: safePage, limit: safeLimit, total, pages }
  };
}

export async function publishBook({ ISBN, title, author, content = "", publisherId }) {
  if (!publisherId) {
    throw new AppError({ code: "UNAUTHORIZED", status: 401, message: "Authentication required." });
  }
  try {
    const book = await bookRepo.createBook({ ISBN, title, author, content, publisherId });
    return { book };
  } catch (err) {
    if (err?.code === 11000) {
      throw new AppError({ code: "BOOK_EXISTS", status: 409, message: "Book already exists." });
    }
    throw err;
  }
}

export async function updateBookContent(bookId, content, userId) {
  if (!isValidObjectId(bookId)) {
    throw new AppError({ code: "INVALID_ID", status: 422, message: "Invalid book id." });
  }
  const book = await bookRepo.findBookById(bookId);
  if (!book) throw new AppError({ code: "NOT_FOUND", status: 404, message: "Book not found." });
  if (book.publisherId?.toString() !== userId) {
    throw new AppError({ code: "FORBIDDEN", status: 403, message: "You can only update your own books." });
  }
  const updated = await bookRepo.updateBookContent(bookId, content);
  if (!updated) throw new AppError({ code: "NOT_FOUND", status: 404, message: "Book not found." });
  return updated;
}

export async function deleteBook({ bookId, userId }) {
  if (!isValidObjectId(bookId)) {
    throw new AppError({ code: "INVALID_ID", status: 422, message: "Invalid book id." });
  }
  const book = await bookRepo.findBookById(bookId);
  if (!book) throw new AppError({ code: "NOT_FOUND", status: 404, message: "Book not found." });
  if (book.publisherId?.toString() !== userId) {
    throw new AppError({ code: "FORBIDDEN", status: 403, message: "You can only delete your own books." });
  }
  await Promise.all([bookRepo.deleteBookById(bookId), reviewRepo.deleteReviewsForBook({ bookId })]);
  return { deleted: true };
}

export async function searchByISBN({ ISBN }) {
  const items = await bookRepo.findBooksByISBN(ISBN);
  return { items };
}

export async function searchByTitle({ title }) {
  const items = await bookRepo.findBooksByTitle(title);
  return { items };
}

export async function searchByAuthor({ author }) {
  const items = await bookRepo.findBooksByAuthor(author);
  return { items };
}
