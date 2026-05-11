import { ok } from "../utils/api-response.js";
import * as bookService from "../services/book-service.js";

// Read
export async function list(req, res) {
  const result = await bookService.listBooks(req.query);
  return ok(res, result.items, result.pagination);
}
// Create
export async function publish(req, res) {
  const result = await bookService.publishBook(req.body);
  return ok(res, result, undefined, 201);
}
// Search by ISBN
export async function byISBN(req, res) {
  const result = await bookService.searchByISBN(req.body);
  return ok(res, { foundBooks: result.items });
}
//Search By Title
export async function byTitle(req, res) {
  const result = await bookService.searchByTitle(req.body);
  return ok(res, { foundBooks: result.items });
}
//Search By Auther
export async function byAuthor(req, res) {
  const result = await bookService.searchByAuthor(req.body);
  return ok(res, { foundBooks: result.items });
}
