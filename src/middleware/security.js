import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { env } from "../config/env.js";

export function applySecurityMiddleware(app) {
  // Hide "X-Powered-By: Express" header to avoid exposing the tech stack
  app.disable("x-powered-by");

  // Add HTTP security headers (XSS, clickjacking protection, etc.)
  // cross-origin policy allows other domains to load resources (e.g. images)
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" }
    })
  );

  // Allow requests only from trusted frontend origins
  // Supports multiple origins separated by commas in the env
  // credentials: true is required to send/receive cookies cross-origin
  app.use(
    cors({
      origin: env.CORS_ORIGIN.split(",").map((v) => v.trim()),
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
    })
  );

  // Parse incoming cookies and attach them to req.cookies
  app.use(cookieParser());

  // Limit each IP to 120 requests per minute to prevent brute force attacks
  // standardHeaders: "draft-7" sends RateLimit headers to inform the client
  app.use(
    rateLimit({
      windowMs: 60 * 1000,
      limit: 120,
      standardHeaders: "draft-7",
      legacyHeaders: false
    })
  );

  // Log incoming requests in the terminal (development only)
  if (env.NODE_ENV !== "production") {
    app.use(morgan("dev"));
  }
}