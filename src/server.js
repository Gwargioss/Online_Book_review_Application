import { createApp } from "./app.js";
import { connectDb } from "./config/db.js";
import { env } from "./config/env.js";

export async function startServer() {
  // Connect to the database before starting the server
  await connectDb();

  // Initialize the Express app
  const app = createApp();

  // Start listening on the configured port
  const server = app.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT}`);
  });

  // Handle server-level errors (e.g. port already in use)
  server.on("error", (err) => {
    console.error("Server error:", err);
    process.exit(1);
  });

  // Gracefully close the server on shutdown signals
  const shutdown = (signal) => {
    console.log(`${signal} received, shutting down...`);
    server.close(() => {
      console.log("Server closed");
      process.exit(0);
    });
  };

  // Listen for termination signals (Ctrl+C / system shutdown)
  process.once("SIGINT", () => shutdown("SIGINT"));
  process.once("SIGTERM", () => shutdown("SIGTERM"));

  // Return the server instance for external use if needed
  return server;
}