import { motion } from "framer-motion";
import { ArrowRight, Music, Waves, Users, Clock, Sparkles, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/i18n/LanguageContext";
import Layout from "@/components/layout/Layout";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as const } },
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.15 } } };

const parties = [
  {
    name: { it: "Sunset Cruise Party", en: "Sunset Cruise Party" },
    desc: { it: "DJ set al tramonto navigando tra le isole. Open bar, finger food gourmet e atmosfera unica.", en: "Sunset DJ set sailing between islands. Open bar, gourmet finger food and unique atmosphere." },
    duration: "4h",
    guests: "20-40",
    time: "18:00 - 22:00",
    highlight: { it: "Best Seller", en: "Best Seller" },
  },
  {
    name: { it: "Full Moon Party", en: "Full Moon Party" },
    desc: { it: "Festa sotto la luna piena in mare aperto. Musica live, cocktail premium e fuochi d'artificio.", en: "Full moon party on the open sea. Live music, premium cocktails and fireworks." },
    duration: "5h",
    guests: "30-50",
    time: "21:00 - 02:00",
    highlight: { it: "Esclusivo", en: "Exclusive" },
  },
  {
    name: { it: "Day Cruise Party", en: "Day Cruise Party" },
    desc: { it: "Crociera diurna con soste per il bagno, musica e pranzo a bordo. Il modo migliore per vivere il mare.", en: "Day cruise with swimming stops, music and lunch on board. The best way to experience the sea." },
    duration: "6h",
    guests: "20-40",
    time: "11:00 - 17:00",
    highlight: null,
  },
  {
    name: { it: "Private Boat Party", en: "Private Boat Party" },
    desc: { it: "Organizza la tua festa privata a bordo. DJ, catering e servizio personalizzato per il tuo evento.", en: "Organize your private party on board. DJ, catering and personalized service for your event." },
    duration: { it: "Su misura", en: "Custom" },
    guests: "10-80",
    time: { it: "A scelta", en: "Your choice" },
    highlight: { it: "VIP", en: "VIP" },
  },
];

