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
    title: "Residential Interiors",
    description: "Complete home transformations from concept to completion",
    features: ["Space Planning", "Material Selection", "Furniture Curation", "Art Integration"],
  },
  {
    title: "Commercial Spaces",
    description: "Offices, cafés, restaurants and boutique retail designs",
    features: ["Brand Integration", "Functional Flow", "Custom Fixtures", "Lighting Design"],
  },
  {
    title: "Renovation & Makeovers",
    description: "Breathing new life into existing spaces",
    features: ["Structure Assessment", "Modern Updates", "Budget Optimization", "Timeline Management"],
  },
  {
    title: "Design Consultation",
    description: "Expert guidance for your design decisions",
    features: ["Style Direction", "Color Schemes", "Material Advice", "Vendor Recommendations"],
  },
];

const process = [
  { step: "01", title: "Discovery", description: "Understanding your vision, lifestyle, and aspirations" },
  { step: "02", title: "Concept", description: "Crafting the aesthetic direction and material palette" },
  { step: "03", title: "Visualization", description: "Bringing your space to life before construction" },
  { step: "04", title: "Execution", description: "Meticulous site coordination and quality control" },
  { step: "05", title: "Styling", description: "The finishing touches that make a house a home" },
];

const projects = [
  {
    id: 1,
    title: "Serene Residence",
    location: "Mumbai",
    type: "Residential",
    description: "A minimal luxury apartment where clean lines meet warm textures",
    image: project1,
  },
  {
    id: 2,
    title: "The Dining Room",
    location: "Delhi",
    type: "Residential",
    description: "An elegant space designed for intimate gatherings and celebrations",
    image: project2,
  },
  {
    id: 3,
    title: "Artisan Café",
    location: "Bangalore",
    type: "Commercial",
    description: "A boutique café that celebrates craft coffee and local artistry",
    image: project3,
  },
  {
    id: 4,
    title: "Skyline Penthouse",
    location: "Mumbai",
    type: "Residential",
    description: "Panoramic views meet sophisticated interior design",
    image: heroInterior,
  },
];

const Interiors = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative min-h-[80vh] flex items-center">
        <div className="absolute inset-0">
          <img
            src={heroInterior}
            alt="Interior Design by Naveen Vij"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/40" />
        </div>
        
        <div className="container-wide relative z-10 pt-32">
          <div className="max-w-2xl">
            <div className="inline-block mb-8">
              <p className="text-[10px] uppercase tracking-[0.4em] text-accent font-sans">
                Interior Design Studio
              </p>
              <div className="section-divider mt-4 mx-0" />
            </div>
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl mb-8 leading-[1.1]">
              Interior Design
              <span className="block mt-2">That Feels Like Art</span>
            </h1>
            <p className="text-xl text-muted-foreground font-sans leading-relaxed max-w-lg font-light">
              Bespoke interiors that balance aesthetics with functionality, 
              creating spaces that inspire and elevate everyday living.
            </p>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="section-padding bg-secondary/50">
        <div className="container-wide">
          <div className="text-center mb-20">
            <p className="text-[10px] uppercase tracking-[0.4em] text-accent font-sans mb-4">
              What We Offer
            </p>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl">
              Design Services
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
              The Design Process
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
              Our Work
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
            Ready to Start Your Project?
          </h2>
          <p className="text-primary-foreground/60 font-sans text-lg mb-12 max-w-2xl mx-auto leading-relaxed">
            Let's discuss your vision and create a space that truly reflects your personality and lifestyle.
          </p>
          <Button variant="gold" size="xl" asChild>
            <Link to="/contact">
              Request a Consultation
              <ArrowRight size={16} />
            </Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Interiors;
