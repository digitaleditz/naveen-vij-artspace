import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import project1 from "@/assets/project-1.jpg";
import project2 from "@/assets/project-2.jpg";
import project3 from "@/assets/project-3.jpg";

const projects = [
  {
    id: 1,
    title: "Serene Residence",
    location: "Mumbai",
    type: "Residential",
    image: project1,
  },
  {
    id: 2,
    title: "The Dining Room",
    location: "Delhi",
    type: "Residential",
    image: project2,
  },
  {
    id: 3,
    title: "Artisan Café",
    location: "Bangalore",
    type: "Commercial",
    image: project3,
  },
];

export const FeaturedProjects = () => {
  return (
    <section className="section-padding">
      <div className="container-wide">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
          <div>
            <div className="inline-block mb-6">
              <p className="text-[10px] uppercase tracking-[0.4em] text-accent font-sans">
                Interior Design
              </p>
              <div className="section-divider mt-4 mx-0" />
            </div>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl">
              Featured Projects
            </h2>
          </div>
          <Button variant="minimal" asChild className="self-start md:self-auto">
            <Link to="/interiors">
              View All Projects
              <ArrowRight size={14} />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {projects.map((project, index) => (
            <Link
              key={project.id}
              to="/interiors"
              className="group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="aspect-[4/5] overflow-hidden image-reveal mb-8 relative">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-all duration-500" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground font-sans mb-3">
                  {project.type} • {project.location}
                </p>
                <h3 className="font-serif text-2xl md:text-3xl group-hover:text-accent transition-colors">
                  {project.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
