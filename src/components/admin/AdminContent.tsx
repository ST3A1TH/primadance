import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ContentItem {
  id: string;
  key: string;
  value_ro: string;
  value_ru: string;
}

const AdminContent = () => {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const { data, error } = await supabase.from("site_content").select("*").order("key");
    if (error) toast.error(error.message);
    else setItems(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const updateItem = async (id: string, field: string, value: string) => {
    const { error } = await supabase.from("site_content").update({ [field]: value }).eq("id", id);
    if (error) toast.error(error.message);
    else toast.success("Saved");
  };

  if (loading) return <p className="text-muted-foreground text-sm">Loading...</p>;

  return (
    <div className="space-y-8">
      {items.map((item) => (
        <div key={item.id} className="border border-border p-6 space-y-4">
          <h3 className="font-display text-lg text-foreground">{item.key}</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-muted-foreground text-xs font-body mb-1 block">Romanian</label>
              <textarea
                defaultValue={item.value_ro}
                onBlur={(e) => updateItem(item.id, "value_ro", e.target.value)}
                rows={4}
                className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm font-body focus:outline-none resize-none"
              />
            </div>
            <div>
              <label className="text-muted-foreground text-xs font-body mb-1 block">Russian</label>
              <textarea
                defaultValue={item.value_ru}
                onBlur={(e) => updateItem(item.id, "value_ru", e.target.value)}
                rows={4}
                className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm font-body focus:outline-none resize-none"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminContent;
