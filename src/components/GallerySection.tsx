import { useState, useRef, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

// Static fallback images
import groupTraining1 from "@/assets/gallery/group-training-1.jpg";
import groupTraining2 from "@/assets/gallery/group-training-2.jpg";
import privateLesson1 from "@/assets/gallery/private-lesson-1.jpg";
import privateLesson2 from "@/assets/gallery/private-lesson-2.jpg";
import techniquePractice from "@/assets/gallery/technique-practice.jpg";
import movementCloseup from "@/assets/gallery/movement-closeup.jpg";
import barrePractice from "@/assets/gallery/barre-practice.jpg";
import studioInteriorBack from "@/assets/gallery/studio-interior-back.jpg";
import barreTutu from "@/assets/gallery/barre-tutu.jpg";
import receptionDesk from "@/assets/gallery/reception-desk.jpg";
import mainHallMirror from "@/assets/gallery/main-hall-mirror.jpg";
import danceHallLogo from "@/assets/gallery/dance-hall-logo.jpg";
import loungeArea from "@/assets/gallery/lounge-area.jpg";
import danceHallWide from "@/assets/gallery/dance-hall-wide.jpg";
import equipmentStorage from "@/assets/gallery/equipment-storage.jpg";
import lockerRoom from "@/assets/gallery/locker-room.jpg";

interface GalleryImage {
  src: string;
  alt: string;
}

const staticImages: GalleryImage[] = [
  { src: barrePractice, alt: "Instructoare de dans practicând la bară în studioul Prima Dance" },
  { src: studioInteriorBack, alt: "Interiorul studioului Prima Dance cu oglinzi și iluminat profesional" },
  { src: barreTutu, alt: "Dansatoare cu fustă tutu practicând la bară în pantofi de dans" },
  { src: receptionDesk, alt: "Recepția studioului Prima Dance cu trofee și branding" },
  { src: mainHallMirror, alt: "Sala principală de dans cu oglinzi la Prima Dance Chișinău" },
  { src: danceHallLogo, alt: "Sala de dans spațioasă cu perete de cărămidă și logo Prima Dance" },
  { src: groupTraining1, alt: "Antrenament de dans latin în grup pentru femei la Prima Dance Chișinău" },
  { src: privateLesson2, alt: "Lecție privată de dans latin la studioul Prima Dance" },
  { src: loungeArea, alt: "Zona de relaxare cu fotolii și vedere spre sala de dans" },
  { src: groupTraining2, alt: "Curs de dans de societate pentru adulți în Chișinău" },
  { src: danceHallWide, alt: "Vedere panoramică a sălii Prima Dance cu tavan industrial" },
  { src: privateLesson1, alt: "Lecție privată de dans cu instructor profesionist" },
  { src: equipmentStorage, alt: "Depozit de echipamente cu saltele și bară de balet" },
  { src: movementCloseup, alt: "Detaliu tehnică de dans la Prima Dance" },
  { src: lockerRoom, alt: "Vestiar modern cu dulapuri din lemn la Prima Dance" },
  { src: techniquePractice, alt: "Sesiune de practică tehnică de dans de societate" },
];

const GallerySection = () => {
  const { t } = useLanguage();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [dbImages, setDbImages] = useState<GalleryImage[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    supabase
      .from("gallery_images")
      .select("*")
      .order("sort_order")
      .then(({ data }) => {
        if (data && data.length > 0) {
          setDbImages(data.map((img) => ({ src: img.image_url, alt: img.alt_text })));
        }
        setLoaded(true);
      });
  }, []);

  // Use DB images if available, otherwise fall back to static
  const galleryImages = dbImages.length > 0 ? dbImages : staticImages;

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const goNext = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % galleryImages.length);
    }
  };

  const goPrev = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + galleryImages.length) % galleryImages.length);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") goNext();
    if (e.key === "ArrowLeft") goPrev();
  };

  return (
    <>
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

          {/* Masonry-style Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[200px] md:auto-rows-[240px]">
            {galleryImages.map((image, index) => {
              // Make certain images span 2 rows or 2 cols for visual interest
              const isLarge = index === 0 || index === 4 || index === 8 || index === 12;
              const isTall = index === 2 || index === 6 || index === 10 || index === 14;
              return (
                <motion.div
                  key={index}
                  className={`relative overflow-hidden cursor-pointer group ${
                    isLarge ? "md:col-span-2 md:row-span-2" : isTall ? "row-span-2" : ""
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.06 }}
                  onClick={() => openLightbox(index)}
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Studio Tour Video */}
      <section id="tour" className="py-24 md:py-32 bg-background">
        <div className="container mx-auto px-6 max-w-6xl">
          <motion.h2
            className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-4 text-center tracking-wide"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            {t("gallery.tour.title")}
          </motion.h2>
          <motion.p
            className="text-muted-foreground text-sm font-body text-center mb-12 tracking-widest uppercase"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {t("gallery.tour.subtitle")}
          </motion.p>
          <motion.div
            className="relative overflow-hidden mx-auto max-w-4xl aspect-video bg-secondary/30"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <video
              src="/videos/studio-tour.mp4"
              controls
              playsInline
              preload="metadata"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* Lessons Video */}
      <section id="lessons" className="py-24 md:py-32 bg-secondary/30">
        <div className="container mx-auto px-6 max-w-6xl">
          <motion.h2
            className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-4 text-center tracking-wide"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            {t("gallery.lessons.title")}
          </motion.h2>
          <motion.p
            className="text-muted-foreground text-sm font-body text-center mb-12 tracking-widest uppercase"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {t("gallery.lessons.subtitle")}
          </motion.p>
          <motion.div
            className="relative overflow-hidden mx-auto max-w-4xl aspect-video bg-background"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <video
              src="/videos/lessons.mp4"
              controls
              playsInline
              preload="metadata"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeLightbox}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            role="dialog"
            aria-label="Image lightbox"
          >
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-10"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
              className="absolute left-4 md:left-8 text-white/50 hover:text-white transition-colors z-10"
              aria-label="Previous"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); goNext(); }}
              className="absolute right-4 md:right-8 text-white/50 hover:text-white transition-colors z-10"
              aria-label="Next"
            >
              <ChevronRight className="w-8 h-8" />
            </button>

            <motion.img
              key={lightboxIndex}
              src={galleryImages[lightboxIndex].src}
              alt={galleryImages[lightboxIndex].alt}
              className="max-w-[90vw] max-h-[85vh] object-contain"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            />

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/40 text-xs font-body tracking-widest">
              {lightboxIndex + 1} / {galleryImages.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default GallerySection;
