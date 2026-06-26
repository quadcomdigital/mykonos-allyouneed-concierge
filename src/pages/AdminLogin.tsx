import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import logoAln from "@/assets/logo-aln.png";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user");

      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin");

      if (!roles || roles.length === 0) {
        await supabase.auth.signOut();
        throw new Error("Non sei autorizzato ad accedere al pannello admin.");
      }

      navigate("/admin");
    } catch (err: any) {
      toast({ title: "Errore", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({ title: "Errore", description: "Inserisci la tua email", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      toast({ title: "Email inviata", description: "Controlla la tua casella email per il link di reset." });
      setForgotMode(false);
    } catch (err: any) {
      toast({ title: "Errore", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-foreground px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src={logoAln} alt="All You Need" className="h-14 w-auto mx-auto brightness-0 invert mb-6" />
          <h1 className="font-serif text-2xl text-primary-foreground mb-2">Admin Panel</h1>
          <p className="text-primary-foreground/50 text-sm">
            {forgotMode ? "Inserisci la tua email per reimpostare la password" : "Accedi per gestire i contenuti"}
          </p>
        </div>
        <form onSubmit={forgotMode ? handleForgotPassword : handleLogin} className="space-y-4 rounded-2xl bg-card p-8 border border-border/20 shadow-xl">
          <div>
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Email</Label>
            <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@allyouneed.com" className="mt-1 rounded-xl" />
          </div>
          {!forgotMode && (
            <div>
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Password</Label>
              <Input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="mt-1 rounded-xl" />
            </div>
          )}
          <Button type="submit" disabled={loading} className="w-full rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground py-5 font-semibold">
            {loading ? "Caricamento..." : forgotMode ? "Invia link di reset" : "Accedi"}
          </Button>
          <button
            type="button"
            onClick={() => setForgotMode(!forgotMode)}
            className="w-full text-center text-sm text-muted-foreground hover:text-primary-foreground transition-colors"
          >
            {forgotMode ? "← Torna al login" : "Password dimenticata?"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
