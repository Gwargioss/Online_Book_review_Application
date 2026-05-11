import express from "express";
import routes from "./routes/index.js";
import { applySecurityMiddleware } from "./middleware/security.js";
import { notFound } from "./middleware/not-found.js";
import { errorHandler } from "./middleware/error-handler.js";

export function createApp() {
  // create express app
  const app = express();

  // apply security middleware
  applySecurityMiddleware(app);

  // Limit for text in req Body to protect me from large payloads
  app.use(express.json({ limit: "64kb" }));

  // home route
  app.get("/", function (req, res) {
    res.status(200).send(
      "<h1>BookVerse API</h1>" +
      "<p>Online Book Review API</p>" +
      "<p>API base: <code>/api/v1</code></p>"
    );
  });

  // api routes
  app.use("/api/v1", routes);

  app.use(notFound);

  app.use(errorHandler);

  return app;
}