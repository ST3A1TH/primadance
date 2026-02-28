import { useState, useEffect } from "react";
import { Globe, Menu, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import logoDark from "@/assets/logo-dark.png";

const Header = () => {
  const { lang, setLang, t } = useLanguage();
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

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-background/95 backdrop-blur-md border-b border-border" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <button onClick={() => scrollTo("hero")} className="flex items-center gap-3">
          <img src={logoDark} alt="Prima Dance Studio" className="h-10 w-10 object-cover rounded-full" />
          <span className="font-display text-foreground text-xl tracking-[0.2em] uppercase hidden sm:block">
            Prima
          </span>
        </button>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => scrollTo(item)}
              className="text-muted-foreground hover:text-foreground transition-colors duration-300 text-sm tracking-[0.15em] uppercase font-body"
            >
              {t(`nav.${item}`)}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          {/* Language switcher */}
          <button
            onClick={() => setLang(lang === "ro" ? "ru" : "ro")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-300"
            aria-label="Switch language"
          >
            <Globe className="w-4 h-4" />
            <span className="text-xs tracking-[0.15em] uppercase font-body">{lang === "ro" ? "RU" : "RO"}</span>
          </button>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden text-foreground"
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
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
