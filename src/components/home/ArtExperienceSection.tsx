import { useState, useRef, useEffect } from "react";
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
  // If no URL or relative path that won't work, use default images
  if (!imageUrl || imageUrl.startsWith("/")) {
    return defaultImages[index % defaultImages.length];
  }
  return imageUrl;
};

export const ArtExperienceSection = () => {
  const { artworks, loading } = useArtworks();
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);

  const displayArtworks = artworks?.slice(0, 6) || [];

  const goToNext = () => {
    if (currentIndex < displayArtworks.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goToPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Handle horizontal scroll on vertical scroll
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting && entry.intersectionRatio > 0.5);
      },
      { threshold: [0, 0.5, 1] }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isInView) return;

    let accumulatedDelta = 0;
    const threshold = 100;

    const handleWheel = (e: WheelEvent) => {
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const isFullyVisible = rect.top <= 100 && rect.bottom >= window.innerHeight - 100;

      if (isFullyVisible) {
        accumulatedDelta += e.deltaY;

        if (Math.abs(accumulatedDelta) > threshold) {
          if (accumulatedDelta > 0 && currentIndex < displayArtworks.length - 1) {
            e.preventDefault();
            setCurrentIndex(prev => Math.min(prev + 1, displayArtworks.length - 1));
            accumulatedDelta = 0;
          } else if (accumulatedDelta < 0 && currentIndex > 0) {
            e.preventDefault();
            setCurrentIndex(prev => Math.max(prev - 1, 0));
            accumulatedDelta = 0;
          }
        }
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [isInView, currentIndex, displayArtworks.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isInView) return;
      if (e.key === "ArrowRight") goToNext();
      if (e.key === "ArrowLeft") goToPrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isInView, currentIndex, displayArtworks.length]);

  if (loading || displayArtworks.length === 0) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-secondary/30">
        <div className="animate-pulse text-muted-foreground">Loading artworks...</div>
      </section>
    );
  }

  const currentArtwork = displayArtworks[currentIndex];

  return (
    <section 
      ref={sectionRef}
      className="min-h-screen bg-background relative overflow-hidden"
    >
      {/* Progress indicator */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
        {displayArtworks.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-1 rounded-full transition-all duration-500 ${
              index === currentIndex 
                ? "w-8 bg-accent" 
                : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
            }`}
          />
        ))}
      </div>

      {/* Main content */}
      <div 
        ref={containerRef}
        className="h-screen flex items-center"
      >
        <div className="container-wide grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center py-20">
          {/* Left side - Content */}
          <div 
            key={currentArtwork.id}
            className="order-2 lg:order-1 animate-fade-in"
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

            {/* Video thumbnail placeholder */}
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

          {/* Right side - Artwork Image */}
          <div 
            key={`image-${currentArtwork.id}`}
            className="order-1 lg:order-2 relative animate-fade-in"
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

      {/* Navigation arrows */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-6 z-20">
        <button
          onClick={goToPrev}
          disabled={currentIndex === 0}
          className="w-12 h-12 rounded-full border border-border flex items-center justify-center hover:border-accent hover:text-accent transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ArrowLeft size={18} />
        </button>
        <span className="text-sm font-sans text-muted-foreground">
          {currentIndex + 1} / {displayArtworks.length}
        </span>
        <button
          onClick={goToNext}
          disabled={currentIndex === displayArtworks.length - 1}
          className="w-12 h-12 rounded-full border border-border flex items-center justify-center hover:border-accent hover:text-accent transition-all disabled:opacity-30 disabled:cursor-not-allowed"
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
