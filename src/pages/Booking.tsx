import { useState, useEffect, useMemo } from "react";
import SEOHead from "@/components/SEOHead";
import { z } from "zod";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { format, addDays, startOfDay, isSameDay } from "date-fns";
import { ChevronLeft, ChevronRight, Check, ArrowLeft, Calendar, Clock, User } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import logoDark from "@/assets/logo-dark.png";

interface ScheduleEntry {
  id: string;
  day_of_week: number;
  time: string;
  class_name: string;
  note: string | null;
}

interface BookingSetting {
  schedule_id: string;
  max_participants: number;
}

const Booking = () => {
  const { lang, t } = useLanguage();
  const [step, setStep] = useState(0); // 0=class, 1=date, 2=time, 3=form, 4=success
  const [schedule, setSchedule] = useState<ScheduleEntry[]>([]);
  const [settings, setSettings] = useState<BookingSetting[]>([]);
  const [closedDates, setClosedDates] = useState<string[]>([]);
  const [bookingCounts, setBookingCounts] = useState<Record<string, number>>({});

  const [selectedClass, setSelectedClass] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<ScheduleEntry | null>(null);
  const [calendarMonth, setCalendarMonth] = useState(new Date());

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    supabase.from("schedule").select("*").order("day_of_week").order("sort_order").then(({ data }) => {
      if (data) setSchedule(data);
    });
    supabase.from("booking_settings").select("*").then(({ data }) => {
      if (data) setSettings(data);
    });
    supabase.from("closed_dates").select("date").then(({ data }) => {
      if (data) setClosedDates(data.map(d => d.date));
    });
  }, []);

  const classNames = useMemo(() => {
    const unique = [...new Set(schedule.map(s => s.class_name))];
    return unique.sort();
  }, [schedule]);

  // Get available dates for selected class (next 30 days)
  const availableDates = useMemo(() => {
    if (!selectedClass) return [];
    const classSchedule = schedule.filter(s => s.class_name === selectedClass);
    const daysOfWeek = [...new Set(classSchedule.map(s => s.day_of_week))];
    const dates: Date[] = [];
    const today = startOfDay(new Date());
    for (let i = 1; i <= 30; i++) {
      const d = addDays(today, i);
      const dow = (d.getDay() + 6) % 7; // Convert JS day (0=Sun) to our format (0=Mon)
      if (daysOfWeek.includes(dow) && !closedDates.includes(format(d, "yyyy-MM-dd"))) {
        dates.push(d);
      }
    }
    return dates;
  }, [selectedClass, schedule, closedDates]);

  // Get time slots for selected date + class
  const availableSlots = useMemo(() => {
    if (!selectedDate || !selectedClass) return [];
    const dow = (selectedDate.getDay() + 6) % 7;
    return schedule.filter(s => s.class_name === selectedClass && s.day_of_week === dow);
  }, [selectedDate, selectedClass, schedule]);

  // Fetch booking counts when date changes
  useEffect(() => {
    if (!selectedDate) return;
    const dateStr = format(selectedDate, "yyyy-MM-dd");
    supabase.from("bookings").select("schedule_id").eq("booking_date", dateStr).neq("status", "cancelled")
      .then(({ data }) => {
        if (data) {
          const counts: Record<string, number> = {};
          data.forEach(b => { counts[b.schedule_id] = (counts[b.schedule_id] || 0) + 1; });
          setBookingCounts(counts);
        }
      });
  }, [selectedDate]);

  const getMaxParticipants = (scheduleId: string) => {
    const s = settings.find(s => s.schedule_id === scheduleId);
    return s?.max_participants ?? 20;
  };

  const isFull = (scheduleId: string) => {
    return (bookingCounts[scheduleId] || 0) >= getMaxParticipants(scheduleId);
  };

  const bookingSchema = useMemo(() => z.object({
    client_name: z.string().trim().min(1, t("booking.fillAll")).max(100, t("booking.fillAll")),
    client_phone: z.string().trim().min(3, t("booking.fillAll")).max(30, t("booking.fillAll")),
    client_email: z.string().trim().email(t("booking.fillAll")).max(255, t("booking.fillAll")),
  }), [t]);

  const handleSubmit = async () => {
    if (!selectedSlot || !selectedDate) {
      toast.error(t("booking.fillAll"));
      return;
    }
    const result = bookingSchema.safeParse({ client_name: name, client_phone: phone, client_email: email });
    if (!result.success) {
      toast.error(result.error.errors[0]?.message || t("booking.fillAll"));
      return;
    }
    setSubmitting(true);
    try {
      const { data, error: fnError } = await supabase.functions.invoke("create-booking", {
        body: {
          schedule_id: selectedSlot.id,
          booking_date: format(selectedDate, "yyyy-MM-dd"),
          client_name: result.data.client_name,
          client_phone: result.data.client_phone,
          client_email: result.data.client_email.toLowerCase(),
          language: lang,
        },
      });
      setSubmitting(false);
      if (fnError) {
        toast.error(fnError.message || "Error");
        return;
      }
      if (data?.error) {
        if (data.error === "ALREADY_BOOKED") {
          toast.error(t("booking.alreadyBooked"));
        } else if (data.error === "CLASS_FULL") {
          toast.error(t("booking.classFull"));
        } else {
          toast.error(data.error);
        }
        return;
      }
      setStep(4);
    } catch (e) {
      setSubmitting(false);
      toast.error("Error");
    }
  };

  // Calendar rendering
  const renderCalendar = () => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDow = (firstDay.getDay() + 6) % 7;
    
    const days: (Date | null)[] = [];
    for (let i = 0; i < startDow; i++) days.push(null);
    for (let i = 1; i <= lastDay.getDate(); i++) days.push(new Date(year, month, i));

    const dayLabels = lang === "ro" 
      ? ["Lu", "Ma", "Mi", "Jo", "Vi", "Sâ", "Du"]
      : ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => setCalendarMonth(new Date(year, month - 1))} className="p-2 text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="font-display text-xl text-foreground">
            {calendarMonth.toLocaleDateString(lang === "ro" ? "ro-RO" : "ru-RU", { month: "long", year: "numeric" })}
          </span>
          <button onClick={() => setCalendarMonth(new Date(year, month + 1))} className="p-2 text-muted-foreground hover:text-foreground transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayLabels.map(d => (
            <div key={d} className="text-center text-xs text-muted-foreground font-body py-2">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, i) => {
            if (!day) return <div key={i} />;
            const isAvailable = availableDates.some(ad => isSameDay(ad, day));
            const isSelected = selectedDate && isSameDay(selectedDate, day);
            const today = startOfDay(new Date());
            const isPast = day <= today;

            return (
              <button
                key={i}
                disabled={!isAvailable || isPast}
                onClick={() => { setSelectedDate(day); setSelectedSlot(null); }}
                className={`aspect-square flex items-center justify-center text-sm font-body rounded-sm transition-all duration-200 ${
                  isSelected
                    ? "bg-foreground text-background font-medium"
                    : isAvailable && !isPast
                    ? "text-foreground hover:bg-muted cursor-pointer"
                    : "text-muted-foreground/30 cursor-not-allowed"
                }`}
              >
                {day.getDate()}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const stepIndicator = (
    <div className="flex items-center justify-center gap-2 mb-8">
      {[0, 1, 2, 3].map(s => (
        <div key={s} className={`h-0.5 w-8 transition-all duration-500 ${step >= s ? "bg-foreground" : "bg-border"}`} />
      ))}
    </div>
  );

  const bookingSeo = useMemo(() => lang === "ro" ? {
    title: "Rezervare — Prima Dance Chișinău",
    description: "Rezervă-ți locul la cursurile de dans Prima Dance. Latin, Ballroom, Pro-Am pentru adulți în Chișinău."
  } : {
    title: "Запись — Prima Dance Кишинёв",
    description: "Запишитесь на занятия в Prima Dance. Латинские, бальные танцы и Pro-Am для взрослых в Кишинёве."
  }, [lang]);

  return (
    <>
    <SEOHead title={bookingSeo.title} description={bookingSeo.description} canonical="https://primadance.lovable.app/booking" />
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src={logoDark} alt="Prima Dance" className="h-8 w-8 object-cover rounded-full" />
            <span className="font-display text-foreground text-lg tracking-[0.2em] uppercase">Prima Dance</span>
          </Link>
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-body">
            <ArrowLeft className="w-4 h-4" /> {t("booking.back")}
          </Link>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center py-12 px-6">
        <div className="w-full max-w-lg">
          <motion.h1
            className="font-display text-3xl md:text-4xl text-foreground text-center mb-2 tracking-wide"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {t("booking.title")}
          </motion.h1>
          <p className="text-muted-foreground text-sm font-body text-center mb-10">{t("booking.subtitle")}</p>

          {step < 4 && stepIndicator}

          <AnimatePresence mode="wait">
            {/* Step 0: Select Class */}
            {step === 0 && (
              <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                <div className="flex items-center gap-3 mb-6">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-body text-muted-foreground uppercase tracking-widest">{t("booking.selectClass")}</span>
                </div>
                <div className="space-y-2">
                  {classNames.map(cn => (
                    <button
                      key={cn}
                      onClick={() => { setSelectedClass(cn); setSelectedDate(null); setSelectedSlot(null); setStep(1); }}
                      className={`w-full text-left px-5 py-4 border transition-all duration-300 font-body text-sm ${
                        selectedClass === cn
                          ? "border-foreground bg-foreground/5 text-foreground"
                          : "border-border text-foreground hover:border-muted-foreground"
                      }`}
                    >
                      {cn}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 1: Select Date */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                <button onClick={() => setStep(0)} className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm font-body mb-6 transition-colors">
                  <ChevronLeft className="w-4 h-4" /> {selectedClass}
                </button>
                <div className="flex items-center gap-3 mb-6">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-body text-muted-foreground uppercase tracking-widest">{t("booking.selectDate")}</span>
                </div>
                <div className="border border-border p-6">
                  {renderCalendar()}
                </div>
                {selectedDate && (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() => setStep(2)}
                    className="w-full mt-6 py-3 bg-foreground text-background font-body text-sm tracking-widest uppercase hover:bg-foreground/90 transition-colors"
                  >
                    {t("booking.continue")}
                  </motion.button>
                )}
              </motion.div>
            )}

            {/* Step 2: Select Time */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                <button onClick={() => setStep(1)} className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm font-body mb-6 transition-colors">
                  <ChevronLeft className="w-4 h-4" /> {selectedDate && format(selectedDate, "dd.MM.yyyy")}
                </button>
                <div className="flex items-center gap-3 mb-6">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-body text-muted-foreground uppercase tracking-widest">{t("booking.selectTime")}</span>
                </div>
                <div className="space-y-2">
                  {availableSlots.map(slot => {
                    const full = isFull(slot.id);
                    const maxP = getMaxParticipants(slot.id);
                    const spots = maxP - (bookingCounts[slot.id] || 0);
                    return (
                      <button
                        key={slot.id}
                        disabled={full}
                        onClick={() => { setSelectedSlot(slot); setStep(3); }}
                        className={`w-full text-left px-5 py-4 border transition-all duration-300 font-body text-sm ${
                          full
                            ? "border-border text-muted-foreground/40 cursor-not-allowed"
                            : selectedSlot?.id === slot.id
                            ? "border-foreground bg-foreground/5 text-foreground"
                            : "border-border text-foreground hover:border-muted-foreground"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{slot.time}</span>
                          <span className={`text-xs ${full ? "text-destructive" : "text-muted-foreground"}`}>
                            {full ? t("booking.classFull") : `${t("booking.spotsRemaining")}: ${spots}`}
                          </span>
                        </div>
                        {!full && (
                          <div className="mt-2 w-full bg-border h-1 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-foreground/60 transition-all duration-500" 
                              style={{ width: `${((maxP - spots) / maxP) * 100}%` }}
                            />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Step 3: Contact Form */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                <button onClick={() => setStep(2)} className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm font-body mb-6 transition-colors">
                  <ChevronLeft className="w-4 h-4" /> {selectedSlot?.time}
                </button>
                <div className="flex items-center gap-3 mb-6">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-body text-muted-foreground uppercase tracking-widest">{t("booking.yourDetails")}</span>
                </div>

                {/* Summary */}
                <div className="border border-border p-5 mb-6 space-y-2">
                  <div className="flex justify-between text-sm font-body">
                    <span className="text-muted-foreground">{t("booking.class")}</span>
                    <span className="text-foreground">{selectedClass}</span>
                  </div>
                  <div className="flex justify-between text-sm font-body">
                    <span className="text-muted-foreground">{t("booking.date")}</span>
                    <span className="text-foreground">{selectedDate && format(selectedDate, "dd.MM.yyyy")}</span>
                  </div>
                  <div className="flex justify-between text-sm font-body">
                    <span className="text-muted-foreground">{t("booking.time")}</span>
                    <span className="text-foreground">{selectedSlot?.time}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder={t("booking.namePlaceholder")}
                    maxLength={100}
                    className="w-full bg-transparent border border-border px-4 py-3 text-foreground text-sm font-body placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground transition-colors"
                  />
                  <input
                    value={phone}
                    onChange={e => setPhone(e.target.value.replace(/[^0-9+\-() ]/g, ""))}
                    placeholder={t("booking.phonePlaceholder")}
                    type="tel"
                    maxLength={30}
                    className="w-full bg-transparent border border-border px-4 py-3 text-foreground text-sm font-body placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground transition-colors"
                  />
                  <input
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder={t("booking.emailPlaceholder")}
                    type="email"
                    maxLength={255}
                    className="w-full bg-transparent border border-border px-4 py-3 text-foreground text-sm font-body placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground transition-colors"
                  />
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={submitting || !name.trim() || !phone.trim() || !email.trim()}
                  className="w-full mt-6 py-3 bg-foreground text-background font-body text-sm tracking-widest uppercase hover:bg-foreground/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {submitting ? "..." : t("booking.confirm")}
                </button>
              </motion.div>
            )}

            {/* Step 4: Success */}
            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
                <div className="w-16 h-16 border-2 border-foreground rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="w-8 h-8 text-foreground" />
                </div>
                <h2 className="font-display text-2xl text-foreground mb-3">{t("booking.success")}</h2>
                <p className="text-muted-foreground text-sm font-body mb-2">{selectedClass}</p>
                <p className="text-muted-foreground text-sm font-body mb-8">
                  {selectedDate && format(selectedDate, "dd.MM.yyyy")} · {selectedSlot?.time}
                </p>
                <Link to="/" className="inline-block py-3 px-8 border border-border text-foreground font-body text-sm tracking-widest uppercase hover:bg-foreground hover:text-background transition-all duration-300">
                  {t("booking.backToSite")}
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Booking;
