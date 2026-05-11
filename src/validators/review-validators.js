import { z } from "zod";

export const bookIdParams = z.object({
  id: z.string().min(1)
});

export const upsertReviewSchema = z.object({
  review_text: z.string().min(1).max(2000)
});
