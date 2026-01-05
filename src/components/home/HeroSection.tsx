import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import heroInterior from "@/assets/hero-interior.jpg";

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroInterior}
          alt="Architectural space designed by Naveen Vij"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="container-wide relative z-10 pt-32 pb-24">
        <div className="max-w-2xl">
          <div className="inline-block mb-8 animate-fade-up opacity-0 stagger-1">
            <p className="text-[10px] uppercase tracking-[0.4em] text-accent font-sans">
              Architect • Designer • Artist
            </p>
            <div className="section-divider mt-4 mx-0" />
          </div>
          
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl leading-[1.05] mb-8 animate-fade-up opacity-0 stagger-2">
            Architecture, Art
            <span className="block text-accent mt-2">& Stories</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground font-sans leading-relaxed mb-12 max-w-lg animate-fade-up opacity-0 stagger-3 font-light">
            Designing spaces. Painting emotions. Each creation is a narrative 
            of light, form, and the poetry of inhabitation.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 animate-fade-up opacity-0 stagger-4">
            <Button variant="hero" size="xl" asChild>
              <Link to="/vision">
                Explore the Vision
                <ArrowRight size={16} />
              </Link>
            </Button>
            <Button variant="heroOutline" size="xl" asChild>
              <Link to="/collection">
                View the Collection
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-float">
        <div className="flex flex-col items-center gap-3">
          <span className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground font-sans">
            Scroll
          </span>
          <div className="w-px h-16 bg-gradient-to-b from-accent via-accent/50 to-transparent" />
        </div>
      </div>
    </section>
  );
};
