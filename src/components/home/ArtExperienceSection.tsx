import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { useArtworks } from "@/hooks/useArtworks";
import { useIsMobile } from "@/hooks/use-mobile";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { useArtExperienceNavigation } from "@/components/home/art-experience/useArtExperienceNavigation";
import { ArtExperienceSlide } from "@/components/home/art-experience/ArtExperienceSlide";
import artwork1 from "@/assets/artwork-1.jpg";
import artwork2 from "@/assets/artwork-2.jpg";
import artwork3 from "@/assets/artwork-3.jpg";
import paintingFeatured from "@/assets/painting-featured.jpg";

const defaultImages = [artwork1, artwork2, artwork3, paintingFeatured];

const getArtworkImage = (imageUrl: string | null, index: number): string => {
  if (!imageUrl || imageUrl.startsWith("/")) {
    return defaultImages[index % defaultImages.length];
  }
  return imageUrl;
};

export const ArtExperienceSection = () => {
  const { artworks, loading } = useArtworks();
  const sectionRef = useRef<HTMLElement>(null);
  const isMobile = useIsMobile();

  const [isActive, setIsActive] = useState(false);
  const lockTimerRef = useRef<number | null>(null);
  const hasSnappedRef = useRef(false);

  const displayArtworks = artworks?.slice(0, 6) || [];
  const totalArtworks = displayArtworks.length;

  const reducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
  }, []);

  const scrollToSiblingSection = useCallback(
    (direction: "next" | "prev") => {
      const wrapper = sectionRef.current?.parentElement;
      const target =
        direction === "next" ? wrapper?.nextElementSibling : wrapper?.previousElementSibling;
      if (!target) return;
      target.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
    },
    [reducedMotion]
  );

  const exitToNextSection = useCallback(() => {
    setIsActive(false);
    window.setTimeout(() => scrollToSiblingSection("next"), 50);
  }, [scrollToSiblingSection]);

  const exitToPrevSection = useCallback(() => {
    setIsActive(false);
    window.setTimeout(() => scrollToSiblingSection("prev"), 50);
  }, [scrollToSiblingSection]);

  const nav = useArtExperienceNavigation({
    enabled: isActive,
    total: totalArtworks,
    onExitNext: exitToNextSection,
    onExitPrev: exitToPrevSection,
    threshold: isMobile ? 45 : 60,
  });

  useBodyScrollLock(isActive);

  const goToNext = useCallback(() => {
    nav.goToNext();
  }, [nav]);

  const goToPrev = useCallback(() => {
    nav.goToPrev();
  }, [nav]);

  // Snap + activate when the section is entering view.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const entering = entry.isIntersecting && entry.intersectionRatio > 0.2;

        if (!entering) {
          hasSnappedRef.current = false;
          if (lockTimerRef.current) window.clearTimeout(lockTimerRef.current);
          lockTimerRef.current = null;
          setIsActive(false);
          return;
        }

        if (!hasSnappedRef.current) {
          hasSnappedRef.current = true;
          section.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });

          if (lockTimerRef.current) window.clearTimeout(lockTimerRef.current);
          lockTimerRef.current = window.setTimeout(() => {
            setIsActive(true);
          }, reducedMotion ? 0 : 350);
        }
      },
      { threshold: [0, 0.2, 0.35, 0.5, 0.75, 1] }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [reducedMotion]);

  // Bind wheel/touch/key handlers to the section element.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    return nav.bindToElement(el);
  }, [nav]);

  if (loading) {
    return (
      <section className="h-screen flex items-center justify-center bg-secondary/30">
        <div className="animate-pulse text-muted-foreground">Loading artworks...</div>
      </section>
    );
  }

  if (displayArtworks.length === 0) {
    return (
      <section className="h-screen flex items-center justify-center bg-secondary/30">
        <div className="text-muted-foreground">No artworks available</div>
      </section>
    );
  }

  const storyMaxChars = isMobile ? 110 : 150;

  return (
    <section 
      ref={sectionRef}
      className="h-[100svh] min-h-[100svh] bg-background relative overflow-hidden overscroll-contain touch-none"
    >
      {/* Progress indicator */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
        {displayArtworks.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              nav.setIndex(index);
            }}
            className={`h-1 rounded-full transition-all duration-500 ${
              index === nav.index 
                ? "w-8 bg-accent" 
                : index < nav.index 
                  ? "w-3 bg-accent/50"
                  : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
            }`}
            aria-label={`Go to artwork ${index + 1}`}
          />
        ))}
      </div>

      {/* Scroll hint */}
      {nav.index === 0 && isActive && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20">
          <p className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground/60 font-sans animate-pulse">
            Scroll to explore
          </p>
        </div>
      )}

      {/* Main content with transition */}
      <div className="h-full overflow-hidden">
        <div
          className="flex h-full transition-transform duration-700 ease-out"
          style={{ transform: `translate3d(-${nav.index * 100}%, 0, 0)` }}
        >
          {displayArtworks.map((artwork, i) => (
            <ArtExperienceSlide
              key={artwork.id}
              artwork={artwork}
              imageSrc={getArtworkImage(artwork.image_url, i)}
              isActive={i === nav.index}
              storyMaxChars={storyMaxChars}
            />
          ))}
        </div>
      </div>

      {/* Navigation arrows */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-6 z-20">
        <button
          onClick={() => goToPrev()}
          disabled={nav.index === 0}
          className="w-12 h-12 rounded-full border border-border flex items-center justify-center hover:border-accent hover:text-accent transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Previous artwork"
        >
          <ArrowLeft size={18} />
        </button>
        <span className="text-sm font-sans text-muted-foreground tabular-nums">
          {nav.index + 1} / {totalArtworks}
        </span>
        <button
          onClick={() => goToNext()}
          disabled={nav.index === totalArtworks - 1}
          className="w-12 h-12 rounded-full border border-border flex items-center justify-center hover:border-accent hover:text-accent transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Next artwork"
        >
          <ArrowRight size={18} />
        </button>
      </div>

      {/* View all link */}
      <div className="absolute bottom-12 right-8 z-20 hidden lg:block">
        <Link 
          to="/collection"
          className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground hover:text-accent transition-colors font-sans flex items-center gap-2"
        >
          View Full Collection
          <ArrowRight size={12} />
        </Link>
      </div>
    </section>
  );
};
