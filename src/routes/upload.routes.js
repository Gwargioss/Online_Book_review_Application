import express from "express";
import { ok } from "../utils/api-response.js";
import { upload } from "../middleware/upload.js";
import { requireAuth } from "../middleware/require-auth.js";
import * as userRepo from "../repositories/user-repository.js";
import * as bookRepo from "../repositories/book-repository.js";

const router = express.Router();

router.post(
  "/upload-profile",
  requireAuth,
  upload.single("image"),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

      const user = await userRepo.updateProfile(req.auth.userId, {
        profilePicture: imageUrl
      });
      const bookCount = await bookRepo.countBooks();

      return ok(res, { imageUrl, user: { ...user.toJSON(), bookCount } });
    } catch (err) {
      next(err);
    }
  }
);

export default router;