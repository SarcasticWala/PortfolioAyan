import { memo } from "react";
import { motion } from "framer-motion";
import AnimatedSection from "./AnimatedSection";
import { Code2, Rocket, Heart } from "lucide-react";
import TypewriterText from "./TypewriterText";

const highlights = [
  { icon: Code2, label: "Clean Code", desc: "Writing maintainable, scalable solutions" },
  { icon: Rocket, label: "Performance", desc: "Optimized for speed and efficiency" },
  { icon: Heart, label: "Passion", desc: "Love for building great products" },
];

const aboutTexts = [
  "Building scalable web applications",
  "Crafting beautiful user experiences",
  "Solving complex problems elegantly",
];

const About = memo(() => {
  return (
    <AnimatedSection className="py-24 relative">
      <div id="about" className="absolute -top-20" />
      <div className="container mx-auto px-6">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-sm font-mono text-primary mb-2 tracking-widest uppercase"
        >
          About Me
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-4xl font-bold mb-12"
        >
          Who I <span className="text-gradient">Am</span>
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="space-y-6"
          >
            <p className="text-muted-foreground leading-relaxed text-lg">
              I'm a passionate{" "}
              <span className="text-foreground font-medium">Full Stack Developer</span>{" "}
              specializing in the <span className="text-primary font-medium">MERN stack</span>. 
              I love turning complex problems into simple, beautiful, and intuitive solutions.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              With a keen eye for detail and a drive for perfection, I build web applications 
              that not only function flawlessly but also deliver exceptional{" "}
              <span className="text-accent font-medium">user experiences</span>. 
              My focus is on writing clean, maintainable code and staying current with 
              the latest technologies.
            </p>

            {/* Typewriter text */}
            <div className="glass-card p-4 rounded-lg">
              <span className="text-sm text-muted-foreground font-mono">Currently: </span>
              <TypewriterText
                texts={aboutTexts}
                speed={60}
                deleteSpeed={35}
                pauseTime={2500}
                className="text-sm font-mono text-primary"
              />
            </div>
          </motion.div>

          <div className="space-y-4">
            {highlights.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                whileHover={{ x: 5 }}
                className="glass-card p-5 flex items-center gap-4 group cursor-default"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <item.icon size={20} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{item.label}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
});

About.displayName = "About";
export default About;
