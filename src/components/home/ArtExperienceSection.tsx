import { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useArtworks } from "@/hooks/useArtworks";
import { Skeleton } from "@/components/ui/skeleton";
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
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const animationRef = useRef<number>();
  const scrollPos = useRef(0);
  const speed = 0.6; // px per frame

  const displayArtworks = artworks?.slice(0, 6) || [];

  // Duplicate for seamless loop
  const loopArtworks = [...displayArtworks, ...displayArtworks];

  useEffect(() => {
    const container = scrollRef.current;
    if (!container || displayArtworks.length === 0) return;

    const animate = () => {
      if (!isPaused && container) {
        scrollPos.current += speed;
        // Reset when we've scrolled past the first set
        const halfWidth = container.scrollWidth / 2;
        if (scrollPos.current >= halfWidth) {
          scrollPos.current = 0;
        }
        container.style.transform = `translateX(-${scrollPos.current}px)`;
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPaused, displayArtworks.length]);

  if (loading) {
    return (
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container-wide space-y-8">
          <Skeleton className="h-8 w-48" />
          <div className="flex gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="aspect-[3/4] w-72 shrink-0 rounded-lg" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (displayArtworks.length === 0) {
    return (
      <section className="py-20 flex items-center justify-center bg-secondary/30">
        <div className="text-muted-foreground">No artworks available</div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-20 bg-background relative overflow-hidden select-none">
      {/* Section header */}
      <div className="container-wide mb-8 md:mb-12">
        <p className="text-[10px] uppercase tracking-[0.4em] text-accent font-sans mb-3">
          Curated Collection
        </p>
        <div className="section-divider mt-1 mx-0 mb-4" />
        <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl">
          Experience the Art
        </h2>
      </div>

      {/* Infinite scroll marquee */}
      <div
        className="overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div ref={scrollRef} className="flex gap-8 md:gap-12 will-change-transform">
          {loopArtworks.map((artwork, index) => (
            <div
              key={`${artwork.id}-${index}`}
              className="shrink-0 w-[75vw] sm:w-[50vw] md:w-[35vw] lg:w-[28vw] xl:w-[22vw]"
            >
              <Link to={`/artwork/${artwork.id}`} className="group block">
                {/* Image */}
                <div className="aspect-[3/4] overflow-hidden rounded-sm mb-4 relative">
                  <img
                    src={getArtworkImage(artwork.image_url, index % displayArtworks.length)}
                    alt={artwork.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    draggable={false}
                  />
                  <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors duration-500" />
                </div>

                {/* Info */}
                <div className="space-y-1.5">
                  <p className="text-[9px] uppercase tracking-[0.3em] text-accent font-sans">
                    {artwork.collection}
                  </p>
                  <h3 className="font-serif text-lg md:text-xl group-hover:text-accent transition-colors duration-300 leading-snug">
                    {artwork.title}
                  </h3>
                  <div className="flex items-center justify-between pt-2">
                    <p className="text-accent font-serif text-lg">
                      ₹{artwork.price.toLocaleString("en-IN")}
                    </p>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground group-hover:text-accent transition-colors flex items-center gap-1.5">
                      View <ArrowRight size={10} />
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* View all link */}
      <div className="container-wide mt-8 md:mt-10 flex justify-center md:justify-end">
        <Button variant="ghost" asChild className="group">
          <Link
            to="/collection"
            className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground hover:text-accent font-sans flex items-center gap-2"
          >
            View Full Collection
            <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </div>
    </section>
  );
};
