import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { AdminEditableImage } from "@/components/AdminEditableImage";
import naveenPortrait from "@/assets/naveen-portrait.jpg";
import heroInterior from "@/assets/hero-interior.jpg";
import { ArchProjectsSection } from "@/components/architect/ArchProjectsSection";

const milestones = [
  { year: "1982", title: "Architecture Graduate", description: "Graduated from Chandigarh College of Architecture" },
  { year: "1983", title: "Design Studio", description: "Established an independent architecture and design studio" },
  { year: "Pioneer", title: "3D Visualisation", description: "Recognised as a pioneer in introducing sketching and 3D visualisation within India's architectural fraternity" },
  { year: "Practice", title: "Built Work", description: "Residences, interiors, and institutional spaces shaped by proportion, light, and material honesty" },
  { year: "Present", title: "Spatial Design", description: "Continuing to design spaces where structure, detail, and daylight work as one" },
];

const principles = [
  {
    title: "Proportion & Perspective",
    body:
      "Every plan begins as a hand sketch. Proportion is tested in perspective before it is drawn to scale, so the space reads correctly to the eye long before it is built.",
  },
  {
    title: "Light as Material",
    body:
      "Openings, courtyards, and reveals are positioned to move daylight through a building across the day, letting the same room change character from morning to evening.",
  },
  {
    title: "Material Honesty",
    body:
      "Concrete, stone, brick, and timber are left to read as themselves. Detailing is restrained so junctions, shadow lines, and texture carry the architecture.",
  },
  {
    title: "Context First",
    body:
      "Orientation, climate, and site levels drive the massing. Each project responds to where it stands rather than repeating a signature form.",
  },
];

const TheArchitect = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="pt-28 sm:pt-40 pb-16 sm:pb-24 container-wide">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-24 items-center">
          <div>
            <div className="inline-block mb-6 sm:mb-8">
              <p className="text-[10px] uppercase tracking-[0.4em] text-accent font-sans">
                The Architect
              </p>
              <div className="section-divider mt-4 mx-0" />
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-6 sm:mb-8 leading-[1.1]">
              Naveen Vij
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground font-sans leading-relaxed mb-4 sm:mb-6 font-light italic">
              "Architecture begins the moment a line describes space."
            </p>
            <p className="text-muted-foreground font-sans leading-relaxed text-base sm:text-lg">
              An architect practising since 1982, with a body of built work spanning
              residences, interiors, and institutional spaces. His practice is grounded in
              drawing, perspective, and a close reading of site, structure, and daylight.
            </p>
          </div>
          <div className="relative">
            <div className="aspect-[4/5] overflow-hidden image-reveal">
              <AdminEditableImage
                src={naveenPortrait}
                alt="Architect Naveen Vij"
                className="w-full h-full object-cover"
                priority
                assetKey="architect-portrait"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 w-full h-full border border-accent/20 -z-10" />
          </div>
        </div>
      </section>

      {/* Architectural Projects */}
      <ArchProjectsSection />

      {/* Approach */}
      <section className="section-padding bg-secondary/50">
        <div className="container-wide">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <p className="text-[10px] uppercase tracking-[0.4em] text-accent font-sans mb-4">
                The Approach
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-4">
                How the Work is Designed
              </h2>
              <div className="section-divider mt-8" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              {principles.map((p) => (
                <div key={p.title} className="premium-card p-8 sm:p-10">
                  <h3 className="font-serif text-xl sm:text-2xl mb-4 sm:mb-6 text-accent">{p.title}</h3>
                  <p className="text-muted-foreground font-sans leading-relaxed text-base sm:text-lg">
                    {p.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* The Practice */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-24">
            <div className="relative">
              <div className="aspect-[4/3] overflow-hidden image-reveal">
                <AdminEditableImage
                  src={heroInterior}
                  alt="Interior designed by Naveen Vij"
                  className="w-full h-full object-cover"
                  assetKey="architect-journey"
                />
              </div>
              <div className="absolute -top-4 -left-4 sm:-top-6 sm:-left-6 w-full h-full border border-accent/20 -z-10" />
            </div>
            <div className="flex flex-col justify-center">
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl mb-8 sm:mb-10">The Practice</h2>
              <div className="space-y-6 sm:space-y-8 text-muted-foreground font-sans leading-relaxed text-base sm:text-lg">
                <p>
                  After graduating from the Chandigarh College of Architecture in 1982,
                  Naveen established a studio working across architecture, interiors, and
                  product design.
                </p>
                <p>
                  He was among the early voices in India to place freehand sketching and
                  three-dimensional visualisation at the centre of the design process,
                  using perspective to test a building before it was documented.
                </p>
                <p>
                  Projects are developed from the site outward: levels, orientation, and
                  climate set the massing; structure and detail then resolve it. The result
                  is a body of work defined less by style than by clarity of space.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding bg-cream">
        <div className="container-wide">
          <div className="text-center mb-12 sm:mb-20">
            <p className="text-[10px] uppercase tracking-[0.4em] text-accent font-sans mb-4">
              Evolution
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
              Milestones
            </h2>
            <div className="section-divider mt-8" />
          </div>

          <div className="max-w-4xl mx-auto">
            {milestones.map((milestone, index) => (
              <div
                key={milestone.year}
                className="flex gap-6 sm:gap-12 pb-12 sm:pb-16 relative group"
              >
                {index < milestones.length - 1 && (
                  <div className="absolute left-[48px] sm:left-[80px] top-10 bottom-0 w-px bg-gradient-to-b from-accent/50 to-border" />
                )}

                <div className="w-[96px] sm:w-[160px] flex-shrink-0 text-right">
                  <span className="font-serif text-lg sm:text-2xl text-accent group-hover:text-gold transition-colors">
                    {milestone.year}
                  </span>
                </div>

                <div className="absolute left-[45px] sm:left-[77px] top-2 w-2 h-2 rounded-full bg-accent group-hover:scale-150 transition-transform" />

                <div className="pt-0.5">
                  <h3 className="font-serif text-lg sm:text-xl mb-2 sm:mb-3">{milestone.title}</h3>
                  <p className="text-muted-foreground font-sans text-sm sm:text-base">
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
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-8">
            Discuss a Project
          </h2>
          <p className="text-primary-foreground/60 font-sans text-base sm:text-lg mb-12 max-w-2xl mx-auto leading-relaxed">
            For architecture, interiors, or spatial design enquiries, get in touch to talk
            through the site, brief, and scope.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center">
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

export default TheArchitect;
