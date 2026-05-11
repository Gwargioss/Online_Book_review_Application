import { startServer } from "./src/server.js";

startServer().catch((err) => {
  console.error(err);
  process.exit(1);
});