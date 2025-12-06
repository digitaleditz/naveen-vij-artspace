import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import naveenPortrait from "@/assets/naveen-portrait.jpg";
import heroInterior from "@/assets/hero-interior.jpg";

const milestones = [
  { year: "1998", title: "Architecture Degree", description: "Graduated from School of Planning and Architecture" },
  { year: "2003", title: "First Studio", description: "Established Vij Design Studio in Mumbai" },
  { year: "2010", title: "Art Journey Begins", description: "First solo painting exhibition" },
  { year: "2015", title: "Award Recognition", description: "IIID Award for Residential Design" },
  { year: "2020", title: "Art & Design Fusion", description: "Launch of integrated art-interior concept" },
  { year: "Present", title: "Continuing the Vision", description: "Creating spaces and stories worldwide" },
];

const About = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-20 container-wide">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-accent font-sans mb-6">
              About the Artist
            </p>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-8 leading-tight">
              Naveen Vij
            </h1>
            <p className="text-xl text-muted-foreground font-sans leading-relaxed mb-6">
              Architect. Interior Designer. Artist.
            </p>
            <p className="text-muted-foreground font-sans leading-relaxed">
              With over 25 years of experience shaping spaces and creating art, 
              Naveen Vij has developed a unique practice that bridges the worlds 
              of architecture, interior design, and fine art.
            </p>
          </div>
          <div className="aspect-[4/5] overflow-hidden image-reveal">
            <img
              src={naveenPortrait}
              alt="Naveen Vij"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="section-padding bg-secondary">
        <div className="container-wide">
          <div className="max-w-4xl mx-auto">
            <p className="text-xs uppercase tracking-[0.3em] text-accent font-sans mb-6 text-center">
              Philosophy
            </p>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl mb-12 text-center">
              Where Space Becomes Story
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h3 className="font-serif text-xl mb-4 text-accent">On Design</h3>
                <p className="text-muted-foreground font-sans leading-relaxed">
                  "Every space has a soul waiting to be discovered. My role as a 
                  designer is not to impose a style, but to listen deeply—to the 
                  architecture, to the light, to the people who will inhabit it—
                  and then create an environment that feels inevitable, as if it 
                  could never have been any other way."
                </p>
              </div>
              <div>
                <h3 className="font-serif text-xl mb-4 text-accent">On Art</h3>
                <p className="text-muted-foreground font-sans leading-relaxed">
                  "My paintings are extensions of my architectural thinking. They 
                  explore the same themes—light, form, negative space, emotion—but 
                  freed from the constraints of function. Art allows me to express 
                  what architecture sometimes cannot: the purely emotional, the 
                  abstract, the deeply personal."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bio */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            <div className="aspect-[4/3] overflow-hidden image-reveal">
              <img
                src={heroInterior}
                alt="Interior by Naveen Vij"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="font-serif text-3xl md:text-4xl mb-8">The Journey</h2>
              <div className="space-y-6 text-muted-foreground font-sans leading-relaxed">
                <p>
                  Born and raised in Delhi, Naveen developed an early fascination with 
                  both the built environment and visual art. His architect father and 
                  artist mother created a home where design and creativity were woven 
                  into everyday life.
                </p>
                <p>
                  After graduating from the School of Planning and Architecture, 
                  Naveen spent his early career working with leading architectural 
                  firms before establishing his own studio in Mumbai. His interiors 
                  quickly gained recognition for their thoughtful approach to space, 
                  light, and material.
                </p>
                <p>
                  The parallel journey as an artist began almost by accident—a series 
                  of sketches for a client project evolved into a passion for painting. 
                  Today, his canvases often find homes in the very spaces he designs, 
                  creating a seamless dialogue between architecture and art.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding bg-cream">
        <div className="container-wide">
          <div className="text-center mb-16">
            <p className="text-xs uppercase tracking-[0.3em] text-accent font-sans mb-4">
              Career
            </p>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl">
              Milestones
            </h2>
          </div>

          <div className="max-w-3xl mx-auto">
            {milestones.map((milestone, index) => (
              <div
                key={milestone.year}
                className="flex gap-8 pb-12 relative"
              >
                {/* Line */}
                {index < milestones.length - 1 && (
                  <div className="absolute left-[60px] top-8 bottom-0 w-px bg-border" />
                )}
                
                {/* Year */}
                <div className="w-[120px] flex-shrink-0 text-right">
                  <span className="font-serif text-xl text-accent">{milestone.year}</span>
                </div>
                
                {/* Content */}
                <div>
                  <h3 className="font-serif text-lg mb-2">{milestone.title}</h3>
                  <p className="text-muted-foreground font-sans text-sm">
                    {milestone.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-primary text-primary-foreground">
        <div className="container-wide text-center">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl mb-8">
            Let's Create Something Beautiful
          </h2>
          <p className="text-primary-foreground/70 font-sans text-lg mb-10 max-w-2xl mx-auto">
            Whether you're envisioning a new interior or seeking a meaningful piece of art, 
            I'd love to hear your story.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="gold" size="xl" asChild>
              <Link to="/contact">
                Get in Touch
                <ArrowRight size={16} />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
