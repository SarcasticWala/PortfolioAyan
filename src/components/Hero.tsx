import { memo, useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import AuroraBackground from "./ui/aurora-background";

const roles = ["MERN Stack Developer", "React Developer", "Full Stack Engineer", "UI/UX Enthusiast"];

const Hero = memo(() => {
  const [roleIndex, setRoleIndex] = useState(0);
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentRole = roles[roleIndex];
    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          setText(currentRole.substring(0, text.length + 1));
          if (text.length + 1 === currentRole.length) {
            setTimeout(() => setIsDeleting(true), 2000);
          }
        } else {
          setText(currentRole.substring(0, text.length - 1));
          if (text.length === 0) {
            setIsDeleting(false);
            setRoleIndex((prev) => (prev + 1) % roles.length);
          }
        }
      },
      isDeleting ? 40 : 80
    );
    return () => clearTimeout(timeout);
  }, [text, isDeleting, roleIndex]);

  const scrollTo = useCallback((id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden grain">
      {/* Aurora backdrop */}
      <AuroraBackground />

      {/* Subtle grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.15] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]"
        style={{
          backgroundImage:
            "linear-gradient(to right, hsl(var(--foreground) / 0.12) 1px, transparent 1px)," +
            "linear-gradient(to bottom, hsl(var(--foreground) / 0.12) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Ambient glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-radial rounded-full blur-3xl animate-pulse-glow pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl animate-pulse-glow pointer-events-none" style={{ background: "radial-gradient(ellipse, hsl(200 100% 60% / 0.1), transparent 70%)" }} />

      {/* Floating orbs */}
      {/* <motion.div
        className="absolute top-20 right-20 w-3 h-3 rounded-full bg-primary/40"
        animate={{ y: [0, -30, 0], x: [0, 15, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-32 left-16 w-2 h-2 rounded-full bg-accent/40"
        animate={{ y: [0, -20, 0], x: [0, -10, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/2 right-10 w-4 h-4 rounded-full bg-primary/20"
        animate={{ y: [0, -40, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      /> */}

      <div className="container mx-auto px-6 text-center relative z-10">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-sm font-mono text-primary mb-4 tracking-widest uppercase"
        >
          Hello, I'm
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="text-5xl sm:text-7xl lg:text-8xl font-black mb-6 tracking-tight"
        >
          <span className="text-gradient bg-[length:200%_auto] animate-gradient-shift">Ayan Das</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-lg sm:text-xl text-muted-foreground mb-10 h-8"
        >
          <span className="font-mono">{text}</span>
          <span className="animate-pulse text-primary">|</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => scrollTo("#projects")}
            className="group relative overflow-hidden px-8 py-3 rounded-lg bg-primary text-primary-foreground font-medium glow-primary transition-all duration-300"
          >
            <span className="relative z-10">View Projects</span>
            {/* shine sweep */}
            <span
              aria-hidden
              className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:animate-shimmer"
            />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => scrollTo("#contact")}
            className="px-8 py-3 rounded-lg border border-border text-foreground font-medium hover:border-primary/50 hover:glow-border transition-all duration-300"
          >
            Contact Me
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
});

Hero.displayName = "Hero";
export default Hero;
