import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowDown } from "lucide-react";
import heroInterior from "@/assets/hero-interior.jpg";

export const HeroSection = () => {
  const scrollToArtExperience = () => {
    const artSection = document.getElementById("art-experience");
    if (artSection) {
      artSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative h-screen flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroInterior}
          alt="Artistic space"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="container-wide relative z-10 pt-24 pb-20">
        <div className="max-w-xl lg:max-w-2xl">
          <div className="inline-block mb-6 animate-fade-up opacity-0 stagger-1">
            <p className="text-[10px] uppercase tracking-[0.4em] text-accent font-sans">
              Artist · Architect · Chronic Overthinker
            </p>
            <div className="section-divider mt-3 mx-0" />
          </div>
          
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05] mb-6 animate-fade-up opacity-0 stagger-2">
            Where Art
            <span className="block text-accent mt-1">Meets Architecture</span>
          </h1>
          
          <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground font-sans leading-relaxed mb-10 max-w-lg animate-fade-up opacity-0 stagger-3 font-light">
            Paintings, sculptures, murals—each one born from curiosity, 
            a healthy disregard for staying in one lane, and way too much coffee.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 animate-fade-up opacity-0 stagger-4">
            <Button variant="hero" size="lg" asChild>
              <Link to="/collection">
                Explore the Collection
                <ArrowRight size={16} />
              </Link>
            </Button>
            <Button variant="heroOutline" size="lg" asChild>
              <Link to="/the-architect">
                Meet the Artist
              </Link>
            </Button>
          </div>
        </div>
      </div>

    </section>
  );
};
