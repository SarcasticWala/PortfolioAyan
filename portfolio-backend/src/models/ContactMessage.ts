import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, minlength: 2, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    message: { type: String, required: true, minlength: 10, trim: true },
  },
  { timestamps: true, collection: "contact_messages" }
);

const ContactMessage =
  mongoose.models.ContactMessage || mongoose.model("ContactMessage", contactSchema);

export default ContactMessage;
