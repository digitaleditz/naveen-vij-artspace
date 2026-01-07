import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart, MessageCircle, Play, ShoppingBag } from "lucide-react";
import { useArtworks } from "@/hooks/useArtworks";
import { useWishlist } from "@/hooks/useWishlist";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import artwork1 from "@/assets/artwork-1.jpg";
import artwork2 from "@/assets/artwork-2.jpg";
import artwork3 from "@/assets/artwork-3.jpg";
import paintingFeatured from "@/assets/painting-featured.jpg";
import naveenPortrait from "@/assets/naveen-portrait.jpg";

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

const ArtworkDetail = () => {
  const { id } = useParams();
  const { artworks, loading } = useArtworks();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart, isInCart } = useCart();
  const { toast } = useToast();

  const artwork = artworks.find((a) => a.id === id);

  const handleAddToCart = () => {
    if (artwork) {
      addToCart(artwork);
      toast({
        title: "Added to cart",
        description: `${artwork.title} has been added to your selection.`,
      });
    }
  };
  const artworkIndex = artworks.findIndex((a) => a.id === id);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground font-sans">Loading...</div>
        </div>
      </Layout>
    );
  }

  if (!artwork) {
    return (
      <Layout>
        <div className="min-h-screen flex flex-col items-center justify-center gap-8">
          <p className="text-muted-foreground font-sans text-lg">Artwork not found</p>
          <Button variant="outline" asChild>
            <Link to="/collection">
              <ArrowLeft size={16} />
              Return to Collection
            </Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Back Navigation */}
      <div className="pt-32 pb-10 container-wide">
        <Link
          to="/collection"
          className="inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] font-sans text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Back to Collection
        </Link>
      </div>

      {/* Hero Section - Full Width Artwork */}
      <section className="container-wide pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Artwork Image */}
          <div className="relative">
            <div className="aspect-[3/4] bg-stone overflow-hidden">
              <img
                src={getArtworkImage(artwork.image_url, artworkIndex)}
                alt={artwork.title}
                className="w-full h-full object-cover"
              />
            </div>
            {!artwork.available && (
              <div className="absolute top-6 left-6 bg-primary text-primary-foreground px-5 py-2.5 text-[10px] uppercase tracking-[0.2em] font-sans">
                Acquired by Collector
              </div>
            )}
            {/* Decorative frame */}
            <div className="absolute -bottom-6 -right-6 w-full h-full border border-accent/20 -z-10 hidden lg:block" />
          </div>

          {/* Artwork Details */}
          <div className="lg:py-8">
            <p className="text-[10px] uppercase tracking-[0.4em] text-accent font-sans mb-6">
              {artwork.collection}
            </p>
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl mb-8 leading-[1.05]">
              {artwork.title}
            </h1>

            {/* Specs Grid */}
            <div className="grid grid-cols-2 gap-8 py-10 border-y border-border mb-10">
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-sans mb-2">
                  Size
                </p>
                <p className="font-sans text-lg">{artwork.size}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-sans mb-2">
                  Medium
                </p>
                <p className="font-sans text-lg">{artwork.medium}</p>
              </div>
              {artwork.mood && (
                <div>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-sans mb-2">
                    Mood
                  </p>
                  <p className="font-sans text-lg">{artwork.mood}</p>
                </div>
              )}
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-sans mb-2">
                  Status
                </p>
                <p className={`font-sans text-lg ${artwork.available ? "text-accent" : "text-muted-foreground"}`}>
                  {artwork.available ? "Available" : "Private Collection"}
                </p>
              </div>
            </div>

            {/* Price & Actions */}
            {artwork.available && (
              <div className="mb-10">
                <p className="font-serif text-4xl md:text-5xl text-accent mb-8">
                  ₹{artwork.price.toLocaleString()}
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    variant="hero"
                    size="xl"
                    className="flex-1"
                    onClick={handleAddToCart}
                    disabled={isInCart(artwork.id)}
                  >
                    <ShoppingBag size={18} className="mr-2" />
                    {isInCart(artwork.id) ? "Added to Cart" : "Acquire This Vision"}
                  </Button>
                  <Button
                    variant="heroOutline"
                    size="xl"
                    onClick={() => toggleWishlist(artwork.id)}
                    className="flex items-center gap-3"
                  >
                    <Heart
                      size={18}
                      className={isInWishlist(artwork.id) ? "fill-accent text-accent" : ""}
                    />
                    {isInWishlist(artwork.id) ? "Saved" : "Save"}
                  </Button>
                </div>
                <Button variant="ghost" size="lg" className="w-full mt-4" asChild>
                  <Link to={`/contact?artwork=${encodeURIComponent(artwork.title)}&intent=enquire`}>
                    <MessageCircle size={16} />
                    Make an Enquiry
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="section-padding bg-secondary/30">
        <div className="container-wide">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-[10px] uppercase tracking-[0.4em] text-accent font-sans mb-4">
                The Story Behind This Vision
              </p>
              <div className="section-divider" />
            </div>
            <p className="font-serif text-3xl md:text-4xl leading-relaxed text-center text-foreground/90 mb-14 italic">
              "{artwork.story.split('.')[0]}."
            </p>
            <div className="font-sans text-lg text-muted-foreground leading-relaxed text-center max-w-3xl mx-auto">
              <p>{artwork.story}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="section-padding bg-cream">
        <div className="container-wide">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-[10px] uppercase tracking-[0.4em] text-accent font-sans mb-4">
                From the Artist
              </p>
              <h2 className="font-serif text-3xl md:text-4xl">
                Hear Naveen Vij share the inspiration
              </h2>
              <div className="section-divider mt-8" />
            </div>

            {/* Video Placeholder */}
            <div className="relative aspect-video bg-stone overflow-hidden group cursor-pointer">
              <img
                src={naveenPortrait}
                alt="Naveen Vij discussing artwork"
                className="w-full h-full object-cover opacity-80 group-hover:opacity-70 transition-opacity duration-500"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 bg-background/95 rounded-full flex items-center justify-center group-hover:bg-accent group-hover:scale-110 transition-all duration-500 shadow-elevated">
                  <Play size={36} className="text-foreground group-hover:text-accent-foreground ml-1" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-10 bg-gradient-to-t from-primary/90 via-primary/50 to-transparent">
                <p className="text-primary-foreground font-sans">
                  Video coming soon — The story, the space it belongs to, what it represents
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Design Inspiration */}
      {artwork.design_inspiration && (
        <section className="section-padding">
          <div className="container-wide">
            <div className="max-w-4xl mx-auto">
              <div className="premium-card p-12 md:p-16">
                <p className="text-[10px] uppercase tracking-[0.4em] text-accent font-sans mb-6">
                  Design Inspiration
                </p>
                <p className="font-serif text-2xl md:text-3xl italic text-foreground/80 leading-relaxed">
                  {artwork.design_inspiration}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Suggested Placement */}
      {artwork.placement && (
        <section className="section-padding bg-secondary/50">
          <div className="container-wide">
            <div className="max-w-4xl mx-auto text-center">
              <p className="text-[10px] uppercase tracking-[0.4em] text-accent font-sans mb-4">
                Where This Vision Belongs
              </p>
              <div className="section-divider mt-6 mb-10" />
              <p className="font-serif text-3xl md:text-4xl leading-relaxed mb-10">
                {artwork.placement}
              </p>
              <p className="text-muted-foreground font-sans max-w-xl mx-auto">
                As an architect, I envision each painting in a specific context—a dialogue between art and architecture that elevates both the space and the work itself.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="section-padding bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        
        <div className="container-wide text-center relative z-10">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl mb-8">
            Interested in this vision?
          </h2>
          <p className="text-primary-foreground/60 font-sans text-lg mb-12 max-w-xl mx-auto leading-relaxed">
            Each acquisition includes a personal consultation with Naveen Vij 
            to ensure the work finds its perfect home in your space.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <Button variant="gold" size="xl" asChild>
              <Link to={`/contact?artwork=${encodeURIComponent(artwork.title)}`}>
                Begin the Conversation
              </Link>
            </Button>
            <Button 
              variant="heroOutline" 
              size="xl" 
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
              asChild
            >
              <Link to="/collection">
                Explore More Works
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ArtworkDetail;
