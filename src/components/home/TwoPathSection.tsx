import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import project1 from "@/assets/project-1.jpg";
import paintingFeatured from "@/assets/painting-featured.jpg";

export const TwoPathSection = () => {
  return (
    <section className="section-padding bg-secondary/50">
      <div className="container-wide">
        <div className="text-center mb-20">
          <p className="text-[10px] uppercase tracking-[0.4em] text-accent font-sans mb-4">
            Two Expressions
          </p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl">
            One Creative Vision
          </h2>
          <div className="section-divider mt-8" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
          {/* Architecture Card */}
          <Link
            to="/interiors"
            className="group relative aspect-[4/5] overflow-hidden image-reveal"
          >
            <img
              src={project1}
              alt="Interior Design by Naveen Vij"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/40 to-transparent opacity-90 group-hover:opacity-95 transition-opacity duration-500" />
            
            <div className="absolute bottom-0 left-0 right-0 p-10 md:p-14">
              <p className="text-[10px] uppercase tracking-[0.3em] text-primary-foreground/60 font-sans mb-4">
                Architecture & Interiors
              </p>
              <h3 className="font-serif text-3xl md:text-4xl text-primary-foreground mb-5">
                Designed Spaces
              </h3>
              <p className="text-primary-foreground/70 font-sans leading-relaxed mb-8 max-w-sm">
                Thoughtful interiors and architectural projects that blend 
                functionality with artistic sensibility.
              </p>
              <Button 
                variant="gallery" 
                className="text-primary-foreground border-primary-foreground/30 hover:border-primary-foreground"
              >
                View Portfolio
                <ArrowUpRight size={14} className="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Button>
            </div>
          </Link>

          {/* Art Card */}
          <Link
            to="/collection"
            className="group relative aspect-[4/5] overflow-hidden image-reveal"
          >
            <img
              src={paintingFeatured}
              alt="Original Painting by Naveen Vij"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/40 to-transparent opacity-90 group-hover:opacity-95 transition-opacity duration-500" />
            
            <div className="absolute bottom-0 left-0 right-0 p-10 md:p-14">
              <p className="text-[10px] uppercase tracking-[0.3em] text-primary-foreground/60 font-sans mb-4">
                Visual Studies
              </p>
              <h3 className="font-serif text-3xl md:text-4xl text-primary-foreground mb-5">
                The Collection
              </h3>
              <p className="text-primary-foreground/70 font-sans leading-relaxed mb-8 max-w-sm">
                Paintings as architectural emotions—narratives of space, light, 
                and the human experience of inhabitation.
              </p>
              <Button 
                variant="gallery" 
                className="text-primary-foreground border-primary-foreground/30 hover:border-primary-foreground"
              >
                Explore Works
                <ArrowUpRight size={14} className="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Button>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};
