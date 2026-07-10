import { defineConfig, loadEnv, type PluginOption } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

import svgr from "vite-plugin-svgr";

/**
 * Dev-only middleware that serves POST /api/contact locally, mirroring the
 * Vercel serverless function in api/contact.ts. Vite's dev server doesn't run
 * serverless functions, so without this the contact form has no backend in dev.
 */
function contactApiDevPlugin(env: Record<string, string>): PluginOption {
  const uri = env.MONGODB_URI;
  const dbName = env.MONGODB_DB || "portfolio";
  const collectionName = env.MONGODB_COLLECTION || "messages";

  // Cache the connection across requests during a dev session.
  let clientPromise: Promise<import("mongodb").MongoClient> | null = null;

  return {
    name: "contact-api-dev",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use("/api/contact", async (req, res) => {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");
        res.setHeader("Content-Type", "application/json");

        const send = (status: number, body: unknown) => {
          res.statusCode = status;
          res.end(JSON.stringify(body));
        };

        if (req.method === "OPTIONS") {
          res.statusCode = 204;
          res.end();
          return;
        }
        if (req.method !== "POST") {
          send(405, { message: "Method not allowed" });
          return;
        }
        if (!uri) {
          send(500, { message: "MONGODB_URI is not set in .env" });
          return;
        }

        try {
          // Read raw body with a size cap to avoid unbounded memory use.
          const chunks: Buffer[] = [];
          let total = 0;
          for await (const chunk of req) {
            total += (chunk as Buffer).length;
            if (total > 20_000) {
              send(413, { message: "Payload too large" });
              return;
            }
            chunks.push(chunk as Buffer);
          }
          const raw = Buffer.concat(chunks).toString("utf8");
          const payload = raw ? JSON.parse(raw) : {};

          // Honeypot: silently accept (but don't store) if the hidden field is set.
          if (typeof payload.company === "string" && payload.company.trim() !== "") {
            send(201, { message: "Message sent successfully" });
            return;
          }

          // Validate (mirrors src/utils/contactSchema.ts)
          const name = String(payload.name ?? "").trim();
          const email = String(payload.email ?? "").trim();
          const message = String(payload.message ?? "").trim();
          const errors: Record<string, string[]> = {};
          if (name.length < 2) errors.name = ["Name must be at least 2 characters"];
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = ["Invalid email address"];
          if (message.length < 10) errors.message = ["Message must be at least 10 characters"];
          if (Object.keys(errors).length) {
            send(400, { message: "Validation failed", errors });
            return;
          }

          const { MongoClient } = await import("mongodb");
          if (!clientPromise) clientPromise = MongoClient.connect(uri);
          const client = await clientPromise;
          const db = client.db(dbName);

          // Rate limit per IP (mirrors api/contact.ts).
          const RATE_LIMIT = 5;
          const RATE_WINDOW_MS = 60_000;
          const xff = req.headers["x-forwarded-for"];
          const fwd = Array.isArray(xff) ? xff[0] : xff;
          const ip = (fwd ? fwd.split(",")[0].trim() : req.socket?.remoteAddress) || "unknown";
          const hits = db.collection("rate_limits");
          await hits
            .createIndex({ createdAt: 1 }, { expireAfterSeconds: 120 })
            .catch(() => {});
          const now = new Date();
          await hits.insertOne({ ip, createdAt: now });
          const recent = await hits.countDocuments({
            ip,
            createdAt: { $gte: new Date(now.getTime() - RATE_WINDOW_MS) },
          });
          if (recent > RATE_LIMIT) {
            send(429, { message: "Too many requests. Please try again in a minute." });
            return;
          }

          await db
            .collection(collectionName)
            .insertOne({ name, email, message, createdAt: new Date() });

          send(201, { message: "Message sent successfully" });
        } catch (error) {
          console.error("[contact-api-dev] failed:", error);
          send(500, { message: "Failed to send message. Please try again later." });
        }
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    server: {
      host: "::",
      port: 8080,
      hmr: {
        overlay: false,
      },
    },
    plugins: [react(), svgr(), contactApiDevPlugin(env)],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
