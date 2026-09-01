import { useState } from "react";
import { MapPin, CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { useExhibitions, statusLabel, type Exhibition } from "@/hooks/useExhibitions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const StatusTag = ({ status }: { status?: string | null }) => {
  const s = status || "upcoming";
  const tone =
    s === "past"
      ? "bg-muted text-muted-foreground border-border"
      : s === "ongoing"
      ? "bg-accent text-accent-foreground border-accent"
      : "bg-accent/15 text-accent border-accent/40";
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.2em] font-sans ${tone}`}
    >
      {statusLabel(s)}
    </span>
  );
};


const ImageSlider = ({
  images,
  alt,
  aspect = "aspect-[1/1]",
  rounded = "",
}: {
  images: string[];
  alt: string;
  aspect?: string;
  rounded?: string;
}) => {
  const [index, setIndex] = useState(0);
  if (images.length === 0) return null;

  const go = (e: React.MouseEvent, dir: number) => {
    e.stopPropagation();
    setIndex((i) => (i + dir + images.length) % images.length);
  };

  return (
    <div className={`relative overflow-hidden bg-secondary ${aspect} ${rounded}`}>
      {images.map((src, i) => (
        <img
          key={src + i}
          src={src}
          alt={`${alt} — image ${i + 1}`}
          loading="lazy"
          decoding="async"
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {images.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous image"
            onClick={(e) => go(e, -1)}
            className="absolute left-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-background/70 backdrop-blur-xl border border-border flex items-center justify-center text-foreground hover:bg-background transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            aria-label="Next image"
            onClick={(e) => go(e, 1)}
            className="absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-background/70 backdrop-blur-xl border border-border flex items-center justify-center text-foreground hover:bg-background transition-colors"
          >
            <ChevronRight size={16} />
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to image ${i + 1}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setIndex(i);
                }}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? "w-5 bg-accent" : "w-1.5 bg-background/70"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

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
              {item.images.length > 0 && (
                <div className="relative">
                  <ImageSlider images={item.images} alt={item.title} />
                  <div className="absolute left-3 top-3 z-10">
                    <StatusTag status={item.status} />
                  </div>
                </div>
              )}
              <div className="p-6">
                {item.images.length === 0 && (
                  <div className="mb-3">
                    <StatusTag status={item.status} />
                  </div>
                )}

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
            <div className="flex flex-col gap-4">
              <DialogHeader>
                <DialogTitle className="font-serif text-2xl text-left">
                  {active.title}
                </DialogTitle>
              </DialogHeader>
              <div className="flex items-center gap-3 flex-wrap">
                <StatusTag status={active.status} />
                {active.subtitle && (
                  <p className="text-sm text-accent font-sans">{active.subtitle}</p>
                )}
              </div>

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
              {active.images.length > 0 && (
                <div className="mx-auto max-w-sm w-full">
                  <ImageSlider
                    key={active.id}
                    images={active.images}
                    alt={active.title}
                    aspect="aspect-[4/5]"
                    rounded="rounded-lg border border-border"
                  />
                </div>
              )}
              {active.content && (
                <p className="text-sm md:text-base text-muted-foreground font-sans whitespace-pre-line leading-relaxed">
                  {active.content}
                </p>
              )}
            </div>
          )}

        </DialogContent>
      </Dialog>
    </section>
  );
};
