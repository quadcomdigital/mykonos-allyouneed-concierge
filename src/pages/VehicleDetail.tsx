import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Shield, Sparkles, Fuel, Users, Calendar as CalendarIcon, CheckCircle2, Star } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/noleggio-hero.jpg";

// Reuse same image imports as Rentals
import citroenC1 from "@/assets/vehicles/citroen-c1.png";
import kiaPicanto from "@/assets/vehicles/kia-picanto.png";
import nissanMicra from "@/assets/vehicles/nissan-micra.png";
import fiat500Cabrio from "@/assets/vehicles/fiat-500-cabrio.png";
import smartCar from "@/assets/vehicles/smart-car.png";
import peugeot108Cabrio from "@/assets/vehicles/peugeot-108-cabrio.png";
import opelCorsa from "@/assets/vehicles/opel-corsa.png";
import citroenC3 from "@/assets/vehicles/citroen-c3.png";
import renaultClio from "@/assets/vehicles/renault-clio.png";
import peugeot208 from "@/assets/vehicles/peugeot-208.png";
import miniCooperCabrio from "@/assets/vehicles/mini-cooper-cabrio.png";
import kiaStonic from "@/assets/vehicles/kia-stonic.png";
import mercedesGla from "@/assets/vehicles/mercedes-gla.png";
import suzukiVitara from "@/assets/vehicles/suzuki-vitara.png";
import vwGolf from "@/assets/vehicles/vw-golf.png";
import nissanQashqai from "@/assets/vehicles/nissan-qashqai.png";
import bmwX1 from "@/assets/vehicles/bmw-x1.png";
import bmw116 from "@/assets/vehicles/bmw-116.png";
import jeepSahara2019 from "@/assets/vehicles/jeep-wrangler-sahara-2019.png";
import jeepSahara2022 from "@/assets/vehicles/jeep-wrangler-sahara-2022.png";
import jeepRubicon2022 from "@/assets/vehicles/jeep-wrangler-rubicon-2022.png";
import jeepWrangler2024 from "@/assets/vehicles/jeep-wrangler-2024.png";
import jeep5door2014 from "@/assets/vehicles/jeep-wrangler-5door-2014.webp";
import atvSegway from "@/assets/vehicles/atv-segway.png";
import atvGoes from "@/assets/vehicles/atv-goes.png";
import atvAeon200 from "@/assets/vehicles/atv-aeon-200.png";
import buggyPolaris from "@/assets/vehicles/buggy-polaris.webp";
import libertyBoulevard50 from "@/assets/vehicles/liberty-boulevard-50.png";
import hondaPiaggio125 from "@/assets/vehicles/honda-piaggio-125.png";
import piaggioBeverly300 from "@/assets/vehicles/piaggio-beverly-300.png";
import piaggioLiberty125 from "@/assets/vehicles/piaggio-liberty-125.png";
import hondaSh125 from "@/assets/vehicles/honda-sh-125.png";
import piaggioMedley150 from "@/assets/vehicles/piaggio-medley-150.png";
import yamahaTrieity125 from "@/assets/vehicles/yamaha-tricity-125.png";
import libertyRstAbs from "@/assets/vehicles/liberty-rst-abs.png";
import variant50 from "@/assets/vehicles/variant-50.png";

type Vehicle = { name: string; image: string; low: string; mid: string; high: string; category: string };

