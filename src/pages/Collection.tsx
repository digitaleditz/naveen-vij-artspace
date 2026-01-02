import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, X, Heart } from "lucide-react";
import { useArtworks, Artwork } from "@/hooks/useArtworks";
import { useWishlist } from "@/hooks/useWishlist";
import { useAuth } from "@/contexts/AuthContext";
import artwork1 from "@/assets/artwork-1.jpg";
import artwork2 from "@/assets/artwork-2.jpg";
import artwork3 from "@/assets/artwork-3.jpg";
import paintingFeatured from "@/assets/painting-featured.jpg";

const collections = ["All", "Architecture Inspired", "Urban Stories", "Calm Interiors", "Abstract Emotions"];

// Fallback images for artworks
const getArtworkImage = (imageUrl: string | null, index: number) => {
  if (imageUrl) {
    const images: Record<string, string> = {
      "/artwork-1.jpg": artwork1,
      "/artwork-2.jpg": artwork2,
      "/artwork-3.jpg": artwork3,
      "/painting-featured.jpg": paintingFeatured,
    };
    return images[imageUrl] || artwork1;
  }
  const fallbacks = [artwork1, artwork2, artwork3, paintingFeatured];
  return fallbacks[index % fallbacks.length];
};

const Collection = () => {
  const [activeCollection, setActiveCollection] = useState("All");
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const { artworks, loading } = useArtworks();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();
  const navigate = useNavigate();

  const filteredArtworks = activeCollection === "All"
    ? artworks
    : artworks.filter((a) => a.collection === activeCollection);

  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-16 container-wide">
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.3em] text-accent font-sans mb-6">
            The Collection
          </p>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-6 leading-tight">
            Visual Studies &
            <span className="block text-accent">Architectural Emotions</span>
          </h1>
          <p className="text-lg text-muted-foreground font-sans leading-relaxed">
            Each painting is a narrative of space—an exploration of light, form, 
            and emotion that exists at the intersection of architecture and art. 
            These are not merely decorative objects; they are stories waiting to 
            find their home.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="pb-8 container-wide">
        <div className="flex flex-wrap gap-3">
          {collections.map((collection) => (
            <button
              key={collection}
              onClick={() => setActiveCollection(collection)}
              className={`px-4 py-2 text-xs uppercase tracking-widest font-sans transition-all duration-300 ${
                activeCollection === collection
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-stone"
              }`}
            >
              {collection}
            </button>
          ))}
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="section-padding pt-8">
        <div className="container-wide">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[3/4] bg-secondary mb-4" />
                  <div className="h-3 bg-secondary w-24 mb-2" />
                  <div className="h-5 bg-secondary w-48 mb-1" />
                  <div className="h-4 bg-secondary w-20" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArtworks.map((artwork, index) => (
                <div
                  key={artwork.id}
                  className="group cursor-pointer"
                  onClick={() => setSelectedArtwork(artwork)}
                >
                  <div className="aspect-[3/4] overflow-hidden image-reveal mb-4 bg-stone relative">
                    <img
                      src={getArtworkImage(artwork.image_url, index)}
                      alt={artwork.title}
                      className="w-full h-full object-cover"
                    />
                    {!artwork.available && (
                      <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1 text-xs uppercase tracking-wider font-sans">
                        Acquired
                      </div>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(artwork.id);
                      }}
                      className="absolute top-4 right-4 p-2 bg-background/90 hover:bg-background transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Heart
                        size={18}
                        className={isInWishlist(artwork.id) ? "fill-accent text-accent" : "text-foreground"}
                      />
                    </button>
                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-all duration-500 flex items-center justify-center">
                      <span className="text-primary-foreground text-xs uppercase tracking-widest font-sans opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        View Story
                      </span>
                    </div>
                  </div>
                  <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground font-sans mb-1">
                    {artwork.collection}
                  </p>
                  <h3 className="font-serif text-xl group-hover:text-accent transition-colors mb-1">
                    {artwork.title}
                  </h3>
                  <p className="text-sm font-sans text-accent">
                    ₹{artwork.price.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Artwork Modal */}
      {selectedArtwork && (
        <div
          className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedArtwork(null)}
        >
          <div
            className="bg-background max-w-5xl w-full max-h-[90vh] overflow-auto shadow-elevated"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="aspect-square lg:aspect-auto">
                <img
                  src={getArtworkImage(selectedArtwork.image_url, 0)}
                  alt={selectedArtwork.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-8 lg:p-12 relative">
                <button
                  onClick={() => setSelectedArtwork(null)}
                  className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X size={24} />
                </button>

                <p className="text-xs uppercase tracking-[0.2em] text-accent font-sans mb-4">
                  {selectedArtwork.collection}
                </p>
                <h3 className="font-serif text-3xl mb-6">{selectedArtwork.title}</h3>
                
                <div className="space-y-4 mb-8 pb-8 border-b border-border">
                  <div className="flex justify-between text-sm font-sans">
                    <span className="text-muted-foreground">Size</span>
                    <span>{selectedArtwork.size}</span>
                  </div>
                  <div className="flex justify-between text-sm font-sans">
                    <span className="text-muted-foreground">Medium</span>
                    <span>{selectedArtwork.medium}</span>
                  </div>
                  {selectedArtwork.mood && (
                    <div className="flex justify-between text-sm font-sans">
                      <span className="text-muted-foreground">Mood</span>
                      <span>{selectedArtwork.mood}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-sans">
                    <span className="text-muted-foreground">Status</span>
                    <span className={selectedArtwork.available ? "text-green-600" : "text-muted-foreground"}>
                      {selectedArtwork.available ? "Available" : "Acquired"}
                    </span>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-xs uppercase tracking-[0.2em] text-accent font-sans mb-3">
                    The Story Behind This Vision
                  </h4>
                  <p className="text-foreground/80 font-sans leading-relaxed text-sm">
                    {selectedArtwork.story}
                  </p>
                </div>

                {selectedArtwork.design_inspiration && (
                  <div className="mb-6 p-4 bg-cream border-l-2 border-accent">
                    <h4 className="text-xs uppercase tracking-[0.2em] text-accent font-sans mb-2">
                      Design Inspiration
                    </h4>
                    <p className="text-foreground/80 font-sans leading-relaxed text-sm italic">
                      {selectedArtwork.design_inspiration}
                    </p>
                  </div>
                )}

                {selectedArtwork.placement && (
                  <div className="mb-8 p-4 bg-secondary rounded">
                    <h4 className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-sans mb-2">
                      Where It Belongs
                    </h4>
                    <p className="text-muted-foreground font-sans leading-relaxed text-sm italic">
                      {selectedArtwork.placement}
                    </p>
                  </div>
                )}

                <div className="space-y-3">
                  {selectedArtwork.available && (
                    <>
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-serif text-2xl text-accent">
                          ₹{selectedArtwork.price.toLocaleString()}
                        </span>
                        <button
                          onClick={() => toggleWishlist(selectedArtwork.id)}
                          className="p-2 border border-border hover:border-accent transition-colors"
                        >
                          <Heart
                            size={20}
                            className={isInWishlist(selectedArtwork.id) ? "fill-accent text-accent" : "text-foreground"}
                          />
                        </button>
                      </div>
                      <Button variant="hero" size="lg" className="w-full" asChild>
                        <Link to={`/contact?artwork=${encodeURIComponent(selectedArtwork.title)}`}>
                          Acquire This Vision
                          <ArrowRight size={16} />
                        </Link>
                      </Button>
                      <p className="text-center text-xs text-muted-foreground font-sans">
                        Request this work through our concierge service
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Collection;
