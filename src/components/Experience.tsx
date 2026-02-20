import { memo } from "react";
import { motion } from "framer-motion";
import AnimatedSection from "./AnimatedSection";
import { Award, Trophy, Star } from "lucide-react";
import BeyondTheCode from "./BeyondTheCode ";


const achievements = [
  {
    icon: Trophy,
    title: "Hackathon Winner",
    description:
      "Won multiple hackathons with innovative web solutions and rapid prototyping.",
  },
  {
    icon: Award,
    title: "Open Source Contributor",
    description:
      "Active contributions to open-source projects, improving developer tools and libraries.",
  },
  {
    icon: Star,
    title: "Academic Excellence",
    description:
      "Consistently maintained high academic performance while building real-world projects.",
  },
];

const Experience = memo(() => {
  return (
    <AnimatedSection className="py-24 relative">
      <div id="experience" className="absolute -top-20" />

      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-sm font-mono text-primary mb-2 tracking-widest uppercase"
        >
          Experience
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-4xl font-bold mb-12"
        >
          Achievements & <span className="text-gradient">Experience</span>
        </motion.h2>

        {/* Achievements */}
        <div className="grid md:grid-cols-3 gap-6">
          {achievements.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              whileHover={{ y: -5 }}
              className="glass-card p-6 text-center group"
            >
              <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:glow-primary transition-all duration-300">
                <item.icon size={24} className="text-primary" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Spacer */}
        <div className="mt-20" />

        {/* Beyond the Code (shrinked + centered) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="max-w-4xl mx-auto scale-[0.92]"
        >
          <BeyondTheCode />
        </motion.div>
      </div>
    </AnimatedSection>
  );
});

Experience.displayName = "Experience";
export default Experience;