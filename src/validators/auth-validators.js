import { z } from "zod";

export const registerSchema = z.object({
  username: z.string().min(3).max(32).regex(/^[a-zA-Z0-9_]+$/),
  password: z.string().min(8).max(72)
});

export const loginSchema = z.object({
  username: z.string().min(3).max(32),
  password: z.string().min(1).max(72)
});

export const updateProfileSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(120),
  profilePicture: z.union([z.string().trim().url().max(500), z.literal("")]).optional(),
  favoriteGenre: z.union([z.string().trim().max(80), z.literal("")]).optional()
});
