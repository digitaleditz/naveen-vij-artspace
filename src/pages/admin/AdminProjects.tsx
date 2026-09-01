import { useState, useEffect, useRef } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Upload, ArrowLeft, ArrowRight } from "lucide-react";

interface ArchProject {
  id: string;
  name: string;
  image_url: string;
  images: string[];
  description: string | null;
  display_order: number;
}

const AdminProjects = () => {
  const { toast } = useToast();
  const [projects, setProjects] = useState<ArchProject[]>([]);
  const [selected, setSelected] = useState<ArchProject | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [form, setForm] = useState<Partial<ArchProject>>({});
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("architectural_projects" as any)
      .select("*")
      .order("display_order", { ascending: true });

    if (!error && data) {
      setProjects(
        (data as any[]).map((p) => ({
          ...p,
          images:
            Array.isArray(p.images) && p.images.length > 0
              ? p.images
              : p.image_url
              ? [p.image_url]
              : [],
        })) as ArchProject[]
      );
    }
    setLoading(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    setUploading(true);
    const uploaded: string[] = [];

    for (const file of files) {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("architectural-projects")
        .upload(fileName, file);

      if (uploadError) {
        toast({ title: "Upload failed", description: uploadError.message, variant: "destructive" });
        continue;
      }

      const { data: { publicUrl } } = supabase.storage
        .from("architectural-projects")
        .getPublicUrl(fileName);

      uploaded.push(publicUrl);
    }

    setForm((prev) => ({ ...prev, images: [...(prev.images ?? []), ...uploaded] }));
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (uploaded.length) toast({ title: "Uploaded!", description: `${uploaded.length} image(s) ready` });
  };

  const removeImage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      images: (prev.images ?? []).filter((_, i) => i !== index),
    }));
  };

  const moveImage = (index: number, dir: -1 | 1) => {
    setForm((prev) => {
      const imgs = [...(prev.images ?? [])];
      const target = index + dir;
      if (target < 0 || target >= imgs.length) return prev;
      [imgs[index], imgs[target]] = [imgs[target], imgs[index]];
      return { ...prev, images: imgs };
    });
  };

  const saveProject = async () => {
    const images = form.images ?? [];
    if (!form.name || images.length === 0) {
      toast({ title: "Error", description: "Please provide a name and at least one image", variant: "destructive" });
      return;
    }

    const payload = {
      name: form.name,
      image_url: images[0],
      images,
      description: form.description ?? null,
      display_order: form.display_order ?? projects.length,
    };

    if (selected) {
      const { error } = await (supabase
        .from("architectural_projects" as any)
        .update(payload) as any)
        .eq("id", selected.id);

      if (error) {
        toast({ title: "Error", description: "Failed to update", variant: "destructive" });
      } else {
        toast({ title: "Updated", description: "Project updated successfully" });
        fetchProjects();
        setIsDialogOpen(false);
      }
    } else {
      const { error } = await supabase
        .from("architectural_projects" as any)
        .insert(payload as any);

      if (error) {
        toast({ title: "Error", description: "Failed to create", variant: "destructive" });
      } else {
        toast({ title: "Created", description: "New project added!" });
        fetchProjects();
        setIsDialogOpen(false);
      }
    }
  };

  const deleteProject = async (id: string) => {
    if (!confirm("Delete this project?")) return;

    const { error } = await (supabase
      .from("architectural_projects" as any)
      .delete() as any)
      .eq("id", id);

    if (error) {
      toast({ title: "Error", description: "Failed to delete", variant: "destructive" });
    } else {
      toast({ title: "Deleted", description: "Project removed" });
      fetchProjects();
    }
  };

  const openDialog = (project?: ArchProject) => {
    if (project) {
      setSelected(project);
      setForm(project);
    } else {
      setSelected(null);
      setForm({ images: [] });
    }
    setIsDialogOpen(true);
  };

  return (
    <AdminLayout title="Architectural Projects" subtitle="Showcase of Naveen Vij's architectural work — displayed on The Architect page">
      <div className="flex justify-end mb-6">
        <Button variant="hero" onClick={() => openDialog()}>
          <Plus size={16} className="mr-2" />
          Add Project
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="p-4 bg-secondary/50 border border-border rounded-lg">
          <p className="text-2xl font-serif">{projects.length}</p>
          <p className="text-sm text-muted-foreground">Total Projects</p>
        </div>
        <div className="p-4 bg-secondary/50 border border-border rounded-lg">
          <p className="text-2xl font-serif">The Architect</p>
          <p className="text-sm text-muted-foreground">Displayed On</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 text-muted-foreground">Loading...</div>
      ) : projects.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <p className="mb-2">No projects yet</p>
          <p className="text-sm">Add architectural projects to showcase on The Architect page.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-secondary/30 border border-border overflow-hidden rounded-lg"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={project.images[0] ?? project.image_url}
                  alt={project.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-serif text-lg mb-1">{project.name}</h3>
                <span className="text-xs text-muted-foreground">
                  Order: {project.display_order} · {project.images.length} image(s)
                </span>
                <div className="flex gap-2 mt-3">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => openDialog(project)}>
                    <Edit size={14} className="mr-1" /> Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteProject(project.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif">
              {selected ? "Edit Project" : "Add New Project"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground mb-2 block">
                Project Images * (first image is the cover)
              </label>
              {(form.images ?? []).length > 0 && (
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {(form.images ?? []).map((url, i) => (
                    <div key={url + i} className="relative aspect-[4/3]">
                      <img src={url} alt={`Image ${i + 1}`} className="w-full h-full object-cover rounded" />
                      <button
                        onClick={() => removeImage(i)}
                        className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs"
                      >
                        ×
                      </button>
                      <div className="absolute bottom-1 left-1 flex gap-1">
                        <button
                          onClick={() => moveImage(i, -1)}
                          className="bg-background/80 border border-border rounded p-0.5"
                        >
                          <ArrowLeft size={12} />
                        </button>
                        <button
                          onClick={() => moveImage(i, 1)}
                          className="bg-background/80 border border-border rounded p-0.5"
                        >
                          <ArrowRight size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                <Upload size={14} className="mr-2" />
                {uploading ? "Uploading..." : "Upload Images"}
              </Button>
            </div>

            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground mb-2 block">
                Project Name *
              </label>
              <Input
                value={form.name || ""}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Villa Harmony, Chandigarh"
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground mb-2 block">
                Description
              </label>
              <Textarea
                rows={6}
                value={form.description || ""}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Tell the story of this project — brief, materials, location, year..."
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground mb-2 block">
                Display Order
              </label>
              <Input
                type="number"
                value={form.display_order ?? 0}
                onChange={(e) => setForm({ ...form, display_order: Number(e.target.value) })}
              />
            </div>

            <Button variant="hero" className="w-full" onClick={saveProject}>
              {selected ? "Update Project" : "Add Project"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminProjects;
