import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart, MessageCircle, Play } from "lucide-react";
import { useArtworks, Artwork } from "@/hooks/useArtworks";
import { useWishlist } from "@/hooks/useWishlist";
import { useAuth } from "@/contexts/AuthContext";
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
  const navigate = useNavigate();
  const { artworks, loading } = useArtworks();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();
  const [showVideo, setShowVideo] = useState(false);

  const artwork = artworks.find((a) => a.id === id);
  const artworkIndex = artworks.findIndex((a) => a.id === id);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Loading...</div>
        </div>
      </Layout>
    );
  }

  if (!artwork) {
    return (
      <Layout>
        <div className="min-h-screen flex flex-col items-center justify-center gap-6">
          <p className="text-muted-foreground font-sans">Artwork not found</p>
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
      <div className="pt-28 pb-8 container-wide">
        <Link
          to="/collection"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-sans text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Collection
        </Link>
      </div>

      {/* Hero Section - Full Width Artwork */}
      <section className="container-wide">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
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
              <div className="absolute top-6 left-6 bg-charcoal text-cream px-4 py-2 text-xs uppercase tracking-widest font-sans">
                Acquired by Collector
              </div>
            )}
          </div>

          {/* Artwork Details */}
          <div className="lg:py-8">
            <p className="text-xs uppercase tracking-[0.3em] text-accent font-sans mb-4">
              {artwork.collection}
            </p>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-6 leading-tight">
              {artwork.title}
            </h1>

            {/* Specs Grid */}
            <div className="grid grid-cols-2 gap-6 py-8 border-y border-border mb-8">
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground font-sans mb-1">
                  Size
                </p>
                <p className="font-sans">{artwork.size}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground font-sans mb-1">
                  Medium
                </p>
                <p className="font-sans">{artwork.medium}</p>
              </div>
              {artwork.mood && (
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground font-sans mb-1">
                    Mood
                  </p>
                  <p className="font-sans">{artwork.mood}</p>
                </div>
              )}
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground font-sans mb-1">
                  Status
                </p>
                <p className={`font-sans ${artwork.available ? "text-accent" : "text-muted-foreground"}`}>
                  {artwork.available ? "Available for Acquisition" : "In Private Collection"}
                </p>
              </div>
            </div>

            {/* Price & Actions */}
            {artwork.available && (
              <div className="mb-8">
                <p className="font-serif text-3xl md:text-4xl text-accent mb-6">
                  ₹{artwork.price.toLocaleString()}
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button variant="hero" size="lg" className="flex-1" asChild>
                    <Link to={`/contact?artwork=${encodeURIComponent(artwork.title)}&intent=acquire`}>
                      Acquire This Vision
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => toggleWishlist(artwork.id)}
                    className="flex items-center gap-2"
                  >
                    <Heart
                      size={18}
                      className={isInWishlist(artwork.id) ? "fill-accent text-accent" : ""}
                    />
                    {isInWishlist(artwork.id) ? "Saved" : "Save"}
                  </Button>
                </div>
                <Button variant="ghost" size="lg" className="w-full mt-3" asChild>
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
      <section className="section-padding">
        <div className="container-wide">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xs uppercase tracking-[0.3em] text-accent font-sans mb-6 text-center">
              The Story Behind This Vision
            </h2>
            <p className="font-serif text-2xl md:text-3xl leading-relaxed text-center text-foreground/90 mb-12">
              "{artwork.story.split('.')[0]}."
            </p>
            <div className="prose prose-lg font-sans text-muted-foreground leading-relaxed">
              <p>{artwork.story}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="bg-cream section-padding">
        <div className="container-wide">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-xs uppercase tracking-[0.3em] text-accent font-sans mb-4">
                From the Artist
              </h2>
              <p className="font-serif text-2xl md:text-3xl">
                Hear Naveen Vij share the inspiration
              </p>
            </div>

            {/* Video Placeholder */}
            <div className="relative aspect-video bg-stone overflow-hidden group cursor-pointer">
              <img
                src={naveenPortrait}
                alt="Naveen Vij discussing artwork"
                className="w-full h-full object-cover opacity-80 group-hover:opacity-70 transition-opacity"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 bg-background/90 rounded-full flex items-center justify-center group-hover:bg-accent transition-colors">
                  <Play size={32} className="text-foreground group-hover:text-accent-foreground ml-1" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-charcoal/80 to-transparent">
                <p className="text-cream font-sans text-sm">
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
            <div className="max-w-3xl mx-auto">
              <div className="border-l-2 border-accent pl-8 py-4">
                <h3 className="text-xs uppercase tracking-[0.3em] text-accent font-sans mb-4">
                  Design Inspiration
                </h3>
                <p className="font-serif text-xl md:text-2xl italic text-foreground/80 leading-relaxed">
                  {artwork.design_inspiration}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Suggested Placement */}
      {artwork.placement && (
        <section className="bg-secondary section-padding">
          <div className="container-wide">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-xs uppercase tracking-[0.3em] text-accent font-sans mb-6">
                Where This Vision Belongs
              </h2>
              <p className="font-serif text-2xl md:text-3xl leading-relaxed mb-8">
                {artwork.placement}
              </p>
              <p className="text-muted-foreground font-sans text-sm max-w-xl mx-auto">
                As an architect, I envision each painting in a specific context—a dialogue between art and architecture that elevates both the space and the work itself.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="section-padding">
        <div className="container-wide text-center">
          <h2 className="font-serif text-2xl md:text-3xl mb-6">
            Interested in this vision?
          </h2>
          <p className="text-muted-foreground font-sans mb-8 max-w-xl mx-auto">
            Each acquisition includes a personal consultation with Naveen Vij 
            to ensure the work finds its perfect home in your space.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="lg" asChild>
              <Link to={`/contact?artwork=${encodeURIComponent(artwork.title)}`}>
                Begin the Conversation
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
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
