import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Ruler, Users, Anchor, Gauge, Calendar, Ship, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/i18n/LanguageContext";
import Layout from "@/components/layout/Layout";
import { yachts as staticYachts } from "@/data/yachts";
import { useYachts } from "@/hooks/useSupabaseData";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

const YachtDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { language } = useLanguage();
  const [currentImage, setCurrentImage] = useState(0);

  const { data: dbYachts } = useYachts();
  const yachts = useMemo(() => {
    if (dbYachts && dbYachts.length > 0) {
      return dbYachts.map((y) => ({
        slug: y.slug,
        name: y.name,
        model: y.model || "",
        length: y.length || "",
        guests: y.guests || 0,
        overnightGuests: y.overnight_guests || 0,
        cabins: y.cabins || 0,
        crew: y.crew || 0,
        speed: y.speed || "",
        year: y.year || "",
        engines: y.engines || "",
        description: { it: y.description_it || "", en: y.description_en || "" },
        includes: y.includes || [],
        images: y.images || [],
      }));
    }
    return staticYachts;
  }, [dbYachts]);

  const yacht = yachts.find(y => y.slug === slug);

  if (!yacht) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6">
          <h1 className="font-serif text-4xl font-bold">Yacht non trovato</h1>
          <Link to="/yachts" className="inline-flex items-center gap-2 text-accent hover:underline">
            <ArrowLeft className="h-4 w-4" /> {language === "it" ? "Torna alla flotta" : "Back to fleet"}
          </Link>
        </div>
      </Layout>
    );
  }

  const otherYachts = yachts.filter(y => y.slug !== yacht.slug).slice(0, 3);

  const nextImage = () => setCurrentImage((prev) => (prev + 1) % yacht.images.length);
  const prevImage = () => setCurrentImage((prev) => (prev - 1 + yacht.images.length) % yacht.images.length);

  const specs = [
    { icon: Ruler, label: language === "it" ? "Lunghezza" : "Length", value: yacht.length },
    { icon: Users, label: language === "it" ? "Ospiti" : "Guests", value: `${yacht.guests}` },
    { icon: Anchor, label: language === "it" ? "Cabine" : "Cabins", value: `${yacht.cabins}` },
    { icon: Ship, label: language === "it" ? "Equipaggio" : "Crew", value: `${yacht.crew}` },
    { icon: Gauge, label: language === "it" ? "Velocità" : "Speed", value: yacht.speed },
    { icon: Calendar, label: language === "it" ? "Anno" : "Year", value: yacht.year },
  ];

  return (
    <Layout>
      {/* ═══ HERO — Full screen gallery ═══ */}
      <section className="relative h-screen overflow-hidden bg-foreground">
        {/* Image with crossfade */}
        {yacht.images.map((img, i) => (
          <motion.img
            key={i}
            src={img}
            alt={yacht.name}
            className="absolute inset-0 w-full h-full object-cover"
            initial={false}
            animate={{ opacity: i === currentImage ? 1 : 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
        ))}
        
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/20 via-transparent to-foreground/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/50 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[300px] bg-accent/10 rounded-full blur-[150px] pointer-events-none" />

        {/* Navigation arrows */}
        {yacht.images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-card/20 backdrop-blur-xl border border-primary-foreground/10 flex items-center justify-center text-primary-foreground hover:bg-card/40 transition-all"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-card/20 backdrop-blur-xl border border-primary-foreground/10 flex items-center justify-center text-primary-foreground hover:bg-card/40 transition-all"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            {/* Dots */}
            <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
              {yacht.images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImage(i)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${i === currentImage ? "bg-accent w-6" : "bg-primary-foreground/30 hover:bg-primary-foreground/50"}`}
                />
              ))}
            </div>
          </>
        )}

        {/* Content overlay */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <div className="container mx-auto px-6 pb-16">
            <motion.div initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 0.3 }}>
              <Link to="/yachts" className="inline-flex items-center gap-2 text-primary-foreground/50 hover:text-primary-foreground transition-colors mb-6 text-sm">
                <ArrowLeft className="h-3.5 w-3.5" /> {language === "it" ? "Torna alla flotta" : "Back to fleet"}
              </Link>
              <div className="flex items-end gap-4 mb-2">
                <span className="text-accent text-[10px] uppercase tracking-[0.4em] font-semibold">{yacht.model}</span>
              </div>
              <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-primary-foreground leading-[0.9] drop-shadow-2xl">
                {yacht.name}
              </h1>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ SPECS BAR ═══ */}
      <section className="relative -mt-1 z-20 bg-foreground">
        <div className="container mx-auto px-6 py-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="grid grid-cols-3 md:grid-cols-6 gap-6"
          >
            {specs.map((spec) => (
              <div key={spec.label} className="text-center">
                <spec.icon className="h-5 w-5 text-accent mx-auto mb-2" />
                <span className="block text-primary-foreground font-bold text-lg">{spec.value}</span>
                <span className="block text-primary-foreground/30 text-[10px] uppercase tracking-[0.2em] mt-1">{spec.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
      </section>

      {/* ═══ CONTENT ═══ */}
      <section className="py-20 md:py-28 bg-background relative overflow-hidden">
        <div className="absolute top-40 -right-20 w-[500px] h-[500px] bg-accent/3 rounded-full blur-[200px] pointer-events-none" />
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
            {/* Main */}
            <motion.div className="lg:col-span-3 space-y-16" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ visible: { transition: { staggerChildren: 0.12 } } }}>
              {/* Description */}
              <motion.div variants={fadeUp}>
                <span className="text-accent text-[10px] uppercase tracking-[0.4em] font-semibold mb-4 block">
                  {language === "it" ? "Lo Yacht" : "The Yacht"}
                </span>
                <h2 className="font-serif text-3xl md:text-5xl font-bold mb-6 leading-tight">
                  {language === "it" ? "Un'esperienza unica" : "A unique experience"}
                </h2>
                <p className="text-muted-foreground text-lg leading-[1.9]">{yacht.description[language]}</p>
              </motion.div>

              {/* Engines */}
              <motion.div variants={fadeUp}>
                <div className="rounded-2xl bg-foreground p-8">
                  <div className="flex items-center gap-2 mb-3">
                    <Gauge className="h-4 w-4 text-accent" />
                    <span className="text-accent text-[10px] uppercase tracking-[0.3em] font-bold">{language === "it" ? "Motorizzazione" : "Engines"}</span>
                  </div>
                  <p className="text-primary-foreground text-xl font-semibold">{yacht.engines}</p>
                </div>
              </motion.div>

              {/* Second image */}
              {yacht.images.length > 1 && (
                <motion.div variants={fadeUp}>
                  <div className="rounded-3xl overflow-hidden">
                    <img src={yacht.images[1]} alt={yacht.name} className="w-full h-[400px] object-cover" />
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* Sidebar */}
            <motion.div className="lg:col-span-2" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.4 }}>
              <div className="sticky top-28 space-y-6">
                {/* CTA Card */}
                <div className="rounded-3xl overflow-hidden shadow-2xl">
                  <div className="bg-gradient-to-br from-foreground to-foreground/95 p-8">
                    <span className="text-accent text-[10px] uppercase tracking-[0.3em] font-bold mb-2 block">
                      {language === "it" ? "Charter Privato" : "Private Charter"}
                    </span>
                    <h3 className="text-2xl font-bold text-primary-foreground mb-2">{yacht.name}</h3>
                    <p className="text-primary-foreground/40 text-sm mb-6">
                      {language === "it"
                        ? "Contattaci per un preventivo personalizzato per il tuo charter privato."
                        : "Contact us for a personalized quote for your private charter."}
                    </p>
                    <Button
                      className="w-full rounded-xl py-6 bg-gradient-to-r from-primary to-accent text-primary-foreground font-bold shadow-xl shadow-accent/20 border-0 hover:opacity-90"
                      asChild
                    >
                      <a href="https://wa.me/393400000000" target="_blank" rel="noopener noreferrer">
                        {language === "it" ? "Richiedi Preventivo" : "Request Quote"} <ArrowRight className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>

                {/* Included services */}
                <div className="rounded-3xl bg-card border border-border/20 p-7">
                  <span className="text-accent text-[10px] uppercase tracking-[0.3em] font-bold mb-5 block">
                    {language === "it" ? "Servizi Inclusi" : "Included Services"}
                  </span>
                  <div className="space-y-3">
                    {yacht.includes.map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                          <Check className="h-3 w-3 text-accent" />
                        </div>
                        <span className="text-sm text-foreground font-medium">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ OTHER YACHTS ═══ */}
      {otherYachts.length > 0 && (
        <section className="py-20 bg-muted/15 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-accent/3 rounded-full blur-[200px] pointer-events-none" />
          <div className="container mx-auto px-6 relative z-10">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mb-12">
              <h2 className="font-serif text-3xl md:text-4xl font-bold">
                {language === "it" ? "Scopri la Flotta" : "Explore the Fleet"}
              </h2>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {otherYachts.map((y, i) => (
                <motion.div
                  key={y.slug}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link to={`/yachts/${y.slug}`}>
                    <div className="group rounded-2xl overflow-hidden bg-card border border-border/15 hover:border-accent/25 hover:shadow-[0_30px_80px_-20px_hsl(var(--accent)/0.15)] transition-all duration-500">
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <img src={y.images[0]} alt={y.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1500ms]" />
                        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
                        <div className="absolute bottom-4 left-5">
                          <span className="text-primary-foreground/50 text-[9px] uppercase tracking-wider font-semibold">{y.model}</span>
                          <h3 className="font-serif text-xl font-bold text-primary-foreground">{y.name}</h3>
                        </div>
                      </div>
                      <div className="p-5 flex items-center justify-between text-xs text-muted-foreground">
                        <span>{y.length}</span>
                        <span>{y.guests} {language === "it" ? "ospiti" : "guests"}</span>
                        <span>{y.speed}</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ CTA ═══ */}
      <section className="relative py-28 bg-foreground overflow-hidden">
        <div className="absolute inset-0">
          <video autoPlay muted loop playsInline className="w-full h-full object-cover opacity-25">
            <source src="/videos/yachts.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/80 to-foreground/60" />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/8 rounded-full blur-[200px] pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
            <motion.span variants={fadeUp} className="text-accent text-[10px] uppercase tracking-[0.4em] font-semibold mb-6 block">
              {language === "it" ? "Charter Esclusivo" : "Exclusive Charter"}
            </motion.span>
            <motion.h2 variants={fadeUp} className="font-serif text-4xl md:text-6xl text-primary-foreground leading-tight mb-6 max-w-3xl mx-auto">
              {language === "it" ? "Il mare delle Cicladi ti aspetta" : "The Cyclades sea awaits you"}
            </motion.h2>
            <motion.div variants={fadeUp}>
              <Button
                size="lg"
                className="rounded-full px-12 py-6 text-sm font-semibold bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90 shadow-xl shadow-accent/20 border-0"
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

export default YachtDetail;
