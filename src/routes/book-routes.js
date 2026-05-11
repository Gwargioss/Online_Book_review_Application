import { Router } from "express";
import { asyncHandler } from "../middleware/async-handler.js";
import { validate } from "../middleware/validate.js";
import * as bookController from "../controllers/book-controller.js";
import {
  listBooksQuery,
  publishBookSchema,
  searchByAuthorSchema,
  searchByIsbnSchema,
  searchByTitleSchema
} from "../validators/book-validators.js";

const router = Router();

router.get("/books", validate({ query: listBooksQuery }), asyncHandler(bookController.list));
router.post("/books", validate({ body: publishBookSchema }), asyncHandler(bookController.publish));
router.post("/books/byISBN", validate({ body: searchByIsbnSchema }), asyncHandler(bookController.byISBN));
router.post("/books/byTitle", validate({ body: searchByTitleSchema }), asyncHandler(bookController.byTitle));
router.post("/books/byAuthor", validate({ body: searchByAuthorSchema }), asyncHandler(bookController.byAuthor));

export default router;
