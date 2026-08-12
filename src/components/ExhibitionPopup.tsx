import { useState, useEffect } from "react";
import { MapPin, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import poster from "@/assets/art-grandeur-2026.jpg";

const MAPS_URL = "https://maps.app.goo.gl/5aW9ypndCjgPM9xf7";

const SHOWN_KEY = "exhibition-popup-shown";

export const ExhibitionPopup = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Only auto-open once per browser session, regardless of route changes.
    if (sessionStorage.getItem(SHOWN_KEY)) return;
    sessionStorage.setItem(SHOWN_KEY, "1");
    const timer = setTimeout(() => setOpen(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("open-exhibition-popup", handler);
    return () => window.removeEventListener("open-exhibition-popup", handler);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      {/* Sticky bottom button */}
      <button
        onClick={() => setOpen(true)}
        aria-label="View exhibition details"
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-accent text-accent-foreground shadow-gold px-5 py-3 rounded-full hover:scale-105 hover:shadow-gold-lg transition-all duration-300 flex items-center gap-2"
      >
        <Sparkles size={14} />
        <span className="text-[10px] uppercase tracking-[0.25em] font-sans">
          Exhibition
        </span>
      </button>

      {/* Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-[100] flex items-center justify-center p-4 transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        <div
          className="absolute inset-0 bg-foreground/50 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />

        <div
          className={cn(
            "relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-lg border border-border/60 bg-background shadow-elevated transition-all duration-500",
            open ? "translate-y-0 scale-100" : "translate-y-4 scale-95"
          )}
        >
          <button
            onClick={() => setOpen(false)}
            aria-label="Close"
            className="absolute right-3 top-3 z-10 p-2 rounded-full bg-background/80 backdrop-blur-xl border border-border/50 text-foreground hover:text-accent transition-colors"
          >
            <X size={18} />
          </button>

          <div className="grid md:grid-cols-2">
            <div className="bg-secondary">
              <img
                src={poster}
                alt="Naveen Vij at Art Grandeur, Film Expo India 2026, Bharat Mandapam New Delhi"
                className="w-full h-full object-contain md:object-cover max-h-[42vh] md:max-h-none"
                loading="lazy"
                decoding="async"
              />
            </div>

            <div className="p-7 md:p-10 flex flex-col justify-center">
              <p className="text-[10px] uppercase tracking-[0.4em] text-accent font-sans">
                26–30 August 2026
              </p>
              <div className="section-divider mt-3 mx-0" />

              <h2 className="font-serif text-3xl md:text-4xl mt-5 leading-tight">
                Art Grandeur
                <span className="block text-accent text-xl md:text-2xl mt-1">
                  Film Expo India
                </span>
              </h2>

              <div className="mt-5 space-y-4 text-sm md:text-base text-muted-foreground font-sans leading-relaxed">
                <p>
                  I'll be exhibiting at Art Grandeur, Film Expo India, from 26–30 August at
                  Bharat Mandapam, New Delhi.
                </p>
                <p>
                  If you've only seen my work on a screen, this is your chance to experience it
                  in person.
                </p>
                <p className="text-foreground">
                  Come find me at <span className="text-accent">STALL A62, Hall 2</span>,
                  Bharat Mandapam, ITPO, New Delhi.
                </p>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Button variant="default" size="lg" asChild>
                  <a href={MAPS_URL} target="_blank" rel="noopener noreferrer">
                    <MapPin size={16} />
                    Get Directions
                  </a>
                </Button>
                <Button variant="outline" size="lg" onClick={() => setOpen(false)}>
                  Maybe Later
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
