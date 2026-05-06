import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import SEOHead from "@/components/SEOHead";
import { useLanguage } from "@/contexts/LanguageContext";

interface Props {
  videoSrc: string;
  titleKey: string;
  subtitleKey: string;
  slug: string;
}

const GalleryVideo = ({ videoSrc, titleKey, subtitleKey, slug }: Props) => {
  const { t, lang } = useLanguage();
  return (
    <>
      <SEOHead
        title={`${t(titleKey)} | Prima Dance`}
        description={t(subtitleKey)}
        canonical={`https://www.primadance.md/gallery/${slug}`}
        lang={lang}
      />
      <Header />
      <main className="min-h-screen bg-background pt-32 pb-24">
        <div className="container mx-auto px-6 max-w-5xl">
          <Link to="/#gallery" className="inline-flex items-center gap-2 text-sm tracking-[0.2em] uppercase font-body text-muted-foreground hover:text-foreground transition-colors mb-12">
            <ArrowLeft className="w-4 h-4" /> {t("gallery.back")}
          </Link>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-4 tracking-wide">{t(titleKey)}</h1>
          <p className="text-muted-foreground text-sm font-body mb-12 tracking-widest uppercase">{t(subtitleKey)}</p>

          <div className="relative overflow-hidden aspect-video bg-secondary/30">
            <video src={videoSrc} controls playsInline preload="metadata" className="w-full h-full object-cover" />
          </div>
        </div>
      </main>
    </>
  );
};

export const GalleryTour = () => (
  <GalleryVideo videoSrc="/videos/studio-tour.mp4" titleKey="gallery.tour.title" subtitleKey="gallery.tour.subtitle" slug="tour" />
);
export const GalleryLessons = () => (
  <GalleryVideo videoSrc="/videos/lessons.mp4" titleKey="gallery.lessons.title" subtitleKey="gallery.lessons.subtitle" slug="lessons" />
);
