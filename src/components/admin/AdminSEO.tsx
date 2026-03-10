import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SEOItem {
  id: string;
  page_key: string;
  title_ro: string;
  title_ru: string;
  description_ro: string;
  description_ru: string;
}

const AdminSEO = ({ lang }: { lang: "ro" | "ru" }) => {
  const [items, setItems] = useState<SEOItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("seo_settings").select("*").order("page_key").then(({ data, error }) => {
      if (error) toast.error(error.message);
      else setItems(data || []);
      setLoading(false);
    });
  }, []);

  const updateItem = async (id: string, field: string, value: string) => {
    const { error } = await supabase.from("seo_settings").update({ [field]: value }).eq("id", id);
    if (error) toast.error(error.message);
    else toast.success("Saved");
  };

  if (loading) return <p className="text-muted-foreground text-sm">Loading...</p>;

  const labels = {
    ro: { title: "Titlu", description: "Meta Descriere", page: "Pagina" },
    ru: { title: "Заголовок", description: "Мета-описание", page: "Страница" },
  };
  const l = labels[lang];

  return (
    <div className="space-y-6">
      {items.map((item) => (
        <div key={item.id} className="border border-border p-6 space-y-4">
          <h3 className="font-display text-lg text-foreground capitalize">{l.page}: {item.page_key}</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-muted-foreground text-xs font-body mb-1 block">{l.title} (RO)</label>
              <input
                defaultValue={item.title_ro}
                onBlur={(e) => updateItem(item.id, "title_ro", e.target.value)}
                className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm font-body focus:outline-none"
              />
            </div>
            <div>
              <label className="text-muted-foreground text-xs font-body mb-1 block">{l.title} (RU)</label>
              <input
                defaultValue={item.title_ru}
                onBlur={(e) => updateItem(item.id, "title_ru", e.target.value)}
                className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm font-body focus:outline-none"
              />
            </div>
            <div>
              <label className="text-muted-foreground text-xs font-body mb-1 block">{l.description} (RO)</label>
              <textarea
                defaultValue={item.description_ro}
                onBlur={(e) => updateItem(item.id, "description_ro", e.target.value)}
                rows={3}
                className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm font-body focus:outline-none resize-none"
              />
            </div>
            <div>
              <label className="text-muted-foreground text-xs font-body mb-1 block">{l.description} (RU)</label>
              <textarea
                defaultValue={item.description_ru}
                onBlur={(e) => updateItem(item.id, "description_ru", e.target.value)}
                rows={3}
                className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm font-body focus:outline-none resize-none"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminSEO;
