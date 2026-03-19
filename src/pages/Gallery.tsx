import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, X } from "lucide-react";
import { useArtworks } from "@/hooks/useArtworks";
import { getArtworkImage } from "@/lib/artwork-utils";
import { Skeleton } from "@/components/ui/skeleton";

const collections = ["All", "Architecture Inspired", "Urban Stories", "Calm Interiors", "Abstract Emotions"];

const Gallery = () => {
  const [activeCollection, setActiveCollection] = useState("All");
  const { artworks, loading } = useArtworks();
  const [selectedArtwork, setSelectedArtwork] = useState<typeof artworks[0] | null>(null);

  const filteredArtworks = activeCollection === "All"
    ? artworks
    : artworks.filter((a) => a.collection === activeCollection);

  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-16 container-wide">
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.3em] text-accent font-sans mb-6">
            Art Collection
          </p>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-6 leading-tight">
            Original Paintings
            <span className="block text-accent">& Limited Editions</span>
          </h1>
          <p className="text-lg text-muted-foreground font-sans leading-relaxed">
            We don't just sell paintings—we sell stories. Each piece carries 
            the emotions, memories, and moments that inspired its creation. 
            When you bring one home, you're not just decorating a wall—you're 
            adding a chapter to your space.
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
                <div key={i}>
                  <Skeleton className="aspect-[3/4] mb-4" />
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-6 w-40" />
                </div>
              ))}
            </div>
          ) : filteredArtworks.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground font-sans">
              No artworks in this collection yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArtworks.map((artwork) => (
                <div
                  key={artwork.id}
                  className="group cursor-pointer"
                  onClick={() => setSelectedArtwork(artwork)}
                >
                  <div className="aspect-[3/4] overflow-hidden image-reveal mb-4 bg-stone relative">
                    <img
                      src={getArtworkImage(artwork.image_url)}
                      alt={artwork.title}
                      className="w-full h-full object-cover"
                    />
                    {!artwork.available && (
                      <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1 text-xs uppercase tracking-wider font-sans">
                        Acquired
                      </div>
                    )}
                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-all duration-500 flex items-center justify-center">
                      <span className="text-primary-foreground text-xs uppercase tracking-widest font-sans opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        View Details
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
                    {artwork.available ? "Available" : "Private Collection"}
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
                  src={getArtworkImage(selectedArtwork.image_url)}
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
                  <div className="flex justify-between text-sm font-sans">
                    <span className="text-muted-foreground">Status</span>
                    <span className={selectedArtwork.available ? "text-accent" : "text-muted-foreground"}>
                      {selectedArtwork.available ? "Available" : "Acquired"}
                    </span>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-xs uppercase tracking-[0.2em] text-accent font-sans mb-3">
                    The Story Behind This Piece
                  </h4>
                  <p className="text-foreground/80 font-sans leading-relaxed text-sm">
                    {selectedArtwork.story}
                  </p>
                </div>

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

                {selectedArtwork.available && (
                  <Button variant="hero" size="lg" className="w-full" asChild>
                    <Link to={`/artwork/${selectedArtwork.id}`}>
                      Enquire About This Piece
                      <ArrowRight size={16} />
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Gallery;
