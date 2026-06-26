import { motion } from "framer-motion";
import { ArrowRight, Compass, MapPin, Clock, Users, Sun, Anchor, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/i18n/LanguageContext";
import Layout from "@/components/layout/Layout";

import imgScorpios from "@/assets/locations/scorpios.jpg";
import imgNammos from "@/assets/locations/nammos.jpg";
import imgSpilia from "@/assets/locations/spilia.jpg";
import imgPrincipote from "@/assets/locations/principote.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as const } },
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.15 } } };

const excursions = [
  {
    name: { it: "Delos & Rhenia", en: "Delos & Rhenia" },
    desc: { it: "Visita il sito archeologico patrimonio UNESCO di Delos e le acque turchesi di Rhenia. Snorkeling, pranzo a bordo e storia millenaria.", en: "Visit the UNESCO World Heritage archaeological site of Delos and the turquoise waters of Rhenia. Snorkeling, lunch on board and millennia of history." },
    duration: "6-8h",
    highlights: { it: "UNESCO • Snorkeling • Pranzo", en: "UNESCO • Snorkeling • Lunch" },
    img: imgSpilia,
    featured: true,
  },
  {
    name: { it: "South Coast Explorer", en: "South Coast Explorer" },
    desc: { it: "Esplora le baie nascoste della costa sud di Mykonos. Soste per il bagno, aperitivo al tramonto e paesaggi mozzafiato.", en: "Explore the hidden bays of Mykonos' south coast. Swimming stops, sunset aperitif and breathtaking landscapes." },
    duration: "5h",
    highlights: { it: "Baie Segrete • Aperitivo • Tramonto", en: "Secret Bays • Aperitif • Sunset" },
    img: imgScorpios,
    featured: false,
  },
  {
    name: { it: "Cicladi Tour", en: "Cyclades Tour" },
    desc: { it: "Un'escursione tra le isole vicine: Paros, Naxos o Koufonisi. Un viaggio esclusivo tra borghi bianchi e acque cristalline.", en: "An excursion to nearby islands: Paros, Naxos or Koufonisi. An exclusive journey through white villages and crystal-clear waters." },
    duration: { it: "Giornata intera", en: "Full Day" },
    highlights: { it: "Multi-isola • Borghi • Avventura", en: "Multi-island • Villages • Adventure" },
    img: imgNammos,
    featured: false,
  },
  {
    name: { it: "Sunset Private Cruise", en: "Sunset Private Cruise" },
    desc: { it: "Una crociera privata al tramonto con champagne, finger food gourmet e musica. Il modo più romantico di vivere Mykonos.", en: "A private sunset cruise with champagne, gourmet finger food and music. The most romantic way to experience Mykonos." },
    duration: "3-4h",
    highlights: { it: "Champagne • Gourmet • Romantico", en: "Champagne • Gourmet • Romantic" },
    img: imgPrincipote,
    featured: true,
  },
];

