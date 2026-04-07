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

const staticImages: GalleryImage[] = [
  { src: barrePractice, alt: "Dance instructor practicing at the barre at Prima Dance Studio" },
  { src: studioInteriorBack, alt: "Prima Dance Studio interior view with mirrors and professional lighting" },
  { src: barreTutu, alt: "Dancer with tutu practicing at the barre in dance heels" },
  { src: receptionDesk, alt: "Prima Dance Studio reception area with trophies and branding" },
  { src: mainHallMirror, alt: "Main dance hall with full-length mirrors at Prima Dance Chisinau" },
  { src: danceHallLogo, alt: "Spacious dance hall with brick wall and Prima Dance logo" },
  { src: groupTraining1, alt: "Group Latin dance training for women at Prima Dance Chisinau" },
  { src: privateLesson2, alt: "Private Latin dance lesson close-up at Prima Dance studio" },
  { src: loungeArea, alt: "Lounge area with seating and view into the dance studio" },
  { src: groupTraining2, alt: "Group ballroom dance class for adults in Chisinau" },
  { src: danceHallWide, alt: "Wide view of Prima Dance Studio hall with industrial ceiling" },
  { src: privateLesson1, alt: "Private Latin dance lesson with professional instructor" },
  { src: equipmentStorage, alt: "Studio equipment storage with yoga mats and ballet barre" },
  { src: movementCloseup, alt: "Dance movement technique close-up at Prima Dance" },
  { src: lockerRoom, alt: "Modern locker room with wooden lockers at Prima Dance Studio" },
  { src: techniquePractice, alt: "Ballroom dance technique practice session" },
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

          {/* Responsive Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {galleryImages.map((image, index) => (
              <motion.div
                key={index}
                className="relative overflow-hidden cursor-pointer group aspect-[4/3]"
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
            ))}
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
