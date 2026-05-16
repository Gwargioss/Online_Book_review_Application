import { Router } from "express";
import authRoutes from "./auth-routes.js";
import bookRoutes from "./book-routes.js";
import reviewRoutes from "./review-routes.js";
import uploadRoutes from "./upload.routes.js";
import contentRoutes from "./content.routes.js";

const router = Router();

router.use(authRoutes);
router.use(bookRoutes);
router.use(reviewRoutes);
router.use(uploadRoutes);
router.use(contentRoutes);

export default router;
