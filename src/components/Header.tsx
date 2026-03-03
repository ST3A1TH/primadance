import { useState, useEffect } from "react";
import { Globe, Menu, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import iconDark from "@/assets/icon-dark.png";
import iconLight from "@/assets/icon-light.png";

const Header = () => {
  const { lang, setLang, t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = ["about", "classes", "gallery", "schedule", "pricing", "contact"];

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    if (location.pathname !== "/") {
      navigate("/", { state: { scrollTo: id } });
    } else {
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  // Handle scroll-to after navigating back to home
  useEffect(() => {
    const state = location.state as { scrollTo?: string } | null;
    if (state?.scrollTo && location.pathname === "/") {
      setTimeout(() => {
        document.getElementById(state.scrollTo!)?.scrollIntoView({ behavior: "smooth" });
        // Clear the state
        window.history.replaceState({}, document.title);
      }, 300);
    }
  }, [location]);

  const isOnHero = !scrolled;
  const iconSrc = isOnHero ? iconLight : iconDark;

  const handleNavigate = (path: string) => {
    setMenuOpen(false);
    navigate(path);
  };

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

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`${isOnHero ? "text-white" : "text-foreground"}`}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="bg-background/95 backdrop-blur-xl border-b border-border"
          >
            <nav className="container mx-auto px-6 py-8 flex flex-col gap-1">
              {navItems.map((item, i) => (
                <motion.button
                  key={item}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.2 }}
                  onClick={() => scrollTo(item)}
                  className="text-foreground/80 hover:text-foreground hover:pl-2 transition-all duration-200 text-sm tracking-[0.2em] uppercase font-body text-left py-3"
                >
                  {t(`nav.${item}`)}
                </motion.button>
              ))}
              
              <div className="border-t border-border/50 mt-3 pt-3 flex flex-col gap-1">
                <motion.button
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navItems.length * 0.04, duration: 0.2 }}
                  onClick={() => handleNavigate("/my-account")}
                  className="text-foreground/80 hover:text-foreground hover:pl-2 transition-all duration-200 text-sm tracking-[0.2em] uppercase font-body text-left py-3"
                >
                  {t("nav.account")}
                </motion.button>
                <motion.button
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (navItems.length + 1) * 0.04, duration: 0.2 }}
                  onClick={() => handleNavigate("/booking")}
                  className="text-foreground/80 hover:text-foreground hover:pl-2 transition-all duration-200 text-sm tracking-[0.2em] uppercase font-body text-left py-3"
                >
                  {t("nav.booking")}
                </motion.button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
