import { Link } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { ShoppingBag, X, ArrowRight } from "lucide-react";
import artwork1 from "@/assets/artwork-1.jpg";
import artwork2 from "@/assets/artwork-2.jpg";
import artwork3 from "@/assets/artwork-3.jpg";
import paintingFeatured from "@/assets/painting-featured.jpg";

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

interface CartSheetProps {
  children?: React.ReactNode;
}

export const CartSheet = ({ children }: CartSheetProps) => {
  const { items, total, removeFromCart } = useCart();

  return (
    <Sheet>
      <SheetTrigger asChild>
        {children || (
          <button className="relative p-2 hover:bg-secondary/50 transition-colors">
            <ShoppingBag size={20} />
            {items.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-accent-foreground text-xs flex items-center justify-center rounded-full">
                {items.length}
              </span>
            )}
          </button>
        )}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="font-serif text-xl">Your Selection</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <ShoppingBag size={48} className="text-muted-foreground/30 mb-4" />
            <h3 className="font-serif text-lg mb-2">Your cart is empty</h3>
            <p className="text-sm text-muted-foreground font-sans mb-6">
              Explore our collection to find pieces that speak to you.
            </p>
            <Button variant="hero" asChild>
              <Link to="/collection">
                Explore Collection
                <ArrowRight size={16} className="ml-2" />
              </Link>
            </Button>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto py-6 space-y-4">
              {items.map((item, index) => (
                <div
                  key={item.artwork.id}
                  className="flex gap-4 p-4 bg-secondary/30 border border-border"
                >
                  <div className="w-20 h-20 flex-shrink-0 overflow-hidden">
                    <img
                      src={getArtworkImage(item.artwork.image_url, index)}
                      alt={item.artwork.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs uppercase tracking-widest text-muted-foreground font-sans mb-1">
                      {item.artwork.collection}
                    </p>
                    <h3 className="font-serif text-sm truncate">{item.artwork.title}</h3>
                    <p className="text-accent font-serif mt-1">
                      ₹{item.artwork.price.toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.artwork.id)}
                    className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-6 pb-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground font-sans">Subtotal</span>
                <span className="font-serif text-lg">₹{total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground font-sans">Shipping</span>
                <span className="text-sm text-accent font-sans">Complimentary</span>
              </div>
              <div className="flex justify-between items-center border-t border-border pt-4">
                <span className="font-serif">Total</span>
                <span className="font-serif text-xl text-accent">₹{total.toLocaleString()}</span>
              </div>
              <Button variant="hero" size="lg" className="w-full" asChild>
                <Link to="/checkout">
                  Proceed to Checkout
                  <ArrowRight size={16} className="ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
