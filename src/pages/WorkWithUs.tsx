import { useState } from "react";
import { motion } from "framer-motion";
import { User, Briefcase, Languages, Clock, Home, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/i18n/LanguageContext";
import Layout from "@/components/layout/Layout";
import heroImg2 from "@/assets/hero-mykonos-2.jpg";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const roles = [
  "Hostess / Steward",
  "Tour Guide",
  "Driver / Autista",
  "Promoter",
  "Event Coordinator",
  "Social Media Manager",
  "Receptionist",
  "Bartender",
  "Chef",
  "Altro",
];

const englishLevels = ["Base", "Intermedio", "Avanzato", "Madrelingua"];

const WorkWithUs = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [availability, setAvailability] = useState("");
  const [hasAccommodation, setHasAccommodation] = useState<string>("");
  const [workedInMykonos, setWorkedInMykonos] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formElements = form.elements as any;
    const { error } = await supabase.from("bookings").insert({
      service_type: "candidatura",
      service_name: formElements[6]?.value || "Non specificato",
      customer_name: `${formElements[0]?.value || ""} ${formElements[1]?.value || ""}`.trim(),
      customer_email: formElements[4]?.value || null,
      customer_phone: formElements[3]?.value || null,
      message: `Disponibilità: ${availability}, Alloggio: ${hasAccommodation}, Exp Mykonos: ${workedInMykonos}`,
      source: "website",
    } as any);
    if (error) {
      toast({ title: "Errore", description: "Riprova più tardi.", variant: "destructive" });
      return;
    }
    toast({
      title: "Candidatura inviata!",
      description: "Grazie per il tuo interesse. Ti contatteremo presto.",
    });
  };

  const inputClasses = "bg-primary-foreground/10 border-primary-foreground/15 text-primary-foreground placeholder:text-primary-foreground/30 rounded-xl";
  const labelClasses = "text-primary-foreground/80 text-xs uppercase tracking-wider";

  return (
    <Layout>
      {/* Hero — cinematic */}
      <section className="relative h-[55vh] overflow-hidden">
        <img src={heroImg2} alt="" className="w-full h-full object-cover scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/30 to-foreground/20" />
        <div className="absolute inset-0 flex items-center justify-center text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-5 py-2 rounded-full bg-accent/20 backdrop-blur-md text-accent text-xs font-semibold uppercase tracking-[0.3em] mb-6 border border-accent/30">
              Join The Team
            </span>
            <h1 className="font-serif text-3xl md:text-7xl font-bold text-primary-foreground drop-shadow-2xl">
              {t("workWithUs.title")}
            </h1>
            <p className="text-primary-foreground/60 mt-4 max-w-lg mx-auto text-lg">
              Unisciti al team All You Need e vivi un'estate indimenticabile a Mykonos
            </p>
          </motion.div>
        </div>
      </section>

      {/* Form — luxury gradient */}
      <section className="relative py-16 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-accent" />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, hsl(var(--accent)) 0%, transparent 50%), radial-gradient(circle at 80% 20%, hsl(var(--primary-foreground)) 0%, transparent 40%)' }} />
        
        <div className="relative container mx-auto px-4 max-w-3xl z-10">
          <motion.form
            initial="hidden"
            animate="visible"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Personal info */}
            <motion.div variants={fadeUp} className="rounded-2xl bg-primary-foreground/10 backdrop-blur-md border border-primary-foreground/15 p-6 space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2 text-primary-foreground">
                <User className="h-5 w-5 text-accent" /> Dati Personali
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><Label className={labelClasses}>Nome</Label><Input required placeholder="Mario" className={inputClasses} /></div>
                <div><Label className={labelClasses}>Cognome</Label><Input required placeholder="Rossi" className={inputClasses} /></div>
                <div><Label className={labelClasses}>Data di nascita</Label><Input type="date" required className={inputClasses} /></div>
                <div><Label className={labelClasses}>Nazionalità</Label><Input required placeholder="Italiana" className={inputClasses} /></div>
                <div><Label className={labelClasses}>Città di residenza</Label><Input required placeholder="Roma" className={inputClasses} /></div>
                <div><Label className={labelClasses}>Telefono</Label><Input type="tel" required placeholder="+39 333 1234567" className={inputClasses} /></div>
                <div className="md:col-span-2"><Label className={labelClasses}>Email</Label><Input type="email" required placeholder="mario@email.com" className={inputClasses} /></div>
              </div>
            </motion.div>

            {/* Role */}
            <motion.div variants={fadeUp} className="rounded-2xl bg-primary-foreground/10 backdrop-blur-md border border-primary-foreground/15 p-6 space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2 text-primary-foreground">
                <Briefcase className="h-5 w-5 text-accent" /> Ruolo
              </h3>
              <div>
                <Label className={labelClasses}>Per quale ruolo ti candidi?</Label>
                <select required className={`w-full h-10 rounded-xl px-3 py-2 text-sm ${inputClasses} border mt-1`}>
                  <option value="">Seleziona un ruolo...</option>
                  {roles.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </motion.div>

            {/* Experience */}
            <motion.div variants={fadeUp} className="rounded-2xl bg-primary-foreground/10 backdrop-blur-md border border-primary-foreground/15 p-6 space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2 text-primary-foreground">
                <FileText className="h-5 w-5 text-accent" /> Profilo Professionale
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className={labelClasses}>Hai esperienza in questo ruolo?</Label>
                  <select required className={`w-full h-10 rounded-xl px-3 py-2 text-sm ${inputClasses} border mt-1`}>
                    <option value="">Seleziona...</option>
                    <option value="si">Sì</option>
                    <option value="no">No</option>
                  </select>
                </div>
                <div>
                  <Label className={labelClasses}>Anni di esperienza</Label>
                  <Input type="number" min="0" placeholder="0" className={inputClasses} />
                </div>
              </div>
            </motion.div>

            {/* Languages */}
            <motion.div variants={fadeUp} className="rounded-2xl bg-primary-foreground/10 backdrop-blur-md border border-primary-foreground/15 p-6 space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2 text-primary-foreground">
                <Languages className="h-5 w-5 text-accent" /> Lingue
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className={labelClasses}>Lingue parlate</Label>
                  <Input required placeholder="Italiano, Inglese, Greco..." className={inputClasses} />
                </div>
                <div>
                  <Label className={labelClasses}>Livello di inglese</Label>
                  <div className="flex flex-wrap gap-3 mt-2">
                    {englishLevels.map((lvl) => (
                      <label key={lvl} className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="english_level" value={lvl} required className="accent-accent" />
                        <span className="text-sm text-primary-foreground/70">{lvl}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Availability & Mykonos */}
            <motion.div variants={fadeUp} className="rounded-2xl bg-primary-foreground/10 backdrop-blur-md border border-primary-foreground/15 p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2 text-primary-foreground mb-4">
                  <Clock className="h-5 w-5 text-accent" /> Disponibilità
                </h3>
                <div className="flex flex-wrap gap-3">
                  {["Full-time", "Part-time"].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setAvailability(opt)}
                      className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                        availability === opt
                          ? "bg-accent text-accent-foreground shadow-lg shadow-accent/30"
                          : "bg-primary-foreground/10 text-primary-foreground/70 hover:bg-primary-foreground/20 border border-primary-foreground/15"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-primary-foreground/10 pt-6">
                <h3 className="text-lg font-semibold flex items-center gap-2 text-primary-foreground mb-4">
                  <Home className="h-5 w-5 text-accent" /> Mykonos
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className={labelClasses}>Hai un alloggio a Mykonos?</Label>
                    <div className="flex gap-3 mt-2">
                      {["Sì", "No"].map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setHasAccommodation(opt)}
                          className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                            hasAccommodation === opt
                              ? "bg-accent text-accent-foreground shadow-lg shadow-accent/30"
                              : "bg-primary-foreground/10 text-primary-foreground/70 hover:bg-primary-foreground/20 border border-primary-foreground/15"
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label className={labelClasses}>Hai già lavorato sull'isola?</Label>
                    <div className="flex gap-3 mt-2">
                      {["Sì", "No"].map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setWorkedInMykonos(opt)}
                          className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                            workedInMykonos === opt
                              ? "bg-accent text-accent-foreground shadow-lg shadow-accent/30"
                              : "bg-primary-foreground/10 text-primary-foreground/70 hover:bg-primary-foreground/20 border border-primary-foreground/15"
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Free text */}
            <motion.div variants={fadeUp} className="rounded-2xl bg-primary-foreground/10 backdrop-blur-md border border-primary-foreground/15 p-6 space-y-4">
              <Label className={labelClasses}>Raccontaci di te</Label>
              <Textarea
                placeholder="Parlaci delle tue esperienze, motivazioni e perché vorresti lavorare con noi..."
                className={`${inputClasses} min-h-[120px]`}
                required
              />
            </motion.div>

            <motion.div variants={fadeUp}>
              <Button
                type="submit"
                size="lg"
                className="w-full rounded-full bg-primary-foreground text-primary py-6 text-base font-semibold hover:bg-primary-foreground/90 shadow-xl"
              >
                Invia Candidatura
              </Button>
            </motion.div>
          </motion.form>
        </div>
      </section>
    </Layout>
  );
};

export default WorkWithUs;
