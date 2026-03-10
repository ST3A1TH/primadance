import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Trash2, Plus } from "lucide-react";
import { handleDbError } from "@/lib/error-handler";

interface ClassItem {
  id: string;
  name: string;
  description_ro: string;
  description_ru: string;
  sort_order: number;
}

const AdminClasses = () => {
  const [items, setItems] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const { data, error } = await supabase.from("classes").select("*").order("sort_order");
    if (error) toast.error(handleDbError(error));
    else setItems(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const addItem = async () => {
    const maxOrder = items.reduce((max, i) => Math.max(max, i.sort_order), -1);
    const { error } = await supabase.from("classes").insert({
      name: "New Class", description_ro: "", description_ru: "", sort_order: maxOrder + 1
    });
    if (error) toast.error(handleDbError(error));
    else { toast.success("Added"); fetchData(); }
  };

  const updateItem = async (id: string, field: string, value: string) => {
    const { error } = await supabase.from("classes").update({ [field]: value }).eq("id", id);
    if (error) toast.error(handleDbError(error));
  };

  const deleteItem = async (id: string) => {
    const { error } = await supabase.from("classes").delete().eq("id", id);
    if (error) toast.error(handleDbError(error));
    else { toast.success("Deleted"); fetchData(); }
  };

  if (loading) return <p className="text-muted-foreground text-sm">Loading...</p>;

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button onClick={addItem} className="flex items-center gap-2 border border-foreground text-foreground px-4 py-2 text-sm font-body hover:bg-foreground hover:text-background transition-all">
          <Plus className="w-4 h-4" /> Add Class
        </button>
      </div>
      {items.map((item) => (
        <div key={item.id} className="border border-border p-6 space-y-4">
          <div className="flex items-center justify-between">
            <input
              defaultValue={item.name}
              onBlur={(e) => updateItem(item.id, "name", e.target.value)}
              className="font-display text-xl bg-transparent text-foreground focus:outline-none border-b border-transparent focus:border-foreground"
            />
            <button onClick={() => deleteItem(item.id)} className="text-muted-foreground hover:text-destructive transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-muted-foreground text-xs font-body mb-1 block">Description (RO)</label>
              <textarea
                defaultValue={item.description_ro}
                onBlur={(e) => updateItem(item.id, "description_ro", e.target.value)}
                rows={3}
                className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm font-body focus:outline-none resize-none"
              />
            </div>
            <div>
              <label className="text-muted-foreground text-xs font-body mb-1 block">Description (RU)</label>
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

export default AdminClasses;
