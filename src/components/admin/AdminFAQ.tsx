import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Trash2, GripVertical, Eye, EyeOff } from "lucide-react";

interface FAQ {
  id: string;
  question_ro: string;
  question_ru: string;
  answer_ro: string;
  answer_ru: string;
  sort_order: number;
  published: boolean;
}

const AdminFAQ = ({ lang }: { lang: "ro" | "ru" }) => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);

  const l = lang === "ro"
    ? { question: "Întrebare", answer: "Răspuns", add: "Adaugă FAQ", noItems: "Niciun FAQ." }
    : { question: "Вопрос", answer: "Ответ", add: "Добавить FAQ", noItems: "Нет FAQ." };

  const fetchFaqs = async () => {
    const { data, error } = await supabase
      .from("faqs")
      .select("*")
      .order("sort_order");
    if (error) toast.error(error.message);
    else setFaqs(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchFaqs(); }, []);

  const addFaq = async () => {
    const maxOrder = faqs.length > 0 ? Math.max(...faqs.map(f => f.sort_order)) + 1 : 0;
    const { error } = await supabase.from("faqs").insert({
      question_ro: "Nouă întrebare",
      question_ru: "Новый вопрос",
      answer_ro: "Răspuns...",
      answer_ru: "Ответ...",
      sort_order: maxOrder,
    });
    if (error) toast.error(error.message);
    else { toast.success(lang === "ro" ? "Adăugat" : "Добавлено"); fetchFaqs(); }
  };

  const updateField = async (id: string, field: string, value: string | boolean) => {
    const { error } = await supabase.from("faqs").update({ [field]: value }).eq("id", id);
    if (error) toast.error(error.message);
  };

  const deleteFaq = async (id: string) => {
    const { error } = await supabase.from("faqs").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success(lang === "ro" ? "Șters" : "Удалено"); fetchFaqs(); }
  };

  const togglePublished = async (faq: FAQ) => {
    await updateField(faq.id, "published", !faq.published);
    setFaqs(prev => prev.map(f => f.id === faq.id ? { ...f, published: !f.published } : f));
  };

  if (loading) return <p className="text-muted-foreground text-sm font-body">Loading...</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl text-foreground">FAQ</h2>
        <button
          onClick={addFaq}
          className="flex items-center gap-2 border border-border px-4 py-2 text-sm font-body text-foreground hover:bg-secondary transition-colors"
        >
          <Plus className="w-4 h-4" /> {l.add}
        </button>
      </div>

      {faqs.length === 0 ? (
        <p className="text-muted-foreground text-sm font-body">{l.noItems}</p>
      ) : (
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={faq.id} className="border border-border p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <GripVertical className="w-4 h-4" />
                  <span className="text-xs font-body">#{index + 1}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => togglePublished(faq)}
                    className={`p-1.5 transition-colors ${faq.published ? "text-foreground" : "text-muted-foreground"}`}
                    title={faq.published ? "Published" : "Draft"}
                  >
                    {faq.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => deleteFaq(faq.id)}
                    className="p-1.5 text-destructive hover:text-destructive/80 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-muted-foreground text-xs font-body mb-1 block">{l.question} (RO)</label>
                  <input
                    defaultValue={faq.question_ro}
                    onBlur={(e) => updateField(faq.id, "question_ro", e.target.value)}
                    className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm font-body focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-muted-foreground text-xs font-body mb-1 block">{l.question} (RU)</label>
                  <input
                    defaultValue={faq.question_ru}
                    onBlur={(e) => updateField(faq.id, "question_ru", e.target.value)}
                    className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm font-body focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-muted-foreground text-xs font-body mb-1 block">{l.answer} (RO)</label>
                  <textarea
                    defaultValue={faq.answer_ro}
                    onBlur={(e) => updateField(faq.id, "answer_ro", e.target.value)}
                    rows={3}
                    className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm font-body focus:outline-none resize-none"
                  />
                </div>
                <div>
                  <label className="text-muted-foreground text-xs font-body mb-1 block">{l.answer} (RU)</label>
                  <textarea
                    defaultValue={faq.answer_ru}
                    onBlur={(e) => updateField(faq.id, "answer_ru", e.target.value)}
                    rows={3}
                    className="w-full bg-secondary border border-border text-foreground px-3 py-2 text-sm font-body focus:outline-none resize-none"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminFAQ;
