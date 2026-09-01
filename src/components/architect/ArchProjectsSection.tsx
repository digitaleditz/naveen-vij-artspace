import { useState, useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useArchProjects, type ArchProject } from "@/hooks/useArchProjects";

export const ArchProjectsSection = () => {
  const { projects, loading } = useArchProjects();
  const [selectedProject, setSelectedProject] = useState<ArchProject | null>(null);
  const [slide, setSlide] = useState(0);

  const selectedIndex = selectedProject
    ? projects.findIndex((p) => p.id === selectedProject.id)
    : -1;

  const openLightbox = useCallback((project: ArchProject) => {
    setSlide(0);
    setSelectedProject(project);
  }, []);

  const closeLightbox = useCallback(() => {
    setSelectedProject(null);
    setSlide(0);
  }, []);

  const goTo = useCallback(
    (dir: -1 | 1) => {
      if (selectedIndex < 0) return;
      const next = (selectedIndex + dir + projects.length) % projects.length;
      setSlide(0);
      setSelectedProject(projects[next]);
    },
    [selectedIndex, projects]
  );

  const images = selectedProject?.images ?? [];

  const goSlide = useCallback(
    (dir: -1 | 1) => {
      if (images.length < 2) return;
      setSlide((s) => (s + dir + images.length) % images.length);
    },
    [images.length]
  );

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!selectedProject) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") images.length > 1 ? goSlide(-1) : goTo(-1);
      if (e.key === "ArrowRight") images.length > 1 ? goSlide(1) : goTo(1);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [closeLightbox, goTo, goSlide, images.length, selectedProject]);

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
                    src={project.images[0] ?? project.image_url}
                    alt={project.name}
                    loading="lazy"
                    decoding="async"
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

      {/* Full-page popup */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            className="fixed inset-0 z-[100]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="absolute inset-0 bg-background/90 backdrop-blur-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 sm:top-8 sm:right-10 z-30 p-2.5 rounded-full bg-background/50 backdrop-blur-sm border border-border/50 text-foreground/70 hover:text-foreground hover:bg-background/80 transition-all"
            >
              <X size={20} />
            </button>

            {projects.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); goTo(-1); }}
                  className="hidden lg:flex absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-background/50 backdrop-blur-sm border border-border/50 text-foreground/70 hover:text-foreground hover:bg-background/80 transition-all"
                >
                  <ChevronLeft size={22} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); goTo(1); }}
                  className="hidden lg:flex absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-background/50 backdrop-blur-sm border border-border/50 text-foreground/70 hover:text-foreground hover:bg-background/80 transition-all"
                >
                  <ChevronRight size={22} />
                </button>
              </>
            )}

            {/* Full-page content with generous padding */}
            <motion.div
              className="relative z-20 h-full w-full overflow-y-auto"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 30, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="min-h-full flex items-center justify-center px-6 py-10 sm:px-10 sm:py-12 lg:px-16 lg:py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 w-full max-w-6xl">
              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Left: image slider */}
                <div className="relative bg-secondary/40">
                  <div className="relative aspect-[4/3] md:aspect-auto md:h-full md:min-h-[420px] overflow-hidden">
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={`${selectedProject.id}-${slide}`}
                        src={images[slide]}
                        alt={`${selectedProject.name} — image ${slide + 1}`}
                        className="absolute inset-0 w-full h-full object-cover"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.35 }}
                      />
                    </AnimatePresence>

                    {images.length > 1 && (
                      <>
                        <button
                          onClick={() => goSlide(-1)}
                          className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/60 backdrop-blur-sm border border-border/50 text-foreground/80 hover:bg-background/90 transition-all"
                          aria-label="Previous image"
                        >
                          <ChevronLeft size={16} />
                        </button>
                        <button
                          onClick={() => goSlide(1)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/60 backdrop-blur-sm border border-border/50 text-foreground/80 hover:bg-background/90 transition-all"
                          aria-label="Next image"
                        >
                          <ChevronRight size={16} />
                        </button>
                        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
                          {images.map((_, i) => (
                            <button
                              key={i}
                              onClick={() => setSlide(i)}
                              aria-label={`Go to image ${i + 1}`}
                              className={`h-1.5 rounded-full transition-all ${
                                i === slide ? "w-5 bg-accent" : "w-1.5 bg-foreground/30"
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Right: details */}
                <div className="p-6 sm:p-10 flex flex-col justify-center">
                  <p className="text-[10px] uppercase tracking-[0.4em] text-accent font-sans mb-3">
                    Architectural Project
                  </p>
                  <h3 className="font-serif text-2xl sm:text-3xl tracking-wide text-foreground">
                    {selectedProject.name}
                  </h3>
                  <div className="w-12 h-px bg-accent/50 my-5" />
                  {selectedProject.description ? (
                    <p className="text-sm sm:text-base leading-relaxed text-muted-foreground whitespace-pre-line">
                      {selectedProject.description}
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground/70 italic">
                      Details coming soon.
                    </p>
                  )}
                  {images.length > 1 && (
                    <p className="mt-6 text-[10px] uppercase tracking-[0.3em] text-muted-foreground/70">
                      {slide + 1} / {images.length}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
