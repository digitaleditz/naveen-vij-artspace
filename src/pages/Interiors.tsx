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
  { step: "01", title: "Discovery & Brief", description: "Understanding your vision, lifestyle, and aspirations" },
  { step: "02", title: "Concept & Moodboards", description: "Crafting the aesthetic direction and material palette" },
  { step: "03", title: "3D Visualization", description: "Bringing your space to life before construction begins" },
  { step: "04", title: "Execution", description: "Meticulous site coordination and quality control" },
  { step: "05", title: "Art & Styling", description: "The finishing touches that make a house a home" },
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
      <section className="relative min-h-[70vh] flex items-center">
        <div className="absolute inset-0">
          <img
            src={heroInterior}
            alt="Interior Design by Naveen Vij"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-background/30" />
        </div>
        
        <div className="container-wide relative z-10 pt-32">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.3em] text-accent font-sans mb-6">
              Interior Design Studio
            </p>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-6 leading-tight">
              Interior Design
              <span className="block">That Feels Like Art</span>
            </h1>
            <p className="text-lg text-muted-foreground font-sans leading-relaxed max-w-lg">
              Bespoke interiors that balance aesthetics with functionality, 
              creating spaces that inspire and elevate everyday living.
            </p>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="section-padding bg-secondary">
        <div className="container-wide">
          <div className="text-center mb-16">
            <p className="text-xs uppercase tracking-[0.3em] text-accent font-sans mb-4">
              What We Offer
            </p>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl">
              Design Services
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div
                key={service.title}
                className="bg-background p-8 hover-lift"
              >
                <h3 className="font-serif text-xl mb-4">{service.title}</h3>
                <p className="text-muted-foreground font-sans text-sm mb-6">
                  {service.description}
                </p>
                <ul className="space-y-2">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm font-sans">
                      <Check size={14} className="text-accent" />
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
          <div className="text-center mb-16">
            <p className="text-xs uppercase tracking-[0.3em] text-accent font-sans mb-4">
              How We Work
            </p>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl">
              The Design Process
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {process.map((item, index) => (
              <div key={item.step} className="text-center">
                <span className="font-serif text-4xl text-accent mb-4 block">
                  {item.step}
                </span>
                <h3 className="font-serif text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground font-sans">
                  {item.description}
                </p>
                {index < process.length - 1 && (
                  <div className="hidden md:block absolute right-0 top-1/2 w-8 h-px bg-border" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio */}
      <section className="section-padding bg-cream">
        <div className="container-wide">
          <div className="text-center mb-16">
            <p className="text-xs uppercase tracking-[0.3em] text-accent font-sans mb-4">
              Our Work
            </p>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl">
              Project Portfolio
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((project) => (
              <div key={project.id} className="group cursor-pointer">
                <div className="aspect-[4/3] overflow-hidden image-reveal mb-6">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-sans mb-2">
                  {project.type} • {project.location}
                </p>
                <h3 className="font-serif text-2xl mb-2 group-hover:text-accent transition-colors">
                  {project.title}
                </h3>
                <p className="text-muted-foreground font-sans text-sm">
                  {project.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-primary text-primary-foreground">
        <div className="container-wide text-center">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl mb-8">
            Ready to Start Your Project?
          </h2>
          <p className="text-primary-foreground/70 font-sans text-lg mb-10 max-w-2xl mx-auto">
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
