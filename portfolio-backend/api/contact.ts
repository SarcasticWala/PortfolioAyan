import mongoose from "mongoose";
import { z } from "zod";
import { connectMongo } from "./_lib/mongo";

type ApiRequest = {
  method?: string;
  body?: unknown;
};

type ApiResponse = {
  setHeader: (name: string, value: string) => void;
  status: (code: number) => ApiResponse;
  json: (body: unknown) => void;
  end: () => void;
};

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

const ContactMessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, minlength: 2, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    message: { type: String, required: true, minlength: 10, trim: true },
  },
  { timestamps: true, collection: "contact_messages" }
);

const ContactMessage =
  mongoose.models.ContactMessage ||
  mongoose.model("ContactMessage", ContactMessageSchema);

function setCors(res: ApiResponse) {
  const origin = process.env.ALLOWED_ORIGIN || "*";
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  setCors(res);

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  const parsed = contactSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: parsed.error.flatten().fieldErrors,
    });
  }

  try {
    await connectMongo();
    const payload = {
      name: parsed.data.name.trim(),
      email: parsed.data.email.trim().toLowerCase(),
      message: parsed.data.message.trim(),
    };
    const doc = await ContactMessage.create(payload);

    return res.status(200).json({
      success: true,
      message: "Message saved successfully!",
      id: doc._id,
    });
  } catch (error) {
    console.error("contact api error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}
