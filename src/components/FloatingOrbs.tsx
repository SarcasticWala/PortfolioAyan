import { motion } from "framer-motion";

const FLOATING_ORBS = Array.from({ length: 10 }, (_, i) => ({
  id: i,
  size: Math.floor(Math.random() * 4) + 2, // 2–5px
  top: `${Math.random() * 90}%`,
  left: `${Math.random() * 90}%`,
  color: i % 2 === 0 ? "bg-primary/40" : "bg-accent/40",
  x: Math.random() * 30 - 15,
  y: Math.random() * 40 - 20,
  duration: Math.random() * 4 + 6, // 6–10s
}));

export default function FloatingOrbs() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {FLOATING_ORBS.map((orb) => (
        <motion.div
          key={orb.id}
          className={`absolute rounded-full ${orb.color}`}
          style={{
            width: orb.size,
            height: orb.size,
            top: orb.top,
            left: orb.left,
          }}
          animate={{
            x: [0, orb.x, 0],
            y: [0, orb.y, 0],
          }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}