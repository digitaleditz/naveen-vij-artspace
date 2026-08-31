import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Exhibition {
  id: string;
  title: string;
  subtitle: string | null;
  content: string;
  image_url: string | null;
  location: string | null;
  event_date: string | null;
  display_order: number;
  published: boolean;
  created_at: string;
}

export const useExhibitions = (adminMode = false) => {
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("exhibitions" as any)
      .select("*")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });

    const rows = ((data as any[]) || []) as Exhibition[];
    setExhibitions(adminMode ? rows : rows.filter((e) => e.published));
    setLoading(false);
  }, [adminMode]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { exhibitions, loading, refresh: fetch };
};
