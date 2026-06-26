import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Anchor, Users, Gauge, Ruler, Crown, X, ChevronLeft, ChevronRight, Images, Check } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { yachts as staticYachts } from "@/data/yachts";
import { useYachts } from "@/hooks/useSupabaseData";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.15 } } };

const Yachts = () => {
  const { language } = useLanguage();
  const [hoveredYacht, setHoveredYacht] = useState<string | null>(null);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [galleryName, setGalleryName] = useState("");

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

  const openGallery = (images: string[], name: string) => {
    setGalleryImages(images);
    setGalleryName(name);
    setGalleryIndex(0);
    setGalleryOpen(true);
  };

  const nextImage = () => setGalleryIndex((i) => (i + 1) % galleryImages.length);
  const prevImage = () => setGalleryIndex((i) => (i - 1 + galleryImages.length) % galleryImages.length);

  return (
    <Layout>
      {/* ══════ CINEMATIC VIDEO HERO ══════ */}
      <section className="relative h-[75vh] md:h-screen overflow-hidden">
        <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
          <source src="/videos/yacht-lovable.mov" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/20 via-foreground/10 to-foreground/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/60 via-transparent to-transparent" />
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[400px] bg-accent/12 rounded-full blur-[180px] pointer-events-none" />

        <div className="absolute inset-0 flex items-end pb-16 md:pb-28">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-3xl">
              <motion.span variants={fadeUp} className="inline-block text-accent text-[10px] uppercase tracking-[0.4em] md:tracking-[0.6em] font-semibold mb-4 md:mb-8 opacity-80">
                Private Charter
              </motion.span>
              <motion.h1 variants={fadeUp} className="font-serif text-4xl md:text-8xl lg:text-[10rem] text-primary-foreground leading-[0.85] mb-4 md:mb-6 drop-shadow-2xl">
                {language === "it" ? "Yacht" : "Yachts"}
              </motion.h1>
              <motion.p variants={fadeUp} className="text-primary-foreground/40 text-sm md:text-lg font-light max-w-xl leading-relaxed mb-6 md:mb-8">
                {language === "it"
                  ? <><span className="md:inline">Naviga tra le isole delle Cicladi a</span><span className="block md:inline"> bordo dei nostri yacht esclusivi</span></>
                  : "Sail through the Cyclades islands aboard our exclusive yachts."}
              </motion.p>
              <motion.div variants={fadeUp} className="flex items-center gap-4 md:gap-8 text-primary-foreground/35 text-xs md:text-sm">
                <span className="flex items-center gap-2"><Crown className="h-4 w-4 text-accent/60" /> {yachts.length} Yacht</span>
                <span className="flex items-center gap-2"><Users className="h-4 w-4 text-accent/60" /> Max 49 {language === "it" ? "ospiti" : "guests"}</span>
                <span className="hidden md:flex items-center gap-2"><Gauge className="h-4 w-4 text-accent/60" /> Max 60 knots</span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════ FLEET ══════ */}
      <section className="py-14 md:py-24 bg-background relative overflow-hidden">
        <div className="absolute top-40 -left-40 w-[600px] h-[600px] bg-accent/3 rounded-full blur-[250px] pointer-events-none" />
        <div className="container mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-20">
            <motion.span variants={fadeUp} className="text-accent text-[10px] uppercase tracking-[0.4em] font-semibold mb-4 block">
              {language === "it" ? "La Nostra Flotta" : "Our Fleet"}
            </motion.span>
            <motion.h2 variants={fadeUp} className="font-serif text-3xl md:text-5xl lg:text-6xl">
              {language === "it" ? "Scegli il tuo yacht" : "Choose your yacht"}
            </motion.h2>
          </motion.div>

          <div className="space-y-3 md:space-y-8">
            {yachts.map((yacht, idx) => (
              <motion.div
                key={yacht.slug}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: idx * 0.05 }}
                onMouseEnter={() => setHoveredYacht(yacht.slug)}
                onMouseLeave={() => setHoveredYacht(null)}
              >
                {/* Mobile: impactful vertical card */}
                <div className="md:hidden rounded-2xl overflow-hidden bg-card border border-border/20 shadow-lg">
                  {/* Large hero image */}
                  <div className="relative w-full aspect-[16/10] overflow-hidden">
                    <img src={yacht.images[0]} alt={yacht.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-transparent to-transparent" />
                    <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-foreground/50 backdrop-blur-xl border border-primary-foreground/10">
                      <span className="text-primary-foreground text-[8px] font-medium">{yacht.model}</span>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <span className="text-accent text-[8px] uppercase tracking-[0.3em] font-semibold">{yacht.year}</span>
                      <h3 className="font-serif text-lg font-bold text-primary-foreground leading-tight">{yacht.name}</h3>
                    </div>
                  </div>
                  {/* Info below */}
                  <div className="p-3.5">
                    <div className="grid grid-cols-4 gap-1.5 mb-3">
                      {[
                        { icon: Ruler, label: "Lunghezza", value: yacht.length },
                        { icon: Users, label: "Ospiti", value: `${yacht.guests}` },
                        { icon: Anchor, label: "Cabine", value: `${yacht.cabins}` },
                        { icon: Gauge, label: "Velocità", value: yacht.speed },
                      ].map((spec, i) => (
                        <div key={i} className="text-center py-1.5 rounded-lg bg-muted/40 border border-border/20">
                          <spec.icon className="h-3 w-3 text-accent mx-auto mb-0.5" />
                          <span className="block text-foreground font-semibold text-[9px]">{spec.value}</span>
                          <span className="block text-muted-foreground text-[6px] uppercase tracking-wider">{spec.label}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-muted-foreground text-[10px] leading-relaxed line-clamp-2 mb-3">{yacht.description[language]}</p>
                    
                    {/* Scopri i servizi accordion */}
                    <Accordion type="single" collapsible className="mb-3">
                      <AccordionItem value="includes" className="border-border/20">
                        <AccordionTrigger className="text-[11px] font-medium text-foreground hover:no-underline py-2 font-sans">
                          <span className="flex items-center gap-1.5 font-sans" style={{ fontFamily: 'Parkinsans, sans-serif' }}>
                            <Check className="h-3 w-3 text-accent" />
                            Scopri i servizi ({yacht.includes.length})
                          </span>
                        </AccordionTrigger>
                        <AccordionContent>
                          <ul className="grid grid-cols-1 gap-1 pt-1">
                            {yacht.includes.map((item, i) => (
                              <li key={i} className="flex items-start gap-1.5 text-muted-foreground text-[10px] leading-relaxed">
                                <Check className="h-2.5 w-2.5 text-accent mt-0.5 flex-shrink-0" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>

                    <div className="flex gap-2">
                      <button
                        onClick={() => openGallery(yacht.images, yacht.name)}
                        className="flex-1 py-2 rounded-full border border-border/30 text-[10px] font-medium text-foreground flex items-center justify-center gap-1"
                      >
                        <Images className="h-3 w-3 text-accent" /> Gallery
                      </button>
                      <a
                        href={`https://wa.me/393400000000?text=${encodeURIComponent(`Ciao, vorrei un preventivo per lo yacht ${yacht.name} (${yacht.model})`)}`}
                        target="_blank" rel="noopener noreferrer"
                        className="flex-1 py-2 rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground text-[10px] font-semibold flex items-center justify-center gap-1 shadow-md shadow-accent/20"
                      >
                        Preventivo <ArrowRight className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Desktop: full card */}
                <div className="hidden md:block group relative overflow-hidden rounded-3xl border border-border/15 bg-card hover:border-accent/25 transition-all duration-700 hover:shadow-[0_40px_100px_-25px_hsl(var(--accent)/0.15)]">
                  <div className={`grid grid-cols-1 lg:grid-cols-2 gap-0`}>
                    <div className={`relative h-[300px] lg:h-[450px] overflow-hidden ${idx % 2 === 1 ? "lg:order-2" : ""}`}>
                      <img src={yacht.images[0]} alt={yacht.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2000ms]" />
                      <div className={`absolute inset-0 ${idx % 2 === 1 ? "bg-gradient-to-l from-transparent to-card/20 lg:bg-gradient-to-l lg:from-transparent lg:to-card" : "bg-gradient-to-r from-transparent to-card/20 lg:bg-gradient-to-r lg:from-transparent lg:to-card"}`} />
                      <div className="absolute top-5 left-5 bg-foreground/50 backdrop-blur-xl rounded-full px-4 py-1.5 border border-primary-foreground/10">
                        <span className="text-primary-foreground text-xs font-medium tracking-wide">{yacht.model}</span>
                      </div>
                    </div>

                    <div className={`p-8 lg:p-12 flex flex-col justify-center ${idx % 2 === 1 ? "lg:order-1" : ""}`}>
                      <span className="text-accent text-[10px] uppercase tracking-[0.4em] font-semibold mb-3 block">{yacht.year}</span>
                      <h3 className="font-serif text-4xl lg:text-5xl mb-4">{yacht.name}</h3>
                      <p className="text-muted-foreground text-sm font-light leading-relaxed mb-8 max-w-md line-clamp-3">{yacht.description[language]}</p>

                      <div className="grid grid-cols-4 gap-3 mb-8">
                        {[
                          { icon: Ruler, label: language === "it" ? "Lunghezza" : "Length", value: yacht.length },
                          { icon: Users, label: language === "it" ? "Ospiti" : "Guests", value: `${yacht.guests}` },
                          { icon: Anchor, label: language === "it" ? "Cabine" : "Cabins", value: `${yacht.cabins}` },
                          { icon: Gauge, label: language === "it" ? "Velocità" : "Speed", value: yacht.speed },
                        ].map((spec) => (
                          <div key={spec.label} className="text-center p-3 rounded-xl bg-muted/40 border border-border/20">
                            <spec.icon className="h-3.5 w-3.5 text-accent mx-auto mb-1.5" />
                            <span className="block text-foreground font-semibold text-sm">{spec.value}</span>
                            <span className="block text-muted-foreground text-[9px] uppercase tracking-wider mt-0.5">{spec.label}</span>
                          </div>
                        ))}
                      </div>

                      <Accordion type="single" collapsible className="mb-6">
                        <AccordionItem value="includes" className="border-border/20">
                          <AccordionTrigger className="text-sm font-medium text-foreground hover:no-underline py-3 font-sans">
                            <span className="flex items-center gap-2 font-sans">
                              <Check className="h-4 w-4 text-accent" />
                              {language === "it" ? "Scopri i servizi" : "Discover services"} ({yacht.includes.length})
                            </span>
                          </AccordionTrigger>
                          <AccordionContent>
                            <ul className="grid grid-cols-2 gap-1.5 pt-1">
                              {yacht.includes.map((item, i) => (
                                <li key={i} className="flex items-start gap-2 text-muted-foreground text-xs leading-relaxed">
                                  <Check className="h-3 w-3 text-accent mt-0.5 flex-shrink-0" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>

                      <div className="flex gap-3">
                        <Button variant="outline" className="rounded-full px-6 py-5 text-sm font-medium border-border/30 hover:border-accent/40 hover:bg-accent/5 transition-all duration-500" onClick={() => openGallery(yacht.images, yacht.name)}>
                          <Images className="h-4 w-4 mr-2 text-accent" />
                          {language === "it" ? "Galleria foto" : "Photo gallery"}
                        </Button>
                        <Button className="rounded-full px-6 py-5 text-sm font-semibold bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90 shadow-lg shadow-accent/15 border-0"
                          onClick={() => {
                            import("@/integrations/supabase/client").then(({ supabase }) => {
                              supabase.from("bookings").insert({
                                service_type: "yacht",
                                service_name: `${yacht.name} (${yacht.model})`,
                                customer_name: "WhatsApp Lead",
                                message: `Richiesta preventivo yacht ${yacht.name}`,
                                source: "whatsapp",
                              } as any).then(() => {});
                            });
                            window.open(`https://wa.me/393400000000?text=${encodeURIComponent(`Ciao, vorrei un preventivo per lo yacht ${yacht.name} (${yacht.model})`)}`, "_blank");
                          }}
                        >
                            {language === "it" ? "Richiedi preventivo" : "Request quote"} <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className={`absolute -bottom-20 ${idx % 2 === 1 ? '-left-20' : '-right-20'} w-[300px] h-[300px] rounded-full bg-accent/8 blur-[120px] pointer-events-none transition-opacity duration-700 ${hoveredYacht === yacht.slug ? 'opacity-100' : 'opacity-0'}`} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ CTA ══════ */}
      <section className="relative py-16 md:py-28 overflow-hidden bg-foreground">
        <div className="absolute inset-0">
          <video autoPlay muted loop playsInline className="w-full h-full object-cover opacity-25">
            <source src="/videos/yacht-lovable.mov" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/80 to-foreground/60" />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/8 rounded-full blur-[200px] pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.span variants={fadeUp} className="text-accent text-[10px] uppercase tracking-[0.4em] font-semibold mb-6 block">
              {language === "it" ? "Charter Esclusivo" : "Exclusive Charter"}
            </motion.span>
            <motion.h2 variants={fadeUp} className="font-serif text-3xl md:text-6xl text-primary-foreground leading-tight mb-8 md:mb-10 max-w-3xl mx-auto">
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

      {/* ══════ FULLSCREEN GALLERY MODAL ══════ */}
      <Dialog open={galleryOpen} onOpenChange={setGalleryOpen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] w-full h-full p-0 border-0 bg-foreground/95 backdrop-blur-2xl rounded-2xl overflow-hidden [&>button]:hidden">
          <div className="relative w-full h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-primary-foreground/10">
              <div>
                <h3 className="font-serif text-xl text-primary-foreground">{galleryName}</h3>
                <span className="text-primary-foreground/40 text-xs">{galleryIndex + 1} / {galleryImages.length}</span>
              </div>
              <button onClick={() => setGalleryOpen(false)} className="p-2 rounded-full hover:bg-primary-foreground/10 transition-colors">
                <X className="h-5 w-5 text-primary-foreground/70" />
              </button>
            </div>

            {/* Image area */}
            <div className="flex-1 relative flex items-center justify-center p-4 md:p-8 min-h-0">
              <AnimatePresence mode="wait">
                <motion.img
                  key={galleryIndex}
                  src={galleryImages[galleryIndex]}
                  alt={`${galleryName} ${galleryIndex + 1}`}
                  className="max-w-full max-h-full object-contain rounded-xl"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                />
              </AnimatePresence>

              {galleryImages.length > 1 && (
                <>
                  <button onClick={prevImage} className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 backdrop-blur-sm transition-colors">
                    <ChevronLeft className="h-5 w-5 text-primary-foreground" />
                  </button>
                  <button onClick={nextImage} className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 backdrop-blur-sm transition-colors">
                    <ChevronRight className="h-5 w-5 text-primary-foreground" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {galleryImages.length > 1 && (
              <div className="flex items-center justify-center gap-2 px-6 py-4 border-t border-primary-foreground/10 overflow-x-auto">
                {galleryImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setGalleryIndex(i)}
                    className={`flex-shrink-0 w-16 h-12 md:w-20 md:h-14 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                      i === galleryIndex ? "border-accent opacity-100 scale-105" : "border-transparent opacity-50 hover:opacity-80"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Yachts;
