import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Experience from "@/components/Experience";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import { TapeSection } from "@/components/Tape";

const Index = () => {
  return (
    <div className="min-h-screen bg-background/60 grain relative">
      <ScrollProgress />
      
      <Navbar />
      <div className="relative">
        <Hero />
      </div>
      <About />
      <Skills />
      <Projects />
      <Experience />
      <TapeSection />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
