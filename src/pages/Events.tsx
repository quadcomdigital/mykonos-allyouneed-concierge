import { useState, useRef, useMemo } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import Layout from "@/components/layout/Layout";
import heroEvents from "@/assets/hero-eventi.jpg";
import { specialEvents as staticSpecialEvents, weeklyLineups, months } from "@/data/events";
import { useEvents } from "@/hooks/useSupabaseData";

const formatDate = (iso: string) => {
  const d = new Date(iso);
  const days = ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"];
  const monthNames = ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"];
  return { dayName: days[d.getDay()], dayNum: d.getDate(), month: monthNames[d.getMonth()] };
};

const Events = () => {
  const { language } = useLanguage();
  const [monthFilter, setMonthFilter] = useState("all");
  const [venueFilter, setVenueFilter] = useState("all");
  const [openLineup, setOpenLineup] = useState<string | null>(null);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const { data: dbEvents } = useEvents();
  const specialEvents = useMemo(() => {
    if (dbEvents && dbEvents.length > 0) {
      return dbEvents.map((e) => ({
        id: e.id,
        date: e.date,
        title: e.dj,
        dj: e.dj,
        venue: e.venue_name || "",
        venueSlug: e.venue_slug || "",
        venueImage: e.image_url || "/placeholder.svg",
        type: "special" as const,
        description: e.description || "",
        highlight: e.highlight || false,
        tag: e.tag || "",
      }));
    }
    return staticSpecialEvents;
  }, [dbEvents]);

  const venuesList = useMemo(() =>
    Array.from(new Set(specialEvents.map(e => e.venue))).sort(),
    [specialEvents]
  );

  const filtered = specialEvents.filter((e) => {
    const matchMonth = monthFilter === "all" || e.date.slice(5, 7) === monthFilter;
    const matchVenue = venueFilter === "all" || e.venue === venueFilter;
    return matchMonth && matchVenue;
  });

  const featured = filtered.filter(e => e.highlight).slice(0, 2);
  const rest = filtered.filter(e => !featured.includes(e));

  return (
    <Layout>
      {/* ── HERO ── */}
      <section ref={heroRef} className="relative h-[85vh] md:h-screen overflow-hidden">
        <motion.img src={heroEvents} alt="" className="w-full h-full object-cover" style={{ scale: heroScale }} />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/20 via-foreground/50 to-foreground" />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/40 via-transparent to-transparent" />

        <motion.div style={{ opacity: heroOpacity }} className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-6 pb-20 md:pb-28">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="text-primary-foreground/40 text-xs uppercase tracking-[0.4em] mb-6">
                Summer Season 2025
              </p>
              <h1 className="font-serif text-4xl md:text-7xl lg:text-8xl text-primary-foreground leading-[0.95] mb-5 max-w-3xl">
                {language === "it" ? "Eventi" : "Events"}
              </h1>
              <div className="h-[1px] w-24 bg-gradient-to-r from-accent/80 to-transparent" />
            </motion.div>
          </div>
        </motion.div>
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* ── FILTERS ── */}
      <section className="sticky top-16 z-40 border-b border-border/10">
        <div className="absolute inset-0 bg-gradient-to-r from-background via-card/95 to-background backdrop-blur-2xl" />
        <div className="container mx-auto px-6 relative">
          <div className="flex items-center gap-3 md:gap-5 py-4 overflow-x-auto">
            <div className="flex items-center gap-2.5 rounded-full bg-gradient-to-r from-primary/[0.06] to-accent/[0.04] border border-border/15 px-4 py-2">
              <span className="text-[10px] text-muted-foreground/70 uppercase tracking-widest">Mese</span>
              <div className="relative">
                <select value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)} className="appearance-none bg-transparent text-[13px] font-medium text-foreground cursor-pointer pr-5 focus:outline-none">
                  {months.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground/50 pointer-events-none" />
              </div>
            </div>

            <div className="flex items-center gap-2.5 rounded-full bg-gradient-to-r from-accent/[0.04] to-primary/[0.06] border border-border/15 px-4 py-2">
              <span className="text-[10px] text-muted-foreground/70 uppercase tracking-widest">Venue</span>
              <div className="relative">
                <select value={venueFilter} onChange={(e) => setVenueFilter(e.target.value)} className="appearance-none bg-transparent text-[13px] font-medium text-foreground cursor-pointer pr-5 focus:outline-none">
                  <option value="all">{language === "it" ? "Tutti" : "All"}</option>
                  {venuesList.map(v => <option key={v} value={v}>{v}</option>)}
                </select>
                <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground/50 pointer-events-none" />
              </div>
            </div>

            <Link to="/locations" className="ml-auto hidden md:block text-[12px] text-muted-foreground/60 hover:text-accent transition-colors tracking-wide">
              {language === "it" ? "Tutte le locations" : "All locations"} →
            </Link>
          </div>
        </div>
      </section>

      {/* ── FEATURED ── */}
      {featured.length > 0 && (
        <section className="py-16 md:py-24 bg-background relative overflow-hidden">
          <div className="absolute top-20 -left-40 w-[500px] h-[500px] bg-accent/[0.03] rounded-full blur-[200px] pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-primary/[0.04] rounded-full blur-[180px] pointer-events-none" />

          <div className="container mx-auto px-6 relative z-10">
            <p className="text-[10px] text-muted-foreground/60 uppercase tracking-[0.4em] mb-10">
              {language === "it" ? "In evidenza" : "Featured"}
            </p>

            <AnimatePresence mode="wait">
              <motion.div
                key={monthFilter + venueFilter + "feat"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
              >
                {featured.map((ev) => {
                  const dt = formatDate(ev.date);
                  return (
                    <motion.div key={ev.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
                      <Link to={`/locations/${ev.venueSlug}`}>
                        <div className="group relative aspect-[3/4] md:aspect-[4/5] rounded-2xl overflow-hidden">
                          <img src={ev.venueImage} alt={ev.venue} className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-[1800ms]" />
                          <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/30 to-transparent" />
                          <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-accent/5" />

                          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                            <p className="text-primary-foreground/30 text-[10px] uppercase tracking-[0.3em] mb-3">
                              {dt.dayNum} {dt.month} — {ev.venue}
                            </p>
                            <h3 className="font-serif text-3xl md:text-4xl text-primary-foreground leading-[1] mb-3">
                              {ev.dj}
                            </h3>
                            <p className="text-primary-foreground/25 text-[13px] leading-relaxed max-w-sm mb-4 line-clamp-2 font-light">
                              {ev.description}
                            </p>
                            {ev.tag && (
                              <p className="text-accent/60 text-[10px] tracking-wider uppercase">{ev.tag}</p>
                            )}
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>
        </section>
      )}

      {/* ── FULL CALENDAR ── */}
      <section className="py-16 md:py-24 bg-background relative overflow-hidden">
        <div className="absolute bottom-20 -right-40 w-[500px] h-[500px] bg-primary/[0.03] rounded-full blur-[200px] pointer-events-none" />

        <div className="container mx-auto px-6 relative z-10">
          <p className="text-[10px] text-muted-foreground/60 uppercase tracking-[0.4em] mb-10">
            {language === "it" ? "Calendario" : "Calendar"}
          </p>

          <AnimatePresence mode="wait">
            <motion.div key={monthFilter + venueFilter + "cal"} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <div className="rounded-2xl overflow-hidden border border-border/8 bg-gradient-to-b from-card/90 via-card/60 to-card/40">
                {(featured.length > 0 ? rest : filtered).map((ev, i) => {
                  const dt = formatDate(ev.date);
                  return (
                    <motion.div key={ev.id} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.02 }}>
                      <Link to={`/locations/${ev.venueSlug}`}>
                        <div className="group grid grid-cols-12 items-center py-5 md:py-6 px-5 md:px-8 border-b border-border/6 last:border-0 hover:bg-accent/[0.02] transition-colors duration-300">
                          <div className="col-span-3 md:col-span-2">
                            <span className="text-muted-foreground/60 text-[13px] font-light">{dt.dayNum} {dt.month}</span>
                          </div>
                          <div className="col-span-6 md:col-span-4">
                            <span className="font-serif text-lg md:text-xl text-foreground group-hover:text-accent transition-colors duration-300 truncate block">{ev.dj}</span>
                          </div>
                          <div className="hidden md:block md:col-span-3">
                            <span className="text-muted-foreground/40 text-[13px] font-light">{ev.venue}</span>
                          </div>
                          <div className="hidden md:block md:col-span-2">
                            {ev.tag && <span className="text-accent/40 text-[10px] tracking-wider uppercase">{ev.tag}</span>}
                          </div>
                          <div className="col-span-3 md:col-span-1 text-right">
                            <ArrowRight className="inline h-3.5 w-3.5 text-border/50 group-hover:text-accent transition-colors" />
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>

          {filtered.length === 0 && (
            <p className="py-20 text-center text-muted-foreground/50 font-light">{language === "it" ? "Nessun evento trovato" : "No events found"}</p>
          )}
        </div>
      </section>

      {/* ── WEEKLY LINEUPS ── */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-foreground via-foreground to-primary/20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-accent/[0.04] rounded-full blur-[280px] pointer-events-none" />
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/[0.08] rounded-full blur-[150px] pointer-events-none" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 mb-14">
            <div className="md:col-span-5">
              <p className="text-primary-foreground/20 text-[10px] uppercase tracking-[0.4em] mb-5">
                {language === "it" ? "Ogni sera" : "Every night"}
              </p>
              <h2 className="font-serif text-3xl md:text-5xl text-primary-foreground leading-[1.05] mb-5">
                Weekly Lineups
              </h2>
              <p className="text-primary-foreground/20 text-[14px] leading-[1.9] max-w-md font-light">
                {language === "it"
                  ? "La programmazione settimanale dei migliori club e beach club dell'isola."
                  : "The weekly schedule of the island's finest clubs and beach clubs."}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {weeklyLineups.map((lineup) => {
              const isOpen = openLineup === lineup.venueSlug;
              return (
                <div key={lineup.venueSlug} className="rounded-xl overflow-hidden bg-gradient-to-r from-primary-foreground/[0.04] to-primary-foreground/[0.02] border border-primary-foreground/[0.06] backdrop-blur-sm">
                  <button
                    onClick={() => setOpenLineup(isOpen ? null : lineup.venueSlug)}
                    className="w-full flex items-center justify-between py-5 md:py-6 px-6 md:px-8 group text-left"
                  >
                    <div className="flex items-center gap-4 md:gap-6">
                      <div className="w-12 h-12 md:w-14 md:h-14 rounded-lg overflow-hidden shrink-0">
                        <img src={lineup.venueImage} alt={lineup.venue} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h3 className="font-serif text-xl md:text-2xl text-primary-foreground group-hover:text-accent transition-colors duration-300">
                          {lineup.venue}
                        </h3>
                        <p className="text-primary-foreground/15 text-[10px] uppercase tracking-[0.25em] mt-1 font-light">
                          {lineup.category === "beachclub" ? "Beach Club" : "Club"} — {lineup.days.length} {language === "it" ? "sere" : "nights"}
                        </p>
                      </div>
                    </div>
                    <ChevronDown className={`h-4 w-4 text-primary-foreground/20 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 md:px-8 pb-6 md:pb-8">
                          <div className="border-t border-primary-foreground/[0.05] pt-4">
                            {lineup.days.map((d, i) => (
                              <div key={i} className="grid grid-cols-12 items-center py-3 border-b border-primary-foreground/[0.03] last:border-0">
                                <span className="col-span-3 md:col-span-2 text-accent/40 text-[11px] uppercase tracking-wider font-light">{d.day.slice(0, 3)}</span>
                                <span className="col-span-5 md:col-span-5 text-primary-foreground/70 text-sm">{d.resident}</span>
                                <span className="col-span-4 md:col-span-5 text-primary-foreground/15 text-[11px] text-right md:text-left font-light">{d.genre}</span>
                              </div>
                            ))}
                          </div>
                          <Link
                            to={`/locations/${lineup.venueSlug}`}
                            className="inline-flex items-center gap-2 mt-5 text-[12px] text-accent/80 hover:text-accent hover:gap-3 transition-all duration-300"
                          >
                            {language === "it" ? "Vai alla location" : "Go to location"} <ArrowRight className="h-3 w-3" />
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CROSS-LINK ── */}
      <section className="py-20 md:py-28 bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/[0.01] to-transparent pointer-events-none" />
        <div className="container mx-auto px-6 text-center relative z-10">
          <p className="text-muted-foreground/40 text-[10px] uppercase tracking-[0.4em] mb-6">
            {language === "it" ? "Esplora" : "Explore"}
          </p>
          <h2 className="font-serif text-2xl md:text-5xl text-foreground leading-[1.05] mb-8 max-w-2xl mx-auto">
            {language === "it" ? "Scopri tutte le locations dove vivere queste serate" : "Discover all the locations where these nights come alive"}
          </h2>
          <Link
            to="/locations"
            className="inline-flex items-center gap-2 text-[13px] text-foreground/70 font-light hover:text-accent hover:gap-3 transition-all duration-300"
          >
            {language === "it" ? "Vedi le locations" : "See locations"} <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Events;
