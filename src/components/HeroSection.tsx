import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-image.jpg";
import heroSlide1 from "@/assets/hero-slide-1.jpg";
import heroSlide2 from "@/assets/hero-slide-2.jpg";
import logoTextLight from "@/assets/logo-text-light.png";

const slides = [heroSlide1, heroSlide2, heroImage];

const HeroSection = () => {
  const { t } = useLanguage();
  
  const [current, setCurrent] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrent(prev => (prev + 1) % slides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <section id="hero" className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Slider */}
      {/* Static black background to prevent white flash */}
      <div className="absolute inset-0 bg-black" />
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        >
          <img
            src={slides[current]}
            alt={`Dance class at Prima Dance studio in Chisinau - ${current === 0 ? 'Latin dance training' : current === 1 ? 'Ballroom dance lesson' : 'Professional dance studio'}`}
            className="w-full h-full object-cover"
            fetchPriority={current === 0 ? "high" : undefined}
            decoding={current === 0 ? "sync" : "async"}
          />
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
