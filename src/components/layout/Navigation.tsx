import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, User, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import { CartSheet } from "@/components/cart/CartSheet";
import { useCart } from "@/contexts/CartContext";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "The Architect", path: "/about" },
  { name: "The Vision", path: "/vision" },
  { name: "The Collection", path: "/collection" },
  { name: "Interiors", path: "/interiors" },
  { name: "Contact", path: "/contact" },
];

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
  const { items } = useCart();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => setIsOpen(false), [location]);

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
      isScrolled 
        ? "bg-background/95 backdrop-blur-md shadow-soft py-4" 
        : "bg-transparent py-6"
    )}>
      <nav className="container-wide flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="group relative">
          <span className="font-serif text-xl md:text-2xl tracking-wide text-foreground">
            Naveen <span className="text-accent">Vij</span>
          </span>
          <span className="absolute -bottom-1 left-0 w-0 h-px bg-accent transition-all duration-500 group-hover:w-full" />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-10">
          <ul className="flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={cn(
                    "text-[11px] uppercase tracking-[0.2em] font-sans transition-all duration-300 relative py-2",
                    location.pathname === link.path 
                      ? "text-accent" 
                      : "text-foreground/80 hover:text-foreground"
                  )}
                >
                  {link.name}
                  <span className={cn(
                    "absolute -bottom-0.5 left-0 h-px bg-accent transition-all duration-500",
                    location.pathname === link.path ? "w-full" : "w-0 group-hover:w-full"
                  )} />
                </Link>
              </li>
            ))}
          </ul>
          
          <div className="flex items-center gap-4 pl-4 border-l border-border">
            <ThemeToggle />
            <CartSheet>
              <button className="p-2.5 hover:text-accent transition-colors rounded-full hover:bg-secondary relative">
                <ShoppingBag size={18} />
                {items.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-accent-foreground text-xs rounded-full flex items-center justify-center">
                    {items.length}
                  </span>
                )}
              </button>
            </CartSheet>
            <Link
              to={user ? "/profile" : "/auth"}
              className="p-2.5 hover:text-accent transition-colors rounded-full hover:bg-secondary"
            >
              <User size={18} />
            </Link>
          </div>
        </div>

        {/* Mobile Controls */}
        <div className="flex lg:hidden items-center gap-3">
          <ThemeToggle />
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-foreground hover:text-accent transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={cn(
        "lg:hidden fixed inset-0 top-[72px] bg-background/98 backdrop-blur-lg transition-all duration-500",
        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      )}>
        <ul className="flex flex-col items-center justify-center h-full gap-8">
          {navLinks.map((link, index) => (
            <li 
              key={link.path} 
              className={cn(
                "transform transition-all duration-500",
                isOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              )} 
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <Link 
                to={link.path} 
                className={cn(
                  "font-serif text-3xl tracking-wide transition-colors",
                  location.pathname === link.path 
                    ? "text-accent" 
                    : "text-foreground hover:text-accent"
                )}
              >
                {link.name}
              </Link>
            </li>
          ))}
          <li 
            className={cn(
              "transform transition-all duration-500 pt-4 border-t border-border",
              isOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            )}
            style={{ transitionDelay: `${navLinks.length * 100}ms` }}
          >
            <Link 
              to={user ? "/profile" : "/auth"} 
              className="font-serif text-2xl tracking-wide text-foreground hover:text-accent"
            >
              {user ? "Profile" : "Sign In"}
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
};
