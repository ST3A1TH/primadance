import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import AdminSchedule from "@/components/admin/AdminSchedule";
import AdminClasses from "@/components/admin/AdminClasses";
import AdminContent from "@/components/admin/AdminContent";
import AdminBookings from "@/components/admin/AdminBookings";
import AdminBlog from "@/components/admin/AdminBlog";
import AdminSEO from "@/components/admin/AdminSEO";
import AdminFAQ from "@/components/admin/AdminFAQ";
import AdminGallery from "@/components/admin/AdminGallery";
import { LogOut, Globe } from "lucide-react";

const tabs = ["Bookings", "Schedule", "Classes", "Content", "Gallery", "Blog", "SEO"] as const;
type Tab = typeof tabs[number];

const tabLabels: Record<"ro" | "ru", Record<Tab, string>> = {
  ro: { Bookings: "Rezervări", Schedule: "Orar", Classes: "Cursuri", Content: "Conținut", Gallery: "Galerie", Blog: "Blog", SEO: "SEO" },
  ru: { Bookings: "Записи", Schedule: "Расписание", Classes: "Занятия", Content: "Контент", Gallery: "Галерея", Blog: "Блог", SEO: "SEO" },
};

const Admin = () => {
  const [activeTab, setActiveTab] = useState<Tab>("Bookings");
  const [loading, setLoading] = useState(true);
  const [adminLang, setAdminLang] = useState<"ro" | "ru">("ro");
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/admin/login");
        return;
      }
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin");
      
      if (!roles || roles.length === 0) {
        toast.error("Access denied");
        await supabase.auth.signOut();
        navigate("/admin/login");
        return;
      }
      setLoading(false);
    };
    checkAdmin();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground font-body text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="font-display text-2xl text-foreground">Prima Dance Admin</h1>
          <div className="flex items-center gap-4">
            {/* Language Selector */}
            <button
              onClick={() => setAdminLang(adminLang === "ro" ? "ru" : "ro")}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-body"
            >
              <Globe className="w-4 h-4" />
              <span className="text-xs tracking-[0.15em] uppercase">{adminLang === "ro" ? "RU" : "RO"}</span>
            </button>
            <button onClick={handleLogout} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-body">
              <LogOut className="w-4 h-4" /> {adminLang === "ro" ? "Deconectare" : "Выйти"}
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border overflow-x-auto">
        <div className="container mx-auto px-6 flex gap-0 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-3 text-sm font-body tracking-[0.1em] uppercase transition-colors border-b-2 whitespace-nowrap ${
                activeTab === tab
                  ? "text-foreground border-foreground"
                  : "text-muted-foreground border-transparent hover:text-foreground"
              }`}
            >
              {tabLabels[adminLang][tab]}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-8">
        {activeTab === "Bookings" && <AdminBookings />}
        {activeTab === "Schedule" && <AdminSchedule />}
        {activeTab === "Classes" && <AdminClasses />}
        {activeTab === "Content" && <AdminContent />}
        {activeTab === "Gallery" && <AdminGallery lang={adminLang} />}
        {activeTab === "Blog" && <AdminBlog lang={adminLang} />}
        {activeTab === "SEO" && <AdminSEO lang={adminLang} />}
      </div>
    </div>
  );
};

export default Admin;
