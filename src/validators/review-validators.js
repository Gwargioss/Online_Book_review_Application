import { z } from "zod";

export const bookIdParams = z.object({
  id: z.string().min(1)
});

export const reviewIdParams = z.object({
  id: z.string().min(1),
  reviewId: z.string().min(1)
});

export const createReviewSchema = z.object({
  review_text: z.string().min(1).max(2000),
  rating: z.coerce.number().int().min(0).max(4)
});
