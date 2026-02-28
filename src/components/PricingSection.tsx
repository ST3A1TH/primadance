import { motion, useInView } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRef } from "react";

const groupPrices = [
  { lessons: "4", price: "800" },
  { lessons: "8", price: "1400" },
  { lessons: "12", price: "1800" },
];

const personalPrices = [
  { lessons: "1", price: "700" },
  { lessons: "4", price: "2600" },
  { lessons: "8", price: "5200" },
  { lessons: "12", price: "7000" },
];

const PricingSection = () => {
  const { t } = useLanguage();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="pricing" className="py-24 md:py-32 bg-secondary">
      <div className="container mx-auto px-6 max-w-4xl" ref={ref}>
        <motion.h2
          className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-16 text-center tracking-wide"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          {t("pricing.title")}
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Group */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <h3 className="font-display text-2xl text-foreground mb-2">
              {t("pricing.group")}
            </h3>
            <p className="text-muted-foreground text-xs tracking-[0.15em] uppercase font-body mb-8">
              {t("pricing.minutes")}
            </p>
            <div className="space-y-4">
              {groupPrices.map((p) => (
                <div key={p.lessons} className="flex justify-between items-baseline border-b border-border pb-3">
                  <span className="text-foreground font-body text-sm">
                    {p.lessons} {t("pricing.lessons")}
                  </span>
                  <span className="text-foreground font-body text-sm">{p.price} lei</span>
                </div>
              ))}
              <div className="flex justify-between items-baseline border-b border-border pb-3">
                <span className="text-foreground font-body text-sm">
                  {t("pricing.unlimited")}
                </span>
                <span className="text-foreground font-body text-sm">3000 lei</span>
              </div>
            </div>
          </motion.div>

          {/* Personal */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <h3 className="font-display text-2xl text-foreground mb-2">
              {t("pricing.personal")}
            </h3>
            <p className="text-muted-foreground text-xs tracking-[0.15em] uppercase font-body mb-8">
              {t("pricing.minutes")}
            </p>
            <div className="space-y-4">
              {personalPrices.map((p) => (
                <div key={p.lessons} className="flex justify-between items-baseline border-b border-border pb-3">
                  <span className="text-foreground font-body text-sm">
                    {p.lessons} {parseInt(p.lessons) === 1 ? t("pricing.lesson") : t("pricing.lessons")}
                  </span>
                  <span className="text-foreground font-body text-sm">{p.price} lei</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Rules */}
        <motion.div
          className="border border-border p-8 text-center max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <h4 className="font-display text-xl text-foreground mb-4">{t("pricing.rules.title")}</h4>
          <p className="text-muted-foreground text-sm leading-relaxed font-body">
            {t("pricing.rules.text")}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;
