import { Link } from "react-router-dom";
import { ArrowRight, Play } from "lucide-react";

import { Button } from "@/components/ui/button";

type ArtworkLike = {
  id: string;
  title: string;
  collection: string;
  story: string;
  price: number;
};

type Props = {
  artwork: ArtworkLike;
  imageSrc: string;
  isActive: boolean;
  storyMaxChars: number;
};

export function ArtExperienceSlide({
  artwork,
  imageSrc,
  isActive,
  storyMaxChars,
}: Props) {
  const story = artwork.story ?? "";
  const excerpt = story.length > storyMaxChars ? `${story.slice(0, storyMaxChars)}...` : story;

  return (
    <div className="w-full h-full flex-shrink-0">
      <div className="container-wide h-full flex flex-col lg:grid lg:grid-cols-2 gap-6 lg:gap-16 items-center py-10 md:py-14 lg:py-20">
        {/* Left side - Content */}
        <div className="w-full order-2 lg:order-1">
          <div className="animate-fade-in">
            <div className="inline-block mb-5 md:mb-6">
              <p className="text-[10px] uppercase tracking-[0.4em] text-accent font-sans">
                {artwork.collection}
              </p>
              <div className="section-divider mt-3 mx-0" />
            </div>

            <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl mb-6 md:mb-8 leading-tight">
              {artwork.title}
            </h2>

            <p className="text-muted-foreground font-sans leading-relaxed text-base md:text-lg mb-8 md:mb-10 max-w-lg font-light italic">
              “{excerpt}”
            </p>

            {/* Video thumbnail */}
            <div className="mb-8 md:mb-10 group cursor-pointer">
              <div className="flex items-center gap-4 text-muted-foreground hover:text-foreground transition-colors">
                <div className="w-14 h-14 rounded-full border border-accent/30 flex items-center justify-center group-hover:border-accent group-hover:bg-accent/10 transition-all">
                  <Play size={18} className="text-accent ml-0.5" />
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
        </div>

        {/* Right side - Artwork Image */}
        <div className="w-full order-1 lg:order-2 relative h-[44svh] sm:h-[48svh] lg:h-auto flex items-center">
          <div className="w-full h-full lg:aspect-[3/4] lg:h-auto overflow-hidden image-reveal animate-fade-in">
            <img
              src={imageSrc}
              alt={artwork.title}
              loading={isActive ? "eager" : "lazy"}
              className="w-full h-full object-cover"
            />
          </div>
          {/* Decorative frame */}
          <div className="absolute -bottom-4 -right-4 w-full h-full border border-accent/20 -z-10 hidden lg:block" />
        </div>
      </div>
    </div>
  );
}
