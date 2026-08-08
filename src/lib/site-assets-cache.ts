import { supabase } from "@/integrations/supabase/client";

let cache: Promise<Record<string, string>> | null = null;

/** Fetches all site_assets overrides once and shares them across all images. */
export const getSiteAssetOverrides = (): Promise<Record<string, string>> => {
  if (!cache) {
    cache = (async () => {
      try {
        const { data } = await supabase
          .from("site_assets" as any)
          .select("asset_key, image_url");
        const map: Record<string, string> = {};
        (data as any[] | null)?.forEach((row) => {
          if (row?.asset_key && row?.image_url) map[row.asset_key] = row.image_url;
        });
        return map;
      } catch {
        return {};
      }
    })();
  }
  return cache;
};

export const invalidateSiteAssetOverrides = () => {
  cache = null;
};
