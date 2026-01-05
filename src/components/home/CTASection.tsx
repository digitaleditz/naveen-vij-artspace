import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const CTASection = () => {
  return (
    <section className="section-padding bg-sand relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
      
      <div className="container-wide relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block mb-8">
            <p className="text-[10px] uppercase tracking-[0.4em] text-accent font-sans">
              Begin the Conversation
            </p>
            <div className="section-divider mt-4" />
          </div>
          
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-10 leading-tight">
            Let's Create Something Meaningful
          </h2>
          
          <p className="text-muted-foreground font-sans text-lg leading-relaxed mb-14 max-w-2xl mx-auto">
            Whether you're envisioning a new space, seeking to acquire a piece 
            that speaks to you, or simply wish to understand the philosophy 
            behind the work—I'd be honored to connect.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <Button variant="hero" size="xl" asChild>
              <Link to="/contact">
                Start a Conversation
                <ArrowRight size={16} />
              </Link>
            </Button>
            <Button variant="heroOutline" size="xl" asChild>
              <Link to="/collection">
                Explore the Collection
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
