import { AppError } from "../utils/app-error.js";
import * as bookRepo from "../repositories/book-repository.js";

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

export async function publishBook({ ISBN, title, author }) {
  try {
    const book = await bookRepo.createBook({ ISBN, title, author });
    return { book };
  } catch (err) {
    if (err?.code === 11000) {
      throw new AppError({ code: "BOOK_EXISTS", status: 409, message: "Book already exists." });
    }
    throw err;
  }
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
