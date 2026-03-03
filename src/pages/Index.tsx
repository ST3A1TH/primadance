import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ClassesSection from "@/components/ClassesSection";
import DanceOverlaySection from "@/components/DanceOverlaySection";
import GallerySection from "@/components/GallerySection";
import ScheduleSection from "@/components/ScheduleSection";
import PricingSection from "@/components/PricingSection";
import ContactSection from "@/components/ContactSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <AboutSection />
      <ClassesSection />
      <DanceOverlaySection />
      <GallerySection />
      <ScheduleSection />
      <PricingSection />
      <ContactSection />
    </div>
  );
};

export default Index;