const BoatParty = () => {
  const { language } = useLanguage();

  return (
    <Layout>
      {/* ══════ CINEMATIC VIDEO HERO ══════ */}
      <section className="relative h-[75vh] md:h-screen overflow-hidden">
        <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
          <source src="/videos/boat-party.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-black/80" />
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-accent/50 to-transparent" />

        <div className="absolute inset-0 flex items-end pb-20 md:pb-28">
          <div className="container mx-auto px-6 md:px-12">
            <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-3xl">
              <motion.div variants={fadeUp} className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center">
                  <Music className="h-4 w-4 text-accent" />
                </div>
                <span className="text-white/50 text-[11px] uppercase tracking-[0.4em]">Party on the Sea</span>
              </motion.div>
              <motion.h1 variants={fadeUp} className="font-serif text-4xl md:text-7xl lg:text-8xl text-white leading-[0.95] mb-4 md:mb-6 drop-shadow-2xl">
                Boat Party
              </motion.h1>
              <motion.p variants={fadeUp} className="text-white/70 text-lg md:text-xl font-light max-w-xl leading-relaxed">
                {language === "it"
                  ? "Feste esclusive in mare aperto. DJ, cocktail premium e tramonti indimenticabili nelle acque cristalline dell'Egeo."
                  : "Exclusive parties on the open sea. DJs, premium cocktails and unforgettable sunsets in the crystal-clear Aegean waters."}
              </motion.p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════ PARTY OPTIONS ══════ */}
      <section className="py-14 md:py-32 bg-background">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-20">
            <motion.span variants={fadeUp} className="text-accent text-[10px] uppercase tracking-[0.4em] font-medium mb-4 block">
              {language === "it" ? "Le Nostre Feste" : "Our Parties"}
            </motion.span>
            <motion.h2 variants={fadeUp} className="font-serif text-3xl md:text-5xl lg:text-6xl text-foreground">
              {language === "it" ? "Scegli la tua esperienza" : "Choose your experience"}
            </motion.h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {parties.map((party, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: idx * 0.1 }}
                className="group relative overflow-hidden rounded-3xl border border-border/30 bg-card p-8 md:p-10 hover:border-accent/30 transition-all duration-500"
              >
                {party.highlight && (
                  <div className="absolute top-6 right-6 bg-accent/15 text-accent text-[10px] uppercase tracking-widest font-semibold px-3 py-1 rounded-full border border-accent/20">
                    {typeof party.highlight === 'string' ? party.highlight : party.highlight[language]}
                  </div>
                )}

                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center">
                    <Waves className="h-5 w-5 text-accent" />
                  </div>
                </div>

                <h3 className="font-serif text-2xl md:text-3xl text-foreground mb-3">
                  {typeof party.name === 'string' ? party.name : party.name[language]}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-8">
                  {typeof party.desc === 'string' ? party.desc : party.desc[language]}
                </p>

                <div className="grid grid-cols-3 gap-3 mb-8">
                  <div className="text-center p-3 rounded-xl bg-muted/50 border border-border/20">
                    <Clock className="h-3.5 w-3.5 text-accent mx-auto mb-1.5" />
                    <span className="block text-foreground font-semibold text-sm">
                      {typeof party.duration === 'string' ? party.duration : party.duration[language]}
                    </span>
                    <span className="block text-muted-foreground text-[9px] uppercase tracking-wider mt-0.5">
                      {language === "it" ? "Durata" : "Duration"}
                    </span>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-muted/50 border border-border/20">
                    <Users className="h-3.5 w-3.5 text-accent mx-auto mb-1.5" />
                    <span className="block text-foreground font-semibold text-sm">{party.guests}</span>
                    <span className="block text-muted-foreground text-[9px] uppercase tracking-wider mt-0.5">
                      {language === "it" ? "Ospiti" : "Guests"}
                    </span>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-muted/50 border border-border/20">
                    <Sparkles className="h-3.5 w-3.5 text-accent mx-auto mb-1.5" />
                    <span className="block text-foreground font-semibold text-sm">
                      {typeof party.time === 'string' ? party.time : party.time[language]}
                    </span>
                    <span className="block text-muted-foreground text-[9px] uppercase tracking-wider mt-0.5">
                      {language === "it" ? "Orario" : "Time"}
                    </span>
                  </div>
                </div>

                <Button
                  className="rounded-full w-full bg-gradient-to-r from-primary to-accent text-white hover:opacity-90 shadow-lg shadow-accent/20 border-0"
                  onClick={() => {
                    import("@/integrations/supabase/client").then(({ supabase }) => {
                      supabase.from("bookings").insert({
                        service_type: "boat_party",
                        service_name: typeof party.name === 'string' ? party.name : party.name[language],
                        customer_name: "WhatsApp Lead",
                        source: "whatsapp",
                      } as any).then(() => {});
                    });
                    window.open("https://wa.me/393400000000", "_blank");
                  }}
                >
                    {language === "it" ? "Prenota Ora" : "Book Now"} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>

                {/* Glow */}
                <div className="absolute -bottom-16 -right-16 w-[200px] h-[200px] rounded-full bg-accent/5 blur-[80px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ CTA ══════ */}
      <section className="relative py-16 md:py-32 overflow-hidden">
        <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
          <source src="/videos/boat-party.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/70" />
        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.h2 variants={fadeUp} className="font-serif text-3xl md:text-6xl text-white leading-tight mb-6 max-w-3xl mx-auto">
              {language === "it" ? "La festa dei tuoi sogni, in mare aperto" : "The party of your dreams, on the open sea"}
            </motion.h2>
            <motion.div variants={fadeUp}>
              <Button
                size="lg"
                className="rounded-full px-12 py-6 text-sm font-semibold bg-gradient-to-r from-primary to-accent text-white hover:opacity-90 shadow-xl shadow-accent/20 border-0"
                asChild
              >
                <a href="https://wa.me/393400000000" target="_blank" rel="noopener noreferrer">
                  {language === "it" ? "Contatta il Concierge" : "Contact Concierge"} <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default BoatParty;
