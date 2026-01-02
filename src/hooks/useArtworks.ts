import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Artwork {
  id: string;
  title: string;
  collection: string;
  size: string;
  medium: string;
  price: number;
  available: boolean;
  image_url: string | null;
  story: string;
  placement: string | null;
  design_inspiration: string | null;
  mood: string | null;
  created_at: string;
}

export const useArtworks = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchArtworks();
  }, []);

  const fetchArtworks = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("artworks")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setArtworks(data || []);
    }
    setLoading(false);
  };

  return { artworks, loading, error, refetch: fetchArtworks };
};
