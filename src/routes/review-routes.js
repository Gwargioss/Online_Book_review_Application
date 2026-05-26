import { Router } from "express";
import { asyncHandler } from "../middleware/async-handler.js";
import { requireAuth } from "../middleware/require-auth.js";
import { validate } from "../middleware/validate.js";
import * as reviewController from "../controllers/review-controller.js";
import { bookIdParams, createReviewSchema, reviewIdParams } from "../validators/review-validators.js";

const router = Router();

router.get("/books/:id/reviews", validate({ params: bookIdParams }), asyncHandler(reviewController.listForBook));
router.put(
  "/books/:id/reviews",
  requireAuth,
  validate({ params: bookIdParams, body: createReviewSchema }),
  asyncHandler(reviewController.create)
);
router.delete(
  "/books/:id/reviews/:reviewId",
  requireAuth,
  validate({ params: reviewIdParams }),
  asyncHandler(reviewController.remove)
);

export default router;
