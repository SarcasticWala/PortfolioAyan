import { ArrowRight, Repeat2 } from "lucide-react";
import { useState, memo } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export interface CardFlipProps {
  title?: string;
  subtitle?: string;
  description?: string;
  features?: string[];
  ctaLabel?: string;
  ctaHref?: string;
  githubHref?: string;
  imageSrc?: string;
  imageAlt?: string;
}

const CardFlip = memo(function CardFlip({
  title = "Design Systems",
  subtitle = "Explore the fundamentals",
  description = "Dive deep into the world of modern UI/UX design.",
  features = ["UI/UX", "Modern Design", "Tailwind CSS"],
  ctaLabel = "Live Demo",
  ctaHref = "#",
  githubHref = "#",
  imageSrc,
  imageAlt,
}: CardFlipProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="group relative h-[320px] w-full [perspective:2000px]"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <div
        className={cn(
          "relative h-full w-full transition-transform duration-700",
          "[transform-style:preserve-3d]",
          isFlipped ? "[transform:rotateY(180deg)]" : "[transform:rotateY(0deg)]"
        )}
      >
        {/* ================= FRONT ================= */}
        <div
          className={cn(
            "absolute inset-0 rounded-2xl overflow-hidden",
            "border border-border bg-card",
            "[backface-visibility:hidden]"
          )}
        >
          {/* Image */}
          {imageSrc && (
            <div className="absolute inset-0">
              <img
                src={imageSrc}
                alt={imageAlt || title}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            </div>
          )}

          {/* Text */}
          <div className="relative z-10 flex h-full flex-col justify-end p-5">
            <motion.h3
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-xl font-bold text-white leading-tight"
            >
              {title}
            </motion.h3>

            {subtitle && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-sm text-white/80 mt-1"
              >
                {subtitle}
              </motion.p>
            )}

            <div className="mt-3 flex justify-end">
              <Repeat2 className="h-4 w-4 text-white/70" />
            </div>
          </div>
        </div>

        {/* ================= BACK ================= */}
        <div
          className={cn(
            "absolute inset-0 rounded-2xl p-6",
            "bg-card border border-border",
            "[transform:rotateY(180deg)] [backface-visibility:hidden]",
            "flex flex-col"
          )}
        >
          <div className="flex-1 space-y-4 overflow-hidden">
            {/* Gradient title like section headings */}
            <h3 className="text-lg font-bold">
              <span className="text-gradient">{title}</span>
            </h3>

            <p className="text-sm text-muted-foreground leading-relaxed">
              {description}
            </p>

            <div className="space-y-2 pt-1">
              {features.map((feature, index) => (
                <div
                  key={feature}
                  className="flex items-center gap-2 text-sm text-foreground/80"
                  style={{
                    opacity: isFlipped ? 1 : 0,
                    transform: isFlipped
                      ? "translateX(0)"
                      : "translateX(-8px)",
                    transition: `all 300ms ease ${index * 80 + 150}ms`,
                  }}
                >
                  <ArrowRight className="h-3 w-3 text-primary" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 mt-4 border-t border-border flex gap-2">
            <a
              href={ctaHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-between rounded-lg px-3 py-2
                         bg-secondary hover:bg-primary/10 transition"
            >
              <span className="text-sm font-medium">{ctaLabel}</span>
              <ArrowRight className="h-4 w-4 text-primary" />
            </a>

            <a
              href={githubHref}
              target="_blank"
              rel="noopener noreferrer"
              className="w-11 flex items-center justify-center rounded-lg
                         bg-secondary hover:bg-primary/10 transition"
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.1.82-.26.82-.58 0-.28-.01-1.04-.02-2.03-3.34.73-4.04-1.61-4.04-1.61-.55-1.38-1.34-1.75-1.34-1.75-1.09-.75.08-.74.08-.74 1.21.09 1.84 1.23 1.84 1.23 1.07 1.84 2.81 1.31 3.49 1 .11-.78.42-1.31.77-1.61-2.67-.3-5.47-1.33-5.47-5.94 0-1.31.47-2.38 1.23-3.22-.12-.3-.53-1.53.12-3.18 0 0 1.01-.32 3.3 1.23A11.48 11.48 0 0 1 12 6.8c1.02.01 2.05.14 3.01.42 2.29-1.55 3.29-1.23 3.29-1.23.66 1.65.25 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.62-2.8 5.63-5.48 5.93.43.37.82 1.1.82 2.22 0 1.61-.01 2.91-.01 3.31 0 .32.21.69.83.57A12.01 12.01 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
});

CardFlip.displayName = "CardFlip";
export default CardFlip;
