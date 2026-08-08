import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { ArtExperienceSection } from "@/components/home/ArtExperienceSection";
import { ArchExperienceSection } from "@/components/home/ArchExperienceSection";
import { ArtistSection } from "@/components/home/ArtistSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { CTASection } from "@/components/home/CTASection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <div id="art-experience">
        <ArtExperienceSection />
      </div>
      <div id="architecture-projects">
        <ArchExperienceSection />
      </div>
      <ArtistSection />
      <TestimonialsSection />
      <CTASection />
    </Layout>
  );
};

export default Index;
