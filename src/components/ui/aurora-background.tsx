import { memo } from "react";
import { cn } from "@/lib/utils";

/**
 * Aurora-style animated backdrop (Magic UI inspired).
 * Purely decorative — sits behind content, uses the theme's primary/accent
 * tokens so it adapts to light & dark automatically.
 */
const AuroraBackground = memo(({ className }: { className?: string }) => {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className
      )}
    >
      <div
        className="absolute -inset-[20%] opacity-40 blur-3xl animate-aurora"
        style={{
          backgroundImage:
            "radial-gradient(35% 45% at 25% 30%, hsl(var(--primary) / 0.55) 0%, transparent 60%)," +
            "radial-gradient(40% 40% at 75% 35%, hsl(var(--accent) / 0.45) 0%, transparent 60%)," +
            "radial-gradient(45% 45% at 55% 75%, hsl(var(--primary) / 0.35) 0%, transparent 65%)",
          backgroundSize: "200% 200%",
        }}
      />
    </div>
  );
});

AuroraBackground.displayName = "AuroraBackground";
export default AuroraBackground;
