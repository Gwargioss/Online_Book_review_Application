import express from "express";
import { upload } from "../middleware/upload.js";
import { requireAuth } from "../middleware/require-auth.js";
import * as userRepo from "../repositories/user-repository.js";

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

      return res.json({ message: "Profile picture updated", imageUrl, user });
    } catch (err) {
      next(err);
    }
  }
);

export default router;