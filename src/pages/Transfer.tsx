import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CarTaxiFront, ArrowRight, Shield, Sparkles, Crown, Users, Check, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/i18n/LanguageContext";
import Layout from "@/components/layout/Layout";
import heroImg from "@/assets/transfer-hero.jpg";
import imgTaxi from "@/assets/taxi-divider.jpg";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const Transfer = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'standard' | 'premium'>('standard');
  const [selectedService, setSelectedService] = useState("");
  const formRef = useRef<HTMLDivElement>(null);

  const scrollToForm = (service: string) => {
    setSelectedService(service);
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formElements = form.elements as any;
    // Save to CRM
    await supabase.from("bookings").insert({
      service_type: "transfer",
      service_name: selectedService,
      customer_name: `${formElements[0]?.value || ""} ${formElements[1]?.value || ""}`.trim(),
      customer_email: formElements[3]?.value || null,
      customer_phone: formElements[2]?.value || null,
      message: `Servizio: ${selectedService}`,
      source: "whatsapp",
    } as any);
    // Open WhatsApp
    const msg = encodeURIComponent(`Ciao, vorrei richiedere un transfer. Servizio: ${selectedService}`);
    window.open(`https://wa.me/393400000000?text=${msg}`, "_blank");
  };

  const serviceOptions = [
    "1 corsa Standard (1-4 persone)",
    "3 corse Standard (1-4 persone)",
    "5 corse Standard (1-4 persone)",
    "10 corse Standard (1-4 persone)",
    "1 corsa Premium (5-8 persone)",
    "3 corse Premium (5-8 persone)",
    "5 corse Premium (5-8 persone)",
    "10 corse Premium (5-8 persone)",
  ];

  return (
    <Layout>
      {/* Hero */}
      <section className="relative h-[50vh] md:h-[85vh] overflow-hidden">
        <motion.img src={heroImg} alt="Mercedes V-Class transfer di lusso" className="w-full h-full object-cover" initial={{ scale: 1.15 }} animate={{ scale: 1 }} transition={{ duration: 2.5, ease: "easeOut" }} />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/60 to-primary/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-transparent to-accent/10" />
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 pb-10 md:pb-28">
            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.3 }}>
              <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-6">
                <div className="h-px w-10 md:w-14 bg-accent" />
                <span className="text-accent text-[9px] md:text-[11px] font-semibold uppercase tracking-[0.4em]">Private Luxury Service</span>
              </div>
              <h1 className="font-serif text-3xl md:text-8xl font-bold text-primary-foreground leading-[0.9] mb-3 md:mb-6 drop-shadow-[0_4px_30px_hsl(var(--primary)/0.5)]">
                Taxi &<br />Transfer
              </h1>
              <p className="text-primary-foreground/70 max-w-lg text-xs md:text-lg leading-relaxed">
                <span className="block">Viaggia con comfort e stile</span>
                <span className="block">su tutta l'isola</span>
              </p>
            </motion.div>
          </div>
        </div>
        <div className="absolute bottom-0 left-1/4 w-96 h-48 bg-accent/15 blur-[120px] rounded-full pointer-events-none" />
      </section>

      {/* Stats bar */}
      <section className="relative -mt-8 md:-mt-12 z-20 pb-6 md:pb-8">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }}
            className="max-w-4xl mx-auto rounded-2xl bg-card/90 backdrop-blur-xl border border-accent/10 shadow-[0_20px_60px_-15px_hsl(var(--accent)/0.15)] p-4 md:p-8">
            <div className="grid grid-cols-4 gap-2 md:gap-6 text-center">
              {[
                { num: "24/7", label: "Disponibilità" },
                { num: "15 min", label: "Arrivo" },
                { num: "100%", label: "Affidabilità" },
                { num: "VIP", label: "Premium" },
              ].map((s) => (
                <div key={s.label}>
                  <span className="block text-sm md:text-2xl font-serif font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">{s.num}</span>
                  <span className="text-[7px] md:text-[10px] text-muted-foreground uppercase tracking-wider">{s.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services — Packages */}
      <section className="py-10 md:py-28 bg-background relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.div variants={fadeUp} className="text-center mb-6 md:mb-10">
              <div className="flex items-center justify-center gap-2 mb-3 md:mb-4">
                <Crown className="h-3 w-3 md:h-4 md:w-4 text-accent" />
                <span className="text-accent text-[9px] md:text-[10px] uppercase tracking-[0.4em] font-medium">Mykonos Transfer</span>
              </div>
              <h2 className="font-serif text-2xl md:text-6xl font-bold bg-gradient-to-r from-foreground via-foreground to-accent/70 bg-clip-text text-transparent">I Nostri Servizi</h2>
            </motion.div>

            {/* Tabbed Package Section */}
            <motion.div variants={fadeUp} className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-0 rounded-2xl md:rounded-[2rem] overflow-hidden border border-border/20 shadow-[0_30px_80px_-20px_hsl(var(--primary)/0.1)]">
                
                {/* Left: Pricing Panel */}
                <div className="lg:col-span-3 relative bg-card">
                  <div className="absolute -top-20 -left-20 w-60 h-60 bg-accent/8 blur-[100px] rounded-full pointer-events-none" />
                  <div className="relative z-10 p-5 md:p-12">
                    <div className="flex items-center gap-2 mb-4 md:mb-8">
                      <Crown className="h-3 w-3 md:h-4 md:w-4 text-accent" />
                      <span className="text-accent text-[9px] md:text-[10px] uppercase tracking-[0.4em] font-semibold">Pacchetto Corse</span>
                    </div>
                    <h3 className="font-serif text-lg md:text-3xl font-bold mb-4 md:mb-8">Scegli il pacchetto</h3>

                    {/* Tabs */}
                    <div className="flex gap-1.5 md:gap-2 mb-6 md:mb-10">
                      {(['standard', 'premium'] as const).map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setActiveTab(tab)}
                          className={`relative px-3 md:px-6 py-2 md:py-3 rounded-lg md:rounded-xl text-[10px] md:text-sm font-semibold transition-all duration-500 ${
                            activeTab === tab
                              ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-[0_8px_30px_-8px_hsl(var(--accent)/0.4)]'
                              : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                          }`}
                        >
                          <span className="flex items-center gap-1.5 md:gap-2">
                            <Users className="h-3 w-3 md:h-3.5 md:w-3.5" />
                            {tab === 'standard' ? '1-4 persone' : '5-8 persone'}
                          </span>
                        </button>
                      ))}
                    </div>

                    {/* Pricing List with Prenota Ora buttons */}
                    <AnimatePresence mode="wait">
                      <motion.div key={activeTab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3 }} className="space-y-0">
                        {(activeTab === 'standard'
                          ? [
                              { rides: "1 corsa", price: "50 €" },
                              { rides: "3 corse", price: "100 €" },
                              { rides: "5 corse", price: "150 €" },
                              { rides: "10 corse", price: "270 €" },
                            ]
                          : [
                              { rides: "1 corsa", price: "70 €" },
                              { rides: "3 corse", price: "150 €" },
                              { rides: "5 corse", price: "230 €" },
                              { rides: "10 corse", price: "400 €" },
                            ]
                        ).map((p, i) => (
                          <motion.div
                            key={p.rides}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.08 }}
                            className="group/item flex items-center justify-between py-3 md:py-5 border-b border-border/15 last:border-0"
                          >
                            <div className="flex items-center gap-2 md:gap-3">
                              <div className="w-6 h-6 md:w-8 md:h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                                <Check className="h-3 w-3 md:h-4 md:w-4 text-accent" />
                              </div>
                              <span className="text-foreground font-medium text-xs md:text-lg">{p.rides}</span>
                            </div>
                            <div className="flex items-center gap-2 md:gap-3">
                              <span className="text-sm md:text-3xl font-serif font-bold bg-gradient-to-r from-foreground to-accent bg-clip-text text-transparent">
                                {p.price}
                              </span>
                              <button
                                onClick={() => scrollToForm(`${p.rides} ${activeTab === 'standard' ? 'Standard' : 'Premium'}`)}
                                className="px-2.5 md:px-4 py-1 md:py-1.5 rounded-full border border-accent/30 text-[8px] md:text-[10px] font-bold uppercase tracking-wider bg-transparent bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent hover:opacity-80 transition-opacity"
                                style={{ WebkitTextFillColor: 'transparent', backgroundClip: 'text', WebkitBackgroundClip: 'text', backgroundImage: 'linear-gradient(to right, hsl(var(--primary)), hsl(var(--accent)))' }}
                              >
                                Prenota ora
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>

                {/* Right: Description Panel */}
                <div className="lg:col-span-2 relative bg-gradient-to-br from-foreground via-foreground to-primary overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-accent/10 blur-[80px] rounded-full pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent/8 blur-[60px] rounded-full pointer-events-none" />
                  <div className="relative z-10 p-5 md:p-12 h-full flex flex-col justify-center">
                    <div className="space-y-4 md:space-y-6">
                      <p className="text-primary-foreground/90 text-sm md:text-lg leading-relaxed">
                        Offriamo <span className="text-accent font-semibold">pacchetti di transfer privati</span> ideali per muoversi comodamente a Mykonos.
                      </p>
                      <div className="w-12 h-px bg-gradient-to-r from-accent to-transparent" />
                      <p className="text-primary-foreground/60 text-xs md:text-sm leading-relaxed">
                        Perfetti per spiagge, ristoranti, nightlife e spostamenti serali.
                      </p>
                      <div className="flex flex-wrap gap-1.5 md:gap-2 pt-1 md:pt-2">
                        {['Spiagge', 'Ristoranti', 'Nightlife', 'Aeroporto'].map((tag) => (
                          <span key={tag} className="px-2 md:px-3 py-0.5 md:py-1 rounded-full bg-primary-foreground/8 border border-primary-foreground/10 text-primary-foreground/60 text-[8px] md:text-[10px] uppercase tracking-wider">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Cinematic divider */}
      <section className="relative h-[35vh] md:h-[55vh] overflow-hidden">
        <img src={imgTaxi} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/40 to-primary/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-accent/10" />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center px-6 max-w-2xl">
            <motion.div variants={fadeUp} className="flex items-center justify-center gap-2 mb-4 md:mb-6">
              <Shield className="h-4 w-4 md:h-5 md:w-5 text-accent" />
              <span className="text-accent text-[9px] md:text-[10px] uppercase tracking-[0.4em] font-medium">Servizio Garantito</span>
            </motion.div>
            <motion.h2 variants={fadeUp} className="font-serif text-xl md:text-5xl text-white leading-tight mb-3 md:mb-4 drop-shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
              Dall'aeroporto alla tua villa,<br /><span className="bg-gradient-to-r from-accent to-sky-300 bg-clip-text text-transparent">senza pensieri.</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-white/60 text-sm md:text-lg">
              Autisti professionali, veicoli di lusso e puntualità garantita.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-10 md:py-28 bg-foreground relative overflow-hidden">
        <div className="absolute top-20 right-10 w-72 h-72 bg-accent/8 blur-[100px] rounded-full pointer-events-none" />
        <div className="container mx-auto px-4 max-w-4xl relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.div variants={fadeUp} className="text-center mb-8 md:mb-16">
              <div className="flex items-center justify-center gap-2 mb-3 md:mb-4">
                <Sparkles className="h-3 w-3 md:h-4 md:w-4 text-accent" />
                <span className="text-accent text-[9px] md:text-[10px] uppercase tracking-[0.4em] font-medium">Semplicità</span>
              </div>
              <h2 className="font-serif text-2xl md:text-5xl text-primary-foreground">Come Funziona</h2>
            </motion.div>
            <div className="flex flex-col gap-8 md:grid md:grid-cols-3 md:gap-8">
              {[
                { step: "01", title: "Richiedi", desc: "Compila il form con i dettagli del tuo transfer." },
                { step: "02", title: "Conferma", desc: "Ricevi conferma e dettagli dell'autista." },
                { step: "03", title: "Viaggia", desc: "Il tuo autista ti attende puntuale all'arrivo." },
              ].map((s) => (
                <motion.div key={s.step} variants={fadeUp} className="flex flex-col items-center text-center group">
                  <span className="text-5xl md:text-6xl font-serif font-bold bg-gradient-to-b from-accent/40 to-accent/10 bg-clip-text text-transparent mb-2 md:mb-4">{s.step}</span>
                  <h3 className="font-serif text-lg md:text-xl font-bold text-primary-foreground mb-1 md:mb-2">{s.title}</h3>
                  <p className="text-primary-foreground/60 text-sm md:text-sm leading-relaxed">{s.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact form */}
      <section ref={formRef} className="relative py-12 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-accent/80" />
        <div className="absolute inset-0 opacity-15" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, hsl(var(--accent)) 0%, transparent 50%), radial-gradient(circle at 80% 20%, hsl(var(--primary-foreground)) 0%, transparent 40%)' }} />

        <div className="relative container mx-auto px-4 max-w-3xl z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.div variants={fadeUp} className="text-center mb-8 md:mb-12">
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary-foreground/15 text-primary-foreground text-[10px] md:text-xs font-semibold uppercase tracking-[0.3em] mb-4 md:mb-6 backdrop-blur-sm border border-primary-foreground/10">Richiesta</span>
              <h2 className="font-serif text-2xl md:text-5xl font-bold text-primary-foreground">
                Richiedi<br className="md:hidden" /> transfer
              </h2>
              <p className="text-primary-foreground/60 mt-2 md:mt-3 text-sm md:text-lg">
                Compila il form e ti risponderemo<br className="md:hidden" /> al più presto
              </p>
            </motion.div>

            <motion.form variants={fadeUp} onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
              <div className="rounded-2xl bg-primary-foreground/10 backdrop-blur-md border border-primary-foreground/15 p-4 md:p-6 space-y-3 md:space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                  <div><Label className="text-primary-foreground/80 text-[10px] md:text-xs uppercase tracking-wider">Nome</Label><Input required placeholder="Mario" className="mt-1 bg-primary-foreground/10 border-primary-foreground/15 text-primary-foreground placeholder:text-primary-foreground/30 rounded-xl text-sm" /></div>
                  <div><Label className="text-primary-foreground/80 text-[10px] md:text-xs uppercase tracking-wider">Cognome</Label><Input required placeholder="Rossi" className="mt-1 bg-primary-foreground/10 border-primary-foreground/15 text-primary-foreground placeholder:text-primary-foreground/30 rounded-xl text-sm" /></div>
                  <div><Label className="text-primary-foreground/80 text-[10px] md:text-xs uppercase tracking-wider">Telefono</Label><Input type="tel" required placeholder="+39 333 1234567" className="mt-1 bg-primary-foreground/10 border-primary-foreground/15 text-primary-foreground placeholder:text-primary-foreground/30 rounded-xl text-sm" /></div>
                  <div><Label className="text-primary-foreground/80 text-[10px] md:text-xs uppercase tracking-wider">Email</Label><Input type="email" required placeholder="mario@email.com" className="mt-1 bg-primary-foreground/10 border-primary-foreground/15 text-primary-foreground placeholder:text-primary-foreground/30 rounded-xl text-sm" /></div>
                </div>
              </div>

              <div className="rounded-2xl bg-primary-foreground/10 backdrop-blur-md border border-primary-foreground/15 p-4 md:p-6 space-y-3 md:space-y-4">
                <div>
                  <Label className="text-primary-foreground/80 text-[10px] md:text-xs uppercase tracking-wider">Servizio</Label>
                  <select
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    required
                    className="w-full mt-1 bg-primary-foreground/10 border border-primary-foreground/15 text-primary-foreground rounded-xl py-2.5 px-3 text-sm focus:outline-none"
                  >
                    <option value="" className="text-foreground">Seleziona un servizio</option>
                    {serviceOptions.map((opt) => (
                      <option key={opt} value={opt} className="text-foreground">{opt}</option>
                    ))}
                  </select>
                </div>
              </div>

              <Button type="submit" size="lg" className="w-full rounded-full py-5 md:py-6 text-sm md:text-base font-semibold shadow-xl border-0" style={{ backgroundColor: '#25D366', color: 'white' }}>
                <MessageCircle className="mr-2 h-4 w-4 md:h-5 md:w-5" /> Continua su WhatsApp
              </Button>
            </motion.form>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Transfer;
