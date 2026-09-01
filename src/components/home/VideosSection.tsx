import { useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";
import { useSiteVideos } from "@/hooks/useSiteVideos";

export const VideosSection = () => {
  const { videos, enabled, loading } = useSiteVideos();
  const [playing, setPlaying] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const scrollPos = useRef(0);
  const speed = 0.5; // px per frame

  const hasVideos = !loading && enabled && videos.length > 0;
  // Duplicate for a seamless loop
  const loopVideos = hasVideos ? [...videos, ...videos] : [];
  const frozen = isPaused || playing !== null;

  useEffect(() => {
    const container = scrollRef.current;
    if (!container || !hasVideos) return;

    const animate = () => {
      if (!frozen && container) {
        scrollPos.current += speed;
        const halfWidth = container.scrollWidth / 2;
        if (halfWidth > 0 && scrollPos.current >= halfWidth) {
          scrollPos.current = 0;
        }
        container.style.transform = `translateX(-${scrollPos.current}px)`;
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [frozen, hasVideos, videos.length]);

  if (!hasVideos) return null;

  return (
    <section className="py-12 md:py-20 bg-secondary/30 relative overflow-hidden select-none">
      <div className="container-wide mb-8 md:mb-12 max-w-2xl">
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

      {/* Infinite scroll marquee */}
      <div
        className="overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div ref={scrollRef} className="flex gap-6 md:gap-10 will-change-transform">
          {loopVideos.map((video, index) => {
            const key = `${video.id}-${index}`;
            return (
              <article
                key={key}
                className="group shrink-0 w-[80vw] sm:w-[55vw] md:w-[40vw] lg:w-[32vw] xl:w-[26vw] rounded-xl overflow-hidden border border-border bg-background/40 backdrop-blur-xl"
              >
                <div className="relative aspect-video bg-secondary">
                  {playing === key ? (
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
                      onClick={() => setPlaying(key)}
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
                        <span className="h-14 w-14 rounded-full bg-background/70 backdrop-blur-xl border border-border flex items-center justify-center">
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
            );
          })}
        </div>
      </div>
    </section>
  );
};
