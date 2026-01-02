import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import project1 from "@/assets/project-1.jpg";
import paintingFeatured from "@/assets/painting-featured.jpg";

export const TwoPathSection = () => {
  return (
    <section className="section-padding bg-secondary">
      <div className="container-wide">
        <div className="text-center mb-16">
          <p className="text-xs uppercase tracking-[0.3em] text-accent font-sans mb-4">
            Two Expressions
          </p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl">
            One Creative Vision
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
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
            <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/30 to-transparent" />
            
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
              <p className="text-xs uppercase tracking-[0.2em] text-primary-foreground/70 font-sans mb-3">
                Architecture & Interiors
              </p>
              <h3 className="font-serif text-2xl md:text-3xl text-primary-foreground mb-4">
                Designed Spaces
              </h3>
              <p className="text-primary-foreground/80 font-sans text-sm leading-relaxed mb-6 max-w-sm">
                Thoughtful interiors and architectural projects that blend 
                functionality with artistic sensibility.
              </p>
              <Button variant="gallery" className="text-primary-foreground border-primary-foreground/30 hover:border-primary-foreground">
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
            <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/30 to-transparent" />
            
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
              <p className="text-xs uppercase tracking-[0.2em] text-primary-foreground/70 font-sans mb-3">
                Visual Studies
              </p>
              <h3 className="font-serif text-2xl md:text-3xl text-primary-foreground mb-4">
                The Collection
              </h3>
              <p className="text-primary-foreground/80 font-sans text-sm leading-relaxed mb-6 max-w-sm">
                Paintings as architectural emotions—narratives of space, light, 
                and the human experience of inhabitation.
              </p>
              <Button variant="gallery" className="text-primary-foreground border-primary-foreground/30 hover:border-primary-foreground">
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
