import { useState, useRef, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Play } from "lucide-react";
import { useArtworks } from "@/hooks/useArtworks";
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [hasReachedEnd, setHasReachedEnd] = useState(false);
  const [hasReachedStart, setHasReachedStart] = useState(true);
  const scrollCooldown = useRef(false);
  const accumulatedDelta = useRef(0);

  const displayArtworks = artworks?.slice(0, 6) || [];
  const totalArtworks = displayArtworks.length;

  const goToNext = useCallback(() => {
    if (scrollCooldown.current) return false;
    if (currentIndex < totalArtworks - 1) {
      scrollCooldown.current = true;
      setCurrentIndex(prev => prev + 1);
      setHasReachedStart(false);
      setHasReachedEnd(false);
      setTimeout(() => { scrollCooldown.current = false; }, 500);
      return true;
    }
    setHasReachedEnd(true);
    return false;
  }, [currentIndex, totalArtworks]);

  const goToPrev = useCallback(() => {
    if (scrollCooldown.current) return false;
    if (currentIndex > 0) {
      scrollCooldown.current = true;
      setCurrentIndex(prev => prev - 1);
      setHasReachedStart(false);
      setHasReachedEnd(false);
      setTimeout(() => { scrollCooldown.current = false; }, 500);
      return true;
    }
    setHasReachedStart(true);
    return false;
  }, [currentIndex]);

  // Intersection observer to detect when section should be active
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Activate when section is mostly visible
        const shouldBeActive = entry.isIntersecting && entry.intersectionRatio > 0.6;
        setIsActive(shouldBeActive);
        
        if (!shouldBeActive) {
          accumulatedDelta.current = 0;
        }
      },
      { threshold: [0, 0.3, 0.6, 0.9, 1] }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  // Handle wheel events
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const section = sectionRef.current;
      if (!section || totalArtworks === 0) return;

      const rect = section.getBoundingClientRect();
      // Check if section is properly centered in viewport
      const isCentered = rect.top <= 100 && rect.bottom >= window.innerHeight - 100;

      if (!isCentered || !isActive) return;

      // Allow exit if at boundaries and trying to scroll past
      if (e.deltaY < 0 && hasReachedStart && currentIndex === 0) {
        return; // Allow scroll up to exit
      }
      if (e.deltaY > 0 && hasReachedEnd && currentIndex === totalArtworks - 1) {
        return; // Allow scroll down to exit
      }

      // Accumulate scroll delta for smooth threshold
      accumulatedDelta.current += e.deltaY;

      const threshold = 80;
      
      if (Math.abs(accumulatedDelta.current) > threshold) {
        e.preventDefault();
        
        if (accumulatedDelta.current > 0) {
          const moved = goToNext();
          if (!moved && currentIndex === totalArtworks - 1) {
            // At end, need to scroll twice to exit
            if (hasReachedEnd) {
              accumulatedDelta.current = 0;
              return; // Let browser handle scroll
            }
          }
        } else {
          const moved = goToPrev();
          if (!moved && currentIndex === 0) {
            // At start, need to scroll twice to exit
            if (hasReachedStart) {
              accumulatedDelta.current = 0;
              return; // Let browser handle scroll
            }
          }
        }
        
        accumulatedDelta.current = 0;
      } else {
        // Still accumulating, prevent default scroll
        e.preventDefault();
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [isActive, goToNext, goToPrev, hasReachedStart, hasReachedEnd, currentIndex, totalArtworks]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isActive) return;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        goToNext();
      }
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        goToPrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isActive, goToNext, goToPrev]);

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

  const currentArtwork = displayArtworks[currentIndex];

  return (
    <section 
      ref={sectionRef}
      className="h-screen bg-background relative overflow-hidden"
    >
      {/* Progress indicator */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
        {displayArtworks.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentIndex(index);
              setHasReachedStart(index === 0);
              setHasReachedEnd(index === totalArtworks - 1);
            }}
            className={`h-1 rounded-full transition-all duration-500 ${
              index === currentIndex 
                ? "w-8 bg-accent" 
                : index < currentIndex 
                  ? "w-3 bg-accent/50"
                  : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
            }`}
            aria-label={`Go to artwork ${index + 1}`}
          />
        ))}
      </div>

      {/* Scroll hint */}
      {currentIndex === 0 && isActive && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20">
          <p className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground/60 font-sans animate-pulse">
            Scroll to explore
          </p>
        </div>
      )}

      {/* Main content with transition */}
      <div className="h-full flex items-center">
        <div className="container-wide grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center py-20">
          {/* Left side - Content */}
          <div className="order-2 lg:order-1">
            <div 
              key={currentArtwork.id}
              className="animate-fade-in"
            >
              <div className="inline-block mb-6">
                <p className="text-[10px] uppercase tracking-[0.4em] text-accent font-sans">
                  {currentArtwork.collection}
                </p>
                <div className="section-divider mt-3 mx-0" />
              </div>

              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-8 leading-tight">
                {currentArtwork.title}
              </h2>

              <p className="text-muted-foreground font-sans leading-relaxed text-lg mb-10 max-w-lg font-light italic">
                "{currentArtwork.story.slice(0, 150)}..."
              </p>

              {/* Video thumbnail */}
              <div className="mb-10 group cursor-pointer">
                <div className="flex items-center gap-4 text-muted-foreground hover:text-foreground transition-colors">
                  <div className="w-14 h-14 rounded-full border border-accent/30 flex items-center justify-center group-hover:border-accent group-hover:bg-accent/10 transition-all">
                    <Play size={18} className="text-accent ml-0.5" />
                  </div>
                  <div>
                    <p className="text-sm font-sans font-medium">Watch the Story</p>
                    <p className="text-xs text-muted-foreground/70">2 min video</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="hero" size="lg" asChild>
                  <Link to={`/artwork/${currentArtwork.id}`}>
                    Acquire This Piece
                    <ArrowRight size={16} />
                  </Link>
                </Button>
                <p className="text-accent font-serif text-2xl self-center">
                  ₹{currentArtwork.price.toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          </div>

          {/* Right side - Artwork Image */}
          <div className="order-1 lg:order-2 relative">
            <div 
              key={`image-${currentArtwork.id}`}
              className="animate-fade-in"
            >
              <div className="aspect-[3/4] overflow-hidden image-reveal">
                <img
                  src={getArtworkImage(currentArtwork.image_url, currentIndex)}
                  alt={currentArtwork.title}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Decorative frame */}
              <div className="absolute -bottom-4 -right-4 w-full h-full border border-accent/20 -z-10 hidden lg:block" />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation arrows */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-6 z-20">
        <button
          onClick={() => goToPrev()}
          disabled={currentIndex === 0}
          className="w-12 h-12 rounded-full border border-border flex items-center justify-center hover:border-accent hover:text-accent transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Previous artwork"
        >
          <ArrowLeft size={18} />
        </button>
        <span className="text-sm font-sans text-muted-foreground tabular-nums">
          {currentIndex + 1} / {totalArtworks}
        </span>
        <button
          onClick={() => goToNext()}
          disabled={currentIndex === totalArtworks - 1}
          className="w-12 h-12 rounded-full border border-border flex items-center justify-center hover:border-accent hover:text-accent transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Next artwork"
        >
          <ArrowRight size={18} />
        </button>
      </div>

      {/* Exit hint when at the end */}
      {currentIndex === totalArtworks - 1 && hasReachedEnd && (
        <div className="absolute bottom-28 left-1/2 -translate-x-1/2 z-20">
          <p className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground/60 font-sans animate-fade-in">
            Scroll again to continue
          </p>
        </div>
      )}

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
