import { createContext, useContext, useState, ReactNode } from "react";
import { Artwork } from "@/hooks/useArtworks";

interface CartItem {
  artwork: Artwork;
  addedAt: Date;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (artwork: Artwork) => void;
  removeFromCart: (artworkId: string) => void;
  clearCart: () => void;
  isInCart: (artworkId: string) => boolean;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (artwork: Artwork) => {
    if (!items.find((item) => item.artwork.id === artwork.id)) {
      setItems((prev) => [...prev, { artwork, addedAt: new Date() }]);
    }
  };

  const removeFromCart = (artworkId: string) => {
    setItems((prev) => prev.filter((item) => item.artwork.id !== artworkId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const isInCart = (artworkId: string) => {
    return items.some((item) => item.artwork.id === artworkId);
  };

  const total = items.reduce((sum, item) => sum + item.artwork.price, 0);

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, clearCart, isInCart, total }}
    >
      {children}
    </CartContext.Provider>
  );
};
