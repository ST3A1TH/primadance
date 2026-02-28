import { motion, useInView } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface ScheduleEntry {
  time: string;
  name: string;
  note?: string;
}

const scheduleData: { dayKey: string; entries: ScheduleEntry[] }[] = [
  {
    dayKey: "mon",
    entries: [
      { time: "18:00", name: "Latin Technique" },
      { time: "18:30", name: "Dance" },
    ],
  },
  {
    dayKey: "tue",
    entries: [
      { time: "12:00", name: "Classic Basics" },
      { time: "13:00", name: "Latin Mix" },
      { time: "18:00", name: "Relax Time" },
      { time: "18:30", name: "Total Body" },
    ],
  },
  {
    dayKey: "wed",
    entries: [
      { time: "13:00", name: "Latin Mix" },
      { time: "18:00", name: "Stretching" },
      { time: "18:30", name: "Dance" },
    ],
  },
  {
    dayKey: "thu",
    entries: [
      { time: "13:00", name: "Latin Mix" },
      { time: "18:00", name: "Relax Time" },
      { time: "18:30", name: "Dance Mix" },
    ],
  },
  {
    dayKey: "fri",
    entries: [
      { time: "13:00", name: "Stretching" },
      { time: "18:00", name: "Stretching" },
      { time: "18:30", name: "Stretching" },
    ],
  },
  {
    dayKey: "sat",
    entries: [{ time: "18:30", name: "Latin Hits", note: "foreveryone" }],
  },
  {
    dayKey: "sun",
    entries: [],
  },
];

const ScheduleSection = () => {
  const { t } = useLanguage();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const isMobile = useIsMobile();
  const [openDay, setOpenDay] = useState<string | null>(null);

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

        {isMobile ? (
          /* Mobile: Accordion */
          <div className="space-y-2">
            {scheduleData.map((day) => {
              const isOpen = openDay === day.dayKey;
              return (
                <motion.div
                  key={day.dayKey}
                  className="border border-border"
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : {}}
                >
                  <button
                    onClick={() => setOpenDay(isOpen ? null : day.dayKey)}
                    className="w-full flex items-center justify-between p-4 text-left"
                  >
                    <span className="font-display text-xl text-foreground">
                      {t(`schedule.${day.dayKey}`)}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 space-y-3">
                      {day.entries.length === 0 ? (
                        <p className="text-muted-foreground text-sm italic font-body">
                          {t("schedule.noclass")}
                        </p>
                      ) : (
                        day.entries.map((entry, i) => (
                          <div key={i} className="flex items-baseline gap-4">
                            <span className="text-muted-foreground text-sm font-body w-14 shrink-0">
                              {entry.time}
                            </span>
                            <span className="text-foreground text-sm font-body">
                              {entry.name}
                              {entry.note && (
                                <span className="text-muted-foreground italic ml-2">
                                  ({t(`schedule.${entry.note}`)})
                                </span>
                              )}
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
          /* Desktop: Grid */
          <div className="grid grid-cols-7 gap-4">
            {scheduleData.map((day, di) => (
              <motion.div
                key={day.dayKey}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: di * 0.08 }}
              >
                <div className="font-display text-lg text-foreground mb-6 pb-4 border-b border-border">
                  {t(`schedule.${day.dayKey}`)}
                </div>
                <div className="space-y-4">
                  {day.entries.length === 0 ? (
                    <p className="text-muted-foreground text-xs italic font-body">—</p>
                  ) : (
                    day.entries.map((entry, i) => (
                      <div key={i} className="text-left">
                        <span className="text-muted-foreground text-xs font-body block">
                          {entry.time}
                        </span>
                        <span className="text-foreground text-sm font-body leading-tight">
                          {entry.name}
                        </span>
                        {entry.note && (
                          <span className="text-muted-foreground text-xs italic font-body block">
                            ({t(`schedule.${entry.note}`)})
                          </span>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ScheduleSection;
