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
                <path d="M12 0c-6.626 0-12 5.373-12 12..." />
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