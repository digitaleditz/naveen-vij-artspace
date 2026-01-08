import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Heart, Package, User, LogOut, ArrowRight } from "lucide-react";

interface Profile {
  full_name: string | null;
  phone: string | null;
  city: string | null;
}

interface WishlistItem {
  artwork_id: string;
  artworks: {
    id: string;
    title: string;
    collection: string;
    price: number;
    image_url: string | null;
  };
}

interface Order {
  id: string;
  status: string;
  total_amount: number;
  created_at: string;
  artworks: {
    title: string;
    image_url: string | null;
  };
}

const Profile = () => {
  const { user, signOut, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<"profile" | "saved" | "orders">("profile");
  const [profile, setProfile] = useState<Profile>({ full_name: "", phone: "", city: "" });
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchWishlist();
      fetchOrders();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("profiles")
      .select("full_name, phone, city")
      .eq("user_id", user.id)
      .maybeSingle();
    
    if (data) {
      setProfile(data);
    }
  };

  const fetchWishlist = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("wishlists")
      .select(`
        artwork_id,
        artworks (
          id,
          title,
          collection,
          price,
          image_url
        )
      `)
      .eq("user_id", user.id);
    
    if (data) {
      setWishlist(data as unknown as WishlistItem[]);
    }
  };

  const fetchOrders = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("orders")
      .select(`
        id,
        status,
        total_amount,
        created_at,
        artworks (
          title,
          image_url
        )
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    
    if (data) {
      setOrders(data as unknown as Order[]);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);
    
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: profile.full_name,
        phone: profile.phone,
        city: profile.city,
      })
      .eq("user_id", user.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Profile updated",
        description: "Your profile has been saved successfully.",
      });
    }
    setSaving(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const removeFromWishlist = async (artworkId: string) => {
    if (!user) return;
    await supabase
      .from("wishlists")
      .delete()
      .eq("user_id", user.id)
      .eq("artwork_id", artworkId);
    
    setWishlist((prev) => prev.filter((item) => item.artwork_id !== artworkId));
    toast({
      title: "Removed",
      description: "Artwork removed from your saved collection.",
    });
  };

  if (authLoading) {
    return (
      <Layout>
        <div className="pt-32 pb-20 container-wide min-h-screen flex items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="pt-32 pb-20 container-wide min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <p className="text-xs uppercase tracking-[0.3em] text-accent font-sans mb-4">
              Your Account
            </p>
            <h1 className="font-serif text-3xl md:text-4xl mb-2">
              Welcome{profile.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""}
            </h1>
            <p className="text-muted-foreground font-sans text-sm">
              Manage your profile, saved artworks, and acquisitions.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-12 border-b border-border">
            {[
              { id: "profile" as const, label: "Profile", icon: User },
              { id: "saved" as const, label: "Saved Works", icon: Heart },
              { id: "orders" as const, label: "Acquisitions", icon: Package },
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

          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="max-w-lg">
              <div className="space-y-6">
                <div>
                  <label className="text-xs uppercase tracking-widest font-sans text-muted-foreground mb-2 block">
                    Full Name
                  </label>
                  <Input
                    value={profile.full_name || ""}
                    onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                    className="bg-transparent border-border focus:border-accent rounded-none h-12"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest font-sans text-muted-foreground mb-2 block">
                    Email
                  </label>
                  <Input
                    value={user?.email || ""}
                    disabled
                    className="bg-secondary border-border rounded-none h-12 text-muted-foreground"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest font-sans text-muted-foreground mb-2 block">
                    Phone
                  </label>
                  <Input
                    value={profile.phone || ""}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="bg-transparent border-border focus:border-accent rounded-none h-12"
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest font-sans text-muted-foreground mb-2 block">
                    City
                  </label>
                  <Input
                    value={profile.city || ""}
                    onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                    className="bg-transparent border-border focus:border-accent rounded-none h-12"
                    placeholder="Mumbai"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <Button variant="hero" onClick={handleSaveProfile} disabled={saving}>
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button variant="heroOutline" onClick={handleSignOut}>
                    <LogOut size={16} className="mr-2" />
                    Sign Out
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Saved Works Tab */}
          {activeTab === "saved" && (
            <div>
              {wishlist.length === 0 ? (
                <div className="text-center py-16">
                  <Heart size={48} className="mx-auto text-muted-foreground/30 mb-4" />
                  <h3 className="font-serif text-xl mb-2">No saved works yet</h3>
                  <p className="text-muted-foreground font-sans text-sm mb-6">
                    Browse the collection and save pieces that resonate with you.
                  </p>
                  <Button variant="hero" asChild>
                    <Link to="/collection">
                      Explore the Collection
                      <ArrowRight size={16} className="ml-2" />
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wishlist.map((item) => (
                    <div key={item.artwork_id} className="group">
                      <div className="aspect-[3/4] overflow-hidden bg-secondary mb-4 relative">
                        <img
                          src={item.artworks.image_url || "/placeholder.svg"}
                          alt={item.artworks.title}
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => removeFromWishlist(item.artwork_id)}
                          className="absolute top-3 right-3 p-2 bg-background/90 hover:bg-background transition-colors"
                        >
                          <Heart size={16} className="fill-accent text-accent" />
                        </button>
                      </div>
                      <p className="text-xs uppercase tracking-widest text-muted-foreground font-sans mb-1">
                        {item.artworks.collection}
                      </p>
                      <h3 className="font-serif text-lg mb-1">{item.artworks.title}</h3>
                      <p className="text-accent font-sans text-sm">
                        ₹{item.artworks.price.toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <div>
              {orders.length === 0 ? (
                <div className="text-center py-16">
                  <Package size={48} className="mx-auto text-muted-foreground/30 mb-4" />
                  <h3 className="font-serif text-xl mb-2">No acquisitions yet</h3>
                  <p className="text-muted-foreground font-sans text-sm mb-6">
                    When you acquire a piece, it will appear here.
                  </p>
                  <Button variant="hero" asChild>
                    <Link to="/collection">
                      Explore the Collection
                      <ArrowRight size={16} className="ml-2" />
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map((order) => (
                    <Link 
                      key={order.id} 
                      to={`/order/${order.id}`}
                      className="flex gap-6 p-6 bg-secondary hover:bg-secondary/80 transition-colors group"
                    >
                      <div className="w-24 h-24 flex-shrink-0 bg-stone overflow-hidden">
                        <img
                          src={order.artworks.image_url || "/placeholder.svg"}
                          alt={order.artworks.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-serif text-lg mb-1 group-hover:text-accent transition-colors">
                            {order.artworks.title}
                          </h3>
                          <ArrowRight size={16} className="text-muted-foreground group-hover:text-accent transition-colors" />
                        </div>
                        <p className="text-sm text-muted-foreground font-sans mb-2">
                          Acquired on {new Date(order.created_at).toLocaleDateString("en-IN", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                        <div className="flex gap-4 items-center">
                          <span className="text-accent font-sans">
                            ₹{order.total_amount.toLocaleString()}
                          </span>
                          <span className={`text-xs uppercase tracking-wider px-2 py-1 ${
                            order.status === "completed" 
                              ? "bg-green-100 text-green-800" 
                              : "bg-amber-100 text-amber-800"
                          }`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Profile;
