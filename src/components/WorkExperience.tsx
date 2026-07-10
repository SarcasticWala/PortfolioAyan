import { useEffect, useRef, useState } from "react";
import { Building2, Calendar } from "lucide-react";

interface ExperienceItem {
  role: string;
  company: string;
  meta?: string;
  dates: string;
  current?: boolean;
  bullets: string[];
  tags: string[];
}

const EXPERIENCES: ExperienceItem[] = [
  {
    role: "QA Engineer",
    company: "BestQ Software Pvt. Ltd.",
    meta: "Client: IndiaCharts · Project: Strike",
    dates: "Apr 2026 — Present",
    current: true,
    bullets: [
      "Own end-to-end test automation across UI, API, performance, and data layers for a financial trading platform within a CI/CD workflow.",
      "Automated 1,000+ UI test cases with Playwright, cutting regression time by ~40%.",
      "Designed 500+ API tests in Postman, wired into Jenkins CI/CD via Newman for nightly runs.",
      "Validated data integrity in DBeaver and ran load tests with k6 under concurrent traffic.",
    ],
    tags: ["Playwright", "Postman", "Newman", "k6", "DBeaver", "Jenkins", "Jira"],
  },
  {
    role: "MERN Stack Developer",
    company: "IntraNest",
    meta: "NGO management platform",
    dates: "Apr 2025 — Jun 2025",
    current: false,
    bullets: [
      "Built full-stack features using MVC architecture with MongoDB, Express.js, React.js, and Node.js.",
      "Developed responsive UI components with React.js and Tailwind CSS; improved backend response time by 30%.",
      "Deployed the live Tathaagat Foundation Website using Git and Agile/Scrum workflows.",
    ],
    tags: ["React.js", "Node.js", "Express.js", "MongoDB", "Tailwind CSS"],
  },
];

function TimelineItem({ item, index }: { item: ExperienceItem; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="relative pl-14 pb-12 last:pb-0"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        transition: `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`,
      }}
    >
      {/* Node */}
      <div className="absolute left-0 top-0 flex items-center justify-center">
        <span
          className={
            "flex h-9 w-9 items-center justify-center rounded-full border-2 " +
            (item.current
              ? "border-primary bg-primary/10"
              : "border-border bg-card")
          }
        >
          <Building2
            className={"h-4 w-4 " + (item.current ? "text-primary" : "text-muted-foreground")}
          />
        </span>
        {item.current && (
          <span className="absolute h-9 w-9 rounded-full border border-primary/40 animate-ping" />
        )}
      </div>

      {/* Card */}
      <div className="glass-card p-5 transition-colors hover:border-primary/40">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h3 className="font-semibold text-foreground text-lg">{item.role}</h3>
          <span className="flex items-center gap-1.5 text-xs font-mono text-primary/90">
            <Calendar className="h-3.5 w-3.5" />
            {item.dates}
          </span>
        </div>
        <p className="mt-0.5 text-sm text-muted-foreground">
          <span className="text-foreground font-medium">{item.company}</span>
          {item.meta ? <span className="text-muted-foreground/80"> · {item.meta}</span> : null}
        </p>

        <ul className="mt-3 space-y-1.5">
          {item.bullets.map((b, i) => (
            <li key={i} className="flex gap-2 text-sm text-muted-foreground leading-relaxed">
              <span className="mt-2 h-1 w-1 flex-none rounded-full bg-primary/70" />
              {b}
            </li>
          ))}
        </ul>

        {item.tags?.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md border border-border bg-secondary/60 px-2 py-0.5 text-xs font-mono text-foreground/80"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function WorkExperience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [fillPercent, setFillPercent] = useState(0);

  useEffect(() => {
    let ticking = false;
    const compute = () => {
      ticking = false;
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const viewportH = window.innerHeight;
      const total = rect.height;
      const visibleTop = Math.min(Math.max(viewportH * 0.3 - rect.top, 0), total);
      const pct = Math.min(100, Math.max(0, (visibleTop / total) * 100));
      // Only re-render when it moves meaningfully — avoids a render per scroll event.
      setFillPercent((prev) => (Math.abs(prev - pct) > 0.5 ? pct : prev));
    };
    // Coalesce scroll events to at most one update per animation frame.
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(compute);
      }
    };
    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative">
      {/* Track */}
      <div className="absolute left-[18px] top-2 bottom-2 w-px bg-border" />
      {/* Animated fill */}
      <div
        className="absolute left-[18px] top-2 w-px bg-gradient-to-b from-primary to-accent"
        style={{ height: `${fillPercent}%`, transition: "height 0.1s linear" }}
      />

      {EXPERIENCES.map((item, i) => (
        <TimelineItem key={item.role + item.company} item={item} index={i} />
      ))}
    </div>
  );
}
