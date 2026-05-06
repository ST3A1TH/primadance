import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import mainHallMirror from "@/assets/gallery/main-hall-mirror.jpg";
import groupTraining1 from "@/assets/gallery/group-training-1.jpg";
import privateLesson1 from "@/assets/gallery/private-lesson-1.jpg";

const GallerySection = () => {
  const { t } = useLanguage();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const cards = [
    { to: "/gallery/photos", img: mainHallMirror, title: t("gallery.photos.title"), subtitle: t("gallery.photos.subtitle") },
    { to: "/gallery/tour", img: groupTraining1, title: t("gallery.tour.title"), subtitle: t("gallery.tour.subtitle") },
    { to: "/gallery/lessons", img: privateLesson1, title: t("gallery.lessons.title"), subtitle: t("gallery.lessons.subtitle") },
  ];

  return (
    <section id="gallery" className="py-24 md:py-32 bg-secondary/30">
      <div className="container mx-auto px-6 max-w-6xl" ref={ref}>
        <motion.h2
          className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-4 text-center tracking-wide"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          {t("gallery.title")}
        </motion.h2>
        <motion.p
          className="text-muted-foreground text-sm font-body text-center mb-16 tracking-widest uppercase"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {t("gallery.subtitle")}
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card, i) => (
            <motion.div
              key={card.to}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <Link
                to={card.to}
                className="group block relative overflow-hidden aspect-[4/5] bg-background"
              >
                <img
                  src={card.img}
                  alt={card.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-8 text-white">
                  <h3 className="font-display text-2xl md:text-3xl tracking-wide mb-2">{card.title}</h3>
                  <p className="text-white/70 text-xs tracking-[0.2em] uppercase font-body mb-4">{card.subtitle}</p>
                  <span className="inline-block text-xs tracking-[0.2em] uppercase font-body border-b border-white/60 pb-1 group-hover:border-white transition-colors">
                    {t("gallery.explore")} →
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
