import { motion, useInView } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRef, useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";
import AltegWidgetButton from "@/components/AltegWidgetButton";

interface ScheduleEntry {
  id: string;
  day_of_week: number;
  time: string;
  class_name: string;
  note: string | null;
  sort_order: number;
}

const ScheduleSection = () => {
  const { t } = useLanguage();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const isMobile = useIsMobile();
  const [openDay, setOpenDay] = useState<number | null>(null);
  const [items, setItems] = useState<ScheduleEntry[]>([]);

  useEffect(() => {
    supabase.from("schedule").select("*").order("day_of_week").order("sort_order").then(({ data }) => {
      if (data) setItems(data);
    });
  }, []);

  const dayKeys = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

  return (
    <section id="schedule" className="py-24 md:py-32">
      <div className="container mx-auto px-6 max-w-5xl" ref={ref}>
        <motion.h2
          className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-16 text-center tracking-wide"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          {t("schedule.title")}
        </motion.h2>

        <motion.div
          className="mb-12 flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <AltegWidgetButton className="inline-block border border-foreground bg-foreground text-background px-8 py-3 text-sm tracking-[0.2em] uppercase font-body hover:bg-background hover:text-foreground transition-all duration-500">
            {t("nav.booking")}
          </AltegWidgetButton>
        </motion.div>

        {isMobile ? (
          <div className="space-y-2">
            {dayKeys.map((dayKey, di) => {
              const dayItems = items.filter(i => i.day_of_week === di);
              const isOpen = openDay === di;
              return (
                <motion.div key={dayKey} className="border border-border" initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}>
                  <button onClick={() => setOpenDay(isOpen ? null : di)} className="w-full flex items-center justify-between p-4 text-left">
                    <span className="font-display text-xl text-foreground">{t(`schedule.${dayKey}`)}</span>
                    <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 space-y-3">
                      {dayItems.length === 0 ? (
                        <p className="text-muted-foreground text-sm italic font-body">{t("schedule.noclass")}</p>
                      ) : (
                        dayItems.map((entry) => (
                          <div key={entry.id} className="flex items-baseline gap-4">
                            <span className="text-muted-foreground text-sm font-body w-14 shrink-0">{entry.time}</span>
                            <span className="text-foreground text-sm font-body">
                              {entry.class_name}
                              {entry.note && <span className="text-muted-foreground italic ml-2">({t(`schedule.${entry.note}`)})</span>}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-7 gap-4">
            {dayKeys.map((dayKey, di) => {
              const dayItems = items.filter(i => i.day_of_week === di);
              return (
                <motion.div key={dayKey} className="text-center" initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: di * 0.08 }}>
                  <div className="font-display text-lg text-foreground mb-6 pb-4 border-b border-border">{t(`schedule.${dayKey}`)}</div>
                  <div className="space-y-4">
                    {dayItems.length === 0 ? (
                      <p className="text-muted-foreground text-xs italic font-body">—</p>
                    ) : (
                      dayItems.map((entry) => (
                        <div key={entry.id} className="text-left">
                          <span className="text-muted-foreground text-xs font-body block">{entry.time}</span>
                          <span className="text-foreground text-sm font-body leading-tight">{entry.class_name}</span>
                          {entry.note && <span className="text-muted-foreground text-xs italic font-body block">({t(`schedule.${entry.note}`)})</span>}
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default ScheduleSection;
