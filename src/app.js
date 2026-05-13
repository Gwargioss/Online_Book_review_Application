import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import swaggerUi from "swagger-ui-express"; 
import routes from "./routes/index.js";
import { applySecurityMiddleware } from "./middleware/security.js";
import { notFound } from "./middleware/not-found.js";
import { errorHandler } from "./middleware/error-handler.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const swaggerFilePath = path.resolve(__dirname, "../swagger.json");
const swaggerDocument = JSON.parse(fs.readFileSync(swaggerFilePath, "utf8"));

export function createApp() {
  const app = express();

  // apply security middleware
  applySecurityMiddleware(app);

  // Limit for text in req Body to protect me from large payloads
  app.use(express.json({ limit: "64kb" }));

  
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  // home route
  app.get("/", function (req, res) {
    res.status(200).send(
      "<h1>BookVerse API</h1>" +
      "<p>Online Book Review API</p>" +
      "<p>API base: <code>/api/v1</code></p>" +
      "<p>API Documentation: <a href='/api-docs'>/api-docs</a></p>" // 
    );
  });

  // api routes
  app.use("/api/v1", routes);

  app.use(notFound);

  app.use(errorHandler);

  return app;
}
