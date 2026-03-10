import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Trash2, Upload, Image } from "lucide-react";

interface GalleryImage {
  id: string;
  image_url: string;
  alt_text: string;
  sort_order: number;
}

const AdminGallery = ({ lang }: { lang: "ro" | "ru" }) => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchImages = async () => {
    const { data, error } = await supabase
      .from("gallery_images")
      .select("*")
      .order("sort_order");
    if (error) toast.error(error.message);
    else setImages(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchImages(); }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error(lang === "ro" ? "Fișierul este prea mare (max 5MB)" : "Файл слишком большой (макс 5MB)");
      return;
    }

    setUploading(true);
    const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    
    const { error: uploadError } = await supabase.storage
      .from("gallery")
      .upload(fileName, file);

    if (uploadError) {
      toast.error(uploadError.message);
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from("gallery").getPublicUrl(fileName);
    const maxOrder = images.reduce((max, i) => Math.max(max, i.sort_order), -1);

    const { error: insertError } = await supabase.from("gallery_images").insert({
      image_url: urlData.publicUrl,
      alt_text: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
      sort_order: maxOrder + 1,
    });

    if (insertError) toast.error(insertError.message);
    else {
      toast.success(lang === "ro" ? "Imagine încărcată" : "Изображение загружено");
      fetchImages();
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const updateAlt = async (id: string, alt_text: string) => {
    const { error } = await supabase.from("gallery_images").update({ alt_text }).eq("id", id);
    if (error) toast.error(error.message);
    else toast.success(lang === "ro" ? "Salvat" : "Сохранено");
  };

  const deleteImage = async (img: GalleryImage) => {
    // Extract filename from URL
    const parts = img.image_url.split("/");
    const fileName = parts[parts.length - 1];
    
    await supabase.storage.from("gallery").remove([fileName]);
    const { error } = await supabase.from("gallery_images").delete().eq("id", img.id);
    if (error) toast.error(error.message);
    else {
      toast.success(lang === "ro" ? "Șters" : "Удалено");
      fetchImages();
    }
  };

  const labels = {
    ro: { upload: "Încarcă imagine", alt: "Text alternativ (SEO)", empty: "Nu există imagini. Încarcă prima imagine." },
    ru: { upload: "Загрузить изображение", alt: "Альтернативный текст (SEO)", empty: "Нет изображений. Загрузите первое изображение." },
  };
  const l = labels[lang];

  if (loading) return <p className="text-muted-foreground text-sm">Loading...</p>;

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleUpload}
          accept="image/*"
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 border border-foreground text-foreground px-4 py-2 text-sm font-body hover:bg-foreground hover:text-background transition-all disabled:opacity-50"
        >
          <Upload className="w-4 h-4" /> {uploading ? "..." : l.upload}
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((img) => (
          <div key={img.id} className="border border-border overflow-hidden group">
            <div className="aspect-square relative">
              <img
                src={img.image_url}
                alt={img.alt_text}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => deleteImage(img)}
                className="absolute top-2 right-2 bg-background/80 p-1.5 text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="p-2">
              <input
                defaultValue={img.alt_text}
                onBlur={(e) => updateAlt(img.id, e.target.value)}
                placeholder={l.alt}
                className="w-full bg-secondary border border-border text-foreground px-2 py-1 text-xs font-body focus:outline-none"
              />
            </div>
          </div>
        ))}
      </div>

      {images.length === 0 && (
        <div className="text-center py-12 border border-dashed border-border">
          <Image className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground text-sm font-body italic">{l.empty}</p>
        </div>
      )}
    </div>
  );
};

export default AdminGallery;
