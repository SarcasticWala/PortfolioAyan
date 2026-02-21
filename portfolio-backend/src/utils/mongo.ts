import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "node:fs";
import path from "node:path";

const envCandidates = [
  path.resolve(process.cwd(), ".env"),
  path.resolve(process.cwd(), "portfolio-backend/.env"),
  path.resolve(__dirname, "../../.env"),
];

for (const envPath of envCandidates) {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
    break;
  }
}

const MONGO_URI = process.env.MONGO_URI;
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || "portfolio";
if (!MONGO_URI) {
  throw new Error("MONGO_URI is required. Set it in portfolio-backend/.env");
}
if (MONGO_URI.includes("<username>") || MONGO_URI.includes("<password>")) {
  throw new Error("MONGO_URI is still using placeholders. Replace <username> and <password>.");
}
const mongoUri = MONGO_URI;

export async function connectMongo() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  try {
    await mongoose.connect(mongoUri, { dbName: MONGODB_DB_NAME });
    console.log(`Connected to MongoDB (db: ${MONGODB_DB_NAME})`);
    return mongoose.connection;
  } catch (err) {
    console.error("MongoDB connection error:", err);
    throw err;
  }
}
