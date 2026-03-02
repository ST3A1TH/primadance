import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Mail, Calendar, Clock, Search } from "lucide-react";
import { Link } from "react-router-dom";
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

  const handleLookup = async () => {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("lookup-bookings", {
        body: { email: trimmed },
      });
      if (error) throw error;
      setBookings(data.bookings || []);
    } catch {
      setBookings([]);
    } finally {
      setLoading(false);
      setSearched(true);
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

  const statusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "completed": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "cancelled": return "bg-red-500/20 text-red-400 border-red-500/30";
      default: return "bg-muted text-muted-foreground border-border";
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString(lang === "ro" ? "ro-RO" : "ru-RU", {
      day: "numeric", month: "long", year: "numeric",
    });
  };

  return (
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

          {/* Email form */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-10"
          >
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
                onKeyDown={(e) => e.key === "Enter" && handleLookup()}
                placeholder={t("booking.emailPlaceholder")}
                type="email"
                className="flex-1 bg-transparent border border-border px-4 py-3 text-foreground text-sm font-body placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground transition-colors"
              />
              <button
                onClick={handleLookup}
                disabled={loading || !email.trim()}
                className="px-6 py-3 bg-foreground text-background font-body text-sm tracking-widest uppercase hover:bg-foreground/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Search className="w-4 h-4" />
                <span className="hidden sm:inline">{t("account.search")}</span>
              </button>
            </div>
          </motion.div>

          {/* Results */}
          <AnimatePresence mode="wait">
            {loading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-12"
              >
                <div className="w-6 h-6 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin mx-auto" />
              </motion.div>
            )}

            {!loading && searched && bookings.length === 0 && (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-center py-12 border border-border"
              >
                <Calendar className="w-8 h-8 text-muted-foreground/40 mx-auto mb-4" />
                <p className="text-muted-foreground text-sm font-body">
                  {t("account.empty")}
                </p>
              </motion.div>
            )}

            {!loading && bookings.length > 0 && (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-3"
              >
                <p className="text-xs font-body text-muted-foreground uppercase tracking-widest mb-4">
                  {t("account.found")} ({bookings.length})
                </p>
                {bookings.map((booking, i) => (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="border border-border p-5 hover:border-muted-foreground/30 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-display text-lg text-foreground">{booking.class_name}</h3>
                      <span className={`text-xs font-body px-3 py-1 border rounded-full ${statusColor(booking.status)}`}>
                        {statusLabel(booking.status)}
                      </span>
                    </div>
                    <div className="flex items-center gap-6 text-sm font-body text-muted-foreground">
                      <span className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(booking.booking_date)}
                      </span>
                      <span className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5" />
                        {booking.time}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default MyAccount;
