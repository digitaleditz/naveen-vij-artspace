import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ArchProject {
  id: string;
  name: string;
  image_url: string;
  display_order: number;
}

export const ArchProjectsSection = () => {
  const [projects, setProjects] = useState<ArchProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      const { data } = await supabase
        .from("architectural_projects" as any)
        .select("*")
        .order("display_order", { ascending: true });

      if (data) setProjects(data as any);
      setLoading(false);
    };
    fetchProjects();
  }, []);

  if (loading) return null;
  if (projects.length === 0) return null;

  return (
    <section className="section-padding bg-secondary/50">
      <div className="container-wide">
        <div className="text-center mb-20">
          <p className="text-[10px] uppercase tracking-[0.4em] text-accent font-sans mb-4">
            Built Spaces
          </p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl">
            Architectural Projects
          </h2>
          <div className="section-divider mt-8" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div key={project.id} className="group">
              <div className="aspect-[4/3] overflow-hidden mb-4">
                <img
                  src={project.image_url}
                  alt={project.name}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>
              <h3 className="font-serif text-lg text-center tracking-wide">
                {project.name}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
