import { memo, useRef } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

const hobbies = [
  { title: "Movies", emoji: "🎦", left: "42%", top: "55%" },
  { title: "Gaming", emoji: "🎮", left: "30%", top: "18%" },
  { title: "Music", emoji: "🎵", left: "65%", top: "8%" },
  { title: "Magic", emoji: "🪄", left: "3%", top: "50%" },
  { title: "Coding", emoji: "🧑🏻‍💻", left: "55%", top: "32%" },
  { title: "Chess", emoji: "♟️", left: "5%", top: "12%" },
];

const BeyondTheCode = memo(() => {
  const constraintRef = useRef<HTMLDivElement | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="glass-card relative overflow-hidden
                 h-[260px] p-4"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <Star className="text-primary" size={16} />
        <h3 className="text-sm font-semibold">Beyond the Code</h3>
      </div>

      <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
        Creativity & curiosity beyond development.
      </p>

      {/* Draggable Hobbies */}
      <div ref={constraintRef} className="relative h-full">
        {hobbies.map((hobby) => (
          <motion.div
            key={hobby.title}
            drag
            dragConstraints={constraintRef}
            whileTap={{ scale: 0.92 }}
            className="absolute inline-flex items-center gap-1.5
                       px-3 py-1 rounded-full text-xs
                       bg-gradient-to-r from-emerald-300 to-sky-400
                       cursor-grab active:cursor-grabbing"
            style={{ left: hobby.left, top: hobby.top }}
          >
            <span className="text-gray-900 font-medium">
              {hobby.title}
            </span>
            <span>{hobby.emoji}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
});

BeyondTheCode.displayName = "BeyondTheCode";
export default BeyondTheCode;