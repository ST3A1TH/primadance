import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import danceOverlay from "@/assets/dance-overlay-1.jpg";

const DanceOverlaySection = () => {
  const { t } = useLanguage();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={danceOverlay}
          alt="Latin dance performance at Prima Dance studio Chisinau"
          className="w-full h-full object-cover"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>
      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
        <motion.p
          className="font-display text-white text-3xl md:text-5xl lg:text-6xl italic tracking-wide leading-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
        >
          {t("overlay.quote")}
        </motion.p>
        <motion.div
          className="w-16 h-[1px] bg-white/40 mx-auto mt-8"
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
        />
      </div>
    </section>
  );
};

export default DanceOverlaySection;
