import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useInView } from "framer-motion";
import { useRef } from "react";

const AboutSection = () => {
  const { t } = useLanguage();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const bulletItems = [
    t("about.list1"),
    t("about.list2"),
    t("about.list3"),
    t("about.list4"),
  ];

  return (
    <section id="about" className="py-24 md:py-32">
      <div className="container mx-auto px-6 max-w-3xl" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-4 tracking-wide">
            {t("about.title")}
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl font-body italic mb-12">
            {t("about.welcome")}
          </p>
          <div className="w-12 h-[1px] bg-foreground/30 mx-auto mb-12" />

          <p className="text-muted-foreground leading-relaxed text-base md:text-lg font-body mb-6">
            {t("about.text1")}
          </p>
          <p className="text-muted-foreground leading-relaxed text-base md:text-lg font-body mb-8">
            {t("about.text2")}
          </p>

          <p className="text-foreground font-body text-base md:text-lg font-medium mb-4">
            {t("about.listTitle")}
          </p>
          <ul className="text-muted-foreground text-base md:text-lg font-body space-y-2 mb-10 text-left max-w-md mx-auto">
            {bulletItems.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="text-primary mt-1.5 text-xs">●</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <p className="text-muted-foreground leading-relaxed text-base md:text-lg font-body italic">
            {t("about.closing")}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
