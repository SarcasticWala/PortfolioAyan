import { memo } from "react";
import { motion } from "framer-motion";

export interface RevealSegment {
  text: string;
  /** Optional class applied to this segment's words (e.g. "text-primary font-medium"). */
  className?: string;
}

interface RevealTextProps {
  segments: RevealSegment[];
  className?: string;
  /** Seconds between each word appearing. */
  stagger?: number;
}

/**
 * Reveals text word-by-word as it scrolls into view. Segments let you keep
 * emphasized words (colored/bold) while still animating every word.
 */
const RevealText = memo(({ segments, className, stagger = 0.02 }: RevealTextProps) => {
  // Flatten segments into individually-animatable words, keeping their class.
  const words: RevealSegment[] = [];
  segments.forEach((seg) => {
    seg.text.split(/(\s+)/).forEach((chunk) => {
      if (chunk.length === 0) return;
      words.push({ text: chunk, className: seg.className });
    });
  });

  return (
    <motion.p
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      transition={{ staggerChildren: stagger }}
    >
      {words.map((w, i) =>
        w.text.trim() === "" ? (
          <span key={i}> </span>
        ) : (
          <motion.span
            key={i}
            className={w.className ? `inline-block ${w.className}` : "inline-block"}
            variants={{
              hidden: { opacity: 0, y: 8, filter: "blur(4px)" },
              visible: { opacity: 1, y: 0, filter: "blur(0px)" },
            }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {w.text}
          </motion.span>
        )
      )}
    </motion.p>
  );
});

RevealText.displayName = "RevealText";
export default RevealText;
