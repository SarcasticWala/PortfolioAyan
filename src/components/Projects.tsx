import { memo } from "react";
import { motion } from "framer-motion";
import AnimatedSection from "./AnimatedSection";
import CardFlip from "./kokonutui/CardFlip";
import pic3 from  "../assets/imag3.png";
import pic from "../assets/image1.png";
import pic2 from  "../assets/image2.png";

import pic4 from  "../assets/image.png";
import pic5 from  "../assets/pic5.png";
const projects = [
  {
    title: "CodeSphere",
    subtitle: "Collaborative Code Editor",
     image: pic3,
    description:
      "A collaborative code editor with real-time multi-user editing, syntax highlighting, and integrated terminal support.",
    tech: ["React", "Node.js", "Socket.io", "MongoDB", "Monaco Editor"],
    live: "https://code-sphere-editor.vercel.app/",
    github: "https://github.com/SarcasticWala/Code_Sphere",
  },
  {
    title: "Esperenza 2k25",
    subtitle: "College Festival Website",
    image:pic,
    description:
      "A dynamic website for the college's annual cultural festival, featuring event listings, ticket booking, and interactive maps.",
    tech: ["Next.js", "TypeScript", "MongoDB", "Tailwind CSS", "Acertinity UI", "Shadcn UI"],
    live: "https://www.esperanza.org.in/",
    github: "https://github.com/SarcasticWala/Esperanza_2k25",
  },
  {
    title: "TathaagatFoundation",
    subtitle: "NGO Website",
    image:pic5,
    description:
      "Tathaagat Foundation focuses on high-quality, low-cost and replicable interventions to strengthen rural livelihoods and build climate resilience at the village level.",
    tech: ["React", "Node.js", "MongoDB", "Twilio"],
    live: "#",
    github: "#",
  },
  {
    title: "Chat-A-Verse",
    subtitle: "Chat Application ",
    image:pic2,
    description:
      "A real-time chat application with support for text, images, and emojis, built with a focus on performance and scalability.",
    tech: ["React.js", "MongoDB", "Express.js", "Node.js", "Socket.io"],
    live: "https://chat-a-verse-backend.onrender.com/",
    github: "https://github.com/SarcasticWala/Chat_Application",
  },
    {
    title: "expense-tracker",
    description: "An expense tracker app that allows users to track their income and expenses, visualize their spending habits, and set budgets.",
      image:pic4,
    tech: ["React", "Tailwind CSS", ],
    live: "https://tathaagat.vercel.app/",
    github: "https://github.com/SarcasticWala/Tathaagat",
  },
];

const Projects = memo(() => {
  return (
    <AnimatedSection className="py-24 relative">
      <div id="projects" className="absolute -top-20" />

      <div className="container mx-auto px-6">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-sm font-mono text-primary mb-2 tracking-widest uppercase"
        >
          Projects
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-4xl font-bold mb-12"
        >
          Featured <span className="text-gradient">Work</span>
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {projects.map((project, i) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <CardFlip
                title={project.title}
                subtitle={project.subtitle}
                description={project.description}
                features={project.tech}
                ctaLabel="Live Demo"
                ctaHref={project.live}
                githubHref={project.github}
                imageSrc={project.image} 
              />
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
});

Projects.displayName = "Projects";
export default Projects;