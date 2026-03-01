import { motion, useInView } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRef, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ClassItem {
  id: string;
  name: string;
  description_ro: string;
  description_ru: string;
}

const ClassesSection = () => {
  const { lang, t } = useLanguage();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [classes, setClasses] = useState<ClassItem[]>([]);

  useEffect(() => {
    supabase.from("classes").select("*").order("sort_order").then(({ data }) => {
      if (data) setClasses(data);
    });
  }, []);

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
              key={cls.id}
              className="border border-border p-8 hover:bg-muted/30 transition-colors duration-500 group"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <h3 className="font-display text-2xl text-foreground mb-4 group-hover:tracking-wider transition-all duration-500">
                {cls.name}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed font-body">
                {lang === "ro" ? cls.description_ro : cls.description_ru}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClassesSection;
