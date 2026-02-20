import { memo } from "react";
import { motion } from "framer-motion";
import AnimatedSection from "./AnimatedSection";
import ToolboxItems from "./ToolboxItems";

import { FaReact, FaNodeJs, FaGit, FaDocker, FaHtml5, FaCss3Alt } from "react-icons/fa";
import {
  SiExpress,
  SiMongodb,
  SiTypescript,
  SiTailwindcss,
  SiJavascript,
} from "react-icons/si";

const toolboxItems = [
  { title: "React", iconType: FaReact },
  { title: "Node.js", iconType: FaNodeJs },
  { title: "Express", iconType: SiExpress },
  { title: "MongoDB", iconType: SiMongodb },
  { title: "JavaScript", iconType: SiJavascript },
  { title: "TypeScript", iconType: SiTypescript },
  { title: "Tailwind", iconType: SiTailwindcss },
  { title: "Docker", iconType: FaDocker },
  { title: "Git", iconType: FaGit },
  { title: "Html", iconType: FaHtml5 },
  { title: "Css", iconType: FaCss3Alt },
];

const Skills = memo(() => {
  return (
    <AnimatedSection className="py-24 relative">
      <div id="skills" className="absolute -top-20" />

      <div className="container mx-auto px-6">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-sm font-mono text-primary mb-2 tracking-widest uppercase"
        >
          Skills
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-4xl font-bold mb-12"
        >
          Tech <span className="text-gradient">Stack</span>
        </motion.h2>

        {/* Moving Left */}
        <ToolboxItems
          toolboxItems={toolboxItems}
          className="mb-6"
          itemsWrapperClassName="animate-move-left"
        />

        {/* Moving Right */}
        <ToolboxItems
          toolboxItems={toolboxItems}
          itemsWrapperClassName="animate-move-right"
        />
      </div>
    </AnimatedSection>
  );
});

Skills.displayName = "Skills";
export default Skills;