const raw: Record<string, Omit<Vehicle, "category">[]> = {
  Auto: [
    { name: "Citroen C1", image: citroenC1, low: "€45", mid: "€60", high: "€75" },
    { name: "Kia Picanto", image: kiaPicanto, low: "€45", mid: "€60", high: "€75" },
    { name: "Nissan Micra", image: nissanMicra, low: "€55", mid: "€65", high: "€75" },
    { name: "Opel Corsa", image: opelCorsa, low: "€50", mid: "€75", high: "€80" },
    { name: "Renault Clio", image: renaultClio, low: "€50", mid: "€70", high: "€85" },
    { name: "Peugeot 208", image: peugeot208, low: "€50", mid: "€70", high: "€85" },
    { name: "Citroen C3", image: citroenC3, low: "€60", mid: "€70", high: "€85" },
    { name: "Fiat 500 Cabrio", image: fiat500Cabrio, low: "€65", mid: "€90", high: "€140" },
    { name: "Smart", image: smartCar, low: "€70", mid: "€85", high: "€100" },
    { name: "Peugeot 108 Cabrio", image: peugeot108Cabrio, low: "€70", mid: "€85", high: "€110" },
    { name: "Kia Stonic", image: kiaStonic, low: "€70", mid: "€90", high: "€110" },
    { name: "Suzuki Vitara", image: suzukiVitara, low: "€70", mid: "€85", high: "€110" },
    { name: "VW Golf", image: vwGolf, low: "€80", mid: "€90", high: "€130" },
    { name: "Nissan Qashqai", image: nissanQashqai, low: "€80", mid: "€100", high: "€150" },
    { name: "BMW 116", image: bmw116, low: "€90", mid: "€100", high: "€130" },
    { name: "BMW X1", image: bmwX1, low: "€100", mid: "€180", high: "€200" },
    { name: "Mini Cooper Cabrio", image: miniCooperCabrio, low: "€130", mid: "€160", high: "€220" },
    { name: "Mercedes GLA", image: mercedesGla, low: "€130", mid: "€150", high: "€190" },
  ],
  Jeep: [
    { name: "Jeep Wrangler Sahara 2019", image: jeepSahara2019, low: "€190", mid: "€250", high: "€310" },
    { name: "Jeep Wrangler 5 Door 2014", image: jeep5door2014, low: "€190", mid: "€190", high: "€250" },
    { name: "Jeep Wrangler Sahara 2022", image: jeepSahara2022, low: "€250", mid: "€310", high: "€370" },
    { name: "Jeep Wrangler Rubicon 2022", image: jeepRubicon2022, low: "€280", mid: "€320", high: "€400" },
    { name: "Jeep Wrangler 2024 Hybrid", image: jeepWrangler2024, low: "€310", mid: "€370", high: "€440" },
  ],
  ATV: [
    { name: "Kymco MXU 50cc", image: atvSegway, low: "€35", mid: "€40", high: "€45" },
    { name: "ATV Aeon 200cc", image: atvAeon200, low: "€45", mid: "€50", high: "€70" },
    { name: "ATV Goes 450cc", image: atvGoes, low: "€50", mid: "€70", high: "€90" },
    { name: "Kymco MXU 150cc", image: atvSegway, low: "€55", mid: "€60", high: "€70" },
    { name: "ATV Goes 550cc", image: atvGoes, low: "€60", mid: "€80", high: "€100" },
    { name: "Kymco MXU 450cc", image: atvGoes, low: "€70", mid: "€80", high: "€90" },
    { name: "ATV Segway 620cc", image: atvSegway, low: "€70", mid: "€90", high: "€120" },
    { name: "Buggy Polaris RZR 570", image: buggyPolaris, low: "Su richiesta", mid: "Su richiesta", high: "Su richiesta" },
  ],
  Scooter: [
    { name: "Liberty/Boulevard 50cc", image: libertyBoulevard50, low: "€23", mid: "€25", high: "€30" },
    { name: "Variant 50cc", image: variant50, low: "€25", mid: "€30", high: "€35" },
    { name: "Honda/Piaggio 125cc", image: hondaPiaggio125, low: "€30", mid: "€35", high: "€40" },
    { name: "Liberty/Yamaha Ray ZR 125cc", image: libertyBoulevard50, low: "€35", mid: "€40", high: "€45" },
    { name: "Piaggio Liberty 125cc", image: piaggioLiberty125, low: "€35", mid: "€40", high: "€45" },
    { name: "Honda SH 125cc", image: hondaSh125, low: "€35", mid: "€40", high: "€45" },
    { name: "Piaggio Medley 150cc", image: piaggioMedley150, low: "€40", mid: "€40", high: "€45" },
    { name: "Piaggio Beverly 300cc", image: piaggioBeverly300, low: "€40", mid: "€55", high: "€60" },
    { name: "Liberty RST ABS / Honda SH ABS", image: libertyRstAbs, low: "€40", mid: "€45", high: "€50" },
    { name: "Yamaha Tricity 125cc", image: yamahaTrieity125, low: "€40", mid: "€45", high: "€50" },
  ],
};

export const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const allVehicles: Vehicle[] = Object.entries(raw).flatMap(([category, list]) =>
  list.map((v) => ({ ...v, category }))
);

const includes = [
  { icon: Shield, label: "Assicurazione inclusa" },
  { icon: Fuel, label: "Pieno carburante" },
  { icon: Users, label: "2+ guidatori" },
  { icon: Sparkles, label: "Consegna in hotel" },
];

const VehicleDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const vehicle = useMemo(() => allVehicles.find((v) => slugify(v.name) === slug), [slug]);
  const [season, setSeason] = useState<"low" | "mid" | "high">("mid");

  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior }); }, [slug]);

  if (!vehicle) {
    return (
      <Layout>
        <section className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">Veicolo non trovato</p>
            <Button onClick={() => navigate("/rentals")}>Torna al noleggio</Button>
          </div>
        </section>
      </Layout>
    );
  }

  const related = allVehicles
    .filter((v) => v.category === vehicle.category && v.name !== vehicle.name)
    .slice(0, 4);

  const activePrice = vehicle[season];

  const handleQuote = () => {
    navigate(`/rentals?vehicle=${encodeURIComponent(vehicle.name)}`);
  };

  return (
    <Layout>
      {/* Floating luxury hero */}
      <section className="relative pt-24 md:pt-32 pb-12 md:pb-20 overflow-hidden bg-gradient-to-b from-secondary/40 via-background to-background">
        <img src={heroBg} alt="" className="absolute inset-0 w-full h-full object-cover opacity-[0.05]" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-accent/10 blur-[200px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-primary/10 blur-[160px] pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <button
            onClick={() => navigate("/rentals")}
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-accent transition mb-8"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Torna ai veicoli
          </button>

          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}
            >
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-primary/15 to-accent/15 border border-accent/25 text-accent text-[10px] uppercase tracking-[0.3em] font-semibold mb-5">
                <Sparkles className="h-3 w-3" /> {vehicle.category}
              </span>
              <h1 style={{ fontFamily: "'Parkinsans', sans-serif" }} className="font-bold text-3xl md:text-5xl lg:text-6xl leading-[1.05] text-foreground mb-4">
                {vehicle.name}
              </h1>
              <div className="h-px w-16 bg-gradient-to-r from-primary via-accent to-transparent mb-5" />
              <p className="text-muted-foreground text-sm md:text-base font-light max-w-md mb-6 leading-relaxed">
                Consegna gratuita in hotel, porto o aeroporto. Assicurazione kasko, assistenza 24/7 e seconda guida inclusa.
              </p>

              <div className="flex items-center gap-1 mb-7">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
                <span className="text-xs text-muted-foreground ml-2">4.9 · 320+ noleggi</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-3 mb-8">
                {includes.map((it) => (
                  <div key={it.label} className="flex flex-col items-start gap-2 p-3 rounded-2xl bg-gradient-to-br from-card to-secondary/40 border border-border/40">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary/15 to-accent/15 flex items-center justify-center">
                      <it.icon className="h-3.5 w-3.5 text-accent" />
                    </div>
                    <span className="text-[10px] md:text-[11px] text-foreground/85 leading-tight font-medium">{it.label}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                <Button onClick={handleQuote} className="rounded-full px-7 py-6 text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-xl shadow-accent/25 hover:shadow-2xl hover:shadow-accent/35 transition-all">
                  Noleggia subito <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="outline"
                  className="rounded-full px-7 py-6 text-xs font-semibold border-border/50 hover:border-accent/50 hover:bg-accent/5"
                  asChild
                >
                  <a href={`https://wa.me/393761122639?text=${encodeURIComponent("Ciao, vorrei info sul noleggio " + vehicle.name)}`} target="_blank" rel="noopener noreferrer">
                    WhatsApp
                  </a>
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, ease: "easeOut" }}
              className="relative"
            >
              <div className="relative aspect-[5/4] rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-secondary/70 via-secondary/25 to-secondary/5 border border-border/40 shadow-[0_50px_130px_-30px_hsl(var(--foreground)/0.3)]">
                <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-accent/15 blur-3xl pointer-events-none" />
                <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-primary/15 blur-3xl pointer-events-none" />
                <motion.img
                  src={vehicle.image}
                  alt={vehicle.name}
                  className="absolute inset-0 w-[85%] h-[85%] m-auto object-contain drop-shadow-2xl"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                />
                <div
                  style={{ fontFamily: "'Parkinsans', sans-serif" }}
                  className="absolute top-4 right-4 inline-flex items-baseline gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-br from-primary/85 via-primary/70 to-accent/75 ring-1 ring-inset ring-white/25 backdrop-blur-md text-white shadow-lg"
                >
                  <span className="text-[9px] uppercase tracking-[0.22em] text-white/75 font-medium">da</span>
                  <span className="text-[15px] font-bold tracking-tight">{vehicle.low}</span>
                  <span className="text-[9px] text-white/70 font-light">/ giorno</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Seasonal pricing */}
      <section className="py-14 md:py-20 bg-gradient-to-b from-background via-secondary/15 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 md:mb-12">
            <span className="text-accent text-[10px] uppercase tracking-[0.4em] font-semibold mb-3 block">Tariffe stagionali</span>
            <h2 style={{ fontFamily: "'Parkinsans', sans-serif" }} className="font-bold text-2xl md:text-4xl text-foreground">Scegli il tuo periodo</h2>
            <div className="mx-auto mt-3 h-px w-16 bg-gradient-to-r from-transparent via-accent to-transparent" />
            <p className="text-muted-foreground text-xs md:text-sm mt-4">Prezzi al giorno, IVA inclusa. Sconti per noleggi 7+ giorni.</p>
          </div>

          <div className="grid grid-cols-3 gap-2 md:gap-5 max-w-4xl mx-auto">
            {([
              { key: "low", label: "Bassa stagione", sub: "Mag — Giu", price: vehicle.low, color: "emerald" },
              { key: "mid", label: "Media stagione", sub: "Giu — Lug", price: vehicle.mid, color: "amber" },
              { key: "high", label: "Alta stagione", sub: "Lug — Ago", price: vehicle.high, color: "rose" },
            ] as const).map((s) => {
              const active = season === s.key;
              return (
                <button
                  key={s.key}
                  onClick={() => setSeason(s.key)}
                  className={`relative text-left rounded-2xl md:rounded-[1.75rem] p-3 md:p-6 border transition-all duration-500 ${active ? "bg-gradient-to-br from-foreground via-foreground to-foreground/90 text-background border-foreground shadow-[0_30px_60px_-20px_hsl(var(--foreground)/0.35)] scale-[1.03]" : "bg-gradient-to-br from-card to-secondary/30 border-border/40 hover:border-accent/40 hover:shadow-lg"}`}
                >
                  <span className={`inline-flex items-center gap-1.5 text-[9px] md:text-[10px] uppercase tracking-[0.25em] font-semibold ${active ? "text-background/70" : "text-muted-foreground"}`}>
                    <span className={`w-1.5 h-1.5 rounded-full bg-${s.color}-500`} />
                    {s.sub}
                  </span>
                  <p className={`text-[11px] md:text-sm font-medium mt-1.5 md:mt-2 ${active ? "text-background" : "text-foreground"}`}>{s.label}</p>
                  <p style={{ fontFamily: "'Parkinsans', sans-serif" }} className={`font-bold text-xl md:text-4xl mt-1.5 md:mt-3 ${active ? "text-background" : "text-foreground"}`}>{s.price}</p>
                  <p className={`text-[9px] md:text-[10px] mt-0.5 ${active ? "text-background/60" : "text-muted-foreground"}`}>/ giorno</p>
                </button>
              );
            })}
          </div>

          <div className="text-center mt-10">
            <Button onClick={handleQuote} className="rounded-full px-9 py-6 text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-xl shadow-accent/25 hover:shadow-2xl hover:shadow-accent/35 transition-all">
              Noleggia subito a {activePrice} <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Trust signals */}
      <section className="py-12 md:py-16 bg-secondary/30 border-y border-border/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto">
            {[
              { icon: Shield, title: "Assicurazione kasko", text: "Copertura completa furto e danni" },
              { icon: CheckCircle2, title: "Cancellazione flessibile", text: "Fino a 48h prima gratis" },
              { icon: CalendarIcon, title: "Consegna 7/7", text: "In hotel, porto o aeroporto" },
              { icon: Sparkles, title: "Assistenza 24/7", text: "Supporto in italiano sempre" },
            ].map((t) => (
              <div key={t.title} className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-background to-secondary/40 border border-border/40 flex items-center justify-center shadow-sm">
                  <t.icon className="h-5 w-5 text-accent" />
                </div>
                <p style={{ fontFamily: "'Parkinsans', sans-serif" }} className="font-bold text-xs md:text-sm text-foreground">{t.title}</p>
                <p className="text-[10px] md:text-xs text-muted-foreground mt-1">{t.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="flex items-end justify-between mb-6">
              <h3 style={{ fontFamily: "'Parkinsans', sans-serif" }} className="font-bold text-xl md:text-3xl text-foreground">Altri {vehicle.category}</h3>
              <button onClick={() => navigate("/rentals")} className="text-xs text-muted-foreground hover:text-accent inline-flex items-center gap-1 transition">
                Vedi tutti <ArrowRight className="h-3 w-3" />
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 md:gap-4">
              {related.map((r) => (
                <button
                  key={r.name}
                  onClick={() => navigate(`/rentals/${slugify(r.name)}`)}
                  className="group text-left rounded-2xl overflow-hidden bg-gradient-to-br from-card to-secondary/30 border border-border/40 hover:border-accent/40 hover:shadow-xl hover:shadow-accent/10 transition-all duration-500"
                >
                  <div className="aspect-[4/3] bg-gradient-to-br from-secondary/50 to-secondary/10 flex items-center justify-center p-3">
                    <img src={r.image} alt={r.name} className="max-h-[85%] max-w-[85%] object-contain group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-3">
                    <p style={{ fontFamily: "'Parkinsans', sans-serif" }} className="font-bold text-[11px] md:text-sm text-foreground truncate">{r.name}</p>
                    <p className="text-[10px] md:text-xs text-muted-foreground mt-0.5">da {r.low} / giorno</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
};

export default VehicleDetail;


