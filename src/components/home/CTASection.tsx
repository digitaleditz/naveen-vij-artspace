import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const CTASection = () => {
  return (
    <section className="section-padding bg-sand">
      <div className="container-wide">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-accent font-sans mb-6">
            Let's Create Together
          </p>
          
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl mb-8">
            Ready to Transform Your Space?
          </h2>
          
          <p className="text-muted-foreground font-sans text-lg leading-relaxed mb-12 max-w-2xl mx-auto">
            Whether you're looking to redesign your home, create an inspiring workspace, 
            or find the perfect piece of art, I'd love to hear from you.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="lg" asChild>
              <Link to="/contact">
                Book a Consultation
                <ArrowRight size={16} />
              </Link>
            </Button>
            <Button variant="heroOutline" size="lg" asChild>
              <Link to="/gallery">
                Enquire About Art
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
