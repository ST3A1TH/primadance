import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Trash2, Plus } from "lucide-react";
import { handleDbError } from "@/lib/error-handler";

interface PricingItem {
  id: string;
  category: string;
  label_ro: string;
  label_ru: string;
  price: string;
  sort_order: number;
}

const AdminPricing = () => {
  const [items, setItems] = useState<PricingItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const { data, error } = await supabase.from("pricing").select("*").order("category").order("sort_order");
    if (error) toast.error(handleDbError(error));
    else setItems(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const addItem = async (category: string) => {
    const catItems = items.filter(i => i.category === category);
    const maxOrder = catItems.reduce((max, i) => Math.max(max, i.sort_order), -1);
    const { error } = await supabase.from("pricing").insert({
      category, label_ro: "New", label_ru: "Новый", price: "0 lei", sort_order: maxOrder + 1
    });
    if (error) toast.error(handleDbError(error));
    else { toast.success("Added"); fetchData(); }
  };

  const updateItem = async (id: string, field: string, value: string) => {
    const { error } = await supabase.from("pricing").update({ [field]: value }).eq("id", id);
    if (error) toast.error(handleDbError(error));
  };

  const deleteItem = async (id: string) => {
    const { error } = await supabase.from("pricing").delete().eq("id", id);
    if (error) toast.error(handleDbError(error));
    else { toast.success("Deleted"); fetchData(); }
  };

  if (loading) return <p className="text-muted-foreground text-sm">Loading...</p>;

  const renderCategory = (cat: string, title: string) => {
    const catItems = items.filter(i => i.category === cat);
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-xl text-foreground">{title}</h3>
          <button onClick={() => addItem(cat)} className="text-muted-foreground hover:text-foreground transition-colors">
            <Plus className="w-4 h-4" />
          </button>
        </div>
        {catItems.map((item) => (
          <div key={item.id} className="flex items-center gap-3 border border-border p-3">
            <input
              defaultValue={item.label_ro}
              onBlur={(e) => updateItem(item.id, "label_ro", e.target.value)}
              placeholder="Label RO"
              className="flex-1 bg-secondary border border-border text-foreground px-2 py-1 text-sm font-body focus:outline-none"
            />
            <input
              defaultValue={item.label_ru}
              onBlur={(e) => updateItem(item.id, "label_ru", e.target.value)}
              placeholder="Label RU"
              className="flex-1 bg-secondary border border-border text-foreground px-2 py-1 text-sm font-body focus:outline-none"
            />
            <input
              defaultValue={item.price}
              onBlur={(e) => updateItem(item.id, "price", e.target.value)}
              placeholder="Price"
              className="w-28 bg-secondary border border-border text-foreground px-2 py-1 text-sm font-body focus:outline-none"
            />
            <button onClick={() => deleteItem(item.id)} className="text-muted-foreground hover:text-destructive transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-10">
      {renderCategory("group", "Group Classes")}
      {renderCategory("personal", "Personal Lessons")}
    </div>
  );
};

export default AdminPricing;
