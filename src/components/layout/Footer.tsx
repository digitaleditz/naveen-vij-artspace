import { Link } from "react-router-dom";
import { Instagram, Mail, Phone } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container-wide section-padding">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="font-serif text-2xl mb-4">Naveen Vij</h3>
            <p className="text-primary-foreground/70 font-sans text-sm leading-relaxed max-w-md">
              Architect, Interior Designer & Artist creating spaces and stories 
              that transform homes into living galleries.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs uppercase tracking-widest font-sans mb-6 text-primary-foreground/50">
              Explore
            </h4>
            <ul className="space-y-3">
              {[
                { name: "Interior Design", path: "/interiors" },
                { name: "Art Gallery", path: "/gallery" },
                { name: "About", path: "/about" },
                { name: "Contact", path: "/contact" },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm font-sans text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs uppercase tracking-widest font-sans mb-6 text-primary-foreground/50">
              Get in Touch
            </h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="mailto:hello@naveenvij.com"
                  className="flex items-center gap-3 text-sm font-sans text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                >
                  <Mail size={16} />
                  hello@naveenvij.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+919876543210"
                  className="flex items-center gap-3 text-sm font-sans text-primary-foreground/70 hover:text-primary-foreground transition-colors"
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
                  className="flex items-center gap-3 text-sm font-sans text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                >
                  <Instagram size={16} />
                  @naveenvij.studio
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs font-sans text-primary-foreground/50">
            © {new Date().getFullYear()} Naveen Vij. All rights reserved.
          </p>
          <p className="text-xs font-sans text-primary-foreground/50">
            Designed with intention, built with care.
          </p>
        </div>
      </div>
    </footer>
  );
};
