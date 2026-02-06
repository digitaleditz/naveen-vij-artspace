import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const CTASection = () => {
  return (
    <section className="section-padding bg-sand relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
      
      <div className="container-wide relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-block mb-6">
            <p className="text-[10px] uppercase tracking-[0.4em] text-accent font-sans">
              Acquire a Story
            </p>
            <div className="section-divider mt-3" />
          </div>
          
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl mb-8 leading-tight">
            Every Painting Awaits Its Home
          </h2>
          
          <p className="text-muted-foreground font-sans text-base md:text-lg leading-relaxed mb-10 max-w-xl mx-auto">
            When you acquire a piece, you're not just buying art—you're inviting 
            a story into your space. A narrative of light, form, and emotion 
            that will grow with you over time.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="lg" asChild>
              <Link to="/collection">
                View the Collection
                <ArrowRight size={16} />
              </Link>
            </Button>
            <Button variant="heroOutline" size="lg" asChild>
              <Link to="/contact">
                Commission a Piece
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
