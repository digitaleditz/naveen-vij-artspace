import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import naveenPortrait from "@/assets/naveen-portrait.jpg";

export const AboutSnapshot = () => {
  return (
    <section className="section-padding">
      <div className="container-wide">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <div className="order-2 lg:order-1">
            <div className="aspect-[4/5] overflow-hidden image-reveal">
              <img
                src={naveenPortrait}
                alt="Naveen Vij - Architect, Interior Designer & Artist"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Content */}
          <div className="order-1 lg:order-2">
            <p className="text-xs uppercase tracking-[0.3em] text-accent font-sans mb-6">
              About the Artist
            </p>
            
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl mb-8 leading-tight">
              Where Architecture
              <span className="block">Meets Artistry</span>
            </h2>
            
            <div className="space-y-6 mb-10">
              <p className="text-muted-foreground font-sans leading-relaxed">
                With over two decades of experience in architecture and interior design, 
                Naveen Vij has cultivated a unique vision that seamlessly blends functional 
                spaces with artistic expression.
              </p>
              <p className="text-muted-foreground font-sans leading-relaxed">
                His paintings—often inspired by architectural forms and urban landscapes—
                find their natural home in the interiors he designs, creating spaces that 
                feel like living galleries where every element tells a story.
              </p>
            </div>

            <Button variant="hero" size="lg" asChild>
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
