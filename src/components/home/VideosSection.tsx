import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { useSiteVideos } from "@/hooks/useSiteVideos";

export const VideosSection = () => {
  const { videos, enabled, loading } = useSiteVideos();
  const [playing, setPlaying] = useState<string | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const hasVideos = !loading && enabled && videos.length > 0;

  const updateArrows = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 8);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  }, []);

  useEffect(() => {
    if (!hasVideos) return;
    updateArrows();
    window.addEventListener("resize", updateArrows);
    return () => window.removeEventListener("resize", updateArrows);
  }, [hasVideos, videos.length, updateArrows]);

  const scrollByCard = (direction: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    const amount = card ? card.offsetWidth + 32 : el.clientWidth * 0.8;
    el.scrollBy({ left: direction * amount, behavior: "smooth" });
  };

  if (!hasVideos) return null;

  return (
    <section className="py-12 md:py-20 bg-secondary/30 relative overflow-hidden">
      <div className="container-wide mb-8 md:mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div className="max-w-2xl">
          <p className="text-[10px] uppercase tracking-[0.4em] text-accent font-sans mb-3">
            In His Own Words
          </p>
          <div className="section-divider mt-1 mx-0 mb-4" />
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl mb-4">
            Listen to Naveen Vij
          </h2>
          <p className="text-muted-foreground font-sans text-sm md:text-base">
            Conversations, walkthroughs and reflections — straight from the studio,
            fuelled by chai.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            disabled={!canPrev}
            aria-label="Previous videos"
            className="h-11 w-11 rounded-full border border-border bg-background/60 backdrop-blur-xl flex items-center justify-center transition-all duration-300 hover:bg-background hover:border-accent hover:text-accent disabled:opacity-30 disabled:pointer-events-none"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => scrollByCard(1)}
            disabled={!canNext}
            aria-label="Next videos"
            className="h-11 w-11 rounded-full border border-border bg-background/60 backdrop-blur-xl flex items-center justify-center transition-all duration-300 hover:bg-background hover:border-accent hover:text-accent disabled:opacity-30 disabled:pointer-events-none"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        onScroll={updateArrows}
        className="flex gap-6 md:gap-8 overflow-x-auto scroll-smooth snap-x snap-mandatory px-6 md:px-12 pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {videos.map((video) => (
          <article
            key={video.id}
            className="group snap-start shrink-0 w-[72vw] sm:w-[46vw] md:w-[33vw] lg:w-[26vw] xl:w-[22vw] rounded-xl overflow-hidden border border-border bg-background/40 backdrop-blur-xl transition-all duration-500 hover:border-accent/40"
          >
            <div className="relative aspect-video bg-secondary">
              {playing === video.id ? (
                <iframe
                  className="absolute inset-0 h-full w-full"
                  src={`https://www.youtube.com/embed/${video.video_id}?autoplay=1&rel=0`}
                  title={video.title || "Naveen Vij video"}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setPlaying(video.id)}
                  className="absolute inset-0 h-full w-full"
                  aria-label={`Play ${video.title || "video"}`}
                >
                  <img
                    src={`https://i.ytimg.com/vi/${video.video_id}/hqdefault.jpg`}
                    alt={video.title || "Naveen Vij video thumbnail"}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                  <span className="absolute inset-0 flex items-center justify-center bg-foreground/20 transition-colors group-hover:bg-foreground/10">
                    <span className="h-14 w-14 rounded-full bg-background/70 backdrop-blur-xl border border-border flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
                      <Play size={20} className="text-accent ml-0.5" />
                    </span>
                  </span>
                </button>
              )}
            </div>
            {(video.title || video.description) && (
              <div className="p-5">
                {video.title && (
                  <h3 className="font-serif text-lg mb-1">{video.title}</h3>
                )}
                {video.description && (
                  <p className="text-sm text-muted-foreground font-sans line-clamp-2">
                    {video.description}
                  </p>
                )}
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
};
