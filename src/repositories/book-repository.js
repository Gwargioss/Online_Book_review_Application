import Book from "../models/book.js";

export async function createBook({ ISBN, title, author, content = "" }) {
  return Book.create({ ISBN, title, author, content });
}

export async function updateBookContent(bookId, content) {
  return Book.findByIdAndUpdate(bookId, { $set: { content } }, { new: true }).exec();
}

export async function findBooksPaginated({ page, limit }) {
  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    Book.find().sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
    Book.countDocuments().exec()
  ]);
  return { items, total };
}

export async function findBooksByISBN(ISBN) {
  return Book.find({ ISBN }).sort({ createdAt: -1 }).exec();
}

function safeRegex(query) {
  const q = String(query || "").trim().slice(0, 80);
  const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(escaped, "i");
}

export async function findBooksByTitle(title) {
  return Book.find({ title: safeRegex(title) }).sort({ createdAt: -1 }).exec();
}

export async function findBooksByAuthor(author) {
  return Book.find({ author: safeRegex(author) }).sort({ createdAt: -1 }).exec();
}

export async function countBooks() {
  return Book.countDocuments().exec();
}

export async function findBookById(id) {
  return Book.findById(id).exec();
}