const Excursions = () => {
  const { language } = useLanguage();

  return (
    <Layout>
      {/* ══════ HERO ══════ */}
      <section className="relative h-[75vh] md:h-screen overflow-hidden">
        <motion.img
          src={imgSpilia}
          alt="Excursions"
          className="w-full h-full object-cover"
          initial={{ scale: 1.15 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2.5, ease: "easeOut" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/80" />
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-accent/50 to-transparent" />

        <div className="absolute inset-0 flex items-end pb-20 md:pb-28">
          <div className="container mx-auto px-6 md:px-12">
            <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-3xl">
              <motion.div variants={fadeUp} className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center">
                  <Compass className="h-4 w-4 text-accent" />
                </div>
                <span className="text-white/50 text-[11px] uppercase tracking-[0.4em]">Island Adventures</span>
              </motion.div>
              <motion.h1 variants={fadeUp} className="font-serif text-4xl md:text-7xl lg:text-8xl text-white leading-[0.95] mb-4 md:mb-6 drop-shadow-2xl">
                {language === "it" ? "Escursioni" : "Excursions"}
              </motion.h1>
              <motion.p variants={fadeUp} className="text-white/70 text-lg md:text-xl font-light max-w-xl leading-relaxed">
                {language === "it"
                  ? "Scopri le isole delle Cicladi con escursioni private in barca. Delos, Rhenia e molto altro ti aspettano."
                  : "Discover the Cyclades islands with private boat excursions. Delos, Rhenia and much more await you."}
              </motion.p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════ EXCURSIONS LIST ══════ */}
      <section className="py-14 md:py-32 bg-background">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-20">
            <motion.span variants={fadeUp} className="text-accent text-[10px] uppercase tracking-[0.4em] font-medium mb-4 block">
              {language === "it" ? "Le Nostre Escursioni" : "Our Excursions"}
            </motion.span>
            <motion.h2 variants={fadeUp} className="font-serif text-3xl md:text-5xl lg:text-6xl text-foreground">
              {language === "it" ? "Avventure esclusive" : "Exclusive adventures"}
            </motion.h2>
          </motion.div>

          <div className="space-y-6 max-w-5xl mx-auto">
            {excursions.map((exc, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: idx * 0.1 }}
                className="group relative overflow-hidden rounded-3xl border border-border/30 bg-card hover:border-accent/30 transition-all duration-500"
              >
                <div className={`grid grid-cols-1 ${idx % 2 === 0 ? 'lg:grid-cols-[1fr_1.2fr]' : 'lg:grid-cols-[1.2fr_1fr]'} gap-0`}>
                  {/* Image */}
                  <div className={`relative h-[280px] lg:h-[380px] overflow-hidden ${idx % 2 !== 0 ? 'lg:order-2' : ''}`}>
                    <img
                      src={exc.img}
                      alt={typeof exc.name === 'string' ? exc.name : exc.name[language]}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1800ms]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-card/30" />
                    {exc.featured && (
                      <div className="absolute top-6 left-6 bg-accent/20 backdrop-blur-xl text-accent text-[10px] uppercase tracking-widest font-semibold px-4 py-1.5 rounded-full border border-accent/30">
                        <Sun className="inline h-3 w-3 mr-1.5" />
                        {language === "it" ? "Consigliata" : "Recommended"}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className={`p-5 md:p-8 lg:p-12 flex flex-col justify-center ${idx % 2 !== 0 ? 'lg:order-1' : ''}`}>
                    <h3 className="font-serif text-2xl md:text-3xl lg:text-4xl text-foreground mb-3">
                      {typeof exc.name === 'string' ? exc.name : exc.name[language]}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-6 max-w-md">
                      {typeof exc.desc === 'string' ? exc.desc : exc.desc[language]}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 mb-6">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 text-accent" />
                        <span>{typeof exc.duration === 'string' ? exc.duration : exc.duration[language]}</span>
                      </div>
                      <div className="w-[1px] h-4 bg-border/40" />
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Camera className="h-4 w-4 text-accent" />
                        <span>{typeof exc.highlights === 'string' ? exc.highlights : exc.highlights[language]}</span>
                      </div>
                    </div>

                    <Button
                      className="rounded-full w-fit px-8 bg-gradient-to-r from-primary to-accent text-white hover:opacity-90 shadow-lg shadow-accent/20 border-0"
                      asChild
                    >
                      <a href="https://wa.me/393400000000" target="_blank" rel="noopener noreferrer">
                        {language === "it" ? "Prenota Escursione" : "Book Excursion"} <ArrowRight className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ CTA ══════ */}
      <section className="relative py-16 md:py-32 overflow-hidden bg-foreground">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/8 rounded-full blur-[200px] pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.h2 variants={fadeUp} className="font-serif text-3xl md:text-6xl text-white leading-tight mb-6 max-w-3xl mx-auto">
              {language === "it" ? "Esplora le Cicladi con noi" : "Explore the Cyclades with us"}
            </motion.h2>
            <motion.p variants={fadeUp} className="text-white/60 text-lg font-light max-w-lg mx-auto mb-10">
              {language === "it"
                ? "Ogni escursione è personalizzabile. Contattaci per creare il tuo itinerario su misura."
                : "Every excursion is customizable. Contact us to create your tailor-made itinerary."}
            </motion.p>
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

export default Excursions;
