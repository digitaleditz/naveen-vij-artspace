import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSiteVideos, extractYouTubeId } from "@/hooks/useSiteVideos";
import { Trash2, Plus, Eye, EyeOff } from "lucide-react";

const AdminVideos = () => {
  const { toast } = useToast();
  const { videos, enabled, loading, refresh, setEnabled } = useSiteVideos(true);
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  const toggleSection = async (value: boolean) => {
    setEnabled(value);
    const { error } = await supabase
      .from("site_settings" as any)
      .upsert({ key: "videos_section", value: { enabled: value }, updated_at: new Date().toISOString() } as any);
    if (error) {
      setEnabled(!value);
      toast({ title: "Could not update", description: error.message, variant: "destructive" });
    }
  };

  const addVideo = async () => {
    const videoId = extractYouTubeId(url);
    if (!videoId) {
      toast({ title: "Invalid link", description: "Paste a valid YouTube video link.", variant: "destructive" });
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("site_videos" as any).insert({
      youtube_url: url.trim(),
      video_id: videoId,
      title: title.trim() || null,
      description: description.trim() || null,
      display_order: videos.length,
      is_active: true,
    } as any);
    setSaving(false);
    if (error) {
      toast({ title: "Could not add video", description: error.message, variant: "destructive" });
      return;
    }
    setUrl("");
    setTitle("");
    setDescription("");
    toast({ title: "Video added", description: "It's live in the section now." });
    refresh();
  };

  const toggleVideo = async (id: string, isActive: boolean) => {
    const { error } = await supabase
      .from("site_videos" as any)
      .update({ is_active: !isActive } as any)
      .eq("id", id);
    if (error) {
      toast({ title: "Could not update", description: error.message, variant: "destructive" });
      return;
    }
    refresh();
  };

  const removeVideo = async (id: string) => {
    const { error } = await supabase.from("site_videos" as any).delete().eq("id", id);
    if (error) {
      toast({ title: "Could not delete", description: error.message, variant: "destructive" });
      return;
    }
    refresh();
  };

  return (
    <AdminLayout title="Videos" subtitle='Manage the "Listen to Naveen Vij" section on the home page'>
      <div className="flex items-center justify-between p-6 bg-secondary/50 border border-border rounded-lg mb-8">
        <div>
          <p className="font-serif text-lg">Section visibility</p>
          <p className="text-sm text-muted-foreground font-sans">
            {enabled ? "Visible on the home page" : "Hidden from the home page"}
          </p>
        </div>
        <Switch checked={enabled} onCheckedChange={toggleSection} />
      </div>

      <div className="p-6 bg-secondary/30 border border-border rounded-lg mb-8 space-y-4">
        <h3 className="font-serif text-lg">Add a YouTube video</h3>
        <Input
          placeholder="https://www.youtube.com/watch?v=..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <Input
          placeholder="Title (optional)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Textarea
          placeholder="Short description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Button onClick={addVideo} disabled={saving || !url.trim()}>
          <Plus size={16} className="mr-2" />
          {saving ? "Adding..." : "Add video"}
        </Button>
      </div>

      {loading ? (
        <p className="text-muted-foreground font-sans text-sm">Loading videos...</p>
      ) : videos.length === 0 ? (
        <p className="text-muted-foreground font-sans text-sm">No videos yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <div key={video.id} className="border border-border rounded-lg overflow-hidden bg-secondary/30">
              <img
                src={`https://i.ytimg.com/vi/${video.video_id}/hqdefault.jpg`}
                alt={video.title || "Video thumbnail"}
                className="w-full aspect-video object-cover"
                loading="lazy"
              />
              <div className="p-4 space-y-3">
                <p className="font-serif">{video.title || video.video_id}</p>
                {video.description && (
                  <p className="text-sm text-muted-foreground font-sans line-clamp-2">{video.description}</p>
                )}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => toggleVideo(video.id, video.is_active)}>
                    {video.is_active ? <EyeOff size={14} className="mr-1" /> : <Eye size={14} className="mr-1" />}
                    {video.is_active ? "Hide" : "Show"}
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => removeVideo(video.id)}>
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminVideos;
