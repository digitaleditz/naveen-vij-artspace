import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface ArchProject {
  id: string;
  name: string;
  image_url: string;
  images: string[];
  description: string | null;
  display_order: number;
}

export const normalizeProjectImages = (p: any): string[] => {
  const imgs: string[] = Array.isArray(p?.images) ? p.images.filter(Boolean) : [];
  if (imgs.length > 0) return imgs;
  return p?.image_url ? [p.image_url] : [];
};

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
        if (data) {
          setProjects(
            (data as any[]).map((p) => ({
              ...p,
              images: normalizeProjectImages(p),
            })) as ArchProject[]
          );
        }
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return { projects, loading };
};
