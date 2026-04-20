import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

import { Link } from "react-router-dom";
import heroSlideReception from "@/assets/hero-slide-reception.jpg";
import heroSlideReceptionMobile from "@/assets/hero-slide-reception-mobile.jpg";
import heroDance1 from "@/assets/hero-dance1.jpg";
import heroDance1Mobile from "@/assets/hero-dance1-mobile.jpg";
import heroDance3 from "@/assets/hero-dance3.jpg";
import heroDance3Mobile from "@/assets/hero-dance3-mobile.jpg";
import heroDance4 from "@/assets/hero-dance4.jpg";
import heroDance4Mobile from "@/assets/hero-dance4-mobile.jpg";
import heroDance5 from "@/assets/hero-dance5.jpg";
import heroDance5Mobile from "@/assets/hero-dance5-mobile.jpg";
import heroStudioHall from "@/assets/hero-studio-hall.jpg";
import heroStudioHallMobile from "@/assets/hero-studio-hall-mobile.jpg";
import heroStudioMirror from "@/assets/hero-studio-mirror.jpg";
import heroStudioMirrorMobile from "@/assets/hero-studio-mirror-mobile.jpg";
import logoTextLight from "@/assets/logo-text-light.png";

type Slide = { desktop: string; mobile?: string; alt: string };
// Mix: dramatic dance opener -> studio -> dance -> studio -> dance -> reception -> dance close-up
const slides: Slide[] = [
  { desktop: heroDance1, mobile: heroDance1Mobile, alt: "Cuplu de dansatori latino pe ringul de dans la Moldova Dance Festival" },
  { desktop: heroStudioHall, mobile: heroStudioHallMobile, alt: "Sala principală a studioului Prima Dance din Chișinău" },
  { desktop: heroDance3, mobile: heroDance3Mobile, alt: "Cuplu de dansatori în poziție de ballroom la Prima Dance" },
  { desktop: heroStudioMirror, mobile: heroStudioMirrorMobile, alt: "Sala de dans cu oglinzi profesionale la studioul Prima Dance" },
  { desktop: heroDance5, mobile: heroDance5Mobile, alt: "Cuplu de dansatori latino în ținută de competiție la Prima Dance" },
  { desktop: heroSlideReception, mobile: heroSlideReceptionMobile, alt: "Recepția studioului de dans Prima Dance din Chișinău" },
  { desktop: heroDance4, mobile: heroDance4Mobile, alt: "Portret artistic alb-negru al unei dansatoare profesioniste" },
];
const slideDurations = [5500, 4500, 4500, 4500, 4500, 5000, 4500];
// Alternate Ken Burns directions for cinematic feel
const kenBurns: Array<{ from: { scale: number; x: string; y: string }; to: { scale: number; x: string; y: string } }> = [
  { from: { scale: 1.05, x: "0%", y: "0%" }, to: { scale: 1.18, x: "-2%", y: "1%" } },
  { from: { scale: 1.15, x: "2%", y: "-1%" }, to: { scale: 1.02, x: "0%", y: "0%" } },
  { from: { scale: 1.05, x: "-1%", y: "1%" }, to: { scale: 1.18, x: "1%", y: "-1%" } },
  { from: { scale: 1.18, x: "1%", y: "1%" }, to: { scale: 1.04, x: "-1%", y: "-1%" } },
  { from: { scale: 1.05, x: "0%", y: "0%" }, to: { scale: 1.18, x: "0%", y: "-2%" } },
  { from: { scale: 1.12, x: "-1%", y: "0%" }, to: { scale: 1.04, x: "1%", y: "0%" } },
  { from: { scale: 1.06, x: "1%", y: "1%" }, to: { scale: 1.2, x: "-2%", y: "-1%" } },
];

const HeroSection = () => {
  const { t } = useLanguage();
  
  const [current, setCurrent] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrent(prev => (prev + 1) % slides.length);
  }, []);

  useEffect(() => {
    const timer = setTimeout(nextSlide, slideDurations[current]);
    return () => clearTimeout(timer);
  }, [current, nextSlide]);

  return (
    <section id="hero" className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Slider */}
      {/* Static black background to prevent white flash */}
      <div className="absolute inset-0 bg-black" />
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        >
          {/* Ken Burns: continuous zoom + subtle pan for cinematic dynamism */}
          <motion.div
            className="absolute inset-0 will-change-transform"
            initial={{ scale: kenBurns[current].from.scale, x: kenBurns[current].from.x, y: kenBurns[current].from.y }}
            animate={{ scale: kenBurns[current].to.scale, x: kenBurns[current].to.x, y: kenBurns[current].to.y }}
            transition={{ duration: slideDurations[current] / 1000 + 1.2, ease: "linear" }}
          >
            <picture>
              {slides[current].mobile && (
                <source media="(max-width: 768px)" srcSet={slides[current].mobile} />
              )}
              <img
                src={slides[current].desktop}
                alt={slides[current].alt}
                className="w-full h-full object-cover object-[center_30%]"
                fetchPriority={current === 0 ? "high" : undefined}
                decoding={current === 0 ? "sync" : "async"}
              />
            </picture>
          </motion.div>
          {/* Always use dark overlay for readability regardless of theme */}
          <div className="absolute inset-0 bg-black/55" />
        </motion.div>
      </AnimatePresence>

      {/* Slide indicators */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-8 h-[2px] transition-all duration-500 ${
              i === current ? "bg-white" : "bg-white/30"
            }`}
          />
        ))}
      </div>

      {/* Content - always white text on hero regardless of theme */}
      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
        <motion.img
          src={logoTextLight}
          alt="Prima Dance — Studio de dans pentru adulți în Chișinău"
          className="h-32 sm:h-44 md:h-56 mx-auto mb-6 object-contain"
          width={400}
          height={200}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        />
        <motion.h1
          className="text-white text-xl sm:text-2xl md:text-3xl font-display tracking-wide mb-5"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5 }}
        >
          {t("hero.title")}
        </motion.h1>
        <motion.p
          className="text-white/70 text-sm sm:text-base leading-relaxed font-body mb-6 max-w-2xl mx-auto whitespace-pre-line"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          {t("hero.subtitle")}
        </motion.p>
        <motion.p
          className="text-white/40 text-xs sm:text-sm tracking-[0.3em] uppercase font-body mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.0 }}
        >
          {t("hero.tags")}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <Link
            to="/booking"
            className="inline-block border border-white text-white px-8 py-3 text-sm tracking-[0.2em] uppercase font-body hover:bg-white hover:text-black transition-all duration-500"
          >
            {t("hero.cta")}
          </Link>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <div className="w-[1px] h-12 bg-white/30" />
      </motion.div>
    </section>
  );
};

export default HeroSection;
