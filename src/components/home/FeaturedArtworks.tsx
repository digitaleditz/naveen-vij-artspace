import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import artwork1 from "@/assets/artwork-1.jpg";
import artwork2 from "@/assets/artwork-2.jpg";
import artwork3 from "@/assets/artwork-3.jpg";
import paintingFeatured from "@/assets/painting-featured.jpg";

const artworks = [
  {
    id: 1,
    title: "Golden Horizon",
    collection: "Calm Interiors",
    price: "₹85,000",
    image: artwork1,
  },
  {
    id: 2,
    title: "Urban Geometry",
    collection: "Architecture Inspired",
    price: "₹72,000",
    image: artwork2,
  },
  {
    id: 3,
    title: "Ember Dance",
    collection: "Abstract Emotions",
    price: "₹95,000",
    image: artwork3,
  },
  {
    id: 4,
    title: "Autumn Reverie",
    collection: "Urban Stories",
    price: "₹1,20,000",
    image: paintingFeatured,
  },
];

export const FeaturedArtworks = () => {
  return (
    <section className="section-padding bg-cream">
      <div className="container-wide">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-accent font-sans mb-4">
              Art Collection
            </p>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl">
              Original Paintings
            </h2>
          </div>
          <Button variant="minimal" asChild>
            <Link to="/gallery">
              View Full Collection
              <ArrowRight size={14} />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {artworks.map((artwork, index) => (
            <Link
              key={artwork.id}
              to="/gallery"
              className="group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="aspect-[3/4] overflow-hidden image-reveal mb-4 bg-stone">
                <img
                  src={artwork.image}
                  alt={artwork.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground font-sans mb-1">
                  {artwork.collection}
                </p>
                <h3 className="font-serif text-lg group-hover:text-accent transition-colors mb-1">
                  {artwork.title}
                </h3>
                <p className="text-sm font-sans text-accent">
                  {artwork.price}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
