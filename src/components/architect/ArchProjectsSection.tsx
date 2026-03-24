import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface ArchProject {
  id: string;
  name: string;
  image_url: string;
  display_order: number;
}

export const ArchProjectsSection = () => {
  const [projects, setProjects] = useState<ArchProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<ArchProject | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      const { data } = await supabase
        .from("architectural_projects" as any)
        .select("*")
        .order("display_order", { ascending: true });

      if (data) setProjects(data as any);
      setLoading(false);
    };
    fetchProjects();
  }, []);

  const selectedIndex = selectedProject
    ? projects.findIndex((p) => p.id === selectedProject.id)
    : -1;

  const openLightbox = useCallback((project: ArchProject) => {
    setImageLoaded(false);
    setSelectedProject(project);
  }, []);

  const closeLightbox = useCallback(() => {
    setSelectedProject(null);
    setImageLoaded(false);
  }, []);

  const goTo = useCallback(
    (dir: -1 | 1) => {
      if (selectedIndex < 0) return;
      const next = (selectedIndex + dir + projects.length) % projects.length;
      setImageLoaded(false);
      setSelectedProject(projects[next]);
    },
    [selectedIndex, projects]
  );

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") goTo(-1);
      if (e.key === "ArrowRight") goTo(1);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [closeLightbox, goTo]);

  if (loading) return null;
  if (projects.length === 0) return null;

  return (
    <>
      <section className="section-padding bg-secondary/50">
        <div className="container-wide">
          <div className="text-center mb-12 sm:mb-20">
            <p className="text-[10px] uppercase tracking-[0.4em] text-accent font-sans mb-4">
              Built Spaces
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
              Architectural Projects
            </h2>
            <div className="section-divider mt-8" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {projects.map((project) => (
              <div
                key={project.id}
                className="group cursor-pointer"
                onClick={() => openLightbox(project)}
              >
                <div className="aspect-[4/3] overflow-hidden mb-4">
                  <img
                    src={project.image_url}
                    alt={project.name}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </div>
                <h3 className="font-serif text-lg text-center tracking-wide">
                  {project.name}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Blurred backdrop — clicking closes */}
            <motion.div
              className="absolute inset-0 bg-background/80 backdrop-blur-xl cursor-pointer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeLightbox}
            />

            {/* Close button */}
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 z-10 p-2 rounded-full bg-background/50 backdrop-blur-sm border border-border/50 text-foreground/70 hover:text-foreground hover:bg-background/80 transition-all"
            >
              <X size={20} />
            </button>

            {/* Prev / Next arrows */}
            {projects.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); goTo(-1); }}
                  className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-10 p-2.5 rounded-full bg-background/50 backdrop-blur-sm border border-border/50 text-foreground/70 hover:text-foreground hover:bg-background/80 transition-all"
                >
                  <ChevronLeft size={22} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); goTo(1); }}
                  className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-10 p-2.5 rounded-full bg-background/50 backdrop-blur-sm border border-border/50 text-foreground/70 hover:text-foreground hover:bg-background/80 transition-all"
                >
                  <ChevronRight size={22} />
                </button>
              </>
            )}

            {/* Content */}
            <motion.div
              className="relative z-10 max-w-5xl w-full max-h-[85vh] flex flex-col items-center"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Loader */}
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
                </div>
              )}

              <img
                src={selectedProject.image_url}
                alt={selectedProject.name}
                className={`max-h-[75vh] w-auto max-w-full object-contain rounded-sm transition-opacity duration-500 ${
                  imageLoaded ? "opacity-100" : "opacity-0"
                }`}
                onLoad={() => {
                  setTimeout(() => setImageLoaded(true), 500);
                }}
              />

              <motion.h3
                className={`font-serif text-xl md:text-2xl mt-6 text-center tracking-wide text-foreground transition-opacity duration-500 ${
                  imageLoaded ? "opacity-100" : "opacity-0"
                }`}
              >
                {selectedProject.name}
              </motion.h3>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
