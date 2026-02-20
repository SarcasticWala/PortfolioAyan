"use client";
import { memo, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const navItems = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

const Navbar = memo(() => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentHash, setCurrentHash] = useState<string>("");

  const toggle = useCallback(() => setIsOpen((p) => !p), []);

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

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
     className="fixed top-4 inset-x-0 flex justify-center z-40"
    >
      <div className="flex items-center gap-2 p-1 border border-white/15 rounded-full bg-white/10 backdrop-blur-md shadow-lg">

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = currentHash === item.href;

            return (
              <button
                key={item.href}
                onClick={() => handleClick(item.href)}
                className={`px-4 py-2 text-sm rounded-full transition-all duration-300 ${
                  isActive
                    ? "bg-white text-gray-900"
                    : "text-white/70 hover:text-white"
                }`}
              >
                {item.label}
              </button>
            );
          })}
          {/* <ThemeToggle /> */}
        </div>

       
        <div className="flex items-center gap-3 md:hidden px-3 py-2">
          {/* <ThemeToggle /> */}
          <button onClick={toggle} className="text-white">
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-3 md:hidden rounded-2xl border border-white/15 bg-white/10 backdrop-blur-md shadow-lg"
          >
            <ul className="flex flex-col items-center gap-4 py-6">
              {navItems.map((item) => {
                const isActive = currentHash === item.href;

                return (
                  <li key={item.href}>
                    <button
                      onClick={() => handleClick(item.href)}
                      className={`px-4 py-2 rounded-full transition-all ${
                        isActive
                          ? "bg-white text-gray-900"
                          : "text-white/70 hover:text-white"
                      }`}
                    >
                      {item.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
});

Navbar.displayName = "Navbar";
export default Navbar;
