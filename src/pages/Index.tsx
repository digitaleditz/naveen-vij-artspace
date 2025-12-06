import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { TwoPathSection } from "@/components/home/TwoPathSection";
import { FeaturedProjects } from "@/components/home/FeaturedProjects";
import { FeaturedArtworks } from "@/components/home/FeaturedArtworks";
import { AboutSnapshot } from "@/components/home/AboutSnapshot";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { CTASection } from "@/components/home/CTASection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <TwoPathSection />
      <FeaturedProjects />
      <FeaturedArtworks />
      <AboutSnapshot />
      <TestimonialsSection />
      <CTASection />
    </Layout>
  );
};

export default Index;
