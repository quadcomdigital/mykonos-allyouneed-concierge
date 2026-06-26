import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import logoAln from "@/assets/logo-aln.png";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes("type=recovery")) {
      setReady(true);
    }
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setReady(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      toast({ title: "Errore", description: "Le password non coincidono", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast({ title: "Fatto", description: "Password aggiornata con successo. Puoi ora accedere." });
      setTimeout(() => window.location.href = "/admin/login", 2000);
    } catch (err: any) {
      toast({ title: "Errore", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-foreground px-4">
        <p className="text-primary-foreground/70">Link non valido o scaduto.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-foreground px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src={logoAln} alt="All You Need" className="h-14 w-auto mx-auto brightness-0 invert mb-6" />
          <h1 className="font-serif text-2xl text-primary-foreground mb-2">Nuova Password</h1>
        </div>
        <form onSubmit={handleReset} className="space-y-4 rounded-2xl bg-card p-8 border border-border/20 shadow-xl">
          <div>
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Nuova password</Label>
            <Input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="mt-1 rounded-xl" />
          </div>
          <div>
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Conferma password</Label>
            <Input type="password" required minLength={6} value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="••••••••" className="mt-1 rounded-xl" />
          </div>
          <Button type="submit" disabled={loading} className="w-full rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground py-5 font-semibold">
            {loading ? "Aggiornamento..." : "Aggiorna password"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
