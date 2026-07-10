import { memo, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";

interface SpotlightCardProps {
  children: React.ReactNode;
  /** Classes for the outer card surface (borders, background, rounding). */
  className?: string;
  /** Classes for the inner content wrapper (padding, flex layout, etc). */
  innerClassName?: string;
  /** Color of the cursor-following glow. */
  spotlightColor?: string;
}

/**
 * Card with a soft radial glow that follows the cursor (Aceternity inspired).
 * Layout classes stay on `innerClassName` so existing flex/grid layouts are
 * preserved unchanged.
 */
const SpotlightCard = memo(
  ({
    children,
    className,
    innerClassName,
    spotlightColor = "hsl(var(--primary) / 0.18)",
  }: SpotlightCardProps) => {
    const ref = useRef<HTMLDivElement>(null);

    const handleMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      el.style.setProperty("--spot-x", `${e.clientX - rect.left}px`);
      el.style.setProperty("--spot-y", `${e.clientY - rect.top}px`);
    }, []);

    return (
      <div
        ref={ref}
        onMouseMove={handleMove}
        className={cn("group/spot relative overflow-hidden h-full", className)}
      >
        {/* cursor-following glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-300 group-hover/spot:opacity-100"
          style={{
            background: `radial-gradient(240px circle at var(--spot-x, 50%) var(--spot-y, 50%), ${spotlightColor}, transparent 70%)`,
          }}
        />
        <div className={cn("relative z-10 h-full", innerClassName)}>{children}</div>
      </div>
    );
  }
);

SpotlightCard.displayName = "SpotlightCard";
export default SpotlightCard;
