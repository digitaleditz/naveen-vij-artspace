import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { ArtExperienceSection } from "@/components/home/ArtExperienceSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { CTASection } from "@/components/home/CTASection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <div id="art-experience">
        <ArtExperienceSection />
      </div>
      <TestimonialsSection />
      <CTASection />
    </Layout>
  );
};

export default Index;
