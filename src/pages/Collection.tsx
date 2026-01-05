import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { useArtworks } from "@/hooks/useArtworks";
import { useWishlist } from "@/hooks/useWishlist";
import artwork1 from "@/assets/artwork-1.jpg";
import artwork2 from "@/assets/artwork-2.jpg";
import artwork3 from "@/assets/artwork-3.jpg";
import paintingFeatured from "@/assets/painting-featured.jpg";

const collections = ["All", "Architecture Inspired", "Urban Stories", "Calm Interiors", "Abstract Emotions"];

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
  const { artworks, loading } = useArtworks();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const filteredArtworks = activeCollection === "All"
    ? artworks
    : artworks.filter((a) => a.collection === activeCollection);

  return (
    <Layout>
      {/* Hero */}
      <section className="pt-40 pb-24 container-wide">
        <div className="max-w-5xl">
          <div className="inline-block mb-8">
            <p className="text-[10px] uppercase tracking-[0.4em] text-accent font-sans">
              The Collection
            </p>
            <div className="section-divider mt-4 mx-0" />
          </div>
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl mb-10 leading-[1.05]">
            Visual Studies of
            <span className="block text-accent mt-2">an Architect's Mind</span>
          </h1>
          <p className="text-xl text-muted-foreground font-sans leading-relaxed max-w-3xl font-light">
            Each painting is a narrative of space—an exploration of light, form, 
            and emotion. These are not merely decorative objects; they are 
            architectural emotions waiting to find their home.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="pb-16 container-wide">
        <div className="flex flex-wrap gap-4">
          {collections.map((collection) => (
            <button
              key={collection}
              onClick={() => setActiveCollection(collection)}
              className={`px-6 py-3 text-[10px] uppercase tracking-[0.2em] font-sans transition-all duration-300 border ${
                activeCollection === collection
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-transparent text-foreground border-border hover:border-accent hover:text-accent"
              }`}
            >
              {collection}
            </button>
          ))}
        </div>
      </section>

      {/* Gallery Grid - Museum Style */}
      <section className="pb-32">
        <div className="container-wide">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-20">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[3/4] bg-secondary mb-8" />
                  <div className="h-3 bg-secondary w-24 mb-4" />
                  <div className="h-7 bg-secondary w-48 mb-3" />
                  <div className="h-4 bg-secondary w-full mb-5" />
                  <div className="h-5 bg-secondary w-24" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-20">
              {filteredArtworks.map((artwork, index) => (
                <article key={artwork.id} className="group">
                  <Link to={`/artwork/${artwork.id}`} className="block">
                    <div className="aspect-[3/4] overflow-hidden mb-8 bg-stone relative">
                      <img
                        src={getArtworkImage(artwork.image_url, index)}
                        alt={artwork.title}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                      {!artwork.available && (
                        <div className="absolute top-5 left-5 bg-primary text-primary-foreground px-4 py-2 text-[10px] uppercase tracking-[0.2em] font-sans">
                          Acquired
                        </div>
                      )}
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-all duration-500 flex items-center justify-center">
                        <span className="text-primary-foreground text-[10px] uppercase tracking-[0.3em] font-sans opacity-0 group-hover:opacity-100 transition-opacity duration-500 border border-primary-foreground/60 px-8 py-4 backdrop-blur-sm bg-primary/20">
                          Enter
                        </span>
                      </div>
                    </div>
                  </Link>

                  {/* Artwork Info */}
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        toggleWishlist(artwork.id);
                      }}
                      className="absolute top-0 right-0 p-2 text-muted-foreground hover:text-accent transition-colors"
                      aria-label={isInWishlist(artwork.id) ? "Remove from saved" : "Save artwork"}
                    >
                      <Heart
                        size={20}
                        className={isInWishlist(artwork.id) ? "fill-accent text-accent" : ""}
                      />
                    </button>

                    <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground font-sans mb-3">
                      {artwork.collection}
                    </p>
                    <Link to={`/artwork/${artwork.id}`}>
                      <h3 className="font-serif text-2xl md:text-3xl group-hover:text-accent transition-colors mb-4 pr-10">
                        {artwork.title}
                      </h3>
                    </Link>
                    <p className="text-muted-foreground font-sans leading-relaxed mb-5 line-clamp-2">
                      {artwork.story.split('.')[0]}.
                    </p>
                    <p className="font-sans text-accent text-lg tracking-wide">
                      ₹{artwork.price.toLocaleString()}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Collection Philosophy */}
      <section className="bg-cream section-padding relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        
        <div className="container-wide relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-[10px] uppercase tracking-[0.4em] text-accent font-sans mb-8">
              A Note on Collecting
            </p>
            <p className="font-serif text-3xl md:text-4xl leading-relaxed mb-10 italic">
              "Each painting carries within it the memory of spaces I've designed 
              and dreams I've yet to build. When you acquire a work, you become 
              part of that ongoing conversation between imagination and reality."
            </p>
            <div className="section-divider" />
            <p className="text-muted-foreground font-sans mt-8">— Naveen Vij</p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Collection;
