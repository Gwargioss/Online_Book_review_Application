import { z } from "zod";

export const listBooksQuery = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(60).optional()
});

export const bookIdParams = z.object({
  id: z.string().min(1)
});

export const publishBookSchema = z.object({
  ISBN: z.string().min(2).max(32),
  title: z.string().min(2).max(180),
  author: z.string().min(2).max(120),
  content: z.string().optional().default("")
});

export const searchByIsbnSchema = z.object({
  ISBN: z.string().min(1).max(32)
});

export const searchByTitleSchema = z.object({
  title: z.string().min(1).max(80)
});

export const searchByAuthorSchema = z.object({
  author: z.string().min(1).max(80)
});
