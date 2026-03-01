import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast.error("Login failed: " + error.message);
    } else {
      navigate("/admin");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <form onSubmit={handleLogin} className="w-full max-w-sm space-y-6">
        <h1 className="font-display text-3xl text-foreground text-center">Admin Login</h1>
        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-secondary border border-border text-foreground px-4 py-3 text-sm font-body focus:outline-none focus:border-foreground transition-colors"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-secondary border border-border text-foreground px-4 py-3 text-sm font-body focus:outline-none focus:border-foreground transition-colors"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full border border-foreground text-foreground px-4 py-3 text-sm tracking-[0.15em] uppercase font-body hover:bg-foreground hover:text-background transition-all duration-300 disabled:opacity-50"
        >
          {loading ? "..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
