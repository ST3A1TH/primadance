import { motion, useInView } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRef } from "react";

const classes = [
  { key: "stretching" },
  { key: "relax" },
  { key: "totalbody" },
  { key: "latintechnique" },
  { key: "latinhits" },
  { key: "dance" },
  { key: "dancemix" },
];

const ClassesSection = () => {
  const { t } = useLanguage();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="classes" className="py-24 md:py-32 bg-secondary">
      <div className="container mx-auto px-6" ref={ref}>
        <motion.h2
          className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-16 text-center tracking-wide"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          {t("classes.title")}
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {classes.map((cls, i) => (
            <motion.div
              key={cls.key}
              className="border border-border p-8 hover:bg-muted/30 transition-colors duration-500 group"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <h3 className="font-display text-2xl text-foreground mb-4 group-hover:tracking-wider transition-all duration-500">
                {t(`class.${cls.key}`)}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed font-body">
                {t(`class.${cls.key}.desc`)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClassesSection;
