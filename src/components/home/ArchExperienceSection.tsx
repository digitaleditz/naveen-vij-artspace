import { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useArchProjects } from "@/hooks/useArchProjects";

export const ArchExperienceSection = () => {
  const { projects, loading } = useArchProjects();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const animationRef = useRef<number>();
  const scrollPos = useRef(0);
  const speed = 0.6;

  const displayProjects = projects.slice(0, 6);
  const loopProjects = [...displayProjects, ...displayProjects];

  useEffect(() => {
    const container = scrollRef.current;
    if (!container || displayProjects.length === 0) return;

    const animate = () => {
      if (!isPaused && container) {
        scrollPos.current += speed;
        const halfWidth = container.scrollWidth / 2;
        if (scrollPos.current >= halfWidth) scrollPos.current = 0;
        container.style.transform = `translateX(-${scrollPos.current}px)`;
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPaused, displayProjects.length]);

  if (loading) {
    return (
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container-wide space-y-8">
          <Skeleton className="h-8 w-48" />
          <div className="flex gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="aspect-[4/3] w-72 shrink-0 rounded-sm" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (displayProjects.length === 0) return null;

  return (
    <section className="py-12 md:py-20 bg-secondary/40 relative overflow-hidden select-none">
      <div className="container-wide mb-8 md:mb-12">
        <p className="text-[10px] uppercase tracking-[0.4em] text-accent font-sans mb-3">
          Built Spaces
        </p>
        <div className="section-divider mt-1 mx-0 mb-4" />
        <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl">
          Architectural Projects
        </h2>
      </div>

      <div
        className="overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div ref={scrollRef} className="flex gap-8 md:gap-12 will-change-transform">
          {loopProjects.map((project, index) => (
            <div
              key={`${project.id}-${index}`}
              className="shrink-0 w-[75vw] sm:w-[50vw] md:w-[35vw] lg:w-[28vw] xl:w-[22vw]"
            >
              <Link to="/the-architect" className="group block">
                <div className="aspect-[4/3] overflow-hidden rounded-sm mb-4 relative">
                  <img
                    src={project.image_url}
                    alt={project.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors duration-500" />
                </div>
                <h3 className="font-serif text-lg md:text-xl group-hover:text-accent transition-colors duration-300 leading-snug">
                  {project.name}
                </h3>
              </Link>
            </div>
          ))}
        </div>
      </div>

      <div className="container-wide mt-8 md:mt-10 flex justify-center md:justify-end">
        <Button variant="ghost" asChild className="group">
          <Link
            to="/the-architect"
            className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground hover:text-accent font-sans flex items-center gap-2"
          >
            View All Projects
            <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </div>
    </section>
  );
};
