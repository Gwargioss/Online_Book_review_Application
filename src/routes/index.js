import { Router } from "express";
import authRoutes from "./auth-routes.js";
import bookRoutes from "./book-routes.js";
import reviewRoutes from "./review-routes.js";

const router = Router();

router.use(authRoutes);
router.use(bookRoutes);
router.use(reviewRoutes);

export default router;
