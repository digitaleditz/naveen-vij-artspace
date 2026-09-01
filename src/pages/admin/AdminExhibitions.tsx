import { useState, useRef } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  useExhibitions,
  EXHIBITION_STATUSES,
  statusLabel,
  type Exhibition,
  type ExhibitionStatus,
} from "@/hooks/useExhibitions";
import { Plus, Edit, Trash2, Upload, Eye, EyeOff, X, ArrowLeft, ArrowRight } from "lucide-react";

const emptyForm = {
  title: "",
  subtitle: "",
  content: "",
  images: [] as string[],
  location: "",
  event_date: "",
  status: "upcoming" as ExhibitionStatus,
  display_order: 0,
  published: true,
};


const AdminExhibitions = () => {
  const { toast } = useToast();
  const { exhibitions, loading, refresh } = useExhibitions(true);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Exhibition | null>(null);
  const [form, setForm] = useState<typeof emptyForm>(emptyForm);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openNew = () => {
    setSelected(null);
    setForm({ ...emptyForm, display_order: exhibitions.length });
    setOpen(true);
  };

  const openEdit = (item: Exhibition) => {
    setSelected(item);
    setForm({
      title: item.title,
      subtitle: item.subtitle || "",
      content: item.content || "",
      images: item.images || [],
      location: item.location || "",
      event_date: item.event_date || "",
      display_order: item.display_order,
      published: item.published,
    });
    setOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setUploading(true);

    const urls: string[] = [];
    for (const file of files) {
      const ext = file.name.split(".").pop();
      const path = `exhibitions/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error } = await supabase.storage.from("site-assets").upload(path, file);
      if (error) {
        toast({ title: "Upload failed", description: error.message, variant: "destructive" });
        continue;
      }
      urls.push(supabase.storage.from("site-assets").getPublicUrl(path).data.publicUrl);
    }

    if (urls.length > 0) {
      setForm((f) => ({ ...f, images: [...f.images, ...urls] }));
      toast({ title: "Uploaded", description: `${urls.length} image(s) added` });
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (url: string) =>
    setForm((f) => ({ ...f, images: f.images.filter((i) => i !== url) }));

  const moveImage = (index: number, dir: number) =>
    setForm((f) => {
      const next = [...f.images];
      const target = index + dir;
      if (target < 0 || target >= next.length) return f;
      [next[index], next[target]] = [next[target], next[index]];
      return { ...f, images: next };
    });

  const save = async () => {
    if (!form.title.trim()) {
      toast({ title: "Title required", variant: "destructive" });
      return;
    }
    setSaving(true);
    const payload = {
      title: form.title.trim(),
      subtitle: form.subtitle.trim() || null,
      content: form.content,
      images: form.images,
      image_url: form.images[0] || null,
      location: form.location.trim() || null,
      event_date: form.event_date.trim() || null,
      display_order: Number(form.display_order) || 0,
      published: form.published,
    };

    const { error } = selected
      ? await (supabase.from("exhibitions" as any).update(payload as any) as any).eq("id", selected.id)
      : await supabase.from("exhibitions" as any).insert(payload as any);

    setSaving(false);
    if (error) {
      toast({ title: "Could not save", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: selected ? "Updated" : "Published", description: "Exhibition saved." });
    setOpen(false);
    refresh();
  };

  const togglePublished = async (item: Exhibition) => {
    const { error } = await (supabase
      .from("exhibitions" as any)
      .update({ published: !item.published } as any) as any)
      .eq("id", item.id);
    if (error) {
      toast({ title: "Could not update", description: error.message, variant: "destructive" });
      return;
    }
    refresh();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this exhibition post?")) return;
    const { error } = await supabase.from("exhibitions" as any).delete().eq("id", id);
    if (error) {
      toast({ title: "Could not delete", description: error.message, variant: "destructive" });
      return;
    }
    refresh();
  };

  return (
    <AdminLayout title="Exhibitions" subtitle="Write exhibition posts with text and images for the home page">
      <div className="flex justify-end mb-8">
        <Button onClick={openNew}>
          <Plus size={16} className="mr-2" />
          New exhibition post
        </Button>
      </div>

      {loading ? (
        <p className="text-muted-foreground font-sans text-sm">Loading...</p>
      ) : exhibitions.length === 0 ? (
        <p className="text-muted-foreground font-sans text-sm">No exhibition posts yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exhibitions.map((item) => (
            <div key={item.id} className="border border-border rounded-lg overflow-hidden bg-secondary/20">
              {item.images.length > 0 && (
                <div className="relative">
                  <img src={item.images[0]} alt={item.title} className="aspect-[4/3] w-full object-cover" />
                  {item.images.length > 1 && (
                    <span className="absolute bottom-2 right-2 text-[10px] font-sans px-2 py-1 rounded-full bg-background/80 backdrop-blur-xl border border-border">
                      {item.images.length} images
                    </span>
                  )}
                </div>
              )}
              <div className="p-5">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="font-serif text-lg">{item.title}</h3>
                  <span className="text-[10px] uppercase tracking-wider font-sans text-muted-foreground shrink-0 mt-1">
                    {item.published ? "Live" : "Hidden"}
                  </span>
                </div>
                {(item.event_date || item.location) && (
                  <p className="text-xs text-muted-foreground font-sans mb-2">
                    {[item.event_date, item.location].filter(Boolean).join(" · ")}
                  </p>
                )}
                <p className="text-sm text-muted-foreground font-sans line-clamp-3 whitespace-pre-line">
                  {item.content}
                </p>
                <div className="flex gap-2 mt-4">
                  <Button size="sm" variant="outline" onClick={() => openEdit(item)}>
                    <Edit size={14} className="mr-1" /> Edit
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => togglePublished(item)}>
                    {item.published ? <EyeOff size={14} /> : <Eye size={14} />}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => remove(item.id)}>
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">
              {selected ? "Edit exhibition" : "New exhibition"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            <Input
              placeholder="Subtitle (optional)"
              value={form.subtitle}
              onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                placeholder="Dates e.g. 26–30 August 2026"
                value={form.event_date}
                onChange={(e) => setForm({ ...form, event_date: e.target.value })}
              />
              <Input
                placeholder="Location"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
            </div>
            <Textarea
              placeholder="Write the post content..."
              rows={8}
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
            />

            <div className="space-y-3">
              {form.images.length > 0 && (
                <div className="grid grid-cols-3 gap-3">
                  {form.images.map((url, i) => (
                    <div key={url} className="relative group rounded-md overflow-hidden border border-border">
                      <img src={url} alt={`Image ${i + 1}`} className="aspect-square w-full object-cover" />
                      <div className="absolute inset-x-0 bottom-0 flex justify-between p-1 bg-background/80 backdrop-blur-xl opacity-0 group-hover:opacity-100 transition-opacity">
                        <button type="button" aria-label="Move left" onClick={() => moveImage(i, -1)} className="p-1">
                          <ArrowLeft size={14} />
                        </button>
                        <button type="button" aria-label="Remove image" onClick={() => removeImage(url)} className="p-1">
                          <X size={14} />
                        </button>
                        <button type="button" aria-label="Move right" onClick={() => moveImage(i, 1)} className="p-1">
                          <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                multiple
                ref={fileInputRef}
                onChange={handleImageUpload}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                <Upload size={16} className="mr-2" />
                {uploading ? "Uploading..." : "Upload images"}
              </Button>
              <p className="text-xs text-muted-foreground font-sans">
                Multiple images show as a slider on the home page. The first image is the cover.
              </p>
            </div>

            <div className="flex items-center justify-between border border-border rounded-md p-4">
              <div>
                <p className="font-sans text-sm">Published</p>
                <p className="text-xs text-muted-foreground font-sans">
                  {form.published ? "Visible on the home page" : "Hidden from visitors"}
                </p>
              </div>
              <Switch
                checked={form.published}
                onCheckedChange={(v) => setForm({ ...form, published: v })}
              />
            </div>

            <Input
              type="number"
              placeholder="Display order"
              value={form.display_order}
              onChange={(e) => setForm({ ...form, display_order: Number(e.target.value) })}
            />

            <Button onClick={save} disabled={saving} className="w-full">
              {saving ? "Saving..." : selected ? "Save changes" : "Publish"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminExhibitions;
