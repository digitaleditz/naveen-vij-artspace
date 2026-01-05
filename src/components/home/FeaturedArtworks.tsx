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
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
          <div>
            <div className="inline-block mb-6">
              <p className="text-[10px] uppercase tracking-[0.4em] text-accent font-sans">
                Visual Studies
              </p>
              <div className="section-divider mt-4 mx-0" />
            </div>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl">
              Original Paintings
            </h2>
          </div>
          <Button variant="minimal" asChild className="self-start md:self-auto">
            <Link to="/collection">
              View Full Collection
              <ArrowRight size={14} />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {artworks.map((artwork, index) => (
            <Link
              key={artwork.id}
              to="/collection"
              className="group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="aspect-[3/4] overflow-hidden image-reveal mb-6 bg-stone relative">
                <img
                  src={artwork.image}
                  alt={artwork.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-all duration-500" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-sans mb-2">
                  {artwork.collection}
                </p>
                <h3 className="font-serif text-xl group-hover:text-accent transition-colors mb-2">
                  {artwork.title}
                </h3>
                <p className="text-sm font-sans text-accent font-medium">
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
