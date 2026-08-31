import { useState } from "react";
import { MapPin, CalendarDays } from "lucide-react";
import { useExhibitions, type Exhibition } from "@/hooks/useExhibitions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const ExhibitionsSection = () => {
  const { exhibitions, loading } = useExhibitions();
  const [active, setActive] = useState<Exhibition | null>(null);

  if (loading || exhibitions.length === 0) return null;

  return (
    <section className="py-16 md:py-24">
      <div className="container-wide">
        <div className="mb-10 md:mb-14 max-w-2xl">
          <p className="text-xs uppercase tracking-[0.3em] text-accent font-sans mb-4">
            On View
          </p>
          <h2 className="font-serif text-3xl md:text-4xl mb-4">Exhibitions</h2>
          <p className="text-muted-foreground font-sans text-sm md:text-base">
            Shows, showcases and the occasional wandering canvas — notes from where
            the work has been seen.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {exhibitions.map((item) => (
            <article
              key={item.id}
              className="group cursor-pointer rounded-xl overflow-hidden border border-border bg-background/40 backdrop-blur-xl transition-shadow hover:shadow-lg"
              onClick={() => setActive(item)}
            >
              {item.image_url && (
                <div className="aspect-[4/3] overflow-hidden bg-secondary">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                </div>
              )}
              <div className="p-6">
                {(item.event_date || item.location) && (
                  <div className="flex flex-wrap gap-4 mb-3 text-xs font-sans text-muted-foreground">
                    {item.event_date && (
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarDays size={13} className="text-accent" />
                        {item.event_date}
                      </span>
                    )}
                    {item.location && (
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin size={13} className="text-accent" />
                        {item.location}
                      </span>
                    )}
                  </div>
                )}
                <h3 className="font-serif text-xl mb-2">{item.title}</h3>
                {item.subtitle && (
                  <p className="text-sm text-accent font-sans mb-2">{item.subtitle}</p>
                )}
                {item.content && (
                  <p className="text-sm text-muted-foreground font-sans line-clamp-3 whitespace-pre-line">
                    {item.content}
                  </p>
                )}
                <span className="mt-4 inline-block text-xs uppercase tracking-[0.2em] font-sans text-accent">
                  Read more
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>

      <Dialog open={!!active} onOpenChange={(open) => !open && setActive(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {active && (
            <>
              <DialogHeader>
                <DialogTitle className="font-serif text-2xl text-left">
                  {active.title}
                </DialogTitle>
              </DialogHeader>
              {active.subtitle && (
                <p className="text-sm text-accent font-sans">{active.subtitle}</p>
              )}
              {(active.event_date || active.location) && (
                <div className="flex flex-wrap gap-4 text-xs font-sans text-muted-foreground">
                  {active.event_date && (
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarDays size={13} className="text-accent" />
                      {active.event_date}
                    </span>
                  )}
                  {active.location && (
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin size={13} className="text-accent" />
                      {active.location}
                    </span>
                  )}
                </div>
              )}
              {active.image_url && (
                <img
                  src={active.image_url}
                  alt={active.title}
                  className="w-full rounded-lg border border-border"
                />
              )}
              {active.content && (
                <p className="text-sm md:text-base text-muted-foreground font-sans whitespace-pre-line leading-relaxed">
                  {active.content}
                </p>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};
