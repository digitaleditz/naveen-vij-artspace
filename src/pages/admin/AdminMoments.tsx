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
import { Plus, Edit, Trash2, Upload, GripVertical } from "lucide-react";

interface ArtistMoment {
  id: string;
  image_url: string;
  painting_name: string;
  description: string;
  display_order: number;
}

const AdminMoments = () => {
  const { toast } = useToast();
  const [moments, setMoments] = useState<ArtistMoment[]>([]);
  const [selectedMoment, setSelectedMoment] = useState<ArtistMoment | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [form, setForm] = useState<Partial<ArtistMoment>>({});
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchMoments();
  }, []);

  const fetchMoments = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("artist_moments")
      .select("*")
      .order("display_order", { ascending: true });

    if (!error && data) {
      setMoments(data);
    }
    setLoading(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("artist-moments")
      .upload(fileName, file);

    if (uploadError) {
      toast({ title: "Upload failed", description: uploadError.message, variant: "destructive" });
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from("artist-moments")
      .getPublicUrl(fileName);

    setForm({ ...form, image_url: publicUrl });
    setUploading(false);
    toast({ title: "Uploaded!", description: "Image ready to use" });
  };

  const saveMoment = async () => {
    if (!form.painting_name || !form.description || !form.image_url) {
      toast({ title: "Error", description: "Please fill all fields and upload an image", variant: "destructive" });
      return;
    }

    if (selectedMoment) {
      const { error } = await supabase
        .from("artist_moments")
        .update({
          painting_name: form.painting_name,
          description: form.description,
          image_url: form.image_url,
          display_order: form.display_order ?? 0,
        })
        .eq("id", selectedMoment.id);

      if (error) {
        toast({ title: "Error", description: "Failed to update", variant: "destructive" });
      } else {
        toast({ title: "Updated", description: "Moment updated successfully" });
        fetchMoments();
        setIsDialogOpen(false);
      }
    } else {
      const { error } = await supabase
        .from("artist_moments")
        .insert({
          painting_name: form.painting_name!,
          description: form.description!,
          image_url: form.image_url!,
          display_order: form.display_order ?? moments.length,
        });

      if (error) {
        toast({ title: "Error", description: "Failed to create", variant: "destructive" });
      } else {
        toast({ title: "Created", description: "New moment added!" });
        fetchMoments();
        setIsDialogOpen(false);
      }
    }
  };

  const deleteMoment = async (id: string) => {
    if (!confirm("Delete this moment?")) return;

    const { error } = await supabase
      .from("artist_moments")
      .delete()
      .eq("id", id);

    if (error) {
      toast({ title: "Error", description: "Failed to delete", variant: "destructive" });
    } else {
      toast({ title: "Deleted", description: "Moment removed" });
      fetchMoments();
    }
  };

  const openDialog = (moment?: ArtistMoment) => {
    if (moment) {
      setSelectedMoment(moment);
      setForm(moment);
    } else {
      setSelectedMoment(null);
      setForm({});
    }
    setIsDialogOpen(true);
  };

  return (
    <AdminLayout title="Artist Moments" subtitle="Photos of Naveen with his paintings — shown on the homepage">
      <div className="flex justify-end mb-6">
        <Button variant="hero" onClick={() => openDialog()}>
          <Plus size={16} className="mr-2" />
          Add Moment
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="p-4 bg-secondary/50 border border-border rounded-lg">
          <p className="text-2xl font-serif">{moments.length}</p>
          <p className="text-sm text-muted-foreground">Total Moments</p>
        </div>
        <div className="p-4 bg-secondary/50 border border-border rounded-lg">
          <p className="text-2xl font-serif">Homepage</p>
          <p className="text-sm text-muted-foreground">Displayed In</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 text-muted-foreground">Loading...</div>
      ) : moments.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <p className="mb-2">No moments yet</p>
          <p className="text-sm">Add photos of Naveen with his paintings to show on the homepage.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {moments.map((moment) => (
            <div
              key={moment.id}
              className="bg-secondary/30 border border-border overflow-hidden rounded-lg"
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={moment.image_url}
                  alt={moment.painting_name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <GripVertical size={14} className="text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Order: {moment.display_order}</span>
                </div>
                <h3 className="font-serif text-lg mb-1">{moment.painting_name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{moment.description}</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => openDialog(moment)}>
                    <Edit size={14} className="mr-1" /> Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteMoment(moment.id)}
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

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-serif">
              {selectedMoment ? "Edit Moment" : "Add New Moment"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Image Upload */}
            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground mb-2 block">
                Photo *
              </label>
              {form.image_url ? (
                <div className="relative aspect-square w-full max-w-[200px] mb-2">
                  <img src={form.image_url} alt="Preview" className="w-full h-full object-cover rounded" />
                  <button
                    onClick={() => setForm({ ...form, image_url: undefined })}
                    className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs"
                  >
                    ×
                  </button>
                </div>
              ) : null}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
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
                {uploading ? "Uploading..." : "Upload Image"}
              </Button>
            </div>

            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground mb-2 block">
                Painting Name *
              </label>
              <Input
                value={form.painting_name || ""}
                onChange={(e) => setForm({ ...form, painting_name: e.target.value })}
                placeholder="e.g. Urban Geometry"
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground mb-2 block">
                Description *
              </label>
              <Textarea
                value={form.description || ""}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="A casual, fun description of this moment"
                className="min-h-20"
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

            <Button variant="hero" className="w-full" onClick={saveMoment}>
              {selectedMoment ? "Update Moment" : "Add Moment"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminMoments;
