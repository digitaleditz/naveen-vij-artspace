import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import project1 from "@/assets/project-1.jpg";
import project2 from "@/assets/project-2.jpg";
import project3 from "@/assets/project-3.jpg";
import heroInterior from "@/assets/hero-interior.jpg";

const services = [
  {
    title: "Residential Architecture",
    description: "Complete home design from foundation to finishing touches",
    features: ["Master Planning", "Structural Design", "Interior Integration", "Landscape Design"],
  },
  {
    title: "Commercial Buildings",
    description: "Offices, retail spaces, hospitality and institutional projects",
    features: ["Concept Development", "Building Systems", "Sustainability", "Regulatory Compliance"],
  },
  {
    title: "Renovation & Restoration",
    description: "Thoughtful transformation of existing structures",
    features: ["Heritage Conservation", "Adaptive Reuse", "Modern Upgrades", "Structural Enhancement"],
  },
  {
    title: "Design Consultation",
    description: "Expert architectural guidance for your vision",
    features: ["Feasibility Studies", "Design Direction", "Material Expertise", "Project Coordination"],
  },
];

const process = [
  { step: "01", title: "Envision", description: "Understanding your aspirations, site, and context" },
  { step: "02", title: "Design", description: "Crafting the architectural concept and spatial narrative" },
  { step: "03", title: "Develop", description: "Technical drawings, specifications and approvals" },
  { step: "04", title: "Build", description: "Construction oversight and quality assurance" },
  { step: "05", title: "Inhabit", description: "Final details that transform structure into sanctuary" },
];

const projects = [
  {
    id: 1,
    title: "The Serene Villa",
    location: "Mumbai",
    type: "Residential",
    description: "A contemporary residence where architectural form meets natural landscape",
    image: project1,
  },
  {
    id: 2,
    title: "Heritage House",
    location: "Delhi",
    type: "Restoration",
    description: "Reviving colonial elegance with modern sensibilities",
    image: project2,
  },
  {
    id: 3,
    title: "Artisan Coffee Roastery",
    location: "Bangalore",
    type: "Commercial",
    description: "An industrial-inspired space celebrating craft and community",
    image: project3,
  },
  {
    id: 4,
    title: "Skyline Residence",
    location: "Mumbai",
    type: "Residential",
    description: "A penthouse where architecture frames panoramic city views",
    image: heroInterior,
  },
];

const Architecture = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative min-h-[80vh] flex items-center">
        <div className="absolute inset-0">
          <img
            src={heroInterior}
            alt="Architecture by Naveen Vij"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/40" />
        </div>
        
        <div className="container-wide relative z-10 pt-32">
          <div className="max-w-2xl">
            <div className="inline-block mb-8">
              <p className="text-[10px] uppercase tracking-[0.4em] text-accent font-sans">
                Architecture Studio
              </p>
              <div className="section-divider mt-4 mx-0" />
            </div>
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl mb-8 leading-[1.1]">
              Architecture
              <span className="block mt-2">As Living Art</span>
            </h1>
            <p className="text-xl text-muted-foreground font-sans leading-relaxed max-w-lg font-light">
              From concept sketches to completed structures, we design buildings 
              that tell stories, embrace their surroundings, and elevate the human experience.
            </p>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="section-padding bg-secondary/50">
        <div className="container-wide">
          <div className="text-center mb-20">
            <p className="text-[10px] uppercase tracking-[0.4em] text-accent font-sans mb-4">
              Full-Service Architecture
            </p>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl">
              Our Expertise
            </h2>
            <div className="section-divider mt-8" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service) => (
              <div
                key={service.title}
                className="premium-card p-10 group"
              >
                <h3 className="font-serif text-2xl mb-6 group-hover:text-accent transition-colors">
                  {service.title}
                </h3>
                <p className="text-muted-foreground font-sans mb-8 leading-relaxed">
                  {service.description}
                </p>
                <ul className="space-y-3">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 font-sans text-sm">
                      <Check size={14} className="text-accent flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="text-center mb-20">
            <p className="text-[10px] uppercase tracking-[0.4em] text-accent font-sans mb-4">
              How We Work
            </p>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl">
              The Design Journey
            </h2>
            <div className="section-divider mt-8" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {process.map((item, index) => (
              <div key={item.step} className="text-center group relative">
                <span className="font-serif text-5xl text-accent/30 mb-6 block group-hover:text-accent transition-colors">
                  {item.step}
                </span>
                <h3 className="font-serif text-xl mb-3">{item.title}</h3>
                <p className="text-sm text-muted-foreground font-sans leading-relaxed">
                  {item.description}
                </p>
                {index < process.length - 1 && (
                  <div className="hidden md:block absolute right-0 top-8 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio */}
      <section className="section-padding bg-cream">
        <div className="container-wide">
          <div className="text-center mb-20">
            <p className="text-[10px] uppercase tracking-[0.4em] text-accent font-sans mb-4">
              Selected Works
            </p>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl">
              Project Portfolio
            </h2>
            <div className="section-divider mt-8" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {projects.map((project) => (
              <div key={project.id} className="group cursor-pointer">
                <div className="aspect-[4/3] overflow-hidden image-reveal mb-8 relative">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-all duration-500" />
                </div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-sans mb-3">
                  {project.type} • {project.location}
                </p>
                <h3 className="font-serif text-3xl mb-3 group-hover:text-accent transition-colors">
                  {project.title}
                </h3>
                <p className="text-muted-foreground font-sans leading-relaxed">
                  {project.description}
                </p>
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
            Let's Build Something Remarkable
          </h2>
          <p className="text-primary-foreground/60 font-sans text-lg mb-12 max-w-2xl mx-auto leading-relaxed">
            Whether you're envisioning a new home, renovating a heritage property, 
            or planning a commercial space—let's create architecture that inspires.
          </p>
          <Button variant="gold" size="xl" asChild>
            <Link to="/contact">
              Start a Conversation
              <ArrowRight size={16} />
            </Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Architecture;
