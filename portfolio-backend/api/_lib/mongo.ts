import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || "portfolio";

if (!MONGO_URI) {
  throw new Error("MONGO_URI is required in Vercel Environment Variables");
}
const mongoUri = MONGO_URI;

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  // eslint-disable-next-line no-var
  var __mongoose_cache__: MongooseCache | undefined;
}

const cache: MongooseCache = global.__mongoose_cache__ || { conn: null, promise: null };
global.__mongoose_cache__ = cache;

export async function connectMongo() {
  if (cache.conn) return cache.conn;

  if (!cache.promise) {
    cache.promise = mongoose.connect(mongoUri, {
      dbName: MONGODB_DB_NAME,
    });
  }

  cache.conn = await cache.promise;
  return cache.conn;
}
