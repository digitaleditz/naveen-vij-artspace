import { Link } from "react-router-dom";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
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

  const displayArtworks = artworks?.slice(0, 6) || [];

  if (loading) {
    return (
      <section className="section-padding bg-secondary/30">
        <div className="container-wide flex items-center justify-center min-h-[50vh]">
          <div className="animate-pulse text-muted-foreground">Loading artworks...</div>
        </div>
      </section>
    );
  }

  if (displayArtworks.length === 0) {
    return (
      <section className="section-padding bg-secondary/30">
        <div className="container-wide flex items-center justify-center min-h-[50vh]">
          <div className="text-muted-foreground">No artworks available</div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-background">
      {/* Section Header */}
      <div className="container-wide pt-24 pb-12 text-center">
        <p className="text-[10px] uppercase tracking-[0.4em] text-accent font-sans mb-4">
          The Collection
        </p>
        <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-6">
          Experience the Art
        </h2>
        <div className="section-divider" />
      </div>

      {/* Artworks Grid */}
      <div className="container-wide pb-24 space-y-24 md:space-y-32">
        {displayArtworks.map((artwork, index) => (
          <div
            key={artwork.id}
            className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center ${
              index % 2 === 1 ? "lg:direction-rtl" : ""
            }`}
          >
            {/* Content */}
            <div className={`${index % 2 === 1 ? "lg:order-2" : "lg:order-1"}`}>
              <div className="inline-block mb-6">
                <p className="text-[10px] uppercase tracking-[0.4em] text-accent font-sans">
                  {artwork.collection}
                </p>
                <div className="section-divider mt-3 mx-0" />
              </div>

              <h3 className="font-serif text-3xl md:text-4xl lg:text-5xl mb-6 leading-tight">
                {artwork.title}
              </h3>

              <p className="text-muted-foreground font-sans leading-relaxed text-base md:text-lg mb-8 max-w-lg font-light italic">
                "{artwork.story.slice(0, 150)}..."
              </p>

              {/* Video thumbnail */}
              <div className="mb-8 group cursor-pointer">
                <div className="flex items-center gap-4 text-muted-foreground hover:text-foreground transition-colors">
                  <div className="w-12 h-12 rounded-full border border-accent/30 flex items-center justify-center group-hover:border-accent group-hover:bg-accent/10 transition-all">
                    <Play size={16} className="text-accent ml-0.5" />
                  </div>
                  <div>
                    <p className="text-sm font-sans font-medium">Watch the Story</p>
                    <p className="text-xs text-muted-foreground/70">2 min video</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <Button variant="hero" size="lg" asChild>
                  <Link to={`/artwork/${artwork.id}`}>
                    Acquire This Piece
                    <ArrowRight size={16} />
                  </Link>
                </Button>
                <p className="text-accent font-serif text-2xl">
                  ₹{artwork.price.toLocaleString("en-IN")}
                </p>
              </div>
            </div>

            {/* Image */}
            <div className={`relative ${index % 2 === 1 ? "lg:order-1" : "lg:order-2"}`}>
              <div className="aspect-[3/4] overflow-hidden image-reveal">
                <img
                  src={getArtworkImage(artwork.image_url, index)}
                  alt={artwork.title}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Decorative frame */}
              <div className="absolute -bottom-4 -right-4 w-full h-full border border-accent/20 -z-10 hidden lg:block" />
            </div>
          </div>
        ))}
      </div>

      {/* View All CTA */}
      <div className="container-wide pb-24 text-center">
        <Link
          to="/collection"
          className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-muted-foreground hover:text-accent transition-colors font-sans"
        >
          View Full Collection
          <ArrowRight size={14} />
        </Link>
      </div>
    </section>
  );
};
