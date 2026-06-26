import { useState, useRef, useMemo } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import Layout from "@/components/layout/Layout";
import heroLocations from "@/assets/hero-locations.jpg";
import { venues as staticVenues, type VenueCategory } from "@/data/venues";
import { specialEvents as staticSpecialEvents } from "@/data/events";
import { useVenues, useEvents } from "@/hooks/useSupabaseData";

const Locations = () => {
  const { language } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<VenueCategory>("all");
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const { data: dbVenues } = useVenues();
  const { data: dbEvents } = useEvents();

  const venues = useMemo(() => {
    if (dbVenues && dbVenues.length > 0) {
      return dbVenues.map((v) => ({
        slug: v.slug,
        name: v.name,
        category: v.category as VenueCategory,
        zone: v.zone || "",
        desc: v.description || "",
        image: v.image_url || "/placeholder.svg",
        openingHours: v.opening_hours || "",
        season: v.season || "",
        dressCode: v.dress_code || "",
        vibe: Array.isArray(v.vibe) ? v.vibe.join(", ") : "",
        highlights: v.highlights || [],
        cuisine: v.cuisine || "",
        musicStyle: v.music_style || "",
        longDescription: v.long_description || "",
      }));
    }
    return staticVenues;
  }, [dbVenues]);

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

  const filters: { label: string; value: VenueCategory }[] = [
    { label: language === "it" ? "Tutti" : "All", value: "all" },
    { label: language === "it" ? "Ristoranti" : "Restaurants", value: "restaurant" },
    { label: "Beach Club", value: "beachclub" },
    { label: "Club", value: "club" },
  ];

  const filtered = activeFilter === "all" ? venues : venues.filter((v) => v.category === activeFilter);

  const categoryLabel = (cat: string) =>
    cat === "restaurant" ? (language === "it" ? "Ristorante" : "Restaurant")
    : cat === "beachclub" ? "Beach Club" : "Club";

  const nextEvents = specialEvents
    .filter(e => new Date(e.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  return (
    <Layout>
      {/* ── HERO ── */}
      <section ref={heroRef} className="relative h-[85vh] md:h-screen overflow-hidden">
        <motion.img src={heroLocations} alt="" className="w-full h-full object-cover" style={{ scale: heroScale }} />
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
                Curated selection
              </p>
              <h1 className="font-serif text-4xl md:text-7xl lg:text-8xl text-primary-foreground leading-[0.95] mb-5 max-w-3xl">
                Locations
              </h1>
              <div className="h-[1px] w-24 bg-gradient-to-r from-accent/80 to-transparent" />
            </motion.div>
          </div>
        </motion.div>
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* ── FILTER ── */}
      <section className="sticky top-16 z-40 border-b border-border/10">
        <div className="absolute inset-0 bg-gradient-to-r from-background via-card/95 to-background backdrop-blur-2xl" />
        <div className="container mx-auto px-6 relative">
          <div className="flex items-center gap-1">
            {filters.map((f) => (
              <button
                key={f.value}
                onClick={() => setActiveFilter(f.value)}
                className={`relative py-5 px-4 md:px-7 text-[13px] tracking-wide transition-all duration-300 ${
                  activeFilter === f.value
                    ? "text-foreground"
                    : "text-muted-foreground/50 hover:text-foreground/80"
                }`}
              >
                {f.label}
                {activeFilter === f.value && (
                  <motion.div
                    layoutId="locFilter"
                    className="absolute bottom-0 left-2 right-2 h-[2px] rounded-full bg-gradient-to-r from-primary via-accent to-primary/40"
                    transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                  />
                )}
              </button>
            ))}
            <Link
              to="/events"
              className="ml-auto hidden md:block text-[12px] text-muted-foreground/50 hover:text-accent transition-colors tracking-wide"
            >
              {language === "it" ? "Calendario eventi" : "Event calendar"} →
            </Link>
          </div>
        </div>
      </section>

      {/* ── VENUE LIST ── */}
      <section className="py-16 md:py-24 bg-background relative overflow-hidden">
        <div className="absolute top-40 -right-60 w-[600px] h-[600px] bg-accent/[0.03] rounded-full blur-[200px] pointer-events-none" />
        <div className="absolute bottom-40 -left-60 w-[500px] h-[500px] bg-primary/[0.04] rounded-full blur-[200px] pointer-events-none" />

        <div className="container mx-auto px-6 relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {filtered.map((venue, idx) => {
                const venueEvents = specialEvents.filter(e => e.venueSlug === venue.slug).slice(0, 1);

                return (
                  <motion.div
                    key={venue.slug}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.6, delay: idx * 0.04 }}
                  >
                    <Link to={`/locations/${venue.slug}`}>
                      <article className={`group grid grid-cols-1 md:grid-cols-12 gap-0 my-8 rounded-2xl overflow-hidden bg-gradient-to-br from-card/90 via-card/60 to-card/40 border border-border/8 hover:border-accent/12 hover:shadow-[0_30px_80px_-20px_hsl(var(--primary)/0.06)] transition-all duration-700`}>
                        {/* Image */}
                        <div className={`md:col-span-5 ${idx % 2 === 1 ? "md:order-2" : ""}`}>
                          <div className="relative aspect-[4/3] md:aspect-auto md:h-full overflow-hidden">
                            <img
                              src={venue.image}
                              alt={venue.name}
                              className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-[1800ms] ease-out"
                            />
                            <div className={`absolute inset-0 ${
                              idx % 2 === 1
                                ? "bg-gradient-to-l from-transparent to-card/30"
                                : "bg-gradient-to-r from-transparent to-card/30"
                            }`} />
                          </div>
                        </div>

                        {/* Content */}
                        <div className={`md:col-span-7 flex flex-col justify-center p-5 md:p-12 ${idx % 2 === 1 ? "md:order-1" : ""}`}>
                          <p className="text-[10px] text-muted-foreground/50 uppercase tracking-[0.3em] mb-3">
                            {categoryLabel(venue.category)} — {venue.zone}
                          </p>
                          <h2 className="font-serif text-2xl md:text-4xl lg:text-5xl text-foreground leading-[1] mb-3 md:mb-4 group-hover:text-accent transition-colors duration-500">
                            {venue.name}
                          </h2>
                          <p className="text-muted-foreground/60 text-[14px] leading-[1.9] mb-6 max-w-xl line-clamp-3 font-light">
                            {venue.desc}
                          </p>

                          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] text-muted-foreground/40 mb-6 font-light">
                            <span>{venue.openingHours}</span>
                            <span className="w-[3px] h-[3px] rounded-full bg-border/30" />
                            <span>{venue.season}</span>
                            {venue.dressCode && (
                              <>
                                <span className="w-[3px] h-[3px] rounded-full bg-border/30" />
                                <span>{venue.dressCode}</span>
                              </>
                            )}
                          </div>

                          {venueEvents.length > 0 && (
                            <p className="text-[11px] text-accent/50 mb-6 font-light">
                              Prossimo evento — <span className="text-foreground/60">{venueEvents[0].dj}</span>
                            </p>
                          )}

                          <span className="text-[13px] text-foreground/70 font-light inline-flex items-center gap-2 group-hover:text-accent group-hover:gap-3 transition-all duration-300">
                            {language === "it" ? "Scopri" : "Discover"}
                            <ArrowRight className="h-3.5 w-3.5" />
                          </span>
                        </div>
                      </article>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>

          {filtered.length === 0 && (
            <div className="text-center py-24 text-muted-foreground/50 font-light">
              <p>{language === "it" ? "Nessun risultato" : "No results"}</p>
            </div>
          )}
        </div>
      </section>

      {/* ── UPCOMING EVENTS TEASER ── */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-foreground via-foreground to-primary/20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-accent/[0.04] rounded-full blur-[280px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-primary/[0.08] rounded-full blur-[150px] pointer-events-none" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
            <div className="md:col-span-4 flex flex-col justify-center">
              <p className="text-primary-foreground/20 text-[10px] uppercase tracking-[0.4em] mb-5">
                {language === "it" ? "Prossimi eventi" : "Upcoming events"}
              </p>
              <h2 className="font-serif text-3xl md:text-5xl text-primary-foreground leading-[1.05] mb-6">
                {language === "it" ? "Non perdere le serate più esclusive" : "Don't miss the most exclusive nights"}
              </h2>
              <Link
                to="/events"
                className="text-[12px] text-accent/80 inline-flex items-center gap-2 hover:text-accent hover:gap-3 transition-all duration-300"
              >
                {language === "it" ? "Vedi tutti gli eventi" : "See all events"}
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="md:col-span-8">
              <div className="border-t border-primary-foreground/8">
                {nextEvents.map((ev, i) => {
                  const d = new Date(ev.date);
                  const dayNum = d.getDate();
                  const monthNames = ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"];
                  return (
                    <Link key={ev.id} to={`/locations/${ev.venueSlug}`}>
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="group flex items-center gap-6 md:gap-10 py-7 border-b border-primary-foreground/8 hover:border-accent/20 transition-colors duration-500"
                      >
                        <span className="text-primary-foreground/20 text-[11px] uppercase tracking-wider w-20 shrink-0 font-light">
                          {dayNum} {monthNames[d.getMonth()]}
                        </span>
                        <span className="font-serif text-xl md:text-2xl text-primary-foreground group-hover:text-accent transition-colors duration-300 flex-1">
                          {ev.dj}
                        </span>
                        <span className="text-primary-foreground/15 text-[12px] hidden md:block font-light">
                          {ev.venue}
                        </span>
                        <ArrowRight className="h-3.5 w-3.5 text-primary-foreground/10 group-hover:text-accent transition-colors" />
                      </motion.div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Locations;
