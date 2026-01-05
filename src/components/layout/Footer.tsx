import { Link } from "react-router-dom";
import { Instagram, Mail, Phone } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-charcoal text-cream">
      <div className="container-wide section-padding">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="font-serif text-2xl mb-4">Naveen Vij</h3>
            <p className="text-cream/60 font-sans text-sm leading-relaxed max-w-md mb-6">
              Architect & Visual Storyteller — Creating spaces that speak 
              and paintings that inhabit. Where architecture meets art, 
              vision becomes tangible.
            </p>
            <p className="text-xs uppercase tracking-[0.2em] text-cream/40 font-sans">
              New Delhi, India
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] font-sans mb-6 text-cream/40">
              Explore
            </h4>
            <ul className="space-y-3">
              {[
                { name: "The Architect", path: "/about" },
                { name: "The Vision", path: "/vision" },
                { name: "The Collection", path: "/collection" },
                { name: "Interiors", path: "/interiors" },
                { name: "Contact", path: "/contact" },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm font-sans text-cream/60 hover:text-cream transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] font-sans mb-6 text-cream/40">
              Connect
            </h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="mailto:hello@naveenvij.com"
                  className="flex items-center gap-3 text-sm font-sans text-cream/60 hover:text-cream transition-colors"
                >
                  <Mail size={16} />
                  hello@naveenvij.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+919876543210"
                  className="flex items-center gap-3 text-sm font-sans text-cream/60 hover:text-cream transition-colors"
                >
                  <Phone size={16} />
                  +91 98765 43210
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm font-sans text-cream/60 hover:text-cream transition-colors"
                >
                  <Instagram size={16} />
                  @naveenvij.studio
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-cream/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs font-sans text-cream/40">
            © {new Date().getFullYear()} Naveen Vij. All rights reserved.
          </p>
          <p className="text-xs font-sans text-cream/40 italic">
            "Architecture is frozen music; painting is its melody."
          </p>
        </div>
      </div>
    </footer>
  );
};
