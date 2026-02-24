import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface ArtistMoment {
  id: string;
  image_url: string;
  painting_name: string;
  description: string;
  display_order: number;
  created_at: string;
}

export const useArtistMoments = () => {
  const [moments, setMoments] = useState<ArtistMoment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMoments = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("artist_moments")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      setError(error.message);
    } else {
      setMoments(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMoments();
  }, []);

  return { moments, loading, error, refetch: fetchMoments };
};
