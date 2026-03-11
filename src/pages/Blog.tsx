import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import SEOHead from "@/components/SEOHead";
import Header from "@/components/Header";
import { ArrowLeft } from "lucide-react";

interface BlogPost {
  id: string;
  slug: string;
  title_ro: string;
  title_ru: string;
  content_ro: string;
  content_ru: string;
  created_at: string;
  published: boolean;
}

const Blog = () => {
  const { lang, t } = useLanguage();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("blog_posts")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setPosts(data || []);
        setLoading(false);
      });
  }, []);

  const seo = lang === "ro"
    ? {
        title: "Blog despre Dans | Prima Dance Chișinău",
        description: "Articole despre dans latin, ballroom, stretching și sfaturi pentru dansatori adulți. Citește blogul Prima Dance."
      }
    : {
        title: "Блог о Танцах | Prima Dance Кишинёв",
        description: "Статьи о латинских, бальных танцах, стретчинге и советы для взрослых танцоров. Читайте блог Prima Dance."
      };

  return (
    <>
      <SEOHead
        title={seo.title}
        description={seo.description}
        canonical="https://www.primadance.md/blog"
        ogImage="https://www.primadance.md/og-image.jpeg"
        lang={lang}
      />
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-32 pb-24">
          <div className="container mx-auto px-6 max-w-3xl">
            <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-body mb-8">
              <ArrowLeft className="w-4 h-4" />
              {lang === "ro" ? "Înapoi" : "Назад"}
            </Link>

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-12 tracking-wide">
              {lang === "ro" ? "Blog" : "Блог"}
            </h1>

            {loading ? (
              <p className="text-muted-foreground font-body">Loading...</p>
            ) : posts.length === 0 ? (
              <p className="text-muted-foreground font-body">
                {lang === "ro" ? "Încă nu sunt articole publicate." : "Пока нет опубликованных статей."}
              </p>
            ) : (
              <div className="space-y-12">
                {posts.map((post) => {
                  const title = lang === "ro" ? post.title_ro : post.title_ru;
                  const content = lang === "ro" ? post.content_ro : post.content_ru;
                  const excerpt = content.substring(0, 200).replace(/<[^>]*>/g, '') + "...";

                  return (
                    <article key={post.id} className="border-b border-border pb-8">
                      <Link to={`/blog/${post.slug}`}>
                        <h2 className="font-display text-2xl md:text-3xl text-foreground mb-3 hover:text-muted-foreground transition-colors">
                          {title}
                        </h2>
                      </Link>
                      <time
                        dateTime={post.created_at}
                        className="text-muted-foreground text-xs font-body mb-4 block"
                      >
                        {new Date(post.created_at).toLocaleDateString(lang === "ro" ? "ro-RO" : "ru-RU")}
                      </time>
                      <p className="text-muted-foreground text-sm font-body leading-relaxed mb-4">
                        {excerpt}
                      </p>
                      <Link
                        to={`/blog/${post.slug}`}
                        className="text-foreground text-sm font-body tracking-[0.15em] uppercase hover:text-muted-foreground transition-colors"
                      >
                        {lang === "ro" ? "Citește →" : "Читать →"}
                      </Link>
                    </article>
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

export default Blog;
