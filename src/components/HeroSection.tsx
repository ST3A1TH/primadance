import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-image.jpg";
import logoTextDark from "@/assets/logo-text-dark.png";

const HeroSection = () => {
  const { t } = useLanguage();

  return (
    <section id="hero" className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={heroImage} alt="Dance" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-background/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6">
        <motion.img
          src={logoTextDark}
          alt="Prima"
          className="h-20 sm:h-28 md:h-36 mx-auto mb-6 object-contain"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        />
        <motion.p
          className="font-display text-foreground/80 text-lg sm:text-xl md:text-2xl italic tracking-wide mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          Dance Studio
        </motion.p>
        <motion.p
          className="text-muted-foreground text-sm sm:text-base tracking-[0.2em] uppercase font-body mb-10 max-w-lg mx-auto"
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
            className="inline-block border border-foreground text-foreground px-8 py-3 text-sm tracking-[0.2em] uppercase font-body hover:bg-foreground hover:text-background transition-all duration-500"
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
        <div className="w-[1px] h-12 bg-foreground/30" />
      </motion.div>
    </section>
  );
};

export default HeroSection;
