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
            Choose Your Journey
          </p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl">
            Two Worlds, One Vision
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Interior Design Card */}
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
                Design Studio
              </p>
              <h3 className="font-serif text-2xl md:text-3xl text-primary-foreground mb-4">
                Interior Design
              </h3>
              <p className="text-primary-foreground/80 font-sans text-sm leading-relaxed mb-6 max-w-sm">
                Tailored interiors for residences, cafés, offices and boutique spaces 
                that blend functionality with artistry.
              </p>
              <Button variant="gallery" className="text-primary-foreground border-primary-foreground/30 hover:border-primary-foreground">
                View Portfolio
                <ArrowUpRight size={14} className="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Button>
            </div>
          </Link>

          {/* Art Gallery Card */}
          <Link
            to="/gallery"
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
                Art Collection
              </p>
              <h3 className="font-serif text-2xl md:text-3xl text-primary-foreground mb-4">
                Paintings & Art
              </h3>
              <p className="text-primary-foreground/80 font-sans text-sm leading-relaxed mb-6 max-w-sm">
                Original paintings and limited edition prints for collectors 
                and design lovers seeking unique pieces.
              </p>
              <Button variant="gallery" className="text-primary-foreground border-primary-foreground/30 hover:border-primary-foreground">
                Explore Gallery
                <ArrowUpRight size={14} className="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Button>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};
