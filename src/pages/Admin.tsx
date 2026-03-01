import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import AdminSchedule from "@/components/admin/AdminSchedule";
import AdminClasses from "@/components/admin/AdminClasses";
import AdminPricing from "@/components/admin/AdminPricing";
import AdminContent from "@/components/admin/AdminContent";
import { LogOut } from "lucide-react";

const tabs = ["Schedule", "Classes", "Pricing", "Content"] as const;
type Tab = typeof tabs[number];

const Admin = () => {
  const [activeTab, setActiveTab] = useState<Tab>("Schedule");
  const [loading, setLoading] = useState(true);
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
          <h1 className="font-display text-2xl text-foreground">Prima Admin</h1>
          <button onClick={handleLogout} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-body">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <div className="container mx-auto px-6 flex gap-0">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-sm font-body tracking-[0.1em] uppercase transition-colors border-b-2 ${
                activeTab === tab
                  ? "text-foreground border-foreground"
                  : "text-muted-foreground border-transparent hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-8">
        {activeTab === "Schedule" && <AdminSchedule />}
        {activeTab === "Classes" && <AdminClasses />}
        {activeTab === "Pricing" && <AdminPricing />}
        {activeTab === "Content" && <AdminContent />}
      </div>
    </div>
  );
};

export default Admin;
