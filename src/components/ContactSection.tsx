import { motion, useInView } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRef } from "react";
import { MapPin, Instagram, Phone, Mail } from "lucide-react";
import logoDark from "@/assets/logo-dark.jpg";

const ContactSection = () => {
  const { t } = useLanguage();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

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
                <span className="text-foreground text-sm font-body">{t("contact.address")}</span>
              </div>
              <div className="flex items-center gap-4">
                <Phone className="w-4 h-4 text-muted-foreground shrink-0" />
                <a href="tel:+37300000000" className="text-foreground text-sm font-body hover:text-muted-foreground transition-colors">
                  +373 00 000 000
                </a>
              </div>
              <div className="flex items-center gap-4">
                <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
                <a href="mailto:info@primadance.md" className="text-foreground text-sm font-body hover:text-muted-foreground transition-colors">
                  info@primadance.md
                </a>
              </div>
              <div className="flex items-center gap-4">
                <Instagram className="w-4 h-4 text-muted-foreground shrink-0" />
                <a
                  href="https://instagram.com/primadancestudio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground text-sm font-body hover:text-muted-foreground transition-colors"
                >
                  @primadancestudio
                </a>
              </div>
            </div>

            {/* Map */}
            <div className="aspect-video bg-secondary border border-border overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d87095.68285!2d28.77!3d47.02!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40c97c3628b769a1%3A0x37d1d6305749dd3c!2sChi%C8%99in%C4%83u%2C%20Moldova!5e0!3m2!1sen!2s!4v1700000000"
                width="100%"
                height="100%"
                style={{ border: 0, filter: "grayscale(1) invert(1) contrast(0.8)" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Prima Dance Studio Location"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img src={logoDark} alt="Prima" className="h-8 w-8 object-cover rounded-full" />
            <span className="font-display text-foreground tracking-[0.2em] uppercase text-sm">
              Prima Dance Studio
            </span>
          </div>
          <p className="text-muted-foreground text-xs font-body">
            © {new Date().getFullYear()} Prima Dance Studio. {t("footer.rights")}
          </p>
        </div>
      </footer>
    </>
  );
};

export default ContactSection;
