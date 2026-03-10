import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Trash2, Plus } from "lucide-react";
import { handleDbError } from "@/lib/error-handler";

const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

interface ScheduleItem {
  id: string;
  day_of_week: number;
  time: string;
  class_name: string;
  note: string | null;
  sort_order: number;
}

const AdminSchedule = () => {
  const [items, setItems] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const { data, error } = await supabase.from("schedule").select("*").order("day_of_week").order("sort_order");
    if (error) toast.error(handleDbError(error));
    else setItems(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const addItem = async (day: number) => {
    const maxOrder = items.filter(i => i.day_of_week === day).reduce((max, i) => Math.max(max, i.sort_order), -1);
    const { error } = await supabase.from("schedule").insert({
      day_of_week: day, time: "18:00", class_name: "New Class", sort_order: maxOrder + 1
    });
    if (error) toast.error(handleDbError(error));
    else { toast.success("Added"); fetchData(); }
  };

  const updateItem = async (id: string, field: string, value: string | number | null) => {
    const { error } = await supabase.from("schedule").update({ [field]: value }).eq("id", id);
    if (error) toast.error(handleDbError(error));
    else fetchData();
  };

  const deleteItem = async (id: string) => {
    const { error } = await supabase.from("schedule").delete().eq("id", id);
    if (error) toast.error(handleDbError(error));
    else { toast.success("Deleted"); fetchData(); }
  };

  if (loading) return <p className="text-muted-foreground text-sm">Loading...</p>;

  return (
    <div className="space-y-8">
      {dayNames.map((day, di) => {
        const dayItems = items.filter(i => i.day_of_week === di);
        return (
          <div key={di}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display text-xl text-foreground">{day}</h3>
              <button onClick={() => addItem(di)} className="text-muted-foreground hover:text-foreground transition-colors">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {dayItems.length === 0 ? (
              <p className="text-muted-foreground text-xs italic font-body">No classes</p>
            ) : (
              <div className="space-y-2">
                {dayItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 border border-border p-3">
                    <input
                      value={item.time}
                      onChange={(e) => updateItem(item.id, "time", e.target.value)}
                      className="w-20 bg-secondary border border-border text-foreground px-2 py-1 text-sm font-body focus:outline-none"
                    />
                    <input
                      value={item.class_name}
                      onChange={(e) => updateItem(item.id, "class_name", e.target.value)}
                      className="flex-1 bg-secondary border border-border text-foreground px-2 py-1 text-sm font-body focus:outline-none"
                    />
                    <input
                      value={item.note || ""}
                      onChange={(e) => updateItem(item.id, "note", e.target.value || null)}
                      placeholder="Note"
                      className="w-32 bg-secondary border border-border text-foreground px-2 py-1 text-sm font-body focus:outline-none"
                    />
                    <button onClick={() => deleteItem(item.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default AdminSchedule;
