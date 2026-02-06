import { Link } from "react-router-dom";
import { Instagram, Mail, Phone } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-charcoal text-cream relative overflow-hidden">
      {/* Decorative accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
      
      <div className="container-wide section-padding-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="font-serif text-2xl md:text-3xl mb-5">Naveen Vij</h3>
            <p className="text-cream/50 font-sans text-sm leading-relaxed max-w-md mb-6">
              Artist & Visual Storyteller — Creating paintings that speak 
              of space, light, and emotion. Each canvas carries the 
              discipline of architecture and the freedom of art.
            </p>
            <p className="text-[10px] uppercase tracking-[0.3em] text-cream/30 font-sans">
              New Delhi, India
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.3em] font-sans mb-6 text-cream/40">
              Explore
            </h4>
            <ul className="space-y-3">
              {[
                { name: "The Collection", path: "/collection" },
                { name: "The Architect", path: "/the-architect" },
                { name: "Contact", path: "/contact" },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm font-sans text-cream/50 hover:text-cream transition-colors duration-300 relative group"
                  >
                    {link.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-px bg-gold group-hover:w-full transition-all duration-300" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.3em] font-sans mb-6 text-cream/40">
              Connect
            </h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="mailto:hello@naveenvij.com"
                  className="flex items-center gap-3 text-sm font-sans text-cream/50 hover:text-cream transition-colors group"
                >
                  <Mail size={14} className="text-gold/70 group-hover:text-gold transition-colors" />
                  hello@naveenvij.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+919876543210"
                  className="flex items-center gap-3 text-sm font-sans text-cream/50 hover:text-cream transition-colors group"
                >
                  <Phone size={14} className="text-gold/70 group-hover:text-gold transition-colors" />
                  +91 98765 43210
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm font-sans text-cream/50 hover:text-cream transition-colors group"
                >
                  <Instagram size={14} className="text-gold/70 group-hover:text-gold transition-colors" />
                  @naveenvij.studio
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-cream/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs font-sans text-cream/30">
            © {new Date().getFullYear()} Naveen Vij. All rights reserved.
          </p>
          <p className="text-xs font-sans text-cream/30 italic">
            "Every painting is an unbuilt building—a space that exists only in feeling."
          </p>
        </div>
      </div>
    </footer>
  );
};
