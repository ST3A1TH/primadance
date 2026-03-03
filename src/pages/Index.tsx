import { useState } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ClassesSection from "@/components/ClassesSection";
import DanceOverlaySection from "@/components/DanceOverlaySection";
import GallerySection from "@/components/GallerySection";
import ScheduleSection from "@/components/ScheduleSection";
import PricingSection from "@/components/PricingSection";
import ContactSection from "@/components/ContactSection";
import IntroAnimation, { shouldShowIntro } from "@/components/IntroAnimation";

const Index = () => {
  const [showIntro, setShowIntro] = useState(shouldShowIntro);

  return (
    <>
      {showIntro && <IntroAnimation onComplete={() => setShowIntro(false)} />}
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
    </>
  );
};

export default Index;
