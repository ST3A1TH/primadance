import { useState, useMemo } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ClassesSection from "@/components/ClassesSection";
import DanceOverlaySection from "@/components/DanceOverlaySection";
import GallerySection from "@/components/GallerySection";
import ScheduleSection from "@/components/ScheduleSection";
import ContactSection from "@/components/ContactSection";
import IntroAnimation, { shouldShowIntro } from "@/components/IntroAnimation";
import SEOHead from "@/components/SEOHead";
import { useLanguage } from "@/contexts/LanguageContext";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Prima Dance",
  "description": "Modern dance studio in Chisinau offering Latin dance classes, ballroom training and Pro-Am competitions for adults.",
  "url": "https://primadance.lovable.app",
  "telephone": "+37361100499",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Strada Nicolae Testemițanu 19/10",
    "addressLocality": "Chișinău",
    "postalCode": "MD-2025",
    "addressCountry": "MD"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 47.02,
    "longitude": 28.8
  },
  "sameAs": [
    "https://instagram.com/primadancemd",
    "https://t.me/primadancemd",
    "https://facebook.com/primadancemd"
  ],
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    "opens": "09:00",
    "closes": "21:00"
  },
  "image": "https://primadance.lovable.app/og-image.png",
  "@id": "https://primadance.lovable.app"
};

const Index = () => {
  const [showIntro, setShowIntro] = useState(shouldShowIntro);
  const { lang } = useLanguage();

  const seo = useMemo(() => lang === "ro" ? {
    title: "Prima Dance — Studio de Dans pentru Adulți în Chișinău",
    description: "Studio de dans modern în Chișinău. Lecții de dans latin, ballroom și Pro-Am pentru adulți. Programează-te online!"
  } : {
    title: "Prima Dance — Танцевальная Студия для Взрослых в Кишинёве",
    description: "Современная танцевальная студия в Кишинёве. Латинские, бальные танцы и Pro-Am для взрослых. Запишитесь онлайн!"
  }, [lang]);

  return (
    <>
      <SEOHead
        title={seo.title}
        description={seo.description}
        canonical="https://primadance.lovable.app/"
        jsonLd={jsonLd}
      />
      {showIntro && <IntroAnimation onComplete={() => setShowIntro(false)} />}
      <div className="min-h-screen bg-background">
        <Header />
        <HeroSection />
        <AboutSection />
        <ClassesSection />
        <DanceOverlaySection />
        <GallerySection />
        <ScheduleSection />
        <ContactSection />
      </div>
    </>
  );
};

export default Index;
