import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, X } from "lucide-react";
import artwork1 from "@/assets/artwork-1.jpg";
import artwork2 from "@/assets/artwork-2.jpg";
import artwork3 from "@/assets/artwork-3.jpg";
import paintingFeatured from "@/assets/painting-featured.jpg";

const collections = ["All", "Architecture Inspired", "Urban Stories", "Calm Interiors", "Abstract Emotions"];

const artworks = [
  {
    id: 1,
    title: "Golden Horizon",
    collection: "Calm Interiors",
    size: '36" x 48"',
    medium: "Oil on Canvas",
    price: "₹85,000",
    available: true,
    image: artwork1,
    story: "Inspired by the quiet moments of dawn, this piece captures the serenity of light breaking through mist.",
  },
  {
    id: 2,
    title: "Urban Geometry",
    collection: "Architecture Inspired",
    size: '40" x 50"',
    medium: "Acrylic on Canvas",
    price: "₹72,000",
    available: true,
    image: artwork2,
    story: "A meditation on the interplay of lines and forms in modern architecture.",
  },
  {
    id: 3,
    title: "Ember Dance",
    collection: "Abstract Emotions",
    size: '48" x 36"',
    medium: "Oil on Canvas",
    price: "₹95,000",
    available: true,
    image: artwork3,
    story: "The passion and energy of fire translated into sweeping brushstrokes and warm tones.",
  },
  {
    id: 4,
    title: "Autumn Reverie",
    collection: "Urban Stories",
    size: '30" x 40"',
    medium: "Oil on Canvas",
    price: "₹1,20,000",
    available: false,
    image: paintingFeatured,
    story: "A reflection on the changing seasons and the memories they evoke.",
  },
  {
    id: 5,
    title: "Silent Streets",
    collection: "Urban Stories",
    size: '24" x 36"',
    medium: "Mixed Media",
    price: "₹68,000",
    available: true,
    image: artwork1,
    story: "Empty city streets at twilight, where shadows tell their own stories.",
  },
  {
    id: 6,
    title: "Concrete Dreams",
    collection: "Architecture Inspired",
    size: '36" x 36"',
    medium: "Acrylic on Canvas",
    price: "₹78,000",
    available: true,
    image: artwork2,
    story: "The poetry found in brutalist architecture and its interplay with light.",
  },
];

const Gallery = () => {
  const [activeCollection, setActiveCollection] = useState("All");
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
            Each piece tells a story—of spaces, emotions, and the quiet moments 
            that inspire creativity. Discover art that belongs in your home.
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArtworks.map((artwork) => (
              <div
                key={artwork.id}
                className="group cursor-pointer"
                onClick={() => setSelectedArtwork(artwork)}
              >
                <div className="aspect-[3/4] overflow-hidden image-reveal mb-4 bg-stone relative">
                  <img
                    src={artwork.image}
                    alt={artwork.title}
                    className="w-full h-full object-cover"
                  />
                  {!artwork.available && (
                    <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1 text-xs uppercase tracking-wider font-sans">
                      Sold
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
                  {artwork.price}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Commission Section */}
      <section className="section-padding bg-secondary">
        <div className="container-wide">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-accent font-sans mb-6">
              Custom Art
            </p>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl mb-6">
              Commissioned Works
            </h2>
            <p className="text-muted-foreground font-sans text-lg leading-relaxed mb-10">
              Looking for a piece created specifically for your space? 
              I work closely with collectors to create custom paintings that 
              reflect their vision and complement their interiors perfectly.
            </p>
            <Button variant="hero" size="lg" asChild>
              <Link to="/contact">
                Request Custom Painting
                <ArrowRight size={16} />
              </Link>
            </Button>
          </div>
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
                  src={selectedArtwork.image}
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
                    <span className="text-muted-foreground">Price</span>
                    <span className="text-accent font-medium">{selectedArtwork.price}</span>
                  </div>
                  <div className="flex justify-between text-sm font-sans">
                    <span className="text-muted-foreground">Status</span>
                    <span className={selectedArtwork.available ? "text-green-600" : "text-muted-foreground"}>
                      {selectedArtwork.available ? "Available" : "Sold"}
                    </span>
                  </div>
                </div>

                <div className="mb-8">
                  <h4 className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-sans mb-3">
                    The Story
                  </h4>
                  <p className="text-muted-foreground font-sans leading-relaxed">
                    {selectedArtwork.story}
                  </p>
                </div>

                {selectedArtwork.available && (
                  <Button variant="hero" size="lg" className="w-full" asChild>
                    <Link to="/contact">
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
