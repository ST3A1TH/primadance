import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
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
}

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { lang } = useLanguage();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .single()
      .then(({ data }) => {
        setPost(data);
        setLoading(false);
      });
  }, [slug]);

  if (loading) return <div className="min-h-screen bg-background"><Header /><p className="pt-32 text-center text-muted-foreground font-body">Loading...</p></div>;
  if (!post) return <div className="min-h-screen bg-background"><Header /><p className="pt-32 text-center text-muted-foreground font-body">Not found</p></div>;

  const title = lang === "ro" ? post.title_ro : post.title_ru;
  const content = lang === "ro" ? post.content_ro : post.content_ru;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": title,
    "datePublished": post.created_at,
    "author": { "@type": "Organization", "name": "Prima Dance" },
    "publisher": { "@type": "Organization", "name": "Prima Dance", "url": "https://www.primadance.md" },
    "mainEntityOfPage": `https://www.primadance.md/blog/${post.slug}`
  };

  return (
    <>
      <SEOHead
        title={`${title} | Prima Dance`}
        description={content.substring(0, 155).replace(/<[^>]*>/g, '')}
        canonical={`https://www.primadance.md/blog/${post.slug}`}
        ogImage="https://www.primadance.md/og-image.jpeg"
        lang={lang}
        jsonLd={jsonLd}
      />
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-32 pb-24">
          <article className="container mx-auto px-6 max-w-3xl">
            <Link to="/blog" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-body mb-8">
              <ArrowLeft className="w-4 h-4" />
              {lang === "ro" ? "Toate articolele" : "Все статьи"}
            </Link>

            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-foreground mb-4 tracking-wide">
              {title}
            </h1>

            <time dateTime={post.created_at} className="text-muted-foreground text-xs font-body mb-10 block">
              {new Date(post.created_at).toLocaleDateString(lang === "ro" ? "ro-RO" : "ru-RU")}
            </time>

            <div
              className="prose prose-invert max-w-none font-body text-foreground/90 leading-relaxed
                [&_h2]:font-display [&_h2]:text-2xl [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:text-foreground
                [&_h3]:font-display [&_h3]:text-xl [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:text-foreground
                [&_p]:mb-4 [&_p]:text-sm [&_p]:text-muted-foreground
                [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4
                [&_li]:text-sm [&_li]:text-muted-foreground [&_li]:mb-1
                [&_a]:text-foreground [&_a]:underline [&_a]:hover:text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </article>
        </main>
      </div>
    </>
  );
};

export default BlogPostPage;
