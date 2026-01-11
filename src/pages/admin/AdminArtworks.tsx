import { useState, useEffect } from "react";
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
import { Plus, Edit, Trash2, Search } from "lucide-react";
import artwork1 from "@/assets/artwork-1.jpg";
import artwork2 from "@/assets/artwork-2.jpg";
import artwork3 from "@/assets/artwork-3.jpg";
import paintingFeatured from "@/assets/painting-featured.jpg";

interface Artwork {
  id: string;
  title: string;
  collection: string;
  size: string;
  medium: string;
  price: number;
  available: boolean;
  story: string;
  image_url: string | null;
  placement: string | null;
  design_inspiration: string | null;
  mood: string | null;
}

const getArtworkImage = (imageUrl: string | null, index: number) => {
  if (imageUrl) {
    const images: Record<string, string> = {
      "/artwork-1.jpg": artwork1,
      "/artwork-2.jpg": artwork2,
      "/artwork-3.jpg": artwork3,
      "/painting-featured.jpg": paintingFeatured,
    };
    return images[imageUrl] || artwork1;
  }
  const fallbacks = [artwork1, artwork2, artwork3, paintingFeatured];
  return fallbacks[index % fallbacks.length];
};

const AdminArtworks = () => {
  const { toast } = useToast();
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [artworkForm, setArtworkForm] = useState<Partial<Artwork>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArtworks();
  }, []);

  const fetchArtworks = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("artworks")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setArtworks(data);
    }
    setLoading(false);
  };

  const saveArtwork = async () => {
    if (!artworkForm.title || !artworkForm.collection || !artworkForm.story) {
      toast({ title: "Error", description: "Please fill required fields", variant: "destructive" });
      return;
    }

    if (selectedArtwork) {
      const { error } = await supabase
        .from("artworks")
        .update(artworkForm)
        .eq("id", selectedArtwork.id);

      if (error) {
        toast({ title: "Error", description: "Failed to update artwork", variant: "destructive" });
      } else {
        toast({ title: "Updated", description: "Artwork updated successfully" });
        fetchArtworks();
        setIsDialogOpen(false);
      }
    } else {
      const { error } = await supabase
        .from("artworks")
        .insert({
          title: artworkForm.title!,
          collection: artworkForm.collection!,
          size: artworkForm.size || "24 x 30 inches",
          medium: artworkForm.medium || "Oil on Canvas",
          price: artworkForm.price || 5000,
          available: artworkForm.available ?? true,
          story: artworkForm.story!,
          placement: artworkForm.placement || null,
          design_inspiration: artworkForm.design_inspiration || null,
          mood: artworkForm.mood || null,
          image_url: artworkForm.image_url || null,
        });

      if (error) {
        toast({ title: "Error", description: "Failed to create artwork", variant: "destructive" });
      } else {
        toast({ title: "Created", description: "New artwork added successfully" });
        fetchArtworks();
        setIsDialogOpen(false);
      }
    }
  };

  const deleteArtwork = async (artworkId: string) => {
    if (!confirm("Are you sure you want to delete this artwork?")) return;

    const { error } = await supabase
      .from("artworks")
      .delete()
      .eq("id", artworkId);

    if (error) {
      toast({ title: "Error", description: "Failed to delete artwork", variant: "destructive" });
    } else {
      toast({ title: "Deleted", description: "Artwork removed successfully" });
      fetchArtworks();
    }
  };

  const openDialog = (artwork?: Artwork) => {
    if (artwork) {
      setSelectedArtwork(artwork);
      setArtworkForm(artwork);
    } else {
      setSelectedArtwork(null);
      setArtworkForm({});
    }
    setIsDialogOpen(true);
  };

  const filteredArtworks = artworks.filter((artwork) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      artwork.title.toLowerCase().includes(searchLower) ||
      artwork.collection.toLowerCase().includes(searchLower)
    );
  });

  return (
    <AdminLayout title="Artworks" subtitle="Manage your art collection">
      {/* Actions */}
      <div className="flex flex-wrap gap-4 justify-between items-center mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            placeholder="Search by title or collection..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="hero" onClick={() => openDialog()}>
          <Plus size={16} className="mr-2" />
          Add Artwork
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="p-4 bg-secondary/50 border border-border rounded-lg">
          <p className="text-2xl font-serif">{artworks.length}</p>
          <p className="text-sm text-muted-foreground">Total Artworks</p>
        </div>
        <div className="p-4 bg-secondary/50 border border-border rounded-lg">
          <p className="text-2xl font-serif">{artworks.filter((a) => a.available).length}</p>
          <p className="text-sm text-muted-foreground">Available</p>
        </div>
        <div className="p-4 bg-secondary/50 border border-border rounded-lg">
          <p className="text-2xl font-serif">{artworks.filter((a) => !a.available).length}</p>
          <p className="text-sm text-muted-foreground">Sold</p>
        </div>
      </div>

      {/* Artworks Grid */}
      {loading ? (
        <div className="text-center py-16 text-muted-foreground">Loading...</div>
      ) : filteredArtworks.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          {searchTerm ? "No artworks match your search" : "No artworks yet"}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArtworks.map((artwork, index) => (
            <div
              key={artwork.id}
              className="bg-secondary/30 border border-border overflow-hidden rounded-lg group"
            >
              <div className="aspect-[3/4] overflow-hidden">
                <img
                  src={getArtworkImage(artwork.image_url, index)}
                  alt={artwork.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-muted-foreground font-sans">
                      {artwork.collection}
                    </p>
                    <h3 className="font-serif text-lg">{artwork.title}</h3>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      artwork.available
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                    }`}
                  >
                    {artwork.available ? "Available" : "Sold"}
                  </span>
                </div>
                <p className="text-accent font-serif mb-4">
                  ₹{artwork.price.toLocaleString()}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => openDialog(artwork)}
                  >
                    <Edit size={14} className="mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteArtwork(artwork.id)}
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

      {/* Artwork Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif">
              {selectedArtwork ? "Edit Artwork" : "Add New Artwork"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground mb-2 block">
                  Title *
                </label>
                <Input
                  value={artworkForm.title || ""}
                  onChange={(e) =>
                    setArtworkForm({ ...artworkForm, title: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground mb-2 block">
                  Collection *
                </label>
                <Input
                  value={artworkForm.collection || ""}
                  onChange={(e) =>
                    setArtworkForm({ ...artworkForm, collection: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground mb-2 block">
                  Size
                </label>
                <Input
                  value={artworkForm.size || ""}
                  onChange={(e) =>
                    setArtworkForm({ ...artworkForm, size: e.target.value })
                  }
                  placeholder="24 x 30 inches"
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground mb-2 block">
                  Medium
                </label>
                <Input
                  value={artworkForm.medium || ""}
                  onChange={(e) =>
                    setArtworkForm({ ...artworkForm, medium: e.target.value })
                  }
                  placeholder="Oil on Canvas"
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground mb-2 block">
                  Price (₹)
                </label>
                <Input
                  type="number"
                  value={artworkForm.price || ""}
                  onChange={(e) =>
                    setArtworkForm({ ...artworkForm, price: Number(e.target.value) })
                  }
                />
              </div>
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground mb-2 block">
                Story *
              </label>
              <Textarea
                value={artworkForm.story || ""}
                onChange={(e) =>
                  setArtworkForm({ ...artworkForm, story: e.target.value })
                }
                className="min-h-24"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground mb-2 block">
                  Mood
                </label>
                <Input
                  value={artworkForm.mood || ""}
                  onChange={(e) =>
                    setArtworkForm({ ...artworkForm, mood: e.target.value })
                  }
                  placeholder="Serene, Contemplative"
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground mb-2 block">
                  Placement
                </label>
                <Input
                  value={artworkForm.placement || ""}
                  onChange={(e) =>
                    setArtworkForm({ ...artworkForm, placement: e.target.value })
                  }
                  placeholder="Living Room, Lobby"
                />
              </div>
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground mb-2 block">
                Design Inspiration
              </label>
              <Textarea
                value={artworkForm.design_inspiration || ""}
                onChange={(e) =>
                  setArtworkForm({ ...artworkForm, design_inspiration: e.target.value })
                }
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="text-sm font-sans">
                <input
                  type="checkbox"
                  checked={artworkForm.available ?? true}
                  onChange={(e) =>
                    setArtworkForm({ ...artworkForm, available: e.target.checked })
                  }
                  className="mr-2"
                />
                Available for sale
              </label>
            </div>
            <Button variant="hero" className="w-full" onClick={saveArtwork}>
              {selectedArtwork ? "Update Artwork" : "Create Artwork"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminArtworks;
