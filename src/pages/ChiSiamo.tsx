import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import heroImg from "@/assets/chi-siamo-1.jpg";
import imgChiSiamo from "@/assets/chi-siamo-2.jpeg";
import imgProgetto from "@/assets/progetto.jpg";
import imgAnniCostruiti from "@/assets/anni-costruiti.jpg";
import imgTuViviMyk from "@/assets/tu-vivi-myk.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const ChiSiamo = () => {
  return (
    <Layout>
      {/* Hero — chi_siamo_1.jpg */}
      <section className="relative h-[65vh] md:h-[80vh] overflow-hidden">
        <motion.img src={heroImg} alt="" className="w-full h-full object-cover" initial={{ scale: 1.2 }} animate={{ scale: 1.05 }} transition={{ duration: 2, ease: "easeOut" }} />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/50 to-transparent" />
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 pb-16 md:pb-24">
            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.3 }}>
              <div className="flex items-center gap-3 mb-4 md:mb-6">
                <div className="h-px w-14 bg-accent" />
                <span className="text-accent text-[11px] font-semibold uppercase tracking-[0.4em]">La Nostra Storia</span>
              </div>
              <h1 className="font-serif text-4xl md:text-9xl font-bold text-primary-foreground leading-[0.85] mb-4 md:mb-6">Chi Siamo</h1>
              <p className="text-primary-foreground/60 max-w-lg text-lg leading-relaxed">Un accesso privilegiato a Mykonos, costruito sul campo.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Opening statement */}
      <section className="relative py-14 md:py-36 bg-background overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-accent/5 blur-[200px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-primary/5 blur-[150px] pointer-events-none" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="max-w-4xl mx-auto">
            <motion.div variants={fadeUp} className="mb-16">
              <span className="text-accent text-[10px] uppercase tracking-[0.4em] font-medium mb-8 block">Dalla nightlife al concierge di lusso</span>
              <h2 className="font-serif text-3xl md:text-5xl font-bold text-foreground leading-tight mb-8">
                All You Need nasce dalla visione di<br />
                <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">Antonino Barone</span>
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
                Arrivato a Mykonos nel 2022 con un obiettivo preciso: entrare nel cuore dell'isola, comprenderne i ritmi, le dinamiche e l'essenza più autentica.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Video + text — partito-riferimento.mp4 */}
      <section className="bg-background">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-0 items-center mb-0">
            <motion.div variants={fadeUp} className="md:col-span-7 relative">
              <div className="rounded-2xl md:rounded-[2.5rem] overflow-hidden aspect-[9/16] max-h-[500px] md:max-h-none md:aspect-[3/4] shadow-2xl shadow-accent/10 mx-auto w-[70%] md:w-full">
                <video autoPlay muted loop playsInline className="w-full h-full object-cover">
                  <source src="/videos/partito-riferimento.mp4" type="video/mp4" />
                </video>
              </div>
              <div className="absolute -bottom-4 right-[10%] md:-bottom-6 md:right-8 bg-gradient-to-r from-primary to-accent rounded-xl md:rounded-2xl px-4 py-3 md:p-6 shadow-2xl shadow-primary/20">
                <span className="block text-2xl md:text-4xl font-serif font-bold text-primary-foreground">2022</span>
                <span className="text-primary-foreground/70 text-[9px] md:text-xs uppercase tracking-wider">Arrivo a Mykonos</span>
              </div>
            </motion.div>
            <motion.div variants={fadeUp} className="md:col-span-5 md:pl-12 space-y-4 md:space-y-6 pt-8 md:pt-0">
              <p className="text-sm md:text-lg text-foreground font-medium leading-relaxed">
                Partito come promoter di riferimento nella nightlife, Antonino ha costruito nel tempo una rete solida di relazioni dirette con ville esclusive, appartamenti selezionati, beach club iconici e ristoranti d'eccellenza.
              </p>
              <div className="w-16 h-[2px] bg-gradient-to-r from-accent to-primary" />
              <p className="text-sm md:text-lg text-muted-foreground leading-relaxed">
                Vivere Mykonos ogni giorno gli ha permesso di conoscere non solo i luoghi, ma le persone e le opportunità che fanno realmente la differenza.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Full-width divider — progetto.jpg */}
      <section className="relative py-16 md:py-40 overflow-hidden my-10 md:my-24">
        <div className="absolute inset-0">
          <img src={imgProgetto} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-foreground/80" />
        </div>
        <div className="absolute top-[20%] left-[10%] w-[300px] h-[300px] rounded-full bg-accent/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[10%] right-[10%] w-[250px] h-[250px] rounded-full bg-primary/15 blur-[100px] pointer-events-none" />
        
        <div className="relative container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="max-w-3xl mx-auto text-center">
            <motion.span variants={fadeUp} className="text-accent text-[10px] uppercase tracking-[0.4em] font-medium mb-8 block">Il Progetto</motion.span>
            <motion.p variants={fadeUp} className="text-2xl md:text-4xl text-primary-foreground font-bold leading-snug mb-8" style={{ fontFamily: "'Ultra', serif" }}>
              Da una visione precisa nasce All You Need. Un riferimento esclusivo per chi non accetta compromessi.
            </motion.p>
            <motion.p variants={fadeUp} className="text-primary-foreground/60 text-lg leading-relaxed" style={{ fontFamily: "'Parkinsans', sans-serif" }}>
              Non solo un servizio: gestisce ogni dettaglio della vacanza, dall'alloggio alla pianificazione completa.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Block 2 — ultima.jpg */}
      <section className="bg-background pb-24">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-0 items-center">
            <motion.div variants={fadeUp} className="md:col-span-5 md:pr-12 space-y-6 md:order-1 order-2">
              <p className="text-xl md:text-2xl text-foreground font-serif font-bold leading-tight">
                All You Need è il risultato di anni costruiti sul campo.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Un accesso privilegiato all'isola, trasformato in esperienza su misura.
              </p>
              <div className="w-16 h-[2px] bg-gradient-to-r from-accent to-primary" />
              <div className="grid grid-cols-3 gap-4 pt-4">
                {[
                  { num: "3+", label: "Anni sul campo" },
                  { num: "500+", label: "Clienti serviti" },
                  { num: "100%", label: "Soddisfazione" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <span className="block text-2xl font-serif font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">{stat.num}</span>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{stat.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div variants={fadeUp} className="md:col-span-7 md:order-2 order-1">
              <div className="rounded-[2.5rem] overflow-hidden aspect-[4/5] md:aspect-[3/4] shadow-2xl shadow-accent/10">
                <img src={imgAnniCostruiti} alt="Anni costruiti sul campo" className="w-full h-full object-cover" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA — Tu vivi Mykonos */}
      <section className="relative h-[55vh] md:h-[70vh] overflow-hidden">
        <img src={imgTuViviMyk} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30" />
        <div className="absolute bottom-[20%] left-[30%] w-[400px] h-[400px] rounded-full bg-accent/10 blur-[150px] pointer-events-none" />
        
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center px-6 max-w-2xl">
            <motion.span variants={fadeUp} className="text-accent text-[10px] uppercase tracking-[0.4em] font-medium mb-8 block">La Nostra Promessa</motion.span>
            <motion.h2 variants={fadeUp} className="font-serif text-3xl md:text-7xl text-white leading-tight drop-shadow-[0_2px_30px_rgba(0,0,0,0.5)]">
              Tu vivi Mykonos.
            </motion.h2>
            <motion.h2 variants={fadeUp} className="text-3xl md:text-7xl leading-tight mb-8 md:mb-10 drop-shadow-[0_2px_30px_rgba(0,0,0,0.5)]" style={{ fontFamily: "'Parkinsans', sans-serif" }}>
              <span className="text-white font-bold">Noi la rendiamo impeccabile.</span>
            </motion.h2>
            <motion.div variants={fadeUp}>
              <Button size="lg" className="rounded-full px-10 py-6 text-sm font-semibold bg-gradient-to-r from-primary to-accent text-white hover:opacity-90 shadow-xl shadow-accent/20 border-0" asChild>
                <a href="https://wa.me/393400000000" target="_blank" rel="noopener noreferrer">
                  Contatta il Concierge <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default ChiSiamo;
