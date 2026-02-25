import { useState, useRef, useEffect } from "react";
import { useAdmin } from "@/hooks/useAdmin";
import { supabase } from "@/integrations/supabase/client";
import { Camera, Upload, RotateCcw, Check, X, ZoomIn, ZoomOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AdminEditableImageProps {
  src: string;
  alt: string;
  className?: string;
  assetKey: string;
  onImageUpdate?: (newUrl: string) => void;
  /** For DB-driven images (artworks, moments) — updates a specific table/column */
  dbUpdate?: {
    table: string;
    id: string;
    column: string;
    storageBucket: string;
  };
}

export const AdminEditableImage = ({
  src,
  alt,
  className = "",
  assetKey,
  onImageUpdate,
  dbUpdate,
}: AdminEditableImageProps) => {
  const { isAdmin } = useAdmin();
  const { toast } = useToast();
  const [isHovered, setIsHovered] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [confirmedUrl, setConfirmedUrl] = useState<string | null>(null);
  const [objectPosition, setObjectPosition] = useState("center");
  const [scale, setScale] = useState(1);
  const [showControls, setShowControls] = useState(false);
  const [assetLoaded, setAssetLoaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pendingFileRef = useRef<File | null>(null);

  // Load saved override from site_assets on mount (for ALL users, not just admin)
  useEffect(() => {
    if (dbUpdate) { setAssetLoaded(true); return; }
    const loadSavedAsset = async () => {
      const { data } = await supabase
        .from("site_assets" as any)
        .select("image_url")
        .eq("asset_key", assetKey)
        .maybeSingle();
      if (data && (data as any).image_url) {
        setConfirmedUrl((data as any).image_url);
      }
      setAssetLoaded(true);
    };
    loadSavedAsset();
  }, [assetKey, dbUpdate]);

  // Don't render until we've checked the DB for overrides
  const displaySrcFinal = confirmedUrl || src;

  if (!isAdmin) {
    if (!assetLoaded) {
      return <div className={className} style={{ background: 'transparent' }} />;
    }
    return <img src={displaySrcFinal} alt={alt} className={className} />;
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    pendingFileRef.current = file;
    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);
    setShowControls(true);
    setScale(1);
    setObjectPosition("center");
  };

  const handleConfirm = async () => {
    const file = pendingFileRef.current;
    if (!file) return;

    setUploading(true);
    const fileExt = file.name.split(".").pop();
    const fileName = `${assetKey}-${Date.now()}.${fileExt}`;
    const bucket = dbUpdate?.storageBucket || "site-assets";

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, file);

    if (uploadError) {
      toast({ title: "Upload failed", description: uploadError.message, variant: "destructive" });
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    // Save to appropriate place
    if (dbUpdate) {
      const { error } = await (supabase
        .from(dbUpdate.table as any)
        .update({ [dbUpdate.column]: publicUrl }) as any)
        .eq("id", dbUpdate.id);

      if (error) {
        toast({ title: "Update failed", description: error.message, variant: "destructive" });
        setUploading(false);
        return;
      }
    } else {
      // Save to site_assets table
      const existing = await (supabase
        .from("site_assets" as any)
        .select("id") as any)
        .eq("asset_key", assetKey)
        .maybeSingle();

      if (existing.data) {
        await (supabase
          .from("site_assets" as any)
          .update({ image_url: publicUrl }) as any)
          .eq("id", (existing.data as any).id);
      } else {
        await supabase
          .from("site_assets" as any)
          .insert({ asset_key: assetKey, image_url: publicUrl, alt_text: alt });
      }
    }

    onImageUpdate?.(publicUrl);
    setConfirmedUrl(publicUrl);
    toast({ title: "Image updated!", description: "Looking sharp ✨" });
    setPreviewUrl(null);
    setShowControls(false);
    pendingFileRef.current = null;
    setUploading(false);
  };

  const handleCancel = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setShowControls(false);
    pendingFileRef.current = null;
    setScale(1);
    setObjectPosition("center");
  };

  const positions = ["center", "top", "bottom", "left", "right"] as const;
  const cyclePosition = () => {
    const idx = positions.indexOf(objectPosition as typeof positions[number]);
    setObjectPosition(positions[(idx + 1) % positions.length]);
  };

  const displaySrc = previewUrl || confirmedUrl || src;

  return (
    <div
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => !showControls && setIsHovered(false)}
    >
      <img
        src={displaySrc}
        alt={alt}
        className={className}
        style={{
          objectPosition,
          transform: `scale(${scale})`,
          transition: "transform 0.3s ease, object-position 0.3s ease",
        }}
      />

      {/* Admin overlay */}
      {(isHovered || showControls) && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-200 z-20">
          {!showControls ? (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 bg-white/90 text-black px-4 py-2 rounded-lg text-sm font-sans font-medium hover:bg-white transition-colors shadow-lg"
            >
              <Camera size={16} />
              Replace Image
            </button>
          ) : (
            <div className="flex flex-col items-center gap-3">
              {/* Position & zoom controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setScale(Math.max(1, scale - 0.1))}
                  className="bg-white/90 text-black p-2 rounded-lg hover:bg-white transition-colors"
                  title="Zoom out"
                >
                  <ZoomOut size={16} />
                </button>
                <button
                  onClick={cyclePosition}
                  className="bg-white/90 text-black px-3 py-2 rounded-lg text-xs font-sans hover:bg-white transition-colors"
                  title="Change position"
                >
                  <RotateCcw size={14} className="inline mr-1" />
                  {objectPosition}
                </button>
                <button
                  onClick={() => setScale(Math.min(2, scale + 0.1))}
                  className="bg-white/90 text-black p-2 rounded-lg hover:bg-white transition-colors"
                  title="Zoom in"
                >
                  <ZoomIn size={16} />
                </button>
              </div>

              {/* Confirm / Cancel */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleConfirm}
                  disabled={uploading}
                  className="flex items-center gap-1 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-sans font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  <Check size={14} />
                  {uploading ? "Saving..." : "Confirm"}
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-1 bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-sans font-medium hover:bg-red-700 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};
