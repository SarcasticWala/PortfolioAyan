import { useEffect, useRef, useState } from "react";

/**
 * Custom cursor: a small dot that tracks the pointer exactly plus a ring that
 * eases behind it and grows over interactive elements. Desktop-only — it is
 * disabled on touch / coarse-pointer devices so mobile is unaffected.
 */
const CustomCursor = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    setEnabled(true);
    document.documentElement.classList.add("has-custom-cursor");

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ring = { x: pos.x, y: pos.y };
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      setHidden(false);
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
      }
      // Restart the easing loop if it went idle.
      if (!raf) raf = requestAnimationFrame(loop);
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      setHovering(
        !!target?.closest(
          "a, button, input, textarea, select, label, [role='button'], [data-cursor]"
        )
      );
    };

    const onLeave = () => setHidden(true);
    const onDown = () => setHovering((h) => h); // keep state; click feedback optional

    const loop = () => {
      const dx = pos.x - ring.x;
      const dy = pos.y - ring.y;
      ring.x += dx * 0.18;
      ring.y += dy * 0.18;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.x}px, ${ring.y}px)`;
      }
      // Stop looping once the ring has caught up to save CPU when idle.
      if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
        raf = requestAnimationFrame(loop);
      } else {
        raf = 0;
      }
    };
    loop();

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    document.addEventListener("mouseleave", onLeave);
    window.addEventListener("mousedown", onDown);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("mousedown", onDown);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, []);

  if (!enabled) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[9999] transition-opacity duration-300"
      style={{ opacity: hidden ? 0 : 1 }}
    >
      {/* easing ring */}
      <div ref={ringRef} className="fixed left-0 top-0 will-change-transform">
        <div
          className={`-ml-4 -mt-4 h-8 w-8 rounded-full border border-primary/70 transition-transform duration-200 ${
            hovering ? "scale-[1.8]" : "scale-100"
          }`}
          style={{ backgroundColor: hovering ? "hsl(var(--primary) / 0.12)" : "transparent" }}
        />
      </div>
      {/* precise dot */}
      <div ref={dotRef} className="fixed left-0 top-0 will-change-transform">
        <div className="-ml-1 -mt-1 h-2 w-2 rounded-full bg-primary" />
      </div>
    </div>
  );
};

export default CustomCursor;
