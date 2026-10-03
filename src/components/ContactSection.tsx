import { motion, useInView } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

import { useRef } from "react";
import { MapPin, Instagram, Phone, Send, Facebook, Music2 } from "lucide-react";
import logoTextDark from "@/assets/logo-text-dark.png";
import logoTextLight from "@/assets/logo-text-light.png";
import iconDark from "@/assets/icon-dark.png";
import iconLight from "@/assets/icon-light.png";

const ContactSection = () => {
  const { t } = useLanguage();
  
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const logoSrc = logoTextDark;
  const iconSrc = iconDark;

  return (
    <>
      <section id="contact" className="py-24 md:py-32">
        <div className="container mx-auto px-6 max-w-4xl" ref={ref}>
          <motion.h2
            className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-16 text-center tracking-wide"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            {t("contact.title")}
          </motion.h2>

          <motion.div
            className="grid md:grid-cols-2 gap-12"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {/* Info */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
                <a
                  href="https://maps.google.com/?q=Strada+Nicolae+Testemițanu+19/10+MD-2025+Chișinău"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground text-sm font-body hover:text-muted-foreground transition-colors"
                >
                  Strada Nicolae Testemițanu 19/10, MD-2025, Chișinău
                </a>
              </div>
              <div className="flex items-center gap-4">
                <Phone className="w-4 h-4 text-muted-foreground shrink-0" />
                <a href="tel:+37361100499" className="text-foreground text-sm font-body hover:text-muted-foreground transition-colors">
                  061 100 499
                </a>
              </div>
              <div className="flex items-center gap-4">
                <Instagram className="w-4 h-4 text-muted-foreground shrink-0" />
                <a
                  href="https://instagram.com/primadancemd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground text-sm font-body hover:text-muted-foreground transition-colors"
                >
                  @primadancemd
                </a>
              </div>
              <div className="flex items-center gap-4">
                <Send className="w-4 h-4 text-muted-foreground shrink-0" />
                <a
                  href="https://t.me/primadancemd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground text-sm font-body hover:text-muted-foreground transition-colors"
                >
                  Telegram
                </a>
              </div>
              <div className="flex items-center gap-4">
                <Facebook className="w-4 h-4 text-muted-foreground shrink-0" />
                <a
                  href="https://facebook.com/primadancemd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground text-sm font-body hover:text-muted-foreground transition-colors"
                >
                  Facebook
                </a>
              </div>
              <div className="flex items-center gap-4">
                <Music2 className="w-4 h-4 text-muted-foreground shrink-0" />
                <a
                  href="https://www.tiktok.com/@primadancemd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground text-sm font-body hover:text-muted-foreground transition-colors"
                >
                  TikTok
                </a>
              </div>
            </div>

            {/* Map */}
            <div className="aspect-video bg-secondary border border-border overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2720.5!2d28.8!3d47.02!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sStrada+Nicolae+Testemițanu+19%2F10!5e0!3m2!1sen!2s!4v1700000000"
                width="100%"
                height="100%"
                style={{
                  border: 0,
                  filter: "grayscale(0.3) contrast(0.95)"
                }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Prima Dance Location"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t border-border py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            {/* Brand */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <img src={iconSrc} alt="Prima Dance" className="h-8 w-auto object-contain" />
                <span className="font-display text-lg tracking-[0.15em] uppercase text-foreground">Prima Dance</span>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              <a href="https://instagram.com/primadancemd" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors text-sm font-body">
                <Instagram className="w-4 h-4 shrink-0" /> @primadancemd
              </a>
              <a href="https://t.me/primadancemd" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors text-sm font-body">
                <Send className="w-4 h-4 shrink-0" /> Telegram
              </a>
              <a href="https://facebook.com/primadancemd" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors text-sm font-body">
                <Facebook className="w-4 h-4 shrink-0" /> Facebook
              </a>
              <a href="https://www.tiktok.com/@primadancemd" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors text-sm font-body">
                <Music2 className="w-4 h-4 shrink-0" /> TikTok
              </a>
              <a href="tel:+37361100499"
                className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors text-sm font-body">
                <Phone className="w-4 h-4 shrink-0" /> 061 100 499
              </a>
            </div>

            {/* Address */}
            <div>
              <a href="https://maps.google.com/?q=Strada+Nicolae+Testemițanu+19/10+MD-2025+Chișinău"
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors text-sm font-body">
                <MapPin className="w-4 h-4 shrink-0" /> Strada Nicolae Testemițanu 19/10, MD-2025, Chișinău
              </a>
            </div>
          </div>

          <div className="border-t border-border pt-6 text-center">
            <p className="text-muted-foreground text-xs font-body">
              © {new Date().getFullYear()} Prima Dance. {t("footer.rights")}
              <span className="mx-2">·</span>
              <a href="/cookie-policy" className="underline underline-offset-2 hover:text-foreground transition-colors">
                {t("cookies.footerLink")}
              </a>
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default ContactSection;
