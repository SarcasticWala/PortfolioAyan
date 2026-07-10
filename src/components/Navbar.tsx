"use client";
import { memo, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Github, Linkedin, Mail } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const navItems = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

const socials = [
  { icon: Github, href: "https://github.com/SarcasticWala", label: "GitHub" },
  { icon: Linkedin, href: "https://linkedin.com/in/ayandas", label: "LinkedIn" },
  { icon: Mail, href: "mailto:dasayan948@gmail.com", label: "Email" },
];

const Navbar = memo(() => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentHash, setCurrentHash] = useState<string>("");

  const toggle = useCallback(() => setIsOpen((p) => !p), []);
  const close = useCallback(() => setIsOpen(false), []);

  const handleClick = useCallback((href: string) => {
    setCurrentHash(href);
    setIsOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Detect hash on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map((item) => item.href);
      for (const id of sections) {
        const section = document.querySelector(id);
        if (section) {
          const rect = section.getBoundingClientRect();
          if (rect.top <= 120 && rect.bottom >= 120) {
            setCurrentHash(id);
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-4 inset-x-0 flex justify-center z-50 px-4"
      >
        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1 p-1 border border-white/15 rounded-full bg-white/10 backdrop-blur-md shadow-lg">
          {navItems.map((item) => {
            const isActive = currentHash === item.href;
            return (
              <button
                key={item.href}
                onClick={() => handleClick(item.href)}
                className={`px-4 py-2 text-sm rounded-full transition-all duration-300 ${
                  isActive ? "bg-white text-gray-900" : "text-white/70 hover:text-white"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Mobile bar */}
        <div className="md:hidden inline-flex items-center gap-3 pl-5 pr-2 py-2 border border-white/15 rounded-full bg-white/10 backdrop-blur-md shadow-lg">
          <button
            onClick={() => handleClick("#hero")}
            className="font-secondary text-base font-bold text-white"
          >
            Ayan Das
          </button>
          <button
            onClick={toggle}
            aria-label="Open menu"
            aria-expanded={isOpen}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <Menu size={20} />
          </button>
        </div>
      </motion.nav>

      {/* Mobile full-screen menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] md:hidden"
          >
            {/* backdrop */}
            <div
              className="absolute inset-0 bg-background/80 backdrop-blur-xl"
              onClick={close}
            />

            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 flex h-full flex-col"
            >
              {/* header */}
              <div className="flex items-center justify-between px-6 py-6">
                <span className="font-secondary text-lg font-bold text-gradient">
                  Ayan Das
                </span>
                <button
                  onClick={close}
                  aria-label="Close menu"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-secondary/50 text-foreground transition-colors hover:border-primary/50 hover:text-primary"
                >
                  <X size={20} />
                </button>
              </div>

              {/* links */}
              <nav className="flex flex-1 flex-col justify-center gap-1 px-8">
                {navItems.map((item, i) => {
                  const isActive = currentHash === item.href;
                  return (
                    <motion.button
                      key={item.href}
                      initial={{ opacity: 0, x: -24 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.08 * i + 0.12, ease: [0.22, 1, 0.36, 1] }}
                      onClick={() => handleClick(item.href)}
                      className="group flex items-center gap-4 border-b border-border/40 py-4 text-left"
                    >
                      <span className="w-8 font-mono text-sm text-primary/60">
                        0{i + 1}
                      </span>
                      <span
                        className={`text-4xl font-bold tracking-tight transition-colors ${
                          isActive
                            ? "text-gradient"
                            : "text-foreground/70 group-hover:text-foreground"
                        }`}
                      >
                        {item.label}
                      </span>
                    </motion.button>
                  );
                })}
              </nav>

              {/* footer: socials */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-4 px-8 py-10"
              >
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-secondary/40 text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
                  >
                    <s.icon size={20} />
                  </a>
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
});

Navbar.displayName = "Navbar";
export default Navbar;
