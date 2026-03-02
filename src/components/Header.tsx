import { useState, useEffect } from "react";
import { Globe, Menu, X, Sun, Moon } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import logoDark from "@/assets/logo-dark.png";
import logoLight from "@/assets/logo-light.jpg";
import logoTextDark from "@/assets/logo-text-dark.png";
import logoTextLight from "@/assets/logo-text-light.png";

const Header = () => {
  const { lang, setLang, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = ["about", "classes", "schedule", "pricing", "contact"];

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  // When not scrolled on dark hero, always show white text
  // When scrolled or on light theme, use theme colors
  const isOnHero = !scrolled;
  const logoSrc = scrolled && theme === "light" ? logoLight : logoDark;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-background/95 backdrop-blur-md border-b border-border" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <button onClick={() => scrollTo("hero")} className="flex items-center gap-3">
          <img
            src={isOnHero ? logoTextDark : (theme === "light" ? logoTextDark : logoTextLight)}
            alt="Prima Dance Studio"
            className="h-10 sm:h-12 object-contain"
          />
        </button>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => scrollTo(item)}
              className={`transition-colors duration-300 text-sm tracking-[0.15em] uppercase font-body ${
                isOnHero ? "text-white/70 hover:text-white" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t(`nav.${item}`)}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className={`transition-colors duration-300 ${
              isOnHero ? "text-white/70 hover:text-white" : "text-muted-foreground hover:text-foreground"
            }`}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

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
            className={`lg:hidden ${isOnHero ? "text-white" : "text-foreground"}`}
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
            className="lg:hidden bg-background/98 backdrop-blur-md border-b border-border overflow-hidden"
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
                to="/booking"
                className="text-foreground text-sm tracking-[0.15em] uppercase font-body text-left py-2 border-t border-border pt-4 mt-2"
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
