import { memo, useState, useCallback } from "react";
import { motion } from "framer-motion";
import AnimatedSection from "./AnimatedSection";
import { Send, Github, Linkedin, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import MapEmbed from "./MapEmbed";
import { contactSchema, ContactFormType } from "@/utils/contactSchema";

type ContactApiError = {
  message?: string;
  errors?: {
    name?: string[];
    email?: string[];
    message?: string[];
  };
};

const Contact = memo(() => {
  const [form, setForm] = useState<ContactFormType>({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<Partial<ContactFormType>>({});
  const [sending, setSending] = useState(false);
  const { toast } = useToast();
  const contactApiUrl =
    import.meta.env.VITE_CONTACT_API_URL ||
    (import.meta.env.DEV ? "https://portfolio-ayan-backend.vercel.app/api/contact" : "/api/contact");

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
      setErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      const result = contactSchema.safeParse(form);

      if (!result.success) {
        const fieldErrors: Partial<ContactFormType> = {};
        result.error.errors.forEach((err) => {
          if (err.path[0]) fieldErrors[err.path[0] as keyof ContactFormType] = err.message;
        });
        setErrors(fieldErrors);
        return;
      }

      setSending(true);

      try {
        if (!contactApiUrl) {
          throw new Error("Contact API URL is not configured.");
        }

        const response = await fetch(contactApiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            message: form.message,
          }),
        });

        const raw = await response.text();
        let data: ContactApiError | null = null;
        try {
          data = raw ? JSON.parse(raw) : null;
        } catch {
          data = null;
        }

        if (!response.ok) {
          if (data?.errors && typeof data.errors === "object") {
            const fieldErrors: Partial<ContactFormType> = {};
            if (Array.isArray(data.errors.name) && data.errors.name[0]) fieldErrors.name = data.errors.name[0];
            if (Array.isArray(data.errors.email) && data.errors.email[0]) fieldErrors.email = data.errors.email[0];
            if (Array.isArray(data.errors.message) && data.errors.message[0]) fieldErrors.message = data.errors.message[0];
            setErrors(fieldErrors);
          }
          throw new Error(data?.message || `Request failed (${response.status})`);
        }

        toast({
          title: "Message sent!",
          description: "Thanks for reaching out. I'll get back to you soon.",
        });
        setForm({ name: "", email: "", message: "" });
        setErrors({});
      } catch (error) {
        toast({
          title: "Failed to send",
          description: error instanceof Error ? error.message : "Something went wrong",
          variant: "destructive",
        });
      } finally {
        setSending(false);
      }
    },
    [contactApiUrl, form, toast]
  );

  return (
    <AnimatedSection className="py-24 relative">
      <div id="contact" className="absolute -top-20" />
      <div className="container mx-auto px-6 max-w-2xl">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-sm font-mono text-primary mb-2 tracking-widest uppercase text-center"
        >
          Contact
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-4xl font-bold mb-4 text-center"
        >
          Get In <span className="text-gradient">Touch</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground text-center mb-10"
        >
          Have a project in mind? Let's build something amazing together.
        </motion.p>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          onSubmit={handleSubmit}
          className="glass-card p-8 space-y-5"
        >
          <div>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your Name"
              className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all duration-300"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Your Email"
              className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all duration-300"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows={5}
              placeholder="Your Message"
              className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all duration-300 resize-none"
            />
            {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
          </div>

          <motion.button
            type="submit"
            disabled={sending}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-medium glow-primary transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Send size={16} />
            {sending ? "Sending..." : "Send Message"}
          </motion.button>
        </motion.form>

        {/* Social links */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="flex items-center justify-center gap-6 mt-10"
        >
          {[
            { icon: Github, href: "https://github.com/SarcasticWala", label: "GitHub" },
            { icon: Linkedin, href: "https://linkedin.com/in/ayandas", label: "LinkedIn" },
            { icon: Mail, href: "mailto:dasayan948@gmail.com", label: "Email" },
          ].map((s) => (
            <motion.a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.15, y: -3 }}
              className="w-11 h-11 rounded-lg glass-card flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
              aria-label={s.label}
            >
              <s.icon size={20} />
            </motion.a>
          ))}
        </motion.div>

        {/* Map */}
        <MapEmbed />
      </div>
    </AnimatedSection>
  );
});

Contact.displayName = "Contact";
export default Contact;

