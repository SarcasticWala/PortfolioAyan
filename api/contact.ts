import { MongoClient, Db } from "mongodb";
import { z } from "zod";

// Validation mirrors src/utils/contactSchema.ts so the client and server agree.
const contactSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().trim().email("Invalid email address").max(200),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(5000),
});

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "portfolio";
const collectionName = process.env.MONGODB_COLLECTION || "messages";

// Reuse the connection across warm serverless invocations to avoid
// exhausting the connection pool on MongoDB Atlas.
type Cached = { client: MongoClient; db: Db };
let cached: Promise<Cached> | null = null;

function connect(): Promise<Cached> {
  if (!uri) {
    throw new Error("MONGODB_URI environment variable is not set");
  }
  if (!cached) {
    cached = MongoClient.connect(uri).then((client) => ({
      client,
      db: client.db(dbName),
    }));
  }
  return cached;
}

// Minimal structural typing so we don't need the @vercel/node package.
type Req = {
  method?: string;
  body?: unknown;
  headers: Record<string, string | string[] | undefined>;
};
type Res = {
  status: (code: number) => Res;
  json: (body: unknown) => void;
  setHeader: (key: string, value: string) => void;
  end: (body?: string) => void;
};

export default async function handler(req: Req, res: Res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  // Vercel parses JSON bodies automatically, but guard against strings/undefined.
  let payload: unknown = req.body;
  if (typeof payload === "string") {
    try {
      payload = payload ? JSON.parse(payload) : {};
    } catch {
      res.status(400).json({ message: "Invalid JSON body" });
      return;
    }
  }

  const result = contactSchema.safeParse(payload ?? {});
  if (!result.success) {
    res.status(400).json({
      message: "Validation failed",
      errors: result.error.flatten().fieldErrors,
    });
    return;
  }

  try {
    const { db } = await connect();
    await db.collection(collectionName).insertOne({
      name: result.data.name,
      email: result.data.email,
      message: result.data.message,
      createdAt: new Date(),
    });

    res.status(201).json({ message: "Message sent successfully" });
  } catch (error) {
    console.error("Failed to save contact message:", error);
    res.status(500).json({ message: "Failed to send message. Please try again later." });
  }
}
