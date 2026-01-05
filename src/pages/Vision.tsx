import { Layout } from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import heroInterior from "@/assets/hero-interior.jpg";
import artwork1 from "@/assets/artwork-1.jpg";
import artwork2 from "@/assets/artwork-2.jpg";
import project1 from "@/assets/project-1.jpg";

const Vision = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="pt-40 pb-24 container-wide">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-block mb-8">
            <p className="text-[10px] uppercase tracking-[0.4em] text-accent font-sans">
              The Philosophy
            </p>
            <div className="section-divider mt-4" />
          </div>
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl mb-10 leading-[1.1]">
            Where Architecture
            <span className="block text-accent mt-2">Becomes Art</span>
          </h1>
          <p className="text-xl text-muted-foreground font-sans leading-relaxed max-w-3xl mx-auto font-light">
            Every painting I create is a space I've designed in my mind. 
            Every space I design carries the emotion of a painting. 
            This is the dialogue between my two practices.
          </p>
        </div>
      </section>

      {/* The Connection */}
      <section className="section-padding bg-secondary/50">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <div className="mb-8">
                <p className="text-[10px] uppercase tracking-[0.4em] text-accent font-sans mb-4">
                  The Connection
                </p>
                <div className="section-divider mx-0" />
              </div>
              <h2 className="font-serif text-4xl md:text-5xl mb-10 leading-tight">
                Architecture Inspires the Canvas
              </h2>
              <div className="space-y-8 text-muted-foreground font-sans leading-relaxed text-lg">
                <p>
                  Before I design a space, I see it as a painting. The way light 
                  falls through a window, the rhythm of walls and voids, the 
                  emotional weight of materials—these are the elements I explore 
                  on canvas before they become built form.
                </p>
                <p>
                  My paintings are architectural studies—not blueprints, but 
                  emotional explorations of what a space might feel like. They 
                  capture the essence of design thinking: the search for harmony 
                  between form and feeling.
                </p>
                <blockquote className="border-l-2 border-accent pl-8 py-2 text-foreground italic text-xl">
                  "I paint what I wish to build, and build what I've already painted 
                  in my imagination."
                </blockquote>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="aspect-[3/4] overflow-hidden image-reveal">
                <img
                  src={artwork1}
                  alt="Architectural painting study"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-[3/4] overflow-hidden image-reveal mt-16">
                <img
                  src={project1}
                  alt="Completed interior space"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Paintings to Spaces */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="order-2 lg:order-1 relative">
              <div className="aspect-[4/3] overflow-hidden image-reveal">
                <img
                  src={heroInterior}
                  alt="Interior with integrated artwork"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-full h-full border border-accent/20 -z-10" />
            </div>
            <div className="order-1 lg:order-2">
              <div className="mb-8">
                <p className="text-[10px] uppercase tracking-[0.4em] text-accent font-sans mb-4">
                  The Dialogue
                </p>
                <div className="section-divider mx-0" />
              </div>
              <h2 className="font-serif text-4xl md:text-5xl mb-10 leading-tight">
                Paintings Become Spaces
              </h2>
              <div className="space-y-8 text-muted-foreground font-sans leading-relaxed text-lg">
                <p>
                  The reverse is equally true. Sometimes a painting I've created 
                  inspires an entire interior project. The color palette, the mood, 
                  the sense of movement—these elements translate directly into 
                  spatial design.
                </p>
                <p>
                  When my paintings find homes in spaces I've designed, there's a 
                  profound completeness. The artwork doesn't merely hang on a wall—
                  it becomes part of the architecture, a visual anchor that gives 
                  meaning to the space around it.
                </p>
                <p>
                  This is why I believe art and architecture cannot be separated. 
                  They are two expressions of the same creative vision.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Language */}
      <section className="section-padding bg-cream">
        <div className="container-wide">
          <div className="text-center mb-20">
            <p className="text-[10px] uppercase tracking-[0.4em] text-accent font-sans mb-4">
              The Visual Language
            </p>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-6">
              Themes That Unite Both Practices
            </h2>
            <div className="section-divider mt-8" />
            <p className="text-muted-foreground font-sans text-lg max-w-2xl mx-auto mt-8">
              Whether in paint or in built form, certain themes define my work.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Light & Shadow",
                description: "The play of natural light defines both my architecture and my paintings. I chase the golden hour in both mediums—the moment when form becomes luminous.",
              },
              {
                title: "Negative Space",
                description: "What I don't paint is as important as what I do. Empty space creates rhythm, invites the eye to rest, and gives meaning to the elements that remain.",
              },
              {
                title: "Emotional Geometry",
                description: "Lines and forms carry feeling. A vertical speaks of aspiration, a horizontal of calm. I compose with geometric shapes that evoke specific emotions.",
              },
            ].map((theme, index) => (
              <div 
                key={theme.title} 
                className="premium-card p-10 text-center group"
              >
                <span className="text-5xl font-serif text-accent/30 mb-6 block">
                  0{index + 1}
                </span>
                <h3 className="font-serif text-2xl mb-6 group-hover:text-accent transition-colors">
                  {theme.title}
                </h3>
                <p className="text-muted-foreground font-sans leading-relaxed">
                  {theme.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Process */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
            <div>
              <div className="mb-8">
                <p className="text-[10px] uppercase tracking-[0.4em] text-accent font-sans mb-4">
                  The Process
                </p>
                <div className="section-divider mx-0" />
              </div>
              <h2 className="font-serif text-4xl md:text-5xl mb-12 leading-tight">
                From Thought to Tangible
              </h2>
              <div className="space-y-10">
                {[
                  {
                    step: "01",
                    title: "The Feeling",
                    text: "Every work begins with an emotion—a memory, a moment of light, a sense of place that demands to be expressed.",
                  },
                  {
                    step: "02",
                    title: "The Sketch",
                    text: "Quick studies on paper capture the essence. These raw drawings hold the energy that more finished work sometimes loses.",
                  },
                  {
                    step: "03",
                    title: "The Dialogue",
                    text: "The canvas or the space talks back. I listen, adjust, respond. The best work emerges from this conversation.",
                  },
                  {
                    step: "04",
                    title: "The Resolution",
                    text: "There's a moment when the work is complete—when adding more would diminish rather than enhance.",
                  },
                ].map((item) => (
                  <div key={item.step} className="flex gap-8 group">
                    <span className="font-serif text-4xl text-accent/40 group-hover:text-accent transition-colors">
                      {item.step}
                    </span>
                    <div>
                      <h3 className="font-serif text-xl mb-3">{item.title}</h3>
                      <p className="text-muted-foreground font-sans leading-relaxed">
                        {item.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="sticky top-32 relative">
              <div className="aspect-[3/4] overflow-hidden image-reveal">
                <img
                  src={artwork2}
                  alt="Work in progress"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -top-6 -right-6 w-full h-full border border-accent/20 -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        
        <div className="container-wide text-center relative z-10">
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-8">
            Experience the Vision
          </h2>
          <p className="text-primary-foreground/60 font-sans text-lg mb-12 max-w-2xl mx-auto leading-relaxed">
            Explore the paintings that emerge from this philosophy, or discover 
            how these ideas translate into designed spaces.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button variant="gold" size="xl" asChild>
              <Link to="/collection">
                View the Collection
                <ArrowRight size={16} />
              </Link>
            </Button>
            <Button 
              variant="heroOutline" 
              size="xl" 
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
              asChild
            >
              <Link to="/interiors">
                Explore Interiors
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Vision;
