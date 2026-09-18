import mongoose from "mongoose";
import { env } from "./env.js";

let isConnected = false;

export async function connectDB(): Promise<void> {
  if (isConnected) {
    return;
  }

  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    });
    isConnected = true;
    console.log(`✅ [MongoDB] Connected to database: ${env.MONGODB_URI}`);
  } catch (error) {
    console.warn(`⚠️ [MongoDB] Connection to ${env.MONGODB_URI} failed:`, (error as Error).message);
    console.warn("⚠️ [MongoDB] Continuing in offline/transient mode. Docker Compose with Mongo container will provide persistent DB.");
  }
}

export function isDbConnected(): boolean {
  return mongoose.connection.readyState === 1;
}

export async function disconnectDB(): Promise<void> {
  if (isConnected) {
    await mongoose.disconnect();
    isConnected = false;
    console.log("🛑 [MongoDB] Disconnected from database");
  }
}
