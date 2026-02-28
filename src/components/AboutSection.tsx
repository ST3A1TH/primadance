import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useInView } from "framer-motion";
import { useRef } from "react";

const AboutSection = () => {
  const { t } = useLanguage();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="py-24 md:py-32">
      <div className="container mx-auto px-6 max-w-3xl" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-12 tracking-wide">
            {t("about.title")}
          </h2>
          <div className="w-12 h-[1px] bg-foreground/30 mx-auto mb-12" />
          <p className="text-muted-foreground leading-relaxed text-base md:text-lg font-body mb-8">
            {t("about.text1")}
          </p>
          <p className="text-muted-foreground leading-relaxed text-base md:text-lg font-body italic">
            {t("about.text2")}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
