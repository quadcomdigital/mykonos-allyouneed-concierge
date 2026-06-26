import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, Crown, Gem, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/layout/Layout";
import heroImg from "@/assets/concierge-hero-2.png";
import imgConciergeCtaBg from "@/assets/concierge-cta.png";
import imgConcierge from "@/assets/concierge-img.jpg";
import imgMykonos3 from "@/assets/hero-mykonos-luxury-3.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const fullExperienceItems = [
  "Consulenza sulla scelta di villa o appartamento (anche se già individuati)",
  "Supporto nella selezione del mezzo ideale",
  "Programmazione beach club secondo gli eventi settimanali",
  "Selezione ristoranti in base a orari e atmosfera",
  "Coordinamento nightlife nei giorni realmente rilevanti",
  "Calendario personalizzato giorno per giorno",
  "Assistenza diretta e continuativa durante il soggiorno",
];

const selectiveAccessItems = [
  "Accesso riservato ai Beach Club più richiesti",
  "Tavoli VIP in club e discoteche",
  "Ristoranti selezionati",
  "Consulenza strategica sui migliori eventi della settimana",
  "Supporto su mobilità (scooter, quad, auto)",
  "Consulenza su zone strategiche dove alloggiare",
];

const Concierge = () => {
  const [activePackage, setActivePackage] = useState<"full" | "selective" | "">("full");
  const [selectedPackage, setSelectedPackage] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formElements = form.elements as any;
    await supabase.from("bookings").insert({
      service_type: "concierge",
      service_name: selectedPackage || "Non specificato",
      customer_name: `${formElements[0]?.value || ""} ${formElements[1]?.value || ""}`.trim(),
      customer_email: formElements[2]?.value || null,
      customer_phone: formElements[3]?.value || null,
      message: formElements[7]?.value || null,
      source: "whatsapp",
    } as any);
    const msg = encodeURIComponent(`Ciao, vorrei informazioni sul servizio concierge. Pacchetto: ${selectedPackage}`);
    window.open(`https://wa.me/393400000000?text=${msg}`, "_blank");
  };

  const scrollToForm = (pkg: "full" | "selective") => {
    setSelectedPackage(pkg);
    setTimeout(() => {
      document.getElementById("consulenza-form")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <Layout>
      {/* Hero — sfondo Vacanza */}
      <section className="relative h-[70vh] md:h-[85vh] overflow-hidden">
        <motion.img src={heroImg} alt="" className="w-full h-full object-cover" initial={{ scale: 1.15 }} animate={{ scale: 1 }} transition={{ duration: 2.5, ease: "easeOut" }} />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/60 to-primary/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-transparent to-accent/10" />
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 pb-16 md:pb-28">
            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.3 }}>
              <div className="flex items-center gap-3 mb-4 md:mb-6">
                <div className="h-px w-14 bg-accent" />
                <span className="text-accent text-[11px] font-semibold uppercase tracking-[0.4em]">Luxury Concierge</span>
              </div>
              <h1 className="font-serif text-3xl md:text-8xl font-bold text-primary-foreground leading-[0.9] mb-4 md:mb-6 drop-shadow-[0_4px_30px_hsl(var(--primary)/0.5)]">Personalizza la<br />tua Vacanza</h1>
              <p className="text-primary-foreground/70 max-w-lg text-base leading-relaxed">Il tuo soggiorno su misura,<br />coordinato con precisione e stile.</p>
            </motion.div>
          </div>
        </div>
        <div className="absolute bottom-0 left-1/4 w-96 h-48 bg-accent/15 blur-[120px] rounded-full pointer-events-none" />
      </section>

      {/* Intro — immagine Concierge */}
      <section className="relative py-14 md:py-36 bg-background overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-accent/8 blur-[200px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-primary/8 blur-[180px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-accent/3 blur-[150px] pointer-events-none" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
            <motion.div variants={fadeUp} className="md:col-span-7 space-y-7">
              <p className="text-xl md:text-[1.8rem] text-foreground font-serif font-bold leading-tight">
                Mykonos è una delle destinazioni più ambite
                <br />al mondo.
                <br />
                <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">Ma è anche una delle<br />più complesse da vivere correttamente.</span>
              </p>
              <div className="space-y-3 text-base text-muted-foreground leading-relaxed">
                <p>Eventi che cambiano ogni settimana. Location che funzionano solo in determinati giorni. Zone strategiche, altre meno. Scelte che incidono direttamente su budget ed esperienza.</p>
              </div>
              <div className="w-24 h-[2px] bg-gradient-to-r from-accent via-primary to-accent/30" />
              <div className="space-y-3 text-base text-muted-foreground leading-relaxed">
                <p className="text-foreground font-semibold text-lg">All You Need coordina la tua permanenza sull'isola con metodo, presenza reale e conoscenza diretta del territorio.</p>
                <p>Non semplici prenotazioni. <span className="text-foreground font-semibold">Una pianificazione strutturata.</span></p>
              </div>
            </motion.div>
            <motion.div variants={fadeUp} className="md:col-span-5">
              <div className="relative rounded-[2.5rem] overflow-hidden aspect-[3/4] shadow-[0_30px_80px_-15px_hsl(var(--accent)/0.25)]">
                <img src={imgConcierge} alt="Mykonos concierge" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-accent/10" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Packages */}
      <section className="relative py-8 md:py-16 bg-background overflow-hidden">
        <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-accent/5 blur-[200px] pointer-events-none" />
        <div className="absolute top-20 right-0 w-[400px] h-[400px] bg-primary/5 blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute bottom-20 left-0 w-[300px] h-[300px] bg-accent/8 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-10 md:mb-16">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="h-4 w-4 text-accent" />
              <span className="text-accent text-[10px] uppercase tracking-[0.4em] font-medium">Due soluzioni, un unico standard</span>
            </div>
            <h2 className="font-ultra text-3xl md:text-6xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent leading-tight mb-4">Scegli il tuo<br />pacchetto</h2>
            <p className="font-sans text-muted-foreground/80 mt-3 max-w-lg mx-auto text-lg">Due livelli di consulenza pensati<br />per esigenze diverse.</p>
          </motion.div>

          {/* Mobile: Toggle between packages */}
          <div className="lg:hidden">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="flex items-center justify-center mb-8">
              <div className="relative flex rounded-full bg-muted/60 backdrop-blur-sm border border-border/50 p-1">
                <button
                  onClick={() => setActivePackage("full")}
                  className={`relative z-10 px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-[0.15em] transition-all duration-500 ${
                    activePackage === "full" ? "text-primary-foreground" : "text-muted-foreground"
                  }`}
                >
                  {activePackage === "full" && (
                    <motion.div layoutId="activeTab" className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-accent shadow-lg shadow-accent/20" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5"><Crown className="h-3 w-3" /> Full Experience</span>
                </button>
                <button
                  onClick={() => setActivePackage("selective")}
                  className={`relative z-10 px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-[0.15em] transition-all duration-500 ${
                    activePackage === "selective" ? "text-primary-foreground" : "text-muted-foreground"
                  }`}
                >
                  {activePackage === "selective" && (
                    <motion.div layoutId="activeTab" className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-accent shadow-lg shadow-accent/20" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5"><Gem className="h-3 w-3" /> Selective Access</span>
                </button>
              </div>
            </motion.div>

            <AnimatePresence mode="wait">
              {activePackage === "full" ? (
                <motion.div
                  key="full"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 30 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="relative rounded-[2rem] overflow-hidden cursor-pointer active:scale-[0.98] transition-transform" onClick={() => scrollToForm("full")}>
                    <div className="absolute inset-0">
                      <img src={imgMykonos3} alt="" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-foreground/90" />
                      <div className="absolute top-[20%] right-[10%] w-[200px] h-[200px] rounded-full bg-accent/15 blur-[80px]" />
                    </div>
                    <div className="relative p-7 flex flex-col">
                      <div className="flex items-center justify-between mb-6">
                        <span className="text-accent text-[9px] uppercase tracking-[0.4em] font-medium">Pacchetto 01</span>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground text-[9px] font-bold uppercase tracking-widest shadow-lg shadow-accent/20">
                          <Crown className="h-2.5 w-2.5" /> Più scelto
                        </span>
                      </div>
                      <h3 className="font-serif text-2xl font-bold text-primary-foreground leading-[0.95] mb-2">Signature Full Experience</h3>
                      <p className="text-primary-foreground/50 text-sm mb-8">La tua vacanza a Mykonos pianificata con precisione.</p>
                      <p className="text-primary-foreground/60 text-[10px] font-semibold uppercase tracking-[0.3em] mb-5">Un servizio di pianificazione integrale:</p>
                      <div className="space-y-3 mb-8">
                        {fullExperienceItems.map((item, i) => (
                          <div key={i} className="flex items-start gap-3">
                            <div className="w-5 h-5 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center shrink-0 mt-0.5 shadow-lg shadow-accent/20">
                              <Check className="h-3 w-3 text-primary-foreground" />
                            </div>
                            <p className="text-primary-foreground/70 text-sm leading-relaxed">{item}</p>
                          </div>
                        ))}
                      </div>
                      <div className="border-t border-primary-foreground/10 pt-6 space-y-3">
                        <p className="text-primary-foreground/60 text-sm leading-relaxed italic">"Ogni dettaglio viene strutturato per ottimizzare tempo, budget ed esperienza."</p>
                        <p className="text-primary-foreground text-sm font-semibold">La maggior parte dei nostri clienti sceglie questa soluzione.</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="selective"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="relative rounded-[2rem] overflow-hidden bg-card border border-border/50 p-7 flex flex-col cursor-pointer active:scale-[0.98] transition-transform" onClick={() => scrollToForm("selective")}>
                    <div className="absolute top-0 right-0 w-[250px] h-[250px] rounded-full bg-accent/8 blur-[100px] pointer-events-none" />
                    <span className="text-accent text-[9px] uppercase tracking-[0.4em] font-medium mb-6 relative z-10">Pacchetto 02</span>
                    <h3 className="font-serif text-2xl font-bold text-foreground leading-[0.95] mb-2 relative z-10">Selective Access</h3>
                    <p className="text-muted-foreground text-sm mb-8 relative z-10">Per chi ha già organizzato parte del viaggio e desidera un intervento mirato.</p>
                    <p className="text-muted-foreground text-[10px] font-semibold uppercase tracking-[0.3em] mb-5 relative z-10">Supporto esclusivo per:</p>
                    <div className="space-y-3 mb-8 relative z-10">
                      {selectiveAccessItems.map((item, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className="w-5 h-5 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0 mt-0.5">
                            <Gem className="h-3 w-3 text-accent" />
                          </div>
                          <p className="text-muted-foreground text-sm leading-relaxed">{item}</p>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-border/50 pt-6 relative z-10">
                      <p className="text-foreground font-serif text-lg font-bold leading-snug">
                        Lo stesso standard. La stessa precisione.<br /><span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">Applicata solo dove serve.</span>
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Desktop: side by side */}
          <div className="hidden lg:grid grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Package 1 — Signature Full Experience */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <div className="relative rounded-[2.5rem] overflow-hidden h-full hover:shadow-[0_30px_80px_-20px_hsl(var(--accent)/0.2)] transition-all duration-700 cursor-pointer" onClick={() => scrollToForm("full")}>
                <div className="absolute inset-0">
                  <img src={imgMykonos3} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-foreground/90" />
                  <div className="absolute top-[20%] right-[10%] w-[250px] h-[250px] rounded-full bg-accent/15 blur-[100px]" />
                  <div className="absolute bottom-[10%] left-[5%] w-[200px] h-[200px] rounded-full bg-primary/10 blur-[80px]" />
                </div>
                <div className="relative p-8 md:p-12 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-8">
                    <span className="text-accent text-[10px] uppercase tracking-[0.4em] font-medium">Pacchetto 01</span>
                    <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-accent/20">
                      <Crown className="h-3 w-3" /> Più scelto
                    </span>
                  </div>
                  <h3 className="font-serif text-3xl md:text-5xl font-bold text-primary-foreground leading-[0.95] mb-3">Signature<br />Full Experience</h3>
                  <p className="text-primary-foreground/50 text-base mb-10">La tua vacanza a Mykonos pianificata con precisione.</p>
                  <p className="text-primary-foreground/60 text-xs font-semibold uppercase tracking-[0.3em] mb-6">Un servizio di pianificazione integrale:</p>
                  <div className="space-y-4 flex-1 mb-10">
                    {fullExperienceItems.map((item, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center shrink-0 mt-0.5 shadow-lg shadow-accent/20">
                          <Check className="h-3.5 w-3.5 text-primary-foreground" />
                        </div>
                        <p className="text-primary-foreground/70 text-sm leading-relaxed">{item}</p>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-primary-foreground/10 pt-8 space-y-4">
                    <p className="text-primary-foreground/60 text-sm leading-relaxed italic">"Ogni dettaglio viene strutturato per ottimizzare tempo, budget ed esperienza."</p>
                    <p className="text-primary-foreground text-sm font-semibold">La maggior parte dei nostri clienti sceglie questa soluzione per arrivare sull'isola con controllo totale e tranquillità assoluta.</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Package 2 — Selective Access */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <div className="relative rounded-[2.5rem] overflow-hidden bg-card border border-border/50 p-8 md:p-12 flex flex-col h-full hover:border-accent/30 hover:shadow-[0_30px_80px_-20px_hsl(var(--accent)/0.15)] transition-all duration-700 cursor-pointer" onClick={() => scrollToForm("selective")}>
                <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full bg-accent/8 blur-[120px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[200px] h-[200px] rounded-full bg-primary/5 blur-[100px] pointer-events-none" />
                <span className="text-accent text-[10px] uppercase tracking-[0.4em] font-medium mb-8 relative z-10">Pacchetto 02</span>
                <h3 className="font-serif text-3xl md:text-5xl font-bold text-foreground leading-[0.95] mb-3 relative z-10">Selective<br />Access</h3>
                <p className="text-muted-foreground text-base mb-10 relative z-10">Per chi ha già organizzato parte del viaggio e desidera un intervento mirato.</p>
                <p className="text-muted-foreground text-xs font-semibold uppercase tracking-[0.3em] mb-6 relative z-10">Supporto esclusivo per:</p>
                <div className="space-y-4 flex-1 mb-10 relative z-10">
                  {selectiveAccessItems.map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0 mt-0.5">
                        <Gem className="h-3.5 w-3.5 text-accent" />
                      </div>
                      <p className="text-muted-foreground text-sm leading-relaxed">{item}</p>
                    </div>
                  ))}
                </div>
                <div className="border-t border-border/50 pt-8 relative z-10">
                  <p className="text-foreground font-serif text-xl font-bold leading-snug">
                    Lo stesso standard.<br />La stessa precisione.<br /><span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">Applicata solo dove serve.</span>
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA divider */}
      <section className="relative h-[50vh] md:h-[60vh] overflow-hidden mt-8 md:mt-16">
        <img src={imgConciergeCtaBg} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/40 to-primary/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-accent/10" />
        <div className="absolute bottom-[20%] left-[30%] w-[400px] h-[400px] rounded-full bg-accent/15 blur-[150px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-32 bg-accent/10 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center px-6 max-w-2xl">
            <motion.p variants={fadeUp} className="text-primary-foreground/70 text-base leading-relaxed mb-4">Richiedi la tua consulenza riservata.</motion.p>
            <motion.h2 variants={fadeUp} className="font-serif text-2xl md:text-4xl text-primary-foreground leading-tight mb-4 drop-shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
              Mykonos premia<br />chi sa muoversi.
            </motion.h2>
            <motion.h2 variants={fadeUp} className="font-serif text-xl md:text-3xl leading-tight mb-8">
              <span className="bg-gradient-to-r from-accent to-sky-300 bg-clip-text text-transparent font-bold drop-shadow-[0_2px_20px_hsl(var(--accent)/0.4)]">All You Need ti mette<br />nella posizione giusta.</span>
            </motion.h2>
          </motion.div>
        </div>
      </section>

      {/* Contact form */}
      <section id="consulenza-form" className="relative py-16 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-accent/80" />
        <div className="absolute inset-0 opacity-15" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, hsl(var(--accent)) 0%, transparent 50%), radial-gradient(circle at 80% 20%, hsl(var(--primary-foreground)) 0%, transparent 40%)' }} />
        <div className="absolute top-0 left-1/3 w-[400px] h-[300px] bg-accent/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative container mx-auto px-4 max-w-3xl z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.div variants={fadeUp} className="text-center mb-12">
              <span className="inline-block px-5 py-2 rounded-full bg-primary-foreground/15 text-primary-foreground text-xs font-semibold uppercase tracking-[0.3em] mb-6 backdrop-blur-sm border border-primary-foreground/10">Consulenza Riservata</span>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary-foreground drop-shadow-[0_4px_20px_hsl(var(--accent)/0.3)]">Richiedi la tua consulenza</h2>
              <p className="text-primary-foreground/60 mt-3 text-lg">Analizzeremo il tuo soggiorno e definiremo il livello di coordinamento più adatto al tuo profilo.</p>
            </motion.div>

            <motion.form variants={fadeUp} onSubmit={handleSubmit} className="space-y-6">
              <div className="rounded-2xl bg-primary-foreground/10 backdrop-blur-md border border-primary-foreground/15 p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><Label className="text-primary-foreground/80 text-xs uppercase tracking-wider">Nome</Label><Input required placeholder="Mario" className="mt-1 bg-primary-foreground/10 border-primary-foreground/15 text-primary-foreground placeholder:text-primary-foreground/30 rounded-xl" /></div>
                  <div><Label className="text-primary-foreground/80 text-xs uppercase tracking-wider">Cognome</Label><Input required placeholder="Rossi" className="mt-1 bg-primary-foreground/10 border-primary-foreground/15 text-primary-foreground placeholder:text-primary-foreground/30 rounded-xl" /></div>
                  <div><Label className="text-primary-foreground/80 text-xs uppercase tracking-wider">Email</Label><Input type="email" required placeholder="mario@email.com" className="mt-1 bg-primary-foreground/10 border-primary-foreground/15 text-primary-foreground placeholder:text-primary-foreground/30 rounded-xl" /></div>
                  <div><Label className="text-primary-foreground/80 text-xs uppercase tracking-wider">Telefono</Label><Input type="tel" required placeholder="+39 333 1234567" className="mt-1 bg-primary-foreground/10 border-primary-foreground/15 text-primary-foreground placeholder:text-primary-foreground/30 rounded-xl" /></div>
                </div>
              </div>

              <div className="rounded-2xl bg-primary-foreground/10 backdrop-blur-md border border-primary-foreground/15 p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><Label className="text-primary-foreground/80 text-xs uppercase tracking-wider">Date di viaggio</Label><Input required placeholder="es. 15 Luglio - 25 Luglio" className="mt-1 bg-primary-foreground/10 border-primary-foreground/15 text-primary-foreground placeholder:text-primary-foreground/30 rounded-xl" /></div>
                  <div><Label className="text-primary-foreground/80 text-xs uppercase tracking-wider">Numero ospiti</Label><Input type="number" min="1" required placeholder="4" className="mt-1 bg-primary-foreground/10 border-primary-foreground/15 text-primary-foreground placeholder:text-primary-foreground/30 rounded-xl" /></div>
                </div>
                <div>
                  <Label className="text-primary-foreground/80 text-xs uppercase tracking-wider">Pacchetto di interesse</Label>
                  <select value={selectedPackage} onChange={(e) => setSelectedPackage(e.target.value)} required className="w-full mt-1 px-4 py-2.5 bg-primary-foreground/10 border border-primary-foreground/15 text-primary-foreground rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/50">
                    <option value="" className="text-foreground">Seleziona...</option>
                    <option value="full" className="text-foreground">Signature Full Experience</option>
                    <option value="selective" className="text-foreground">Selective Access</option>
                    <option value="undecided" className="text-foreground">Non ho ancora deciso</option>
                  </select>
                </div>
                <div>
                  <Label className="text-primary-foreground/80 text-xs uppercase tracking-wider">Raccontaci le tue esigenze</Label>
                  <Textarea required placeholder="Cosa ti aspetti dalla vacanza, preferenze, esigenze speciali..." className="mt-1 bg-primary-foreground/10 border-primary-foreground/15 text-primary-foreground placeholder:text-primary-foreground/30 rounded-xl min-h-[120px]" />
                </div>
              </div>

              <Button type="submit" size="lg" className="w-full rounded-full bg-gradient-to-r from-primary-foreground to-primary-foreground/90 text-primary py-6 text-base font-semibold hover:shadow-[0_10px_40px_-10px_hsl(var(--accent)/0.4)] transition-all duration-300">
                Invia Richiesta <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.form>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Concierge;
