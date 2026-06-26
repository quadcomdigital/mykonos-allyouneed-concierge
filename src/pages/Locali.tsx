import { useRef, useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Clock, Utensils, Sun, Music, Search, X, Sparkles, Info } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import Layout from "@/components/layout/Layout";
import heroLocaliAsset from "@/assets/pagina-locali.png.asset.json";
const heroLocali = heroLocaliAsset.url;
import { useVenues, useEvents } from "@/hooks/useSupabaseData";
import { BOOKING_MODES, getBookingMode, resolveBookingMode, type BookingMode } from "@/lib/bookingModes";

type VenueCategory = "all" | "restaurant" | "beachclub" | "club";

const categoryConfig = {
  restaurant: { icon: Utensils, label: { it: "Ristorante", en: "Restaurant" } },
  beachclub: { icon: Sun, label: { it: "Beach Club", en: "Beach Club" } },
  club: { icon: Music, label: { it: "Club", en: "Club" } },
} as const;

const Locali = () => {
  const { language } = useLanguage();
  const [categoryFilter, setCategoryFilter] = useState<VenueCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const heroRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

  const { data: dbVenues } = useVenues();
  const { data: dbEvents } = useEvents();

  const venues = useMemo(() => (dbVenues || []).map((v) => ({
    slug: v.slug, name: v.name, category: v.category as VenueCategory, zone: v.zone || "",
    desc: v.description || "", image: v.image_url || "/placeholder.svg",
    openingHours: v.opening_hours || "", cuisine: v.cuisine || "", musicStyle: v.music_style || "",
    highlights: v.highlights || [],
    bookingMode: resolveBookingMode((v as any).booking_mode),
  })), [dbVenues]);

  const events = useMemo(() => (dbEvents || []).map((e) => ({
    id: e.id, date: e.date, dj: e.dj, venueSlug: e.venue_slug || "",
  })), [dbEvents]);

  const filteredVenues = useMemo(() => venues
    .filter((v) => categoryFilter === "all" || v.category === categoryFilter)
    .filter((v) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return v.name.toLowerCase().includes(q) || v.zone.toLowerCase().includes(q) || v.cuisine.toLowerCase().includes(q);
    }), [venues, categoryFilter, searchQuery]);

  const getVenueEvents = useCallback((slug: string) => {
    const now = new Date();
    return events.filter((e) => e.venueSlug === slug && new Date(e.date) >= now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 2);
  }, [events]);

  const formatDay = (iso: string) => {
    const d = new Date(iso + "T00:00:00");
    const months = language === "it" ? ["Gen","Feb","Mar","Apr","Mag","Giu","Lug","Ago","Set","Ott","Nov","Dic"] : ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    return `${d.getDate()} ${months[d.getMonth()]}`;
  };

  const getCatConfig = (cat: string) => categoryConfig[cat as keyof typeof categoryConfig] || categoryConfig.beachclub;
  const categoryFilters: { key: VenueCategory; label: string }[] = [
    { key: "all", label: language === "it" ? "Tutti" : "All" },
    { key: "restaurant", label: language === "it" ? "Ristoranti" : "Restaurants" },
    { key: "beachclub", label: "Beach Club" },
    { key: "club", label: "Club" },
  ];

  return (
    <Layout>
      {/* HERO */}
      <section ref={heroRef} className="relative h-[58svh] md:h-[70svh] overflow-hidden">
        <motion.div className="absolute inset-0" style={{ scale: heroScale }}>
          <img src={heroLocali} alt="" className="h-full w-full object-cover" />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/30 via-foreground/55 to-foreground" />
        <motion.div style={{ opacity: heroOpacity }} className="relative z-10 flex h-full flex-col justify-end pb-10 md:pb-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-10">
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}>
              <div className="mb-4 md:mb-6 flex items-center gap-3">
                <span className="h-px w-8 md:w-12 bg-accent/60" />
                <p className="font-sans text-[9px] md:text-[10px] uppercase tracking-[0.45em] md:tracking-[0.6em] text-accent/90">Mykonos · Partner</p>
              </div>
              <h1 className="font-serif text-[2.6rem] md:text-8xl lg:text-[8.5rem] leading-[0.9] text-primary-foreground tracking-tight">
                {language === "it" ? "Locali" : "Venues"}
              </h1>
              <p className="mt-4 md:mt-6 max-w-md font-sans text-[12.5px] md:text-[13.5px] leading-[1.7] md:leading-[1.8] text-primary-foreground/55">
                {language === "it"
                  ? "I luoghi più ambiti dell'isola, scelti uno a uno."
                  : "The island's most coveted places, hand-picked."}
              </p>
            </motion.div>
          </div>
        </motion.div>
      </section>


      {/* STICKY FILTERS */}
      <nav className="sticky top-16 z-40 border-b border-primary-foreground/[0.05] bg-foreground/[0.97] backdrop-blur-2xl">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10 py-3 flex items-center gap-2 overflow-x-auto scrollbar-hide">
          {categoryFilters.map((f) => {
            const cfg = f.key !== "all" ? categoryConfig[f.key] : null;
            const Icon = cfg?.icon;
            const active = categoryFilter === f.key;
            return (
              <button key={f.key} onClick={() => setCategoryFilter(f.key)}
                className={`shrink-0 flex items-center gap-1.5 whitespace-nowrap px-3 py-1 font-sans text-[10px] uppercase tracking-[0.2em] md:tracking-[0.22em] transition border ${active ? "border-primary-foreground/25 bg-primary-foreground/[0.06] text-primary-foreground" : "border-transparent text-primary-foreground/35 hover:text-primary-foreground/60"}`}>
                {Icon && <Icon className="h-3 w-3" />}{f.label}
              </button>
            );
          })}
          <div className="ml-auto" />
          <div className="relative shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-primary-foreground/30" />
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === "it" ? "Cerca..." : "Search..."}
              className="w-32 md:w-60 border border-primary-foreground/[0.08] bg-primary-foreground/[0.04] pl-8 pr-3 py-1.5 font-sans text-[11px] text-primary-foreground placeholder:text-primary-foreground/25 outline-none focus:border-accent/30" />
            {searchQuery && <button onClick={() => setSearchQuery("")} className="absolute right-2 top-1/2 -translate-y-1/2"><X className="h-3 w-3 text-primary-foreground/40" /></button>}
          </div>
        </div>
      </nav>


      {/* VENUES GRID */}
      <section className="bg-foreground py-10 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10">
          <div className="mb-6 md:mb-10 flex items-end justify-between flex-wrap gap-3">
            <div>
              <div className="mb-2.5 md:mb-3 flex items-center gap-3">
                <span className="h-px w-8 md:w-10 bg-accent/40" />
                <p className="text-[9px] uppercase tracking-[0.4em] md:tracking-[0.5em] text-accent/75 font-sans">{language === "it" ? "Collezione" : "Collection"}</p>
              </div>
              <h2 className="text-[22px] md:text-4xl font-sans font-bold tracking-tight text-primary-foreground">
                {language === "it" ? "I locali partner" : "Our partner venues"}
              </h2>
              <p className="mt-2 font-sans text-[11.5px] md:text-[12px] text-primary-foreground/45 max-w-xl">
                {language === "it" ? "Ogni card indica come si prenota: cena, lunch con musica, lettini in spiaggia, tavolo privé o accredito QR." : "Each card shows how to book: dinner, lunch with music, beach daybeds, privé table or QR pass."}
              </p>
            </div>
            <span className="border border-accent/20 bg-accent/5 px-2.5 md:px-3 py-1 text-[9.5px] md:text-[10px] text-accent tracking-wider font-sans">{filteredVenues.length} {language === "it" ? "locali" : "venues"}</span>
          </div>

          {filteredVenues.length === 0 ? (
            <div className="text-center py-20 md:py-24">
              <Sparkles className="mx-auto h-8 w-8 text-accent/40 mb-3" />
              <p className="text-primary-foreground/40">{language === "it" ? "Nessun locale trovato" : "No venues found"}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              <AnimatePresence mode="popLayout">
                {filteredVenues.map((venue, i) => {
                  const cat = getCatConfig(venue.category);
                  const CatIcon = cat.icon;
                  const nextEvents = getVenueEvents(venue.slug);
                  return (
                    <motion.div
                      key={venue.slug}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ delay: Math.min(i, 18) * 0.04, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                      className="group relative"
                    >
                      <Link
                        to={`/locali/${venue.slug}`}
                        className="relative flex flex-col h-full overflow-hidden rounded-3xl border border-primary-foreground/[0.06] bg-primary-foreground/[0.02] transition-all duration-500 hover:border-accent/40 hover:bg-primary-foreground/[0.04] hover:-translate-y-1 hover:shadow-2xl hover:shadow-accent/10"
                      >
                        {/* Image */}
                        <div className="relative aspect-[4/3] overflow-hidden bg-foreground/40">
                          <img
                            src={venue.image}
                            alt={venue.name}
                            loading="lazy"
                            className="absolute inset-0 h-full w-full object-cover transition-all duration-[1400ms] ease-out group-hover:scale-[1.07]"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/15 to-transparent" />
                          {/* Animated sheen */}
                          <div className="pointer-events-none absolute -inset-x-1/3 -top-1/3 h-1/2 rotate-12 bg-gradient-to-r from-transparent via-primary-foreground/10 to-transparent translate-x-[-150%] transition-transform duration-[1400ms] ease-out group-hover:translate-x-[150%]" />

                          {/* Zone */}
                          <div className="absolute bottom-2.5 md:bottom-3 left-3 md:left-4 right-3 md:right-4 flex items-center gap-1.5 text-[9.5px] md:text-[10px] uppercase tracking-[0.25em] md:tracking-[0.3em] text-primary-foreground/80 font-sans">
                            <MapPin className="h-3 w-3 text-accent/85 shrink-0" /><span className="truncate">{venue.zone}</span>
                          </div>
                        </div>

                        {/* Body */}
                        <div className="flex flex-col flex-1 p-4 md:p-6">
                          {(() => {
                            const bm = getBookingMode(venue.bookingMode);
                            const BMI = bm.icon;
                            return (
                              <div className="mb-2 md:mb-2.5 flex items-center gap-1.5 md:gap-2 text-[9px] md:text-[9.5px] uppercase tracking-[0.24em] md:tracking-[0.28em] text-primary-foreground/45 font-sans">
                                <CatIcon className="h-2.5 w-2.5 text-accent/70 shrink-0" />
                                <span>{cat.label[language as "it" | "en"]}</span>
                                <span className="text-primary-foreground/20">·</span>
                                <BMI className="h-2.5 w-2.5 text-accent/70 shrink-0" />
                                <span className="truncate">{bm.shortLabel[language as "it" | "en"]}</span>
                              </div>
                            );
                          })()}

                          <h3 className="font-sans font-bold text-[17px] md:text-[20px] tracking-tight leading-tight text-primary-foreground transition-colors duration-300 group-hover:text-accent">
                            {venue.name}
                          </h3>
                          {venue.desc && (
                            <p className="mt-1.5 md:mt-2 line-clamp-2 text-[12px] md:text-[12.5px] leading-[1.6] md:leading-[1.65] text-primary-foreground/55">
                              {venue.desc}
                            </p>
                          )}

                          {/* Next event preview */}
                          {nextEvents.length > 0 && (
                            <div className="mt-3 md:mt-4 flex items-center gap-2 border-t border-primary-foreground/[0.06] pt-2.5 md:pt-3">
                              <Clock className="h-3 w-3 text-accent/70 shrink-0" />
                              <span className="text-[9.5px] md:text-[10px] uppercase tracking-[0.24em] md:tracking-[0.28em] text-accent/85 shrink-0">{language === "it" ? "Prossimo" : "Next"}</span>
                              <span className="truncate text-[11px] md:text-[11.5px] text-primary-foreground/65">
                                <span className="text-primary-foreground/90">{formatDay(nextEvents[0].date)}</span> · {nextEvents[0].dj}
                              </span>
                            </div>
                          )}

                          {/* CTA */}
                          <div className="mt-4 md:mt-5 flex items-center justify-between pt-1">
                            <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent px-4 md:px-5 py-2 md:py-2.5 text-[12px] md:text-[13px] font-semibold tracking-normal text-white shadow-md shadow-accent/25 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-accent/50 group-hover:translate-x-0.5">
                              {language === "it" ? "Scopri il locale" : "Discover venue"}
                              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                            </span>
                            <span className="text-[9px] font-mono uppercase tracking-[0.3em] md:tracking-[0.35em] text-primary-foreground/30">
                              {String(i + 1).padStart(2, "0")}
                            </span>
                          </div>
                        </div>

                        {/* Hover ring */}
                        <div className="pointer-events-none absolute inset-0 rounded-3xl ring-0 ring-accent/0 transition-all duration-500 group-hover:ring-1 group-hover:ring-accent/30" />
                      </Link>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

          )}

          <div className="mt-10 md:mt-16 text-center">
            <Link to="/eventi" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent px-6 md:px-7 py-3 md:py-3.5 text-[10px] font-bold uppercase tracking-[0.28em] md:tracking-[0.35em] text-white shadow-lg shadow-accent/30 hover:shadow-accent/55 transition">
              {language === "it" ? "Vedi gli eventi" : "See the events"} <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

    </Layout>
  );
};

export default Locali;
