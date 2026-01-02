import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

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

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => setIsOpen(false), [location]);

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
      isScrolled ? "bg-background/95 backdrop-blur-md shadow-soft py-4" : "bg-transparent py-6"
    )}>
      <nav className="container-wide flex items-center justify-between">
        <Link to="/" className="group">
          <span className="font-serif text-xl md:text-2xl tracking-wide text-foreground">
            Naveen <span className="text-accent">Vij</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <ul className="flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={cn(
                    "text-xs uppercase tracking-widest font-sans transition-all duration-300 line-animate pb-1",
                    location.pathname === link.path ? "text-accent" : "text-foreground hover:text-accent"
                  )}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            to={user ? "/profile" : "/auth"}
            className="p-2 hover:text-accent transition-colors"
          >
            <User size={20} />
          </Link>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-foreground hover:text-accent transition-colors"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      <div className={cn(
        "md:hidden fixed inset-0 top-[72px] bg-background/98 backdrop-blur-lg transition-all duration-500",
        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      )}>
        <ul className="flex flex-col items-center justify-center h-full gap-8">
          {navLinks.map((link, index) => (
            <li key={link.path} className={cn("transform transition-all duration-500", isOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0")} style={{ transitionDelay: `${index * 100}ms` }}>
              <Link to={link.path} className={cn("font-serif text-3xl tracking-wide transition-colors", location.pathname === link.path ? "text-accent" : "text-foreground hover:text-accent")}>
                {link.name}
              </Link>
            </li>
          ))}
          <li>
            <Link to={user ? "/profile" : "/auth"} className="font-serif text-3xl tracking-wide text-foreground hover:text-accent">
              {user ? "Profile" : "Sign In"}
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
};
