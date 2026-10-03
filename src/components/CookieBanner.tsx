import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { CONSENT_EVENT, getConsent, setConsent } from "@/lib/cookie-consent";

const CookieBanner = () => {
  const { t } = useLanguage();
  const { pathname } = useLocation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const sync = () => setVisible(getConsent() === null);
    sync();
    window.addEventListener(CONSENT_EVENT, sync);
    return () => window.removeEventListener(CONSENT_EVENT, sync);
  }, []);

  if (!visible || pathname.startsWith("/admin")) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-foreground/40 backdrop-blur-sm p-4 animate-in fade-in duration-300">
    <div
      role="dialog"
      aria-modal="true"
      aria-live="polite"
      aria-label={t("cookies.bannerTitle")}
      className="w-full max-w-md bg-background border border-border shadow-2xl p-6 sm:p-8 text-center animate-in fade-in zoom-in-95 duration-300"
    >
      <p className="font-display text-base tracking-wide text-foreground mb-2">{t("cookies.bannerTitle")}</p>
      <p className="font-body text-xs leading-relaxed text-muted-foreground mb-4">
        {t("cookies.bannerText")}{" "}
        <Link to="/cookie-policy" className="underline underline-offset-2 text-foreground hover:opacity-70">
          {t("cookies.policyLink")}
        </Link>
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => setConsent(false)}
          className="flex-1 border border-border px-4 py-2 text-xs font-body uppercase tracking-wider text-foreground hover:bg-muted transition-colors"
        >
          {t("cookies.decline")}
        </button>
        <button
          onClick={() => setConsent(true)}
          className="flex-1 bg-foreground text-background px-4 py-2 text-xs font-body uppercase tracking-wider hover:opacity-85 transition-opacity"
        >
          {t("cookies.accept")}
        </button>
      </div>
    </div>
    </div>
  );
};

export default CookieBanner;
