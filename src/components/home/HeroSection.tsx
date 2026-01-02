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
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-transparent" />
      </div>

      {/* Content */}
      <div className="container-wide relative z-10 pt-32 pb-20">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.3em] text-accent font-sans mb-6 animate-fade-up opacity-0 stagger-1">
            Architect • Designer • Artist
          </p>
          
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl leading-[1.1] mb-6 animate-fade-up opacity-0 stagger-2">
            Architecture, Art
            <span className="block text-accent">& Stories</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground font-sans leading-relaxed mb-10 max-w-lg animate-fade-up opacity-0 stagger-3">
            Designing spaces. Painting emotions. Each creation is a narrative 
            of light, form, and the poetry of inhabitation.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 animate-fade-up opacity-0 stagger-4">
            <Button variant="hero" size="lg" asChild>
              <Link to="/vision">
                Explore the Vision
                <ArrowRight size={16} />
              </Link>
            </Button>
            <Button variant="heroOutline" size="lg" asChild>
              <Link to="/collection">
                View the Paintings
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
        <div className="w-px h-16 bg-gradient-to-b from-transparent via-accent to-transparent" />
      </div>
    </section>
  );
};
