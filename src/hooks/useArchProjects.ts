import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface ArchProject {
  id: string;
  name: string;
  image_url: string;
  display_order: number;
}

export const useArchProjects = () => {
  const [projects, setProjects] = useState<ArchProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    supabase
      .from("architectural_projects" as any)
      .select("*")
      .order("display_order", { ascending: true })
      .then(({ data }) => {
        if (!active) return;
        if (data) setProjects(data as any);
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return { projects, loading };
};
