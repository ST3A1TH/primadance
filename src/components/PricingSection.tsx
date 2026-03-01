import { motion, useInView } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRef, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface PricingItem {
  id: string;
  category: string;
  label_ro: string;
  label_ru: string;
  price: string;
}

const PricingSection = () => {
  const { lang, t } = useLanguage();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [items, setItems] = useState<PricingItem[]>([]);
  const [rulesText, setRulesText] = useState({ ro: "", ru: "" });

  useEffect(() => {
    supabase.from("pricing").select("*").order("category").order("sort_order").then(({ data }) => {
      if (data) setItems(data);
    });
    supabase.from("site_content").select("*").eq("key", "pricing.rules").single().then(({ data }) => {
      if (data) setRulesText({ ro: data.value_ro, ru: data.value_ru });
    });
  }, []);

  const groupItems = items.filter(i => i.category === "group");
  const personalItems = items.filter(i => i.category === "personal");

  const renderList = (list: PricingItem[]) => (
    <div className="space-y-4">
      {list.map((p) => (
        <div key={p.id} className="flex justify-between items-baseline border-b border-border pb-3">
          <span className="text-foreground font-body text-sm">{lang === "ro" ? p.label_ro : p.label_ru}</span>
          <span className="text-foreground font-body text-sm">{p.price}</span>
        </div>
      ))}
    </div>
  );

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
          <motion.div initial={{ opacity: 0, x: -30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.7 }}>
            <h3 className="font-display text-2xl text-foreground mb-2">{t("pricing.group")}</h3>
            <p className="text-muted-foreground text-xs tracking-[0.15em] uppercase font-body mb-8">{t("pricing.minutes")}</p>
            {renderList(groupItems)}
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.7 }}>
            <h3 className="font-display text-2xl text-foreground mb-2">{t("pricing.personal")}</h3>
            <p className="text-muted-foreground text-xs tracking-[0.15em] uppercase font-body mb-8">{t("pricing.minutes")}</p>
            {renderList(personalItems)}
          </motion.div>
        </div>

        <motion.div
          className="border border-border p-8 text-center max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <h4 className="font-display text-xl text-foreground mb-4">{t("pricing.rules.title")}</h4>
          <p className="text-muted-foreground text-sm leading-relaxed font-body">
            {lang === "ro" ? rulesText.ro : rulesText.ru}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;
