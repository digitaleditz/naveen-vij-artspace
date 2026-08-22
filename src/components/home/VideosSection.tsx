import { useState } from "react";
import { Play } from "lucide-react";
import { useSiteVideos } from "@/hooks/useSiteVideos";

export const VideosSection = () => {
  const { videos, enabled, loading } = useSiteVideos();
  const [playing, setPlaying] = useState<string | null>(null);

  if (loading || !enabled || videos.length === 0) return null;

  return (
    <section className="py-16 md:py-24 bg-secondary/30">
      <div className="container-wide">
        <div className="mb-10 md:mb-14 max-w-2xl">
          <p className="text-xs uppercase tracking-[0.3em] text-accent font-sans mb-4">
            In His Own Words
          </p>
          <h2 className="font-serif text-3xl md:text-4xl mb-4">
            Listen to Naveen Vij
          </h2>
          <p className="text-muted-foreground font-sans text-sm md:text-base">
            Conversations, walkthroughs and reflections — straight from the studio,
            fuelled by chai.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {videos.map((video) => (
            <article
              key={video.id}
              className="group rounded-xl overflow-hidden border border-border bg-background/40 backdrop-blur-xl"
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
                    <p className="text-sm text-muted-foreground font-sans">
                      {video.description}
                    </p>
                  )}
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
