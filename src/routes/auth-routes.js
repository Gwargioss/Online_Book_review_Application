import { Router } from "express";
import { asyncHandler } from "../middleware/async-handler.js";
import { validate } from "../middleware/validate.js";
import { requireAuth } from "../middleware/require-auth.js";
import * as authController from "../controllers/auth-controller.js";
import { loginSchema, registerSchema, updateProfileSchema } from "../validators/auth-validators.js";

const router = Router();

router.post("/auth/register", validate({ body: registerSchema }), asyncHandler(authController.register));
router.post("/auth/login", validate({ body: loginSchema }), asyncHandler(authController.login));
router.post("/auth/refresh", asyncHandler(authController.refresh));
router.get("/auth/me", requireAuth, asyncHandler(authController.me));
router.put(
  "/auth/profile",
  requireAuth,
  validate({ body: updateProfileSchema }),
  asyncHandler(authController.updateProfile)
);
router.post("/auth/logout", requireAuth, asyncHandler(authController.logout));

export default router;
