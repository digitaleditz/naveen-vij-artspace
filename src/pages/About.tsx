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
      <section className="pt-40 pb-24 container-wide">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div>
            <div className="inline-block mb-8">
              <p className="text-[10px] uppercase tracking-[0.4em] text-accent font-sans">
                About the Artist
              </p>
              <div className="section-divider mt-4 mx-0" />
            </div>
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl mb-8 leading-[1.1]">
              Naveen Vij
            </h1>
            <p className="text-xl text-muted-foreground font-sans leading-relaxed mb-6 font-light">
              Architect. Interior Designer. Artist.
            </p>
            <p className="text-muted-foreground font-sans leading-relaxed text-lg">
              With over 25 years of experience shaping spaces and creating art, 
              Naveen Vij has developed a unique practice that bridges the worlds 
              of architecture, interior design, and fine art.
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
            {/* Decorative frame */}
            <div className="absolute -bottom-6 -right-6 w-full h-full border border-accent/20 -z-10" />
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="section-padding bg-secondary/50">
        <div className="container-wide">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-[10px] uppercase tracking-[0.4em] text-accent font-sans mb-4">
                Philosophy
              </p>
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-4">
                Where Space Becomes Story
              </h2>
              <div className="section-divider mt-8" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              <div className="premium-card p-10">
                <h3 className="font-serif text-2xl mb-6 text-accent">On Design</h3>
                <p className="text-muted-foreground font-sans leading-relaxed text-lg italic">
                  "Every space has a soul waiting to be discovered. My role as a 
                  designer is not to impose a style, but to listen deeply—to the 
                  architecture, to the light, to the people who will inhabit it—
                  and then create an environment that feels inevitable, as if it 
                  could never have been any other way."
                </p>
              </div>
              <div className="premium-card p-10">
                <h3 className="font-serif text-2xl mb-6 text-accent">On Art</h3>
                <p className="text-muted-foreground font-sans leading-relaxed text-lg italic">
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            <div className="relative">
              <div className="aspect-[4/3] overflow-hidden image-reveal">
                <img
                  src={heroInterior}
                  alt="Interior by Naveen Vij"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -top-6 -left-6 w-full h-full border border-accent/20 -z-10" />
            </div>
            <div className="flex flex-col justify-center">
              <h2 className="font-serif text-4xl md:text-5xl mb-10">The Journey</h2>
              <div className="space-y-8 text-muted-foreground font-sans leading-relaxed text-lg">
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
          <div className="text-center mb-20">
            <p className="text-[10px] uppercase tracking-[0.4em] text-accent font-sans mb-4">
              Career
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
                {/* Line */}
                {index < milestones.length - 1 && (
                  <div className="absolute left-[80px] top-10 bottom-0 w-px bg-gradient-to-b from-accent/50 to-border" />
                )}
                
                {/* Year */}
                <div className="w-[160px] flex-shrink-0 text-right">
                  <span className="font-serif text-2xl text-accent group-hover:text-gold transition-colors">
                    {milestone.year}
                  </span>
                </div>
                
                {/* Dot */}
                <div className="absolute left-[77px] top-2 w-2 h-2 rounded-full bg-accent group-hover:scale-150 transition-transform" />
                
                {/* Content */}
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
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        
        <div className="container-wide text-center relative z-10">
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-8">
            Let's Create Something Beautiful
          </h2>
          <p className="text-primary-foreground/60 font-sans text-lg mb-12 max-w-2xl mx-auto leading-relaxed">
            Whether you're envisioning a new interior or seeking a meaningful piece of art, 
            I'd love to hear your story.
          </p>
          <Button variant="gold" size="xl" asChild>
            <Link to="/contact">
              Get in Touch
              <ArrowRight size={16} />
            </Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default About;
