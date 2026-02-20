import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectMongo } from "./utils/mongo";
import contactRoutes from "./routes/contact";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});
app.use("/api/contact", contactRoutes);

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await connectMongo();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

start();
