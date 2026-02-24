import { Link } from "react-router-dom";
import { useArtistMoments } from "@/hooks/useArtistMoments";
import { ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
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
              <img
                src={naveenPortrait}
                alt="Naveen Vij in his studio"
                className="w-full h-full object-cover"
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i}>
                <Skeleton className="aspect-square mb-4" />
                <Skeleton className="h-5 w-32 mb-2" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        ) : moments.length > 0 ? (
          <>
            <div className="text-center mb-12">
              <p className="text-[10px] uppercase tracking-[0.4em] text-accent font-sans mb-3">
                Caught in the Act
              </p>
              <h3 className="font-serif text-2xl md:text-3xl">
                The Artist & His Creations
              </h3>
              <p className="text-muted-foreground font-sans text-sm mt-2 max-w-md mx-auto">
                Proof that he actually paints these himself. No AI involved. Just coffee, chaos, and a lot of turpentine.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {moments.map((moment) => (
                <div key={moment.id} className="group">
                  <div className="aspect-square overflow-hidden mb-4 bg-muted">
                    <img
                      src={moment.image_url}
                      alt={`Naveen Vij with ${moment.painting_name}`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <h4 className="font-serif text-xl mb-1 group-hover:text-accent transition-colors">
                    {moment.painting_name}
                  </h4>
                  <p className="text-muted-foreground font-sans text-sm leading-relaxed">
                    {moment.description}
                  </p>
                </div>
              ))}
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
};
