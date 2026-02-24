import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface SiteAsset {
  id: string;
  asset_key: string;
  image_url: string;
  alt_text: string | null;
}

export const useSiteAssets = () => {
  const [assets, setAssets] = useState<Record<string, SiteAsset>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    const { data } = await supabase
      .from("site_assets" as any)
      .select("*");

    if (data) {
      const map: Record<string, SiteAsset> = {};
      (data as any[]).forEach((a: any) => {
        map[a.asset_key] = a;
      });
      setAssets(map);
    }
    setLoading(false);
  };

  const getImageUrl = (assetKey: string, fallback: string) => {
    return assets[assetKey]?.image_url || fallback;
  };

  const updateAsset = async (assetKey: string, imageUrl: string, altText?: string) => {
    const existing = assets[assetKey];
    if (existing) {
      const { error } = await (supabase
        .from("site_assets" as any)
        .update({ image_url: imageUrl, alt_text: altText }) as any)
        .eq("id", existing.id);
      if (!error) {
        setAssets((prev) => ({
          ...prev,
          [assetKey]: { ...existing, image_url: imageUrl, alt_text: altText || null },
        }));
      }
      return !error;
    } else {
      const { data, error } = await (supabase
        .from("site_assets" as any)
        .insert({ asset_key: assetKey, image_url: imageUrl, alt_text: altText }) as any)
        .select()
        .single();
      if (!error && data) {
        setAssets((prev) => ({ ...prev, [assetKey]: data }));
      }
      return !error;
    }
  };

  return { assets, loading, getImageUrl, updateAsset, refetch: fetchAssets };
};
