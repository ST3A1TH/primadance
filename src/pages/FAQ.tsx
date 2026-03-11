import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import SEOHead from "@/components/SEOHead";
import Header from "@/components/Header";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FAQ {
  id: string;
  question_ro: string;
  question_ru: string;
  answer_ro: string;
  answer_ru: string;
  sort_order: number;
}

const FAQPage = () => {
  const { lang } = useLanguage();
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from("faqs")
      .select("*")
      .eq("published", true)
      .order("sort_order")
      .then(({ data }) => {
        setFaqs(data || []);
        setLoading(false);
      });
  }, []);

  const seo = lang === "ro"
    ? {
        title: "Întrebări Frecvente | Prima Dance Chișinău",
        description: "Răspunsuri la cele mai frecvente întrebări despre lecțiile de dans la Prima Dance. Află totul despre cursuri, prețuri și programare."
      }
    : {
        title: "Часто Задаваемые Вопросы | Prima Dance Кишинёв",
        description: "Ответы на часто задаваемые вопросы об уроках танцев в Prima Dance. Узнайте всё о занятиях, ценах и расписании."
      };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": lang === "ro" ? faq.question_ro : faq.question_ru,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": lang === "ro" ? faq.answer_ro : faq.answer_ru,
      },
    })),
  };

  return (
    <>
      <SEOHead
        title={seo.title}
        description={seo.description}
        canonical="https://www.primadance.md/faq"
        ogImage="https://www.primadance.md/og-image.jpeg"
        lang={lang}
        jsonLd={faqs.length > 0 ? jsonLd : undefined}
      />
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-32 pb-24">
          <div className="container mx-auto px-6 max-w-3xl">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-body mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              {lang === "ro" ? "Înapoi" : "Назад"}
            </Link>

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-4 tracking-wide">
              {lang === "ro" ? "Întrebări Frecvente" : "Часто Задаваемые Вопросы"}
            </h1>
            <p className="text-muted-foreground text-lg font-body mb-12">
              {lang === "ro"
                ? "Tot ce trebuie să știi despre lecțiile de dans la Prima Dance."
                : "Всё, что нужно знать о занятиях танцами в Prima Dance."}
            </p>

            {loading ? (
              <p className="text-muted-foreground font-body text-sm">Loading...</p>
            ) : faqs.length === 0 ? (
              <p className="text-muted-foreground font-body">
                {lang === "ro" ? "Nicio întrebare încă." : "Пока нет вопросов."}
              </p>
            ) : (
              <div className="space-y-0 border-t border-border">
                {faqs.map((faq) => {
                  const question = lang === "ro" ? faq.question_ro : faq.question_ru;
                  const answer = lang === "ro" ? faq.answer_ro : faq.answer_ru;
                  const isOpen = openId === faq.id;

                  return (
                    <div key={faq.id} className="border-b border-border">
                      <button
                        onClick={() => setOpenId(isOpen ? null : faq.id)}
                        className="w-full flex items-center justify-between py-6 text-left group"
                      >
                        <h2 className="font-display text-xl md:text-2xl text-foreground pr-4 group-hover:text-muted-foreground transition-colors">
                          {question}
                        </h2>
                        <ChevronDown
                          className={`w-5 h-5 text-muted-foreground shrink-0 transition-transform duration-300 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                            <p className="text-muted-foreground text-sm font-body leading-relaxed pb-6">
                              {answer}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default FAQPage;
