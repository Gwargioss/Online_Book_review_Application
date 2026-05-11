import dotenv from "dotenv";
import { cleanEnv, num, port, str } from "envalid";

dotenv.config();

// Validate and sanitize all environment variables
// cleanEnv throws an error on startup if any required variable is missing or invalid
const baseEnv = cleanEnv(process.env, {

  // App environment: only accepts these 3 values
  NODE_ENV: str({ choices: ["development", "test", "production"], default: "development" }),

  // Port the server will listen on (validates it's a valid port number 1-65535)
  PORT: port({ default: 3000 }),

  // MongoDB connection string (required, no default)
  MONGODB_URI: str(),
  MONGODB_DB_NAME: str({ default: "" }),

  // Allowed CORS origin for frontend requests
  CORS_ORIGIN: str({ default: "http://localhost:5173" }),

  // JWT secrets used to sign access & refresh tokens
  ACCESS_TOKEN_SECRET: str({ default: "" }),
  REFRESH_TOKEN_SECRET: str({ default: "" }),

  // How long each token stays valid
  ACCESS_TOKEN_EXPIRES_IN: str({ default: "15m" }),
  REFRESH_TOKEN_EXPIRES_IN: str({ default: "30d" }),

  // Refresh token cookie settings
  COOKIE_NAME: str({ default: "bookverse_refresh" }),
  COOKIE_DOMAIN: str({ default: "" }),
  COOKIE_SECURE: str({ choices: ["true", "false"], default: "false" }),

  // Number of bcrypt hashing rounds (higher = more secure but slower)
  SALT_ROUNDS: num({ default: 10, desc: "bcrypt salt rounds" })
});

// Fallback secret in case both token secrets are empty
// TOKEN_SECRET_KEY can act as a single shared secret for both tokens
const fallbackSecret = process.env.TOKEN_SECRET_KEY || "";

export const env = {
  ...baseEnv,

  // Use specific secrets if provided, otherwise fall back to the shared secret
  ACCESS_TOKEN_SECRET: baseEnv.ACCESS_TOKEN_SECRET || fallbackSecret,
  REFRESH_TOKEN_SECRET: baseEnv.REFRESH_TOKEN_SECRET || fallbackSecret
};