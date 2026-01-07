import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAdmin } from "@/hooks/useAdmin";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Package,
  Palette,
  Users,
  Eye,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  Plus,
  Edit,
  Trash2,
} from "lucide-react";
import artwork1 from "@/assets/artwork-1.jpg";
import artwork2 from "@/assets/artwork-2.jpg";
import artwork3 from "@/assets/artwork-3.jpg";
import paintingFeatured from "@/assets/painting-featured.jpg";

interface Order {
  id: string;
  status: string;
  shipping_status: string | null;
  tracking_number: string | null;
  estimated_delivery: string | null;
  total_amount: number;
  shipping_address: string | null;
  notes: string | null;
  created_at: string;
  user_id: string;
  artwork_id: string;
}

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

const Admin = () => {
  const { isAdmin, loading: adminLoading } = useAdmin();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<"orders" | "artworks" | "inquiries">("orders");
  const [orders, setOrders] = useState<Order[]>([]);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [isArtworkDialogOpen, setIsArtworkDialogOpen] = useState(false);
  const [artworkForm, setArtworkForm] = useState<Partial<Artwork>>({});

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!adminLoading && !isAdmin && user) {
      toast({
        title: "Access Denied",
        description: "You don't have admin privileges.",
        variant: "destructive",
      });
      navigate("/");
    }
  }, [isAdmin, adminLoading, user, navigate, toast]);

  useEffect(() => {
    if (isAdmin) {
      fetchOrders();
      fetchArtworks();
    }
  }, [isAdmin]);

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setOrders(data);
    }
  };

  const fetchArtworks = async () => {
    const { data, error } = await supabase
      .from("artworks")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setArtworks(data);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", orderId);

    if (error) {
      toast({ title: "Error", description: "Failed to update order", variant: "destructive" });
    } else {
      toast({ title: "Updated", description: "Order status updated successfully" });
      fetchOrders();
    }
  };

  const updateShippingInfo = async (orderId: string, updates: Partial<Order>) => {
    const { error } = await supabase
      .from("orders")
      .update(updates)
      .eq("id", orderId);

    if (error) {
      toast({ title: "Error", description: "Failed to update shipping", variant: "destructive" });
    } else {
      toast({ title: "Updated", description: "Shipping info updated" });
      fetchOrders();
      setSelectedOrder(null);
    }
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
        setIsArtworkDialogOpen(false);
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
        setIsArtworkDialogOpen(false);
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

  const openArtworkDialog = (artwork?: Artwork) => {
    if (artwork) {
      setSelectedArtwork(artwork);
      setArtworkForm(artwork);
    } else {
      setSelectedArtwork(null);
      setArtworkForm({});
    }
    setIsArtworkDialogOpen(true);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Clock size={16} className="text-blue-500" />;
      case "processing":
        return <Package size={16} className="text-amber-500" />;
      case "shipped":
        return <Truck size={16} className="text-purple-500" />;
      case "delivered":
        return <CheckCircle size={16} className="text-green-500" />;
      case "cancelled":
        return <XCircle size={16} className="text-red-500" />;
      default:
        return <Clock size={16} className="text-muted-foreground" />;
    }
  };

  if (authLoading || adminLoading) {
    return (
      <Layout>
        <div className="pt-32 pb-20 container-wide min-h-screen flex items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </Layout>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <Layout>
      <section className="pt-32 pb-20 container-wide min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <p className="text-xs uppercase tracking-[0.3em] text-accent font-sans mb-4">
              Admin Panel
            </p>
            <h1 className="font-serif text-3xl md:text-4xl mb-2">Manage Your Gallery</h1>
            <p className="text-muted-foreground font-sans text-sm">
              Orders, artworks, and inquiries at a glance.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="p-6 bg-secondary/50 border border-border">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                  <Package size={24} className="text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-serif">{orders.length}</p>
                  <p className="text-sm text-muted-foreground font-sans">Total Orders</p>
                </div>
              </div>
            </div>
            <div className="p-6 bg-secondary/50 border border-border">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                  <Palette size={24} className="text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-serif">{artworks.length}</p>
                  <p className="text-sm text-muted-foreground font-sans">Artworks</p>
                </div>
              </div>
            </div>
            <div className="p-6 bg-secondary/50 border border-border">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                  <Users size={24} className="text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-serif">
                    ₹{orders.reduce((sum, o) => sum + o.total_amount, 0).toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground font-sans">Total Revenue</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-8 border-b border-border">
            {[
              { id: "orders" as const, label: "Orders", icon: Package },
              { id: "artworks" as const, label: "Artworks", icon: Palette },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-sans uppercase tracking-wider transition-colors border-b-2 -mb-px ${
                  activeTab === tab.id
                    ? "border-accent text-accent"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <div className="space-y-4">
              {orders.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">
                  No orders yet
                </div>
              ) : (
                orders.map((order) => (
                  <div
                    key={order.id}
                    className="p-6 bg-secondary/30 border border-border"
                  >
                    <div className="flex flex-wrap gap-6 items-start justify-between">
                      <div className="flex-1 min-w-[200px]">
                        <div className="flex items-center gap-2 mb-2">
                          {getStatusIcon(order.status)}
                          <span className="text-xs uppercase tracking-wider font-sans">
                            {order.status}
                          </span>
                        </div>
                        <p className="font-mono text-sm text-muted-foreground mb-1">
                          #{order.id.slice(0, 8).toUpperCase()}
                        </p>
                        <p className="text-sm text-muted-foreground font-sans">
                          {new Date(order.created_at).toLocaleDateString("en-IN", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>

                      <div className="flex-1 min-w-[200px]">
                        <p className="text-xs uppercase tracking-widest text-muted-foreground font-sans mb-1">
                          Amount
                        </p>
                        <p className="font-serif text-lg text-accent">
                          ₹{order.total_amount.toLocaleString()}
                        </p>
                      </div>

                      <div className="flex-1 min-w-[200px]">
                        <p className="text-xs uppercase tracking-widest text-muted-foreground font-sans mb-1">
                          Shipping
                        </p>
                        <p className="text-sm font-sans whitespace-pre-line">
                          {order.shipping_address?.split("\n")[0] || "N/A"}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <Select
                          value={order.status}
                          onValueChange={(value) => updateOrderStatus(order.id, value)}
                        >
                          <SelectTrigger className="w-36 h-9 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="processing">Processing</SelectItem>
                            <SelectItem value="shipped">Shipped</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedOrder(order)}
                            >
                              <Eye size={14} />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-lg">
                            <DialogHeader>
                              <DialogTitle className="font-serif">Order Details</DialogTitle>
                            </DialogHeader>
                            {selectedOrder && (
                              <div className="space-y-4">
                                <div>
                                  <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
                                    Order ID
                                  </p>
                                  <p className="font-mono">{selectedOrder.id}</p>
                                </div>
                                <div>
                                  <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
                                    Shipping Address
                                  </p>
                                  <p className="whitespace-pre-line text-sm">
                                    {selectedOrder.shipping_address || "N/A"}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
                                    Tracking Number
                                  </p>
                                  <Input
                                    placeholder="Enter tracking number"
                                    defaultValue={selectedOrder.tracking_number || ""}
                                    onChange={(e) =>
                                      setSelectedOrder({
                                        ...selectedOrder,
                                        tracking_number: e.target.value,
                                      })
                                    }
                                    className="h-10"
                                  />
                                </div>
                                <div>
                                  <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
                                    Estimated Delivery
                                  </p>
                                  <Input
                                    type="date"
                                    defaultValue={selectedOrder.estimated_delivery || ""}
                                    onChange={(e) =>
                                      setSelectedOrder({
                                        ...selectedOrder,
                                        estimated_delivery: e.target.value,
                                      })
                                    }
                                    className="h-10"
                                  />
                                </div>
                                <Button
                                  variant="hero"
                                  className="w-full"
                                  onClick={() =>
                                    updateShippingInfo(selectedOrder.id, {
                                      tracking_number: selectedOrder.tracking_number,
                                      estimated_delivery: selectedOrder.estimated_delivery,
                                    })
                                  }
                                >
                                  Save Changes
                                </Button>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Artworks Tab */}
          {activeTab === "artworks" && (
            <div>
              <div className="flex justify-end mb-6">
                <Button variant="hero" onClick={() => openArtworkDialog()}>
                  <Plus size={16} className="mr-2" />
                  Add Artwork
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {artworks.map((artwork, index) => (
                  <div
                    key={artwork.id}
                    className="bg-secondary/30 border border-border overflow-hidden group"
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
                          className={`text-xs px-2 py-1 ${
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
                          onClick={() => openArtworkDialog(artwork)}
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

              {/* Artwork Dialog */}
              <Dialog open={isArtworkDialogOpen} onOpenChange={setIsArtworkDialogOpen}>
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
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Admin;
