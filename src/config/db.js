// Connecting app with MongoDB 
import mongoose from "mongoose";
import { env } from "./env.js";

export async function connectDb() {
  const dbName = env.MONGODB_DB_NAME || undefined;
  await mongoose.connect(env.MONGODB_URI, dbName ? { dbName } : undefined);
  return mongoose.connection;
}
