import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-image.jpg";
import heroSlide1 from "@/assets/hero-slide-1.jpg";
import heroSlide2 from "@/assets/hero-slide-2.jpg";
import heroSlide3 from "@/assets/hero-slide-3.jpg";
import logoTextDark from "@/assets/logo-text-dark.png";

const slides = [heroSlide1, heroSlide2, heroSlide3, heroImage];

const HeroSection = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();
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
            alt="Dance"
            className="w-full h-full object-cover"
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
      <div className="relative z-10 text-center px-6">
        <motion.img
          src={logoTextDark}
          alt="Prima Dance"
          className="h-20 sm:h-28 md:h-36 mx-auto mb-6 object-contain"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        />
        <motion.p
          className="font-display text-white/80 text-lg sm:text-xl md:text-2xl italic tracking-wide mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          Dance Studio
        </motion.p>
        <motion.p
          className="text-white/60 text-sm sm:text-base tracking-[0.2em] uppercase font-body mb-10 max-w-lg mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          {t("hero.subtitle")}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
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
