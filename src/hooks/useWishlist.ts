import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export const useWishlist = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else {
      setWishlistIds([]);
    }
  }, [user]);

  const fetchWishlist = async () => {
    if (!user) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from("wishlists")
      .select("artwork_id")
      .eq("user_id", user.id);

    if (!error && data) {
      setWishlistIds(data.map((item) => item.artwork_id));
    }
    setLoading(false);
  };

  const toggleWishlist = async (artworkId: string) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save artworks to your collection.",
        variant: "destructive",
      });
      return;
    }

    const isInWishlist = wishlistIds.includes(artworkId);

    if (isInWishlist) {
      const { error } = await supabase
        .from("wishlists")
        .delete()
        .eq("user_id", user.id)
        .eq("artwork_id", artworkId);

      if (!error) {
        setWishlistIds((prev) => prev.filter((id) => id !== artworkId));
        toast({
          title: "Removed from collection",
          description: "This piece has been removed from your saved works.",
        });
      }
    } else {
      const { error } = await supabase
        .from("wishlists")
        .insert({ user_id: user.id, artwork_id: artworkId });

      if (!error) {
        setWishlistIds((prev) => [...prev, artworkId]);
        toast({
          title: "Saved to collection",
          description: "This piece has been added to your saved works.",
        });
      }
    }
  };

  const isInWishlist = (artworkId: string) => wishlistIds.includes(artworkId);

  return { wishlistIds, loading, toggleWishlist, isInWishlist, fetchWishlist };
};
