import { useState, useMemo } from "react";
import SEOHead from "@/components/SEOHead";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Mail, Calendar, Clock, ChevronRight, History, CalendarCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import logoDark from "@/assets/logo-dark.png";

interface BookingResult {
  id: string;
  booking_date: string;
  status: string;
  class_name: string;
  time: string;
}

const MyAccount = () => {
  const { lang, t } = useLanguage();
  const [email, setEmail] = useState("");
  const [bookings, setBookings] = useState<BookingResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const fetchBookings = async () => {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return;

    setLoading(true);
    setSearched(true);
    try {
      const { data, error } = await supabase.functions.invoke("lookup-bookings", {
        body: { email: trimmed },
      });
      if (error) throw error;
      setBookings(data.bookings || []);
    } catch {
      setBookings([]);
      toast.error(t("account.error"));
    } finally {
      setLoading(false);
    }
  };

  const statusLabel = (status: string) => {
    const labels: Record<string, Record<string, string>> = {
      confirmed: { ro: "Confirmat", ru: "Подтверждено" },
      completed: { ro: "Finalizat", ru: "Завершено" },
      cancelled: { ro: "Anulat", ru: "Отменено" },
    };
    return labels[status]?.[lang] || status;
  };

  const statusDot = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-emerald-400";
      case "completed": return "bg-foreground/40";
      case "cancelled": return "bg-destructive/60";
      default: return "bg-muted-foreground";
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString(lang === "ro" ? "ro-RO" : "ru-RU", {
      day: "numeric", month: "long", year: "numeric",
    });
  };

  const formatShortDate = (dateStr: string) => {
    const d = new Date(dateStr + "T00:00:00");
    return {
      day: d.getDate().toString(),
      month: d.toLocaleDateString(lang === "ro" ? "ro-RO" : "ru-RU", { month: "short" }).toUpperCase(),
    };
  };

  const today = new Date().toISOString().split("T")[0];

  const { upcoming, past } = useMemo(() => {
    const sorted = [...bookings].sort((a, b) => a.booking_date.localeCompare(b.booking_date));
    const upcoming = sorted.filter(b => b.booking_date >= today && b.status !== "cancelled");
    const past = sorted
      .filter(b => b.booking_date < today || b.status === "cancelled")
      .sort((a, b) => b.booking_date.localeCompare(a.booking_date));
    return { upcoming, past };
  }, [bookings, today]);

  const upcomingLabel = lang === "ro" ? "Programări viitoare" : "Предстоящие записи";
  const pastLabel = lang === "ro" ? "Istoric" : "История";
  const searchBtnLabel = lang === "ro" ? "Caută programări" : "Найти записи";

  const BookingCard = ({ booking, index, isPast }: { booking: BookingResult; index: number; isPast?: boolean }) => {
    const shortDate = formatShortDate(booking.booking_date);
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.06, duration: 0.3 }}
        className={`group flex gap-4 items-stretch ${isPast ? "opacity-60 hover:opacity-100" : ""} transition-opacity duration-300`}
      >
        {/* Date block */}
        <div className="flex-shrink-0 w-14 flex flex-col items-center justify-center border border-border py-3 px-2">
          <span className={`font-display text-xl leading-none ${isPast ? "text-muted-foreground" : "text-foreground"}`}>
            {shortDate.day}
          </span>
          <span className="text-[10px] tracking-[0.15em] font-body text-muted-foreground mt-1">
            {shortDate.month}
          </span>
        </div>

        {/* Info */}
        <div className="flex-1 border border-border p-4 group-hover:border-muted-foreground/40 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-display text-base text-foreground tracking-wide">{booking.class_name}</h3>
            <div className="flex items-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-full ${statusDot(booking.status)}`} />
              <span className="text-[11px] font-body text-muted-foreground tracking-wider uppercase">
                {statusLabel(booking.status)}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs font-body text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3 h-3" />
              {formatDate(booking.booking_date)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3 h-3" />
              {booking.time}
            </span>
          </div>
        </div>
      </motion.div>
    );
  };

  const accountSeo = useMemo(() => lang === "ro" ? {
    title: "Contul Meu — Prima Dance",
    description: "Verifică programările tale la Prima Dance. Vezi cursurile rezervate, datele și statusul."
  } : {
    title: "Мой аккаунт — Prima Dance",
    description: "Проверьте свои записи в Prima Dance. Просмотрите забронированные занятия, даты и статус."
  }, [lang]);

  return (
    <>
    <SEOHead title={accountSeo.title} description={accountSeo.description} canonical="https://primadance.lovable.app/my-account" />
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src={logoDark} alt="Prima Dance" className="h-8 w-8 object-cover rounded-full" />
            <span className="font-display text-foreground text-lg tracking-[0.2em] uppercase">Prima Dance</span>
          </Link>
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-body">
            <ArrowLeft className="w-4 h-4" /> {t("booking.backToSite")}
          </Link>
        </div>
      </header>

      <div className="flex-1 flex items-start justify-center py-12 px-6">
        <div className="w-full max-w-lg">
          <motion.h1
            className="font-display text-3xl md:text-4xl text-foreground text-center mb-2 tracking-wide"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {t("account.title")}
          </motion.h1>
          <p className="text-muted-foreground text-sm font-body text-center mb-10">
            {t("account.subtitle")}
          </p>

          {/* Email input */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-body text-muted-foreground uppercase tracking-widest">
                {t("account.emailLabel")}
              </span>
            </div>
            <div className="flex gap-3">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchBookings()}
                placeholder={t("booking.emailPlaceholder")}
                type="email"
                className="flex-1 bg-transparent border border-border px-4 py-3 text-foreground text-sm font-body placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground transition-colors"
              />
              <button
                onClick={fetchBookings}
                disabled={loading || !email.trim()}
                className="px-6 py-3 bg-foreground text-background font-body text-sm tracking-widest uppercase hover:bg-foreground/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-background/20 border-t-background rounded-full animate-spin" />
                ) : (
                  <>
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results */}
          <AnimatePresence mode="wait">
            {searched && !loading && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {bookings.length === 0 ? (
                  <div className="text-center py-16 border border-dashed border-border">
                    <Calendar className="w-10 h-10 text-muted-foreground/30 mx-auto mb-4" />
                    <p className="text-muted-foreground text-sm font-body">
                      {t("account.empty")}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-10">
                    {/* Upcoming */}
                    {upcoming.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-5">
                          <CalendarCheck className="w-4 h-4 text-emerald-400" />
                          <span className="text-xs font-body text-muted-foreground uppercase tracking-[0.2em]">
                            {upcomingLabel} ({upcoming.length})
                          </span>
                        </div>
                        <div className="space-y-3">
                          {upcoming.map((booking, i) => (
                            <BookingCard key={booking.id} booking={booking} index={i} />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Past */}
                    {past.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-5">
                          <History className="w-4 h-4 text-muted-foreground" />
                          <span className="text-xs font-body text-muted-foreground uppercase tracking-[0.2em]">
                            {pastLabel} ({past.length})
                          </span>
                        </div>
                        <div className="space-y-3">
                          {past.map((booking, i) => (
                            <BookingCard key={booking.id} booking={booking} index={i} isPast />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default MyAccount;
