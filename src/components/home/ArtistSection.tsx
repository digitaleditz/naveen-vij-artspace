import { Link } from "react-router-dom";
import { useArtistMoments } from "@/hooks/useArtistMoments";
import { ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminEditableImage } from "@/components/AdminEditableImage";
import naveenPortrait from "@/assets/naveen-portrait.jpg";

export const ArtistSection = () => {
  const { moments, loading } = useArtistMoments();

  return (
    <section className="section-padding bg-secondary/20 relative overflow-hidden">
      {/* Decorative blurs */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />

      <div className="container-wide relative z-10">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-16 lg:mb-24">
          <div>
            <p className="text-[10px] uppercase tracking-[0.4em] text-accent font-sans mb-3">
              The Man Behind the Mess
            </p>
            <div className="section-divider mt-1 mx-0 mb-6" />
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl mb-6 leading-tight">
              Meet Naveen Vij
            </h2>
            <p className="text-muted-foreground font-sans text-base md:text-lg leading-relaxed mb-4">
              An architect who decided buildings weren't enough to contain his 
              imagination. So he picked up a brush. And then clay. And then walls 
              (yes, entire walls). Forty years later, he's still not done experimenting.
            </p>
            <p className="text-muted-foreground font-sans text-base leading-relaxed mb-8">
              When he's not turning blank canvases into visual arguments about 
              space and light, he's probably redesigning his own studio for the 
              fourteenth time. Architect habits die hard.
            </p>
            <Link
              to="/the-architect"
              className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-accent font-sans hover:gap-3 transition-all duration-300 group"
            >
              His full story (it's a good one)
              <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Portrait */}
          <div className="relative">
            <div className="aspect-[4/5] overflow-hidden">
              <AdminEditableImage
                src={naveenPortrait}
                alt="Naveen Vij in his studio"
                className="w-full h-full object-cover"
                assetKey="naveen-portrait"
              />
            </div>
            <div className="absolute -bottom-4 -left-4 bg-background border border-border px-6 py-4">
              <p className="font-serif text-lg italic text-foreground">
                "Every canvas is an unbuilt building."
              </p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-1">
                — Naveen, probably over chai
              </p>
            </div>
          </div>
        </div>

        {/* Moments with paintings */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-lg overflow-hidden">
                <Skeleton className="aspect-[4/5]" />
              </div>
            ))}
          </div>
        ) : moments.length > 0 ? (
          <>
            <div className="flex items-center gap-6 mb-10">
              <div className="h-px flex-1 bg-border" />
              <div className="text-center">
                <p className="text-[10px] uppercase tracking-[0.4em] text-accent font-sans mb-1">
                  Caught in the Act
                </p>
                <h3 className="font-serif text-2xl md:text-3xl">
                  The Artist & His Creations
                </h3>
              </div>
              <div className="h-px flex-1 bg-border" />
            </div>
            <p className="text-muted-foreground font-sans text-sm text-center max-w-md mx-auto mb-12">
              Proof that he actually paints these himself. No AI involved. Just chai, chaos, and a lot of turpentine.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {moments.map((moment) => (
                <div key={moment.id} className="group relative cursor-pointer p-2 border border-border/50 rounded-sm bg-card/40">
                  {/* Image fills the entire card */}
                  <div className="aspect-[3/4] overflow-hidden relative">
                    <AdminEditableImage
                      src={moment.image_url}
                      alt={`Naveen Vij with ${moment.painting_name}`}
                      className="w-full h-full object-cover transition-all duration-500 group-hover:blur-[3px] group-hover:scale-[1.02]"
                      assetKey={`moment-${moment.id}`}
                      dbUpdate={{
                        table: "artist_moments",
                        id: moment.id,
                        column: "image_url",
                        storageBucket: "artist-moments",
                      }}
                    />
                    {/* Dark overlay on hover */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    {/* Permanent subtle gradient for title */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  </div>

                  {/* Title always visible */}
                  <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                    <h4 className="font-serif text-lg sm:text-xl text-white leading-snug">
                      {moment.painting_name}
                    </h4>
                  </div>

                  {/* Description on hover - centered */}
                  <div className="absolute inset-0 flex items-center justify-center p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <p className="text-white/90 font-sans text-sm sm:text-base leading-relaxed text-center max-w-[85%]">
                      {moment.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
};
