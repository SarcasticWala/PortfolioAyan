import { useEffect, useState, useCallback } from "react";

const roles = ["MERN Stack Developer", "React Developer", "Full Stack Engineer", "UI/UX Enthusiast"];

/**
 * First-load preloader (inspired by red1-for-hek.vercel.app), themed to the
 * portfolio's palette: a roles marquee, a "Loading N%" → "Welcome" pill with a
 * cursor-following glow, animated bars, and a progress line. Shows once per tab
 * session and locks scroll while visible.
 */
const Loader = () => {
  const [show, setShow] = useState(() => {
    if (typeof window === "undefined") return false;
    return !sessionStorage.getItem("loaderShown");
  });
  const [percent, setPercent] = useState(0);
  const [complete, setComplete] = useState(false); // reached 100%
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (!show) return;
    let n = 0;
    const id = window.setInterval(() => {
      n += Math.round(Math.random() * 8) + 3;
      if (n >= 100) {
        n = 100;
        window.clearInterval(id);
        setPercent(100);
        setComplete(true);
        window.setTimeout(() => setFadeOut(true), 700);
        window.setTimeout(() => {
          sessionStorage.setItem("loaderShown", "1");
          setShow(false);
        }, 1500);
      } else {
        setPercent(n);
      }
    }, 120);
    return () => window.clearInterval(id);
  }, [show]);

  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [show]);

  const handleGlow = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
  }, []);

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col justify-between bg-background transition-opacity duration-700 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 sm:p-8">
        <span className="font-secondary text-base sm:text-lg font-bold tracking-tight">
          Ayan Das
        </span>
        <div className="relative flex items-end gap-1 h-6">
          {[14, 22, 12, 20].map((h, i) => (
            <span key={i} className="w-0.5 rounded-full bg-foreground/60" style={{ height: h }} />
          ))}
          <span className="absolute -left-1 bottom-1 h-1.5 w-1.5 rounded-full bg-primary animate-loader-ball" />
        </div>
      </div>

      {/* Marquee + center pill */}
      <div className="relative overflow-hidden py-6">
        <div className="flex whitespace-nowrap animate-[move-left_16s_linear_infinite] will-change-transform">
          {[0, 1].map((k) => (
            <div key={k} className="flex shrink-0">
              {roles.map((r) => (
                <span
                  key={r + k}
                  className="mx-8 flex items-center gap-8 text-4xl sm:text-6xl font-black text-foreground/80"
                >
                  <span className="h-2 w-2 rounded-full bg-primary" />
                  {r.toUpperCase()}
                </span>
              ))}
            </div>
          ))}
        </div>

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div
            className="pointer-events-auto relative rounded-full p-[2px] shadow-2xl"
            style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))" }}
          >
            <div
              onMouseMove={handleGlow}
              className="group relative min-w-[190px] overflow-hidden rounded-full bg-background px-8 py-4 text-center"
            >
              <div
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  background:
                    "radial-gradient(140px circle at var(--mx, 50%) var(--my, 50%), hsl(var(--primary) / 0.25), transparent 70%)",
                }}
              />
              <span
                className={`relative z-10 font-mono text-sm transition-opacity duration-300 ${
                  complete ? "opacity-0" : "opacity-100"
                }`}
              >
                Loading {percent}%
              </span>
              <span
                className={`absolute inset-0 z-10 flex items-center justify-center font-mono text-sm font-semibold text-gradient transition-opacity duration-300 ${
                  complete ? "opacity-100" : "opacity-0"
                }`}
              >
                Welcome
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress line */}
      <div className="p-6 sm:p-8">
        <div className="h-px w-full overflow-hidden bg-border">
          <div
            className="h-full bg-gradient-to-r from-primary to-accent transition-[width] duration-150 ease-out"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default Loader;
