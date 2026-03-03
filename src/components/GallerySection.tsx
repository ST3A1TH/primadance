import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

import groupTraining1 from "@/assets/gallery/group-training-1.jpg";
import groupTraining2 from "@/assets/gallery/group-training-2.jpg";
import privateLesson1 from "@/assets/gallery/private-lesson-1.jpg";
import privateLesson2 from "@/assets/gallery/private-lesson-2.jpg";
import techniquePractice from "@/assets/gallery/technique-practice.jpg";
import warmupSession from "@/assets/gallery/warmup-session.jpg";
import movementCloseup from "@/assets/gallery/movement-closeup.jpg";

interface GalleryImage {
  src: string;
  alt: string;
  tags: string[];
  span: "tall" | "wide" | "square";
}

const galleryImages: GalleryImage[] = [
  { src: groupTraining1, alt: "Group Latin training", tags: ["group-training", "latin-women"], span: "wide" },
  { src: privateLesson2, alt: "Private lesson close-up", tags: ["private-lesson", "latin-pair"], span: "square" },
  { src: groupTraining2, alt: "Group dance class", tags: ["group-training", "latin-women"], span: "tall" },
  { src: privateLesson1, alt: "Private Latin lesson", tags: ["private-lesson", "latin-pair"], span: "wide" },
  { src: movementCloseup, alt: "Dance movement close-up", tags: ["technique-practice", "latin-women"], span: "square" },
  { src: techniquePractice, alt: "Technique practice", tags: ["technique-practice", "private-lesson"], span: "tall" },
  { src: warmupSession, alt: "Warm-up session", tags: ["group-training", "studio-atmosphere"], span: "wide" },
];

const GallerySection = () => {
  const { t } = useLanguage();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

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

          {/* Masonry Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 auto-rows-[200px] md:auto-rows-[240px]">
            {galleryImages.map((image, index) => {
              const spanClass =
                image.span === "wide"
                  ? "col-span-2 row-span-1"
                  : image.span === "tall"
                  ? "col-span-1 row-span-2"
                  : "col-span-1 row-span-1";

              return (
                <motion.div
                  key={index}
                  className={`${spanClass} relative overflow-hidden cursor-pointer group`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.08 }}
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
            {/* Close button */}
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-10"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Prev */}
            <button
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
              className="absolute left-4 md:left-8 text-white/50 hover:text-white transition-colors z-10"
              aria-label="Previous"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>

            {/* Next */}
            <button
              onClick={(e) => { e.stopPropagation(); goNext(); }}
              className="absolute right-4 md:right-8 text-white/50 hover:text-white transition-colors z-10"
              aria-label="Next"
            >
              <ChevronRight className="w-8 h-8" />
            </button>

            {/* Image */}
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

            {/* Counter */}
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
