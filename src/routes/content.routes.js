import express from "express";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { ok } from "../utils/api-response.js";
import { upload } from "../middleware/upload.js";
import { requireAuth } from "../middleware/require-auth.js";
import { extractFileContent } from "../middleware/file-handler.js";
import * as bookService from "../services/book-service.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const router = express.Router();

router.post(
  "/books/:bookId/content",
  requireAuth,
  upload.single("contentFile"),
  async (req, res, next) => {
    try {
      const { bookId } = req.params;
      const { textContent } = req.body;

      let content = "";

      // Handle file upload
      if (req.file) {
        let buffer = req.file.buffer;

        // If buffer not available (disk storage), read from file path
        if (!buffer && req.file.path) {
          buffer = await fs.readFile(req.file.path);
          // Clean up uploaded file after reading
          try {
            await fs.unlink(req.file.path);
          } catch (err) {
            console.error("Error deleting temporary file:", err.message);
          }
        }

        if (buffer) {
          content = await extractFileContent(buffer, req.file.mimetype);
        } else {
          throw new Error("Unable to read file content.");
        }
      } else if (textContent?.trim()) {
        // Handle direct text input
        content = textContent;
      } else {
        return res.status(400).json({
          success: false,
          error: { code: "NO_CONTENT", message: "Please provide either a file or text content." }
        });
      }

      const book = await bookService.updateBookContent(bookId, content);
      return ok(res, book);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
