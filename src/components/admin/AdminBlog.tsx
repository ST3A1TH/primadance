import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Trash2, Plus, Eye, EyeOff, Save } from "lucide-react";

interface BlogPost {
  id: string;
  title_ro: string;
  title_ru: string;
  slug: string;
  content_ro: string;
  content_ru: string;
  published: boolean;
  created_at: string;
}

const AdminBlog = ({ lang }: { lang: "ro" | "ru" }) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    else setPosts(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchPosts(); }, []);

  const addPost = async () => {
    const { data, error } = await supabase.from("blog_posts").insert({
      title_ro: "Articol nou",
      title_ru: "Новая статья",
      slug: `post-${Date.now()}`,
      content_ro: "",
      content_ru: "",
      published: false,
    }).select().single();
    if (error) toast.error(error.message);
    else {
      toast.success(lang === "ro" ? "Adăugat" : "Добавлено");
      fetchPosts();
      if (data) setEditingId(data.id);
    }
  };

  const updatePost = async (id: string, field: string, value: string | boolean) => {
    const { error } = await supabase.from("blog_posts").update({ [field]: value }).eq("id", id);
    if (error) toast.error(error.message);
  };

  const togglePublish = async (post: BlogPost) => {
    const { error } = await supabase.from("blog_posts").update({ published: !post.published }).eq("id", post.id);
    if (error) toast.error(error.message);
    else {
      toast.success(post.published ? (lang === "ro" ? "Nepublicat" : "Снято с публикации") : (lang === "ro" ? "Publicat" : "Опубликовано"));
      fetchPosts();
    }
  };

  const deletePost = async (id: string) => {
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success(lang === "ro" ? "Șters" : "Удалено"); fetchPosts(); }
  };

  const labels = {
    ro: { new: "Articol nou", title: "Titlu", content: "Conținut", slug: "URL slug", published: "Publicat", draft: "Ciornă", save: "Salvat" },
    ru: { new: "Новая статья", title: "Заголовок", content: "Содержание", slug: "URL slug", published: "Опубликовано", draft: "Черновик", save: "Сохранено" },
  };
  const l = labels[lang];

  if (loading) return <p className="text-muted-foreground text-sm">Loading...</p>;

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button onClick={addPost} className="flex items-center gap-2 border border-foreground text-foreground px-4 py-2 text-sm font-body hover:bg-foreground hover:text-background transition-all">
          <Plus className="w-4 h-4" /> {l.new}
        </button>
      </div>

      {posts.map((post) => (
        <div key={post.id} className="border border-border">
          {/* Header */}
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className={`text-[10px] font-body uppercase tracking-widest px-2 py-0.5 ${post.published ? "bg-emerald-500/10 text-emerald-500" : "bg-muted text-muted-foreground"}`}>
                {post.published ? l.published : l.draft}
              </span>
              <span className="text-foreground text-sm font-body font-medium">
                {lang === "ro" ? post.title_ro : post.title_ru}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setEditingId(editingId === post.id ? null : post.id)}
                className="text-muted-foreground hover:text-foreground transition-colors text-xs font-body uppercase tracking-widest">
                {editingId === post.id ? (lang === "ro" ? "Închide" : "Закрыть") : (lang === "ro" ? "Editează" : "Редактировать")}
              </button>
              <button onClick={() => togglePublish(post)} className="text-muted-foreground hover:text-foreground transition-colors">
                {post.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              <button onClick={() => deletePost(post.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Editor */}
          {editingId === post.id && (
            <div className="p-4 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-muted-foreground text-xs font-body mb-1 block">{l.title} (RO)</label>
                  <input
                    defaultValue={post.title_ro}
                    onBlur={(e) => updatePost(post.id, "title_ro", e.target.value)}
                    className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm font-body focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-muted-foreground text-xs font-body mb-1 block">{l.title} (RU)</label>
                  <input
                    defaultValue={post.title_ru}
                    onBlur={(e) => updatePost(post.id, "title_ru", e.target.value)}
                    className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm font-body focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="text-muted-foreground text-xs font-body mb-1 block">{l.slug}</label>
                <input
                  defaultValue={post.slug}
                  onBlur={(e) => updatePost(post.id, "slug", e.target.value)}
                  className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm font-body focus:outline-none"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-muted-foreground text-xs font-body mb-1 block">{l.content} (RO)</label>
                  <textarea
                    defaultValue={post.content_ro}
                    onBlur={(e) => updatePost(post.id, "content_ro", e.target.value)}
                    rows={10}
                    className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm font-body focus:outline-none resize-none"
                  />
                </div>
                <div>
                  <label className="text-muted-foreground text-xs font-body mb-1 block">{l.content} (RU)</label>
                  <textarea
                    defaultValue={post.content_ru}
                    onBlur={(e) => updatePost(post.id, "content_ru", e.target.value)}
                    rows={10}
                    className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm font-body focus:outline-none resize-none"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      ))}

      {posts.length === 0 && (
        <p className="text-muted-foreground text-sm font-body text-center py-8 italic">
          {lang === "ro" ? "Nu există articole. Creează primul articol." : "Нет статей. Создайте первую статью."}
        </p>
      )}
    </div>
  );
};

export default AdminBlog;
