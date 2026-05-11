import Book from "../models/book.js";

// Create a new book document in the database
export async function createBook({ ISBN, title, author }) {
  return Book.create({ ISBN, title, author });
}

// Get books with pagination (sorted by newest first)
export async function findBooksPaginated({ page, limit }) {
  // Calculate how many documents to skip based on current page
  const skip = (page - 1) * limit;

  // Run both queries in parallel for better performance
  const [items, total] = await Promise.all([
    Book.find().sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
    Book.countDocuments().exec()
  ]);

  return { items, total };
}

// Find books by exact ISBN match
export async function findBooksByISBN(ISBN) {
  return Book.find({ ISBN }).sort({ createdAt: -1 }).exec();
}

// Sanitize user input before using it in a regex query
// Prevents ReDoS attacks by escaping special characters and limiting input length
function safeRegex(query) {
  const q = String(query || "").trim().slice(0, 80);
  const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(escaped, "i"); // case-insensitive partial match
}

// Find books by partial title match (case-insensitive)
export async function findBooksByTitle(title) {
  return Book.find({ title: safeRegex(title) }).sort({ createdAt: -1 }).exec();
}

// Find books by partial author name match (case-insensitive)
export async function findBooksByAuthor(author) {
  return Book.find({ author: safeRegex(author) }).sort({ createdAt: -1 }).exec();
}

// Find a single book by its MongoDB ObjectId
export async function findBookById(id) {
  return Book.findById(id).exec();
}