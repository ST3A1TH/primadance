import { useState, useEffect } from "react";
import { Globe, Menu, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import iconDark from "@/assets/icon-dark.png";
import iconLight from "@/assets/icon-light.png";

const Header = () => {
  const { lang, setLang, t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = ["about", "classes", "gallery", "schedule", "pricing", "contact"];

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  // When not scrolled on dark hero, always show white text
  // When scrolled or on light theme, use theme colors
  const isOnHero = !scrolled;
  const iconSrc = isOnHero ? iconLight : iconDark;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-background/95 backdrop-blur-md border-b border-border" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <button onClick={() => scrollTo("hero")} className="flex items-center gap-2">
          <img src={iconSrc} alt="Prima Dance" className="h-8 w-auto object-contain" />
          <span className={`font-display text-lg tracking-[0.15em] uppercase hidden sm:block ${
            isOnHero ? "text-white" : "text-foreground"
          }`}>
            Prima Dance
          </span>
        </button>

        <div className="flex items-center gap-3">
          {/* Language switcher */}
          <button
            onClick={() => setLang(lang === "ro" ? "ru" : "ro")}
            className={`flex items-center gap-2 transition-colors duration-300 ${
              isOnHero ? "text-white/70 hover:text-white" : "text-muted-foreground hover:text-foreground"
            }`}
            aria-label="Switch language"
          >
            <Globe className="w-4 h-4" />
            <span className="text-xs tracking-[0.15em] uppercase font-body">{lang === "ro" ? "RU" : "RO"}</span>
          </button>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`${isOnHero ? "text-white" : "text-foreground"}`}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-background/98 backdrop-blur-md border-b border-border overflow-hidden"
          >
            <nav className="container mx-auto px-6 py-6 flex flex-col gap-4">
              {navItems.map((item) => (
                <button
                  key={item}
                  onClick={() => scrollTo(item)}
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm tracking-[0.15em] uppercase font-body text-left py-2"
                >
                  {t(`nav.${item}`)}
                </button>
              ))}
              <Link
                to="/my-account"
                className="text-foreground text-sm tracking-[0.15em] uppercase font-body text-left py-2 border-t border-border pt-4 mt-2"
                onClick={() => setMenuOpen(false)}
              >
                {t("nav.account")}
              </Link>
              <Link
                to="/booking"
                className="text-foreground text-sm tracking-[0.15em] uppercase font-body text-left py-2"
                onClick={() => setMenuOpen(false)}
              >
                {t("nav.booking")}
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
