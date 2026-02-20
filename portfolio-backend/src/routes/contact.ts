import { Router } from "express";
import { z } from "zod";
import ContactMessage from "../models/ContactMessage";

const router = Router();

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

router.post("/", async (req, res) => {
  const result = contactSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: result.error.flatten().fieldErrors,
    });
  }

  try {
    const payload = {
      name: result.data.name.trim(),
      email: result.data.email.trim().toLowerCase(),
      message: result.data.message.trim(),
    };

    const savedMessage = new ContactMessage(payload);
    await savedMessage.save();
    return res.json({
      success: true,
      message: "Message saved successfully!",
      id: savedMessage._id,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Failed to save message." });
  }
});

export default router;
