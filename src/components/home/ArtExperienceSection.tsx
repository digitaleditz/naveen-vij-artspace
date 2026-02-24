import { useState, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { useArtworks } from "@/hooks/useArtworks";
import { Skeleton } from "@/components/ui/skeleton";
import useEmblaCarousel from "embla-carousel-react";
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
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: false,
    dragFree: false,
    containScroll: "trimSnaps",
  });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  const displayArtworks = artworks?.slice(0, 6) || [];

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
    <section className="py-12 md:py-20 bg-background relative overflow-hidden">
      {/* Section header */}
      <div className="container-wide mb-8 md:mb-12 flex items-end justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.4em] text-accent font-sans mb-3">
            Curated Collection
          </p>
          <div className="section-divider mt-1 mx-0 mb-4" />
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl">
            Experience the Art
          </h2>
        </div>
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:border-accent hover:text-accent transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Previous"
          >
            <ArrowLeft size={16} />
          </button>
          <button
            onClick={scrollNext}
            disabled={!canScrollNext}
            className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:border-accent hover:text-accent transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Next"
          >
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Carousel */}
      <div className="container-wide">
        <div ref={emblaRef} className="overflow-hidden cursor-grab active:cursor-grabbing">
          <div className="flex gap-4 md:gap-6">
            {displayArtworks.map((artwork, index) => (
              <div
                key={artwork.id}
                className="min-w-0 shrink-0 basis-[80%] sm:basis-[55%] md:basis-[40%] lg:basis-[30%]"
              >
                <Link to={`/artwork/${artwork.id}`} className="group block">
                  {/* Image */}
                  <div className="aspect-[3/4] overflow-hidden rounded-sm mb-4 relative">
                    <img
                      src={getArtworkImage(artwork.image_url, index)}
                      alt={artwork.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {/* Hover overlay */}
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
                    <p className="text-muted-foreground text-sm font-light italic line-clamp-2 leading-relaxed">
                      "{artwork.story.slice(0, 80)}..."
                    </p>
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
      </div>

      {/* Progress dots */}
      <div className="flex justify-center gap-2 mt-8 md:mt-12">
        {displayArtworks.map((_, index) => (
          <button
            key={index}
            onClick={() => emblaApi?.scrollTo(index)}
            className={`h-1 rounded-full transition-all duration-500 ${
              index === selectedIndex
                ? "w-8 bg-accent"
                : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
            }`}
            aria-label={`Go to artwork ${index + 1}`}
          />
        ))}
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

      {/* Mobile nav arrows */}
      <div className="flex md:hidden justify-center gap-4 mt-4">
        <button
          onClick={scrollPrev}
          disabled={!canScrollPrev}
          className="w-10 h-10 rounded-full border border-border flex items-center justify-center disabled:opacity-30"
          aria-label="Previous"
        >
          <ArrowLeft size={16} />
        </button>
        <button
          onClick={scrollNext}
          disabled={!canScrollNext}
          className="w-10 h-10 rounded-full border border-border flex items-center justify-center disabled:opacity-30"
          aria-label="Next"
        >
          <ArrowRight size={16} />
        </button>
      </div>
    </section>
  );
};
