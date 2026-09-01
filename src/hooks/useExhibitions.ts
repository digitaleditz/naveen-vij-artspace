import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export type ExhibitionStatus = "upcoming" | "ongoing" | "past";

export const EXHIBITION_STATUSES: { value: ExhibitionStatus; label: string }[] = [
  { value: "upcoming", label: "Upcoming" },
  { value: "ongoing", label: "Ongoing" },
  { value: "past", label: "Done" },
];

export const statusLabel = (s?: string | null) =>
  EXHIBITION_STATUSES.find((x) => x.value === s)?.label ?? "Upcoming";

export interface Exhibition {
  id: string;
  title: string;
  subtitle: string | null;
  content: string;
  image_url: string | null;
  images: string[];
  location: string | null;
  event_date: string | null;
  status: ExhibitionStatus;
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

    const rows = (((data as any[]) || []) as Exhibition[]).map((e) => ({
      ...e,
      images:
        e.images && e.images.length > 0
          ? e.images
          : e.image_url
          ? [e.image_url]
          : [],
    }));
    setExhibitions(adminMode ? rows : rows.filter((e) => e.published));
    setLoading(false);
  }, [adminMode]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { exhibitions, loading, refresh: fetch };
};
