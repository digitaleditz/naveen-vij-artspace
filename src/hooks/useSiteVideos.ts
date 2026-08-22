import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface SiteVideo {
  id: string;
  youtube_url: string;
  video_id: string;
  title: string | null;
  description: string | null;
  display_order: number;
  is_active: boolean;
}

export const extractYouTubeId = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/watch\?(?:.*&)?v=)([\w-]{11})/,
    /(?:youtu\.be\/)([\w-]{11})/,
    /(?:youtube\.com\/(?:embed|shorts|live)\/)([\w-]{11})/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  if (/^[\w-]{11}$/.test(url.trim())) return url.trim();
  return null;
};

export const useSiteVideos = (adminMode = false) => {
  const [videos, setVideos] = useState<SiteVideo[]>([]);
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    const [videosRes, settingRes] = await Promise.all([
      supabase
        .from("site_videos" as any)
        .select("*")
        .order("display_order", { ascending: true }),
      supabase
        .from("site_settings" as any)
        .select("value")
        .eq("key", "videos_section")
        .maybeSingle(),
    ]);

    const rows = ((videosRes.data as any[]) || []) as SiteVideo[];
    setVideos(adminMode ? rows : rows.filter((v) => v.is_active));
    setEnabled(Boolean((settingRes.data as any)?.value?.enabled));
    setLoading(false);
  }, [adminMode]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { videos, enabled, loading, refresh: fetch, setEnabled };
};
