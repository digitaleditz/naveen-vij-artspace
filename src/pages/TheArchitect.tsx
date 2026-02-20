import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import naveenPortrait from "@/assets/naveen-portrait.jpg";
import heroInterior from "@/assets/hero-interior.jpg";

const milestones = [
  { year: "1982", title: "Architecture Graduate", description: "Graduated from Chandigarh College of Architecture" },
  { year: "1983", title: "Design Studio", description: "Established a design studio bridging architecture and visual art" },
  { year: "Pioneer", title: "3D Visualisation", description: "Recognised as a pioneer in introducing sketching and 3D visualisation within India's architectural fraternity" },
  { year: "Ongoing", title: "Multidisciplinary Practice", description: "Expanding across painting, sculpture, murals, product design, and architecture" },
  { year: "Present", title: "New Terrains", description: "Each canvas becomes a new terrain of discovery—driven by curiosity, play, and reinvention" },
];

const TheArchitect = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="pt-40 pb-24 container-wide">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div>
            <div className="inline-block mb-8">
              <p className="text-[10px] uppercase tracking-[0.4em] text-accent font-sans">
                The Artist
              </p>
              <div className="section-divider mt-4 mx-0" />
            </div>
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl mb-8 leading-[1.1]">
              Naveen Vij
            </h1>
            <p className="text-xl text-muted-foreground font-sans leading-relaxed mb-6 font-light italic">
              "Each canvas becomes a new terrain of discovery."
            </p>
            <p className="text-muted-foreground font-sans leading-relaxed text-lg">
              An artist whose practice extends across painting, sculpture, murals, 
              product design, and architecture. At the core of his work lies a deeply 
              personal visual inquiry driven by curiosity, play, and an instinctive 
              engagement with space, material, and narrative.
            </p>
          </div>
          <div className="relative">
            <div className="aspect-[4/5] overflow-hidden image-reveal">
              <img
                src={naveenPortrait}
                alt="Naveen Vij"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-full h-full border border-accent/20 -z-10" />
          </div>
        </div>
      </section>

      {/* The Architectural Mind */}
      <section className="section-padding bg-secondary/50">
        <div className="container-wide">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-[10px] uppercase tracking-[0.4em] text-accent font-sans mb-4">
                The Foundation
              </p>
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-4">
                Where Art Meets Architecture
              </h2>
              <div className="section-divider mt-8" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              <div className="premium-card p-10">
                <h3 className="font-serif text-2xl mb-6 text-accent">The Architectural Eye</h3>
                <p className="text-muted-foreground font-sans leading-relaxed text-lg">
                  Recognised as a pioneer in introducing sketching and three-dimensional 
                  visualisation within the architectural fraternity of India, his profound 
                  understanding of perspective remains central to his artistic language, 
                  lending his works a distinctive spatial depth and structure.
                </p>
              </div>
              <div className="premium-card p-10">
                <h3 className="font-serif text-2xl mb-6 text-accent">Art & Space in Dialogue</h3>
                <p className="text-muted-foreground font-sans leading-relaxed text-lg">
                  His paintings frequently inhabit the architectural environments he conceives, 
                  creating a seamless dialogue between art and space, where each informs and 
                  enriches the other. His art continuously explores new forms of expression, 
                  often dissolving the boundaries between artistic imagination and functional design.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Journey */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            <div className="relative">
              <div className="aspect-[4/3] overflow-hidden image-reveal">
                <img
                  src={heroInterior}
                  alt="Naveen Vij's artistic environment"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -top-6 -left-6 w-full h-full border border-accent/20 -z-10" />
            </div>
            <div className="flex flex-col justify-center">
              <h2 className="font-serif text-4xl md:text-5xl mb-10">The Journey</h2>
              <div className="space-y-8 text-muted-foreground font-sans leading-relaxed text-lg">
                <p>
                  After graduating from the Chandigarh College of Architecture in 1982, 
                  Naveen established a design studio that evolved alongside his parallel 
                  and increasingly significant journey as a visual artist.
                </p>
                <p>
                  His diverse and ever-evolving oeuvre ranges from evocative abstract 
                  compositions and nostalgic old-world streetscapes to satirical realist 
                  works marked by wit and quiet humour.
                </p>
                <p>
                  At times his work reveals a childlike spontaneity and freedom; at others, 
                  the precision and discipline of his architectural training. This constant 
                  shift in tone and expression reflects an artist driven by reinvention, 
                  for whom each canvas becomes a new terrain of discovery.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="section-padding bg-cream">
        <div className="container-wide">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-[10px] uppercase tracking-[0.4em] text-accent font-sans mb-6">
              Philosophy
            </p>
            <blockquote className="font-serif text-3xl md:text-4xl lg:text-5xl leading-tight mb-8 text-foreground">
              "At the core of his work lies
              <span className="block mt-2 text-accent">
                a deeply personal visual inquiry."
              </span>
            </blockquote>
            <p className="text-muted-foreground font-sans leading-relaxed text-lg max-w-2xl mx-auto">
              Driven by curiosity, play, and an instinctive engagement with space, 
              material, and narrative—his art continuously explores new forms of expression, 
              often dissolving the boundaries between artistic imagination and functional design.
            </p>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="text-center mb-20">
            <p className="text-[10px] uppercase tracking-[0.4em] text-accent font-sans mb-4">
              Evolution
            </p>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl">
              Milestones
            </h2>
            <div className="section-divider mt-8" />
          </div>

          <div className="max-w-4xl mx-auto">
            {milestones.map((milestone, index) => (
              <div
                key={milestone.year}
                className="flex gap-12 pb-16 relative group"
              >
                {index < milestones.length - 1 && (
                  <div className="absolute left-[80px] top-10 bottom-0 w-px bg-gradient-to-b from-accent/50 to-border" />
                )}
                
                <div className="w-[160px] flex-shrink-0 text-right">
                  <span className="font-serif text-2xl text-accent group-hover:text-gold transition-colors">
                    {milestone.year}
                  </span>
                </div>
                
                <div className="absolute left-[77px] top-2 w-2 h-2 rounded-full bg-accent group-hover:scale-150 transition-transform" />
                
                <div className="pt-0.5">
                  <h3 className="font-serif text-xl mb-3">{milestone.title}</h3>
                  <p className="text-muted-foreground font-sans">
                    {milestone.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        
        <div className="container-wide text-center relative z-10">
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-8">
            Experience the Collection
          </h2>
          <p className="text-primary-foreground/60 font-sans text-lg mb-12 max-w-2xl mx-auto leading-relaxed">
            Each painting is a story waiting to be acquired. 
            Explore the collection and find the piece that speaks to you.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <Button variant="gold" size="xl" asChild>
              <Link to="/collection">
                View Collection
                <ArrowRight size={16} />
              </Link>
            </Button>
            <Button variant="heroOutline" size="xl" asChild className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
              <Link to="/contact">
                Get in Touch
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default TheArchitect;
