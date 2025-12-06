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
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-accent font-sans mb-4">
              Interior Design
            </p>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl">
              Featured Projects
            </h2>
          </div>
          <Button variant="minimal" asChild>
            <Link to="/interiors">
              View All Projects
              <ArrowRight size={14} />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {projects.map((project, index) => (
            <Link
              key={project.id}
              to="/interiors"
              className="group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="aspect-[4/5] overflow-hidden image-reveal mb-6">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-sans mb-2">
                  {project.type} • {project.location}
                </p>
                <h3 className="font-serif text-xl md:text-2xl group-hover:text-accent transition-colors">
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
