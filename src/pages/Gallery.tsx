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
    price: "₹8,500",
    available: true,
    image: artwork1,
    story: "This painting was born on a morning I spent watching the sun rise over the Aravalli hills. There's a moment—just before the world wakes up—when everything is bathed in golden silence. I wanted to capture that stillness, that breath between night and day. The soft gradients represent the mist lifting slowly, revealing warmth beneath. When I painted this, I was thinking about how our homes should feel like that first light—gentle, welcoming, full of quiet hope.",
    placement: "Perfect for bedrooms, meditation spaces, or above a reading nook where you seek calm.",
  },
  {
    id: 2,
    title: "Urban Geometry",
    collection: "Architecture Inspired",
    size: '40" x 50"',
    medium: "Acrylic on Canvas",
    price: "₹7,200",
    available: true,
    image: artwork2,
    story: "Walking through the streets of Chandigarh, I found myself mesmerized by Le Corbusier's legacy—how concrete can feel both monumental and intimate. This piece is my conversation with those buildings. Each angular form represents the tension between function and beauty, between the human need for shelter and the desire to create something that transcends utility. The muted palette speaks to concrete weathered by time, while the subtle gold accents are the sunlight that transforms brutalism into poetry.",
    placement: "Ideal for modern living rooms, architectural offices, or lobbies that celebrate contemporary design.",
  },
  {
    id: 3,
    title: "Ember Dance",
    collection: "Abstract Emotions",
    size: '48" x 36"',
    medium: "Oil on Canvas",
    price: "₹9,500",
    available: true,
    image: artwork3,
    story: "I painted this during a time of profound change in my life. Sitting by a bonfire one winter evening, I watched flames twist and reach upward—never the same shape twice, yet always fire. This piece channels that energy—the passion that consumes and creates simultaneously. Every brushstroke was spontaneous, urgent, alive. The warm oranges and deep crimsons represent transformation, while the darker undertones acknowledge that growth often comes from letting go.",
    placement: "Makes a powerful statement in dining rooms, creative studios, or spaces meant for gathering and conversation.",
  },
  {
    id: 4,
    title: "Autumn Reverie",
    collection: "Urban Stories",
    size: '30" x 40"',
    medium: "Oil on Canvas",
    price: "₹10,000",
    available: false,
    image: paintingFeatured,
    story: "This painting came from a walk through Lodhi Garden in late November. The light was amber, leaves were falling, and I passed an elderly couple sitting on a bench, holding hands without speaking. That image stayed with me—how some moments are so full of meaning they don't need words. The warm, nostalgic tones reflect the bittersweet beauty of time passing, while the layered textures represent the accumulation of memories that make a place sacred.",
    placement: "Beautiful in entryways, above fireplaces, or any space where you want to evoke warmth and nostalgia.",
  },
  {
    id: 5,
    title: "Silent Streets",
    collection: "Urban Stories",
    size: '24" x 36"',
    medium: "Mixed Media",
    price: "₹6,800",
    available: true,
    image: artwork1,
    story: "During the pandemic lockdowns, I stood on my balcony each evening watching streets that once teemed with life lie completely still. This piece captures that eerie, beautiful silence—the way empty spaces can feel both haunting and peaceful. I incorporated actual newspaper clippings and street textures into the canvas, grounding the abstraction in reality. It's a meditation on absence, on how we often only notice things when they're gone.",
    placement: "Suits urban lofts, home offices, or corridors where contemplative pieces invite pause.",
  },
  {
    id: 6,
    title: "Concrete Dreams",
    collection: "Architecture Inspired",
    size: '36" x 36"',
    medium: "Acrylic on Canvas",
    price: "₹7,800",
    available: true,
    image: artwork2,
    story: "Every architect dreams in concrete and light. This painting is my homage to those dreams—the blueprints that never got built, the sketches crumpled and discarded, the visions that exist only in imagination. The geometric forms float and intersect like thoughts in the early stages of design. Soft greys and unexpected pops of copper represent the raw potential of unfinished ideas, waiting to become spaces where life unfolds.",
    placement: "Perfect for architect studios, minimalist living spaces, or above console tables in modern homes.",
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

                <div className="mb-6">
                  <h4 className="text-xs uppercase tracking-[0.2em] text-accent font-sans mb-3">
                    The Story Behind This Piece
                  </h4>
                  <p className="text-foreground/80 font-sans leading-relaxed text-sm">
                    {selectedArtwork.story}
                  </p>
                </div>

                <div className="mb-8 p-4 bg-secondary rounded">
                  <h4 className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-sans mb-2">
                    Where It Belongs
                  </h4>
                  <p className="text-muted-foreground font-sans leading-relaxed text-sm italic">
                    {selectedArtwork.placement}
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
