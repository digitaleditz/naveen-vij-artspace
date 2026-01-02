import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const CTASection = () => {
  return (
    <section className="section-padding bg-sand">
      <div className="container-wide">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-accent font-sans mb-6">
            Begin the Conversation
          </p>
          
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl mb-8">
            Let's Create Something Meaningful
          </h2>
          
          <p className="text-muted-foreground font-sans text-lg leading-relaxed mb-12 max-w-2xl mx-auto">
            Whether you're envisioning a new space, seeking to acquire a piece 
            that speaks to you, or simply wish to understand the philosophy 
            behind the work—I'd be honored to connect.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="lg" asChild>
              <Link to="/contact">
                Start a Conversation
                <ArrowRight size={16} />
              </Link>
            </Button>
            <Button variant="heroOutline" size="lg" asChild>
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
