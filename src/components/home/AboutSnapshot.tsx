import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import naveenPortrait from "@/assets/naveen-portrait.jpg";

export const AboutSnapshot = () => {
  return (
    <section className="section-padding">
      <div className="container-wide">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Image */}
          <div className="order-2 lg:order-1 relative">
            <div className="aspect-[4/5] overflow-hidden image-reveal">
              <img
                src={naveenPortrait}
                alt="Naveen Vij - Architect, Interior Designer & Artist"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Decorative frame */}
            <div className="absolute -bottom-6 -right-6 w-full h-full border border-accent/20 -z-10 hidden lg:block" />
          </div>

          {/* Content */}
          <div className="order-1 lg:order-2">
            <div className="inline-block mb-8">
              <p className="text-[10px] uppercase tracking-[0.4em] text-accent font-sans">
                About the Artist
              </p>
              <div className="section-divider mt-4 mx-0" />
            </div>
            
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-10 leading-tight">
              Where Architecture
              <span className="block mt-2">Meets Artistry</span>
            </h2>
            
            <div className="space-y-8 mb-12">
              <p className="text-muted-foreground font-sans leading-relaxed text-lg">
                With over two decades of experience in architecture and interior design, 
                Naveen Vij has cultivated a unique vision that seamlessly blends functional 
                spaces with artistic expression.
              </p>
              <p className="text-muted-foreground font-sans leading-relaxed text-lg">
                His paintings—often inspired by architectural forms and urban landscapes—
                find their natural home in the interiors he designs, creating spaces that 
                feel like living galleries where every element tells a story.
              </p>
            </div>

            <Button variant="hero" size="xl" asChild>
              <Link to="/about">
                Read Full Story
                <ArrowRight size={16} />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
