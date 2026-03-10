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
  "@type": "DanceSchool",
  "name": "Prima Dance",
  "alternateName": ["Prima Dance Studio", "Прима Данс", "Studio de Dans Prima"],
  "description": "Studio de dans modern în Chișinău. Lecții de dans latin, ballroom și Pro-Am pentru adulți. / Современная танцевальная студия в Кишинёве.",
  "url": "https://www.primadance.md",
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
  "areaServed": {
    "@type": "City",
    "name": "Chișinău"
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
  "image": "https://www.primadance.md/og-image.jpeg",
  "@id": "https://www.primadance.md",
  "priceRange": "$$",
  "currenciesAccepted": "MDL",
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Dance Classes",
    "itemListElement": [
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Lecții de dans latin / Уроки латинских танцев" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Dans de societate / Бальные танцы" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Pro-Am" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Stretching" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Dance Mix" } }
    ]
  }
};

const Index = () => {
  const [showIntro, setShowIntro] = useState(shouldShowIntro);
  const { lang } = useLanguage();

  const seo = useMemo(() => lang === "ro" ? {
    title: "Studio de Dans pentru Adulți în Chișinău | Prima Dance",
    description: "Studio de dans modern în Chișinău. Lecții de dans latin, ballroom și Pro-Am pentru adulți. Programează prima lecție gratuită!"
  } : {
    title: "Танцевальная Студия для Взрослых в Кишинёве | Prima Dance",
    description: "Современная танцевальная студия в Кишинёве. Латинские, бальные танцы и Pro-Am для взрослых. Запишитесь на первый урок!"
  }, [lang]);

  return (
    <>
      <SEOHead
        title={seo.title}
        description={seo.description}
        canonical="https://www.primadance.md/"
        ogImage="https://www.primadance.md/og-image.jpeg"
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
