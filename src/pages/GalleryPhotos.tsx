import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, X, ChevronLeft, ChevronRight } from "lucide-react";
import Header from "@/components/Header";
import SEOHead from "@/components/SEOHead";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";

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

interface GalleryImage { src: string; alt: string; }

const staticImages: GalleryImage[] = [
  { src: barrePractice, alt: "Bară" },
  { src: studioInteriorBack, alt: "Studio" },
  { src: barreTutu, alt: "Tutu" },
  { src: receptionDesk, alt: "Recepție" },
  { src: mainHallMirror, alt: "Sala principală" },
  { src: danceHallLogo, alt: "Logo sala" },
  { src: groupTraining1, alt: "Grup" },
  { src: privateLesson2, alt: "Lecție privată" },
  { src: loungeArea, alt: "Lounge" },
  { src: groupTraining2, alt: "Grup 2" },
  { src: danceHallWide, alt: "Sala wide" },
  { src: privateLesson1, alt: "Lecție privată" },
  { src: equipmentStorage, alt: "Echipamente" },
  { src: movementCloseup, alt: "Mișcare" },
  { src: lockerRoom, alt: "Vestiar" },
  { src: techniquePractice, alt: "Tehnică" },
];

const GalleryPhotos = () => {
  const { t, lang } = useLanguage();
  const [dbImages, setDbImages] = useState<GalleryImage[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    supabase.from("gallery_images").select("*").order("sort_order").then(({ data }) => {
      if (data && data.length > 0) setDbImages(data.map(img => ({ src: img.image_url, alt: img.alt_text })));
    });
  }, []);

  const images = dbImages.length > 0 ? dbImages : staticImages;
  const goNext = () => lightboxIndex !== null && setLightboxIndex((lightboxIndex + 1) % images.length);
  const goPrev = () => lightboxIndex !== null && setLightboxIndex((lightboxIndex - 1 + images.length) % images.length);

  return (
    <>
      <SEOHead
        title={lang === "ro" ? "Fotografii | Prima Dance" : "Фотографии | Prima Dance"}
        description={lang === "ro" ? "Galerie foto Prima Dance" : "Фотогалерея Prima Dance"}
        canonical="https://www.primadance.md/gallery/photos"
        lang={lang}
      />
      <Header />
      <main className="min-h-screen bg-background pt-32 pb-24">
        <div className="container mx-auto px-6 max-w-6xl">
          <Link to="/#gallery" className="inline-flex items-center gap-2 text-sm tracking-[0.2em] uppercase font-body text-muted-foreground hover:text-foreground transition-colors mb-12">
            <ArrowLeft className="w-4 h-4" /> {t("gallery.back")}
          </Link>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-4 tracking-wide">{t("gallery.photos.title")}</h1>
          <p className="text-muted-foreground text-sm font-body mb-16 tracking-widest uppercase">{t("gallery.photos.subtitle")}</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[200px] md:auto-rows-[240px]">
            {images.map((img, i) => {
              const isLarge = i === 0 || i === 4 || i === 8 || i === 12;
              const isTall = i === 2 || i === 6 || i === 10 || i === 14;
              return (
                <motion.div
                  key={i}
                  className={`relative overflow-hidden cursor-pointer group ${isLarge ? "md:col-span-2 md:row-span-2" : isTall ? "row-span-2" : ""}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.04 }}
                  onClick={() => setLightboxIndex(i)}
                >
                  <img src={img.src} alt={img.alt} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500" />
                </motion.div>
              );
            })}
          </div>
        </div>

        <AnimatePresence>
          {lightboxIndex !== null && (
            <motion.div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setLightboxIndex(null)}>
              <button onClick={() => setLightboxIndex(null)} className="absolute top-6 right-6 text-white/70 hover:text-white z-10"><X className="w-6 h-6" /></button>
              <button onClick={(e) => { e.stopPropagation(); goPrev(); }} className="absolute left-4 md:left-8 text-white/50 hover:text-white z-10"><ChevronLeft className="w-8 h-8" /></button>
              <button onClick={(e) => { e.stopPropagation(); goNext(); }} className="absolute right-4 md:right-8 text-white/50 hover:text-white z-10"><ChevronRight className="w-8 h-8" /></button>
              <motion.img key={lightboxIndex} src={images[lightboxIndex].src} alt={images[lightboxIndex].alt} className="max-w-[90vw] max-h-[85vh] object-contain" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} onClick={(e) => e.stopPropagation()} />
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/40 text-xs font-body tracking-widest">{lightboxIndex + 1} / {images.length}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </>
  );
};

export default GalleryPhotos;
