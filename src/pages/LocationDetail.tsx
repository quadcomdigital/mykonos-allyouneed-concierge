import { useParams, Link } from "react-router-dom";
import { useRef, useMemo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { venues as staticVenues } from "@/data/venues";
import { weeklyLineups, specialEvents as staticSpecialEvents } from "@/data/events";
import { useLanguage } from "@/i18n/LanguageContext";
import { useVenues, useEvents } from "@/hooks/useSupabaseData";

const LocationDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { language } = useLanguage();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);

  const { data: dbVenues } = useVenues();
  const { data: dbEvents } = useEvents();

  const venues = useMemo(() => {
    if (dbVenues && dbVenues.length > 0) {
      return dbVenues.map((v) => ({
        slug: v.slug,
        name: v.name,
        category: v.category,
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
        specialties: [] as string[],
        reservation: undefined as string | undefined,
        lineup: undefined as string | undefined,
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

  const venue = venues.find((v) => v.slug === slug);

  if (!venue) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6">
          <h1 className="font-serif text-4xl font-bold">{language === "it" ? "Locale non trovato" : "Venue not found"}</h1>
          <Link to="/locations" className="text-[13px] text-accent inline-flex items-center gap-2">
            <ArrowLeft className="h-3.5 w-3.5" /> {language === "it" ? "Torna ai locali" : "Back to venues"}
          </Link>
        </div>
      </Layout>
    );
  }

  const catLabel = venue.category === "restaurant"
    ? (language === "it" ? "Ristorante" : "Restaurant")
    : venue.category === "beachclub" ? "Beach Club" : "Club";

  const related = venues.filter(v => v.category === venue.category && v.slug !== venue.slug).slice(0, 3);
  const weeklyLineup = weeklyLineups.find(l => l.venueSlug === slug);
  const venueSpecialEvents = specialEvents.filter(e => e.venueSlug === slug).slice(0, 8);

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    const mn = ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"];
    return { dayNum: d.getDate(), month: mn[d.getMonth()] };
  };

  return (
    <Layout>
      {/* ── HERO ── */}
      <section ref={heroRef} className="relative h-[70vh] md:h-[85vh] overflow-hidden">
        <motion.img src={venue.image} alt={venue.name} className="w-full h-full object-cover" style={{ scale: heroScale }} />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/25 via-foreground/35 to-foreground" />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/40 via-transparent to-transparent" />

        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-6 pb-14 md:pb-20">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
              <Link
                to="/locations"
                className="inline-flex items-center gap-2 text-primary-foreground/50 hover:text-primary-foreground text-[13px] mb-8 transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Locations
              </Link>
              <p className="text-primary-foreground/40 text-[11px] uppercase tracking-[0.4em] mb-4">
                {catLabel} — {venue.zone}
              </p>
              <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-primary-foreground leading-[0.95]">
                {venue.name}
              </h1>
            </motion.div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* ── INFO BAR ── */}
      <section className="relative z-10">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap items-center gap-x-8 gap-y-3 py-6 px-7 -mt-6 rounded-xl bg-gradient-to-r from-card via-card to-card/80 border border-border/10 shadow-[0_20px_60px_-20px_hsl(var(--primary)/0.06)]"
          >
            <div>
              <p className="text-[10px] text-muted-foreground/60 uppercase tracking-wider mb-0.5">Orario</p>
              <p className="text-[13px] text-foreground font-medium">{venue.openingHours}</p>
            </div>
            <div className="w-px h-8 bg-border/15" />
            <div>
              <p className="text-[10px] text-muted-foreground/60 uppercase tracking-wider mb-0.5">Stagione</p>
              <p className="text-[13px] text-foreground font-medium">{venue.season}</p>
            </div>
            {venue.dressCode && (
              <>
                <div className="w-px h-8 bg-border/15" />
                <div>
                  <p className="text-[10px] text-muted-foreground/60 uppercase tracking-wider mb-0.5">Dress Code</p>
                  <p className="text-[13px] text-foreground font-medium">{venue.dressCode}</p>
                </div>
              </>
            )}
            {venue.reservation && (
              <>
                <div className="w-px h-8 bg-border/15" />
                <div>
                  <p className="text-[10px] text-muted-foreground/60 uppercase tracking-wider mb-0.5">Prenotazione</p>
                  <p className="text-[13px] text-foreground font-medium">{venue.reservation}</p>
                </div>
              </>
            )}
          </motion.div>
        </div>
      </section>

      {/* ── CONTENT ── */}
      <section className="py-16 md:py-24 bg-background relative overflow-hidden">
        <div className="absolute top-40 -right-40 w-[500px] h-[500px] bg-accent/[0.03] rounded-full blur-[200px] pointer-events-none" />
        <div className="absolute bottom-40 -left-40 w-[400px] h-[400px] bg-primary/[0.04] rounded-full blur-[200px] pointer-events-none" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
            {/* Main */}
            <div className="lg:col-span-7 space-y-16">
              {/* Description */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
                <p className="text-[11px] text-muted-foreground uppercase tracking-[0.4em] mb-6">
                  {language === "it" ? "L'esperienza" : "The experience"}
                </p>
                <p className="text-foreground text-lg md:text-xl leading-[1.9]">{venue.longDescription}</p>
              </motion.div>

              {/* Vibe */}
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <div className="rounded-xl bg-gradient-to-br from-card via-card to-card/70 border border-border/10 p-8 md:p-10">
                  <p className="text-[11px] text-muted-foreground uppercase tracking-[0.4em] mb-4">
                    {language === "it" ? "Atmosfera" : "Atmosphere"}
                  </p>
                  <p className="text-foreground/80 text-lg leading-[1.8] italic">&ldquo;{venue.vibe}&rdquo;</p>
                </div>
              </motion.div>

              {/* Highlights */}
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <p className="text-[11px] text-muted-foreground uppercase tracking-[0.4em] mb-6">Highlights</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {venue.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-3 py-3 px-4 rounded-lg bg-card/50 border border-border/8">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                      <span className="text-[15px] text-foreground/80 leading-relaxed">{h}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Cuisine */}
              {venue.cuisine && (
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                  <p className="text-[11px] text-muted-foreground uppercase tracking-[0.4em] mb-4">
                    {language === "it" ? "Cucina" : "Cuisine"}
                  </p>
                  <p className="text-foreground/80 text-lg leading-[1.8] mb-6">{venue.cuisine}</p>
                  {venue.specialties && venue.specialties.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {venue.specialties.map((s, i) => (
                        <span key={i} className="text-[13px] text-foreground/70 px-4 py-2 rounded-full bg-card border border-border/10">{s}</span>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Music */}
              {(venue.musicStyle || venue.lineup) && (
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                  <p className="text-[11px] text-muted-foreground uppercase tracking-[0.4em] mb-4">
                    {language === "it" ? "Musica" : "Music"}
                  </p>
                  {venue.musicStyle && <p className="text-accent/80 text-sm mb-3">{venue.musicStyle}</p>}
                  {venue.lineup && <p className="text-foreground/80 text-[15px] leading-[1.8]">{venue.lineup}</p>}
                </motion.div>
              )}

              {/* Weekly Lineup */}
              {weeklyLineup && (
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                  <p className="text-[11px] text-muted-foreground uppercase tracking-[0.4em] mb-8">
                    {language === "it" ? "Programmazione settimanale" : "Weekly lineup"}
                  </p>
                  <div className="rounded-xl overflow-hidden border border-border/10 bg-gradient-to-b from-card to-card/80">
                    {weeklyLineup.days.map((d, i) => (
                      <div key={i} className={`grid grid-cols-12 items-center py-4 px-5 md:px-6 ${i < weeklyLineup.days.length - 1 ? "border-b border-border/8" : ""} hover:bg-accent/[0.02] transition-colors`}>
                        <span className="col-span-3 text-accent/50 text-[12px] uppercase tracking-wider">{d.day.slice(0, 3)}</span>
                        <span className="col-span-5 text-foreground text-sm font-medium">{d.resident}</span>
                        <span className="col-span-4 text-muted-foreground/60 text-[12px] text-right">{d.genre}</span>
                      </div>
                    ))}
                  </div>
                  <Link to="/events" className="inline-flex items-center gap-2 mt-5 text-[13px] text-accent hover:gap-3 transition-all duration-300">
                    {language === "it" ? "Tutti gli eventi" : "All events"} <ArrowRight className="h-3 w-3" />
                  </Link>
                </motion.div>
              )}

              {/* Special Events */}
              {venueSpecialEvents.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                  <p className="text-[11px] text-muted-foreground uppercase tracking-[0.4em] mb-8">
                    {language === "it" ? "Special Guest" : "Special Guests"}
                  </p>
                  <div className="rounded-xl overflow-hidden border border-border/10 bg-gradient-to-b from-card to-card/80">
                    {venueSpecialEvents.map((ev, i) => {
                      const dt = formatDate(ev.date);
                      return (
                        <div key={ev.id} className={`flex items-center py-4 px-5 md:px-6 group ${i < venueSpecialEvents.length - 1 ? "border-b border-border/8" : ""} hover:bg-accent/[0.02] transition-colors`}>
                          <span className="text-muted-foreground/60 text-[13px] w-20 shrink-0">{dt.dayNum} {dt.month}</span>
                          <span className="font-serif text-lg text-foreground group-hover:text-accent transition-colors flex-1">{ev.dj}</span>
                          {ev.tag && <span className="text-accent/40 text-[11px] hidden md:block">{ev.tag}</span>}
                        </div>
                      );
                    })}
                  </div>
                  <Link to="/events" className="inline-flex items-center gap-2 mt-5 text-[13px] text-accent hover:gap-3 transition-all duration-300">
                    {language === "it" ? "Calendario completo" : "Full calendar"} <ArrowRight className="h-3 w-3" />
                  </Link>
                </motion.div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-5">
              <div className="sticky top-28 space-y-6">
                {/* Booking */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                  <div className="rounded-xl overflow-hidden">
                    <div className="relative p-8 md:p-10">
                      <div className="absolute inset-0 bg-gradient-to-br from-foreground via-foreground to-primary/40" />
                      <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-accent/[0.06] rounded-full blur-[100px] pointer-events-none" />
                      <div className="relative z-10">
                        <p className="text-primary-foreground/35 text-[11px] uppercase tracking-[0.4em] mb-4">
                          {language === "it" ? "Esperienza esclusiva" : "Exclusive experience"}
                        </p>
                        <h3 className="font-serif text-2xl text-primary-foreground mb-3">
                          {language === "it" ? "Prenota il tuo tavolo" : "Reserve your table"}
                        </h3>
                        <p className="text-primary-foreground/30 text-sm leading-relaxed mb-8">
                          {language === "it"
                            ? "Contattaci per prenotare la tua esperienza esclusiva."
                            : "Contact us to book your exclusive experience."}
                        </p>
                        <a
                          href="https://wa.me/393000000000"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full text-center py-4 rounded-lg bg-gradient-to-r from-primary to-accent text-primary-foreground text-[13px] font-medium tracking-wide hover:opacity-90 transition-opacity shadow-lg shadow-accent/20"
                        >
                          {language === "it" ? "Prenota con il Concierge" : "Book with Concierge"}
                        </a>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Next event */}
                {venueSpecialEvents.length > 0 && (
                  <div className="rounded-xl bg-gradient-to-br from-card to-card/80 border border-border/10 p-7">
                    <p className="text-[11px] text-muted-foreground uppercase tracking-[0.3em] mb-4">
                      {language === "it" ? "Prossimo evento" : "Next event"}
                    </p>
                    <p className="font-serif text-xl text-foreground mb-1">{venueSpecialEvents[0].dj}</p>
                    <p className="text-muted-foreground/60 text-sm mb-4">{venueSpecialEvents[0].title}</p>
                    <Link to="/events" className="text-[13px] text-accent inline-flex items-center gap-2 hover:gap-3 transition-all">
                      {language === "it" ? "Tutti gli eventi" : "All events"} <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                )}

                {/* Maps */}
                <a
                  href={`https://www.google.com/maps/search/${encodeURIComponent(venue.name + ", Mykonos, Greece")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center py-4 rounded-lg border border-border/10 text-[13px] text-foreground hover:border-accent/20 hover:bg-card/50 transition-all duration-300"
                >
                  {language === "it" ? "Apri in Google Maps" : "Open in Google Maps"} →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── RELATED ── */}
      {related.length > 0 && (
        <section className="py-16 md:py-24 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border/20 to-transparent" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-accent/[0.02] rounded-full blur-[200px] pointer-events-none" />

          <div className="container mx-auto px-6 relative z-10">
            <p className="text-[11px] text-muted-foreground uppercase tracking-[0.4em] mb-10">
              {language === "it" ? "Potrebbe piacerti" : "You might also like"}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {related.map((v, i) => (
                <motion.div key={v.slug} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <Link to={`/locations/${v.slug}`}>
                    <div className="group rounded-xl overflow-hidden border border-border/10 hover:border-accent/15 hover:shadow-[0_20px_60px_-20px_hsl(var(--primary)/0.06)] transition-all duration-500">
                      <div className="aspect-[4/3] overflow-hidden">
                        <img src={v.image} alt={v.name} className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-[1500ms]" />
                      </div>
                      <div className="p-5">
                        <p className="text-[11px] text-muted-foreground/60 uppercase tracking-[0.2em] mb-1">
                          {catLabel} — {v.zone}
                        </p>
                        <h3 className="font-serif text-xl text-foreground group-hover:text-accent transition-colors">{v.name}</h3>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
};

export default LocationDetail;
