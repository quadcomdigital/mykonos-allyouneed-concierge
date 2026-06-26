import { useRef, useState, useMemo, useEffect } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Clock, Calendar, MapPin, Shirt, Music, Star,
  MessageCircle, ArrowRight, Info, X, Utensils, ChevronLeft, ChevronRight, Sparkles,
} from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import Layout from "@/components/layout/Layout";
import { venues as staticVenues } from "@/data/venues";
import { venueEvents as staticVenueEvents } from "@/data/venueEvents";
import { useVenues, useEvents } from "@/hooks/useSupabaseData";
import VenueBookingFlow from "@/components/booking/VenueBookingFlow";

const VenueDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { hash } = useLocation();
  const { language } = useLanguage();

  // Scroll to #prenota when arriving from residency cards
  useEffect(() => {
    if (!hash) return;
    const id = hash.replace("#", "");
    const t = window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 250);
    return () => window.clearTimeout(t);
  }, [hash]);
  const heroRef = useRef<HTMLElement | null>(null);
  const [showExtraInfo, setShowExtraInfo] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const { data: dbVenues } = useVenues();
  const { data: dbEvents } = useEvents();

  const venues = useMemo(() => {
    if (dbVenues && dbVenues.length > 0) {
      return dbVenues.map((v) => ({
        slug: v.slug, name: v.name, category: v.category, zone: v.zone || "",
        desc: v.description || "", image: v.image_url || "/placeholder.svg",
        openingHours: v.opening_hours || "", season: v.season || "",
        dressCode: v.dress_code || "", vibe: Array.isArray(v.vibe) ? v.vibe.join(", ") : "",
        highlights: v.highlights || [], cuisine: v.cuisine || "",
        musicStyle: v.music_style || "", longDescription: v.long_description || "",
        gallery: v.gallery || [], specialties: [] as string[],
        reservation: undefined as string | undefined, extraInfo: undefined as string | undefined,
        booking_mode: (v as any).booking_mode as string | null | undefined,
      }));
    }
    return staticVenues.map((v) => ({ ...v, booking_mode: undefined as string | null | undefined }));
  }, [dbVenues]);

  const venueEvents = useMemo(() => {
    if (dbEvents && dbEvents.length > 0) {
      return dbEvents.map((e) => ({
        id: e.id, date: e.date, dj: e.dj, venue: e.venue_name || "",
        venueSlug: e.venue_slug || "", description: e.description || "",
        highlight: e.highlight || false, tag: e.tag || "", time: e.time || "",
      }));
    }
    return staticVenueEvents;
  }, [dbEvents]);

  const venue = venues.find((v) => v.slug === slug);

  if (!venue) {
    return (
      <Layout>
        <div className="flex min-h-[60vh] flex-col items-center justify-center bg-foreground">
          <h1 className="mb-4 font-serif text-3xl text-primary-foreground">
            {language === "it" ? "Locale non trovato" : "Venue not found"}
          </h1>
          <Link to="/locali" className="flex items-center gap-2 rounded-full bg-accent/15 px-5 py-2.5 text-accent hover:bg-accent/25 transition">
            <ArrowLeft className="h-4 w-4" />
            {language === "it" ? "Torna ai locali" : "Back to venues"}
          </Link>
        </div>
      </Layout>
    );
  }

  const getCategoryLabel = (cat: string) =>
    cat === "restaurant" ? (language === "it" ? "Ristorante" : "Restaurant")
      : cat === "beachclub" ? "Beach Club" : "Club";

  const categoryLabel = getCategoryLabel(venue.category);

  const events = venueEvents
    .filter((e) => e.venueSlug === venue.slug)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const upcomingEvents = events.filter(e => new Date(e.date + "T00:00:00") >= new Date(new Date().toDateString()));
  const highlightEvents = upcomingEvents.filter((e) => e.highlight).slice(0, 4);
  const related = venues.filter((v) => v.category === venue.category && v.slug !== venue.slug).slice(0, 3);

  const venueGallery = 'gallery' in venue ? (venue as any).gallery : [];
  const galleryImages: string[] = [
    venue.image,
    ...(venueGallery && venueGallery.length > 0
      ? venueGallery
      : related.slice(0, 3).map(r => r.image)),
  ];

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    const months = language === "it"
      ? ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"]
      : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const days = language === "it"
      ? ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"]
      : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return { day: days[d.getDay()], num: d.getDate(), month: months[d.getMonth()] };
  };

  const specs = [
    { icon: Clock, label: language === "it" ? "Orari" : "Hours", value: venue.openingHours },
    { icon: Calendar, label: language === "it" ? "Stagione" : "Season", value: venue.season },
    ...(venue.dressCode ? [{ icon: Shirt, label: "Dress code", value: venue.dressCode }] : []),
    ...(venue.musicStyle ? [{ icon: Music, label: language === "it" ? "Musica" : "Music", value: venue.musicStyle }] : []),
  ].filter(s => s.value);

  return (
    <Layout>
      {/* ═══════ HERO — split editorial ═══════ */}
      <section ref={heroRef} className="relative bg-foreground pt-20 pb-10 md:pt-24 md:pb-20 overflow-hidden">
        {/* Ambient blur orbs */}
        <div className="pointer-events-none absolute -top-20 -left-32 h-[420px] w-[420px] rounded-full bg-accent/[0.06] blur-[140px]" />
        <div className="pointer-events-none absolute top-1/2 -right-32 h-[420px] w-[420px] rounded-full bg-primary/[0.08] blur-[140px]" />

        <div className="container relative mx-auto px-4 sm:px-6 lg:px-10">
          <Link
            to="/locali"
            className="mb-6 md:mb-8 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] md:tracking-[0.3em] text-primary-foreground/45 transition-colors hover:text-accent"
          >
            <ArrowLeft className="h-3 w-3" />
            {language === "it" ? "Tutti i locali" : "All venues"}
          </Link>

          <div className="grid gap-5 md:gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-12 items-stretch">
            {/* LEFT — big image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[560px] overflow-hidden rounded-[1.5rem] md:rounded-[2rem] border border-primary-foreground/[0.06]"
            >
              <motion.img
                src={venue.image} alt={venue.name}
                style={{ scale: heroScale }}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/10 to-transparent" />
              {/* Floating category badge */}
              <div className="absolute top-3 md:top-5 left-3 md:left-5 flex items-center gap-2 flex-wrap">
                <span className="rounded-full bg-foreground/70 backdrop-blur-md border border-primary-foreground/15 px-3 md:px-4 py-1 md:py-1.5 text-[8.5px] md:text-[9px] font-bold uppercase tracking-[0.25em] md:tracking-[0.3em] text-primary-foreground/85">
                  {categoryLabel}
                </span>
                <span className="rounded-full bg-foreground/70 backdrop-blur-md border border-primary-foreground/15 px-2.5 md:px-3 py-1 md:py-1.5 inline-flex items-center gap-1.5 text-[9.5px] md:text-[10px] text-primary-foreground/75">
                  <MapPin className="h-3 w-3 text-accent/85" /> {venue.zone}
                </span>
              </div>
              {/* Bottom signature */}
              <div className="absolute bottom-3 md:bottom-5 right-3 md:right-5 rounded-full bg-foreground/65 backdrop-blur-md border border-primary-foreground/10 px-3 md:px-3.5 py-1 md:py-1.5 text-[8.5px] md:text-[9px] uppercase tracking-[0.3em] md:tracking-[0.35em] text-primary-foreground/55">
                Mykonos · 26
              </div>
            </motion.div>

            {/* RIGHT — content card */}
            <motion.div
              style={{ opacity: heroOpacity }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex flex-col justify-between rounded-[1.5rem] md:rounded-[2rem] border border-primary-foreground/[0.07] bg-gradient-to-br from-primary-foreground/[0.04] to-primary-foreground/[0.01] p-5 md:p-10 backdrop-blur-sm"
            >
              <div>
                <div className="mb-4 md:mb-5 flex items-center gap-3">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                  <p className="text-[9px] uppercase tracking-[0.4em] md:tracking-[0.5em] text-accent/75">
                    {language === "it" ? "Partner ufficiale" : "Official partner"}
                  </p>
                </div>
                <h1 className="font-serif text-[2.6rem] md:text-6xl lg:text-7xl leading-[0.88] text-primary-foreground">
                  {venue.name}
                </h1>
                <p className="mt-4 md:mt-6 text-[13px] md:text-[15px] leading-[1.75] md:leading-[1.9] text-primary-foreground/55 max-w-md">
                  {venue.desc}
                </p>
              </div>

              {/* CTAs */}
              <div className="mt-6 md:mt-8 flex flex-wrap items-center gap-2.5 md:gap-3">
                <a
                  href="https://wa.me/393420639539"
                  target="_blank" rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 md:gap-2.5 rounded-full bg-gradient-to-r from-primary to-accent px-5 md:px-7 py-3 md:py-3.5 text-[13px] md:text-[14px] font-semibold tracking-normal text-white shadow-[0_10px_30px_-8px_hsl(var(--accent)/0.45)] transition-all duration-500 hover:shadow-[0_15px_40px_-5px_hsl(var(--accent)/0.6)] hover:scale-[1.03]"
                >
                  <MessageCircle className="h-4 w-4" />
                  {language === "it" ? "Prenota ora" : "Book now"}
                </a>
                {upcomingEvents.length > 0 && (
                  <a href="#events" className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/[0.12] bg-primary-foreground/[0.04] px-4 md:px-5 py-3 md:py-3.5 text-[10px] md:text-[10.5px] uppercase tracking-[0.25em] md:tracking-[0.28em] text-primary-foreground/70 transition hover:border-accent/30 hover:text-accent">
                    <Calendar className="h-3.5 w-3.5" />
                    {language === "it" ? "Eventi" : "Events"}
                  </a>
                )}
              </div>

              {/* Inline specs strip */}
              {specs.length > 0 && (
                <div className="mt-6 md:mt-8 grid grid-cols-2 gap-2.5 md:gap-3 border-t border-primary-foreground/[0.05] pt-5 md:pt-6">
                  {specs.slice(0, 4).map((spec) => (
                    <div key={spec.label} className="flex items-start gap-2 md:gap-2.5">
                      <div className="flex h-7 w-7 md:h-8 md:w-8 shrink-0 items-center justify-center rounded-xl bg-accent/10">
                        <spec.icon className="h-3 w-3 md:h-3.5 md:w-3.5 text-accent" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[8px] uppercase tracking-[0.3em] md:tracking-[0.35em] text-primary-foreground/35">{spec.label}</p>
                        <p className="text-[11px] md:text-[11.5px] leading-[1.4] text-primary-foreground/70 truncate">{spec.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════ MOSAIC GALLERY ═══════ */}
      {galleryImages.length > 1 && (
        <section className="bg-foreground py-8 md:py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-10">
            <div className="mb-6 flex items-end justify-between">
              <div>
                <div className="mb-3 flex items-center gap-3">
                  <span className="h-px w-10 bg-accent/40" />
                  <p className="text-[9px] uppercase tracking-[0.5em] text-accent/70">Gallery</p>
                </div>
                <h2 className="font-serif text-2xl md:text-4xl leading-[1] text-primary-foreground">
                  {language === "it" ? "Atmosfera" : "Atmosphere"}
                </h2>
              </div>
              <span className="rounded-full border border-primary-foreground/[0.08] bg-primary-foreground/[0.03] px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-primary-foreground/50">
                {galleryImages.length} {language === "it" ? "foto" : "photos"}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[140px] md:auto-rows-[180px]">
              {galleryImages.slice(0, 7).map((img, i) => {
                // Asymmetric pattern
                const sizing =
                  i === 0 ? "col-span-2 row-span-2 md:col-span-2 md:row-span-2"
                  : i === 3 ? "col-span-2 row-span-1 md:col-span-2 md:row-span-1"
                  : "col-span-1 row-span-1";
                return (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, scale: 0.96 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => setLightboxIdx(i)}
                    className={`${sizing} group relative overflow-hidden rounded-3xl bg-foreground/40 border border-primary-foreground/[0.05]`}
                  >
                    <img src={img} alt={`${venue.name} ${i + 1}`} loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.08]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    <div className="absolute bottom-3 left-3 rounded-full bg-foreground/70 backdrop-blur-md border border-primary-foreground/10 px-2.5 py-1 text-[8.5px] uppercase tracking-[0.3em] text-primary-foreground/75 opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0 translate-y-1">
                      {String(i + 1).padStart(2, "0")} / {galleryImages.length}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ═══════ STORY + STICKY CONCIERGE ═══════ */}
      <section className="bg-foreground py-10 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_380px] xl:gap-14">
            {/* Main column */}
            <div className="space-y-10">
              {/* Long description */}
              {venue.longDescription && (
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                  <div className="mb-5 flex items-center gap-3">
                    <span className="h-px w-10 bg-accent/40" />
                    <p className="text-[9px] uppercase tracking-[0.5em] text-accent/70">
                      {language === "it" ? "L'esperienza" : "The experience"}
                    </p>
                  </div>
                  <h2 className="font-serif text-3xl md:text-4xl leading-[1.05] text-primary-foreground mb-6">
                    {language === "it" ? <>Una notte da <span className="italic text-accent/90">ricordare</span></> : <>A night to <span className="italic text-accent/90">remember</span></>}
                  </h2>
                  <p className="text-[15px] md:text-[16px] leading-[2.05] text-primary-foreground/60 max-w-2xl">
                    {venue.longDescription}
                  </p>
                </motion.div>
              )}

              {/* Vibe quote */}
              {venue.vibe && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="relative rounded-3xl border border-accent/15 bg-gradient-to-br from-accent/[0.06] via-primary-foreground/[0.02] to-transparent p-8 md:p-10 overflow-hidden"
                >
                  <Sparkles className="absolute top-6 right-6 h-5 w-5 text-accent/30" />
                  <p className="text-[9px] uppercase tracking-[0.45em] text-accent/70 mb-4">
                    {language === "it" ? "Atmosfera" : "Atmosphere"}
                  </p>
                  <p className="font-serif text-2xl md:text-[28px] italic leading-[1.4] text-primary-foreground/80">
                    &ldquo;{venue.vibe}&rdquo;
                  </p>
                </motion.div>
              )}

              {/* Highlights */}
              {venue.highlights && venue.highlights.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                  <div className="mb-6 flex items-center gap-3">
                    <span className="h-px w-10 bg-accent/40" />
                    <p className="text-[9px] uppercase tracking-[0.5em] text-accent/70">Highlights</p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {venue.highlights.map((h, i) => (
                      <motion.div
                        key={h}
                        initial={{ opacity: 0, x: -8 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.04 }}
                        className="group flex items-start gap-4 rounded-2xl border border-primary-foreground/[0.06] bg-primary-foreground/[0.02] p-5 transition-all duration-300 hover:border-accent/25 hover:bg-primary-foreground/[0.04] hover:-translate-y-0.5"
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent/10 transition-colors group-hover:bg-accent/20">
                          <Star className="h-3.5 w-3.5 text-accent" />
                        </div>
                        <p className="text-[13.5px] leading-[1.65] text-primary-foreground/70 pt-1">{h}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Cuisine */}
              {venue.cuisine && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="rounded-3xl border border-primary-foreground/[0.06] bg-primary-foreground/[0.02] p-7 md:p-9"
                >
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
                      <Utensils className="h-4 w-4 text-accent" />
                    </div>
                    <div>
                      <p className="text-[9px] uppercase tracking-[0.4em] text-accent/70">{language === "it" ? "Cucina" : "Cuisine"}</p>
                      <p className="text-[15px] font-medium text-primary-foreground/85 mt-0.5">{language === "it" ? "Sapori autentici" : "Signature flavors"}</p>
                    </div>
                  </div>
                  <p className="text-[14.5px] leading-[1.95] text-primary-foreground/60">{venue.cuisine}</p>
                </motion.div>
              )}

              {/* Extra info */}
              {venue.extraInfo && (
                <motion.button
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  onClick={() => setShowExtraInfo(true)}
                  className="group flex w-full items-center gap-5 rounded-2xl border border-primary-foreground/[0.06] bg-primary-foreground/[0.02] p-5 text-left transition-all hover:border-accent/25 hover:bg-primary-foreground/[0.04]"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent/10 transition-colors group-hover:bg-accent/20">
                    <Info className="h-4 w-4 text-accent" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[14px] font-medium text-primary-foreground/80">
                      {language === "it" ? "Policy & informazioni utili" : "Policy & useful info"}
                    </p>
                    <p className="mt-0.5 text-[12px] text-primary-foreground/45">
                      {language === "it" ? "Prenotazioni, dress code, regole" : "Reservations, dress code, rules"}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-primary-foreground/25 transition-all group-hover:translate-x-1 group-hover:text-accent" />
                </motion.button>
              )}
            </div>

            {/* Sticky sidebar */}
            <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
              {/* Booking card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/25 via-accent/12 to-foreground border border-accent/20 p-7 md:p-8"
              >
                <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-accent/[0.12] blur-[60px]" />
                <div className="absolute -left-12 -bottom-12 h-32 w-32 rounded-full bg-primary/[0.15] blur-[60px]" />
                <div className="relative">
                  <div className="mb-4 flex items-center gap-3">
                    <span className="h-px w-8 bg-accent/50" />
                    <p className="text-[9px] uppercase tracking-[0.4em] text-accent/85">Concierge</p>
                  </div>
                  <h3 className="font-serif text-[28px] leading-[1.05] text-primary-foreground">
                    {language === "it" ? "Il tuo tavolo ti aspetta" : "Your table awaits"}
                  </h3>
                  <p className="mt-3 text-[13px] leading-[1.85] text-primary-foreground/55">
                    {language === "it"
                      ? "Scrivici su WhatsApp: tavolo, timing e conferma in tempo reale."
                      : "Message us on WhatsApp: table, timing and real-time confirmation."}
                  </p>
                  <a
                    href="https://wa.me/393420639539"
                    target="_blank" rel="noopener noreferrer"
                    className="mt-6 flex w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-primary to-accent py-4 text-[10px] font-bold uppercase tracking-[0.28em] text-white shadow-[0_10px_30px_-8px_hsl(var(--accent)/0.4)] transition-all hover:shadow-[0_15px_40px_-5px_hsl(var(--accent)/0.55)] hover:scale-[1.02] animate-[pulse_3s_cubic-bezier(0.4,0,0.6,1)_infinite]"
                  >
                    <MessageCircle className="h-4 w-4" />
                    {language === "it" ? "Contatta il Concierge" : "Contact Concierge"}
                  </a>
                </div>
              </motion.div>

              {/* Quick links */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.08 }}
                className="rounded-3xl border border-primary-foreground/[0.06] bg-primary-foreground/[0.02] p-5"
              >
                <p className="mb-4 text-[9px] uppercase tracking-[0.4em] text-primary-foreground/35">
                  {language === "it" ? "Link rapidi" : "Quick links"}
                </p>
                <div className="space-y-2">
                  {upcomingEvents.length > 0 && (
                    <Link to="/eventi" className="flex items-center gap-3 rounded-2xl border border-primary-foreground/[0.05] bg-primary-foreground/[0.02] p-3 transition-all hover:border-accent/25">
                      <Calendar className="h-3.5 w-3.5 text-accent/70" />
                      <span className="text-[12px] text-primary-foreground/65">{language === "it" ? "Tutti gli eventi" : "All events"}</span>
                      <ArrowRight className="ml-auto h-3 w-3 text-primary-foreground/25" />
                    </Link>
                  )}
                  <Link to="/concierge" className="flex items-center gap-3 rounded-2xl border border-primary-foreground/[0.05] bg-primary-foreground/[0.02] p-3 transition-all hover:border-accent/25">
                    <MessageCircle className="h-3.5 w-3.5 text-accent/70" />
                    <span className="text-[12px] text-primary-foreground/65">{language === "it" ? "Contatta concierge" : "Contact concierge"}</span>
                    <ArrowRight className="ml-auto h-3 w-3 text-primary-foreground/25" />
                  </Link>
                  <a
                    href={`https://www.google.com/maps/search/${encodeURIComponent(venue.name + ", Mykonos, Greece")}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-2xl border border-primary-foreground/[0.05] bg-primary-foreground/[0.02] p-3 transition-all hover:border-accent/25"
                  >
                    <MapPin className="h-3.5 w-3.5 text-accent/70" />
                    <span className="text-[12px] text-primary-foreground/65">Google Maps</span>
                    <ArrowRight className="ml-auto h-3 w-3 text-primary-foreground/25" />
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ BOOKING — same flow logic as event detail ═══════ */}
      <div id="prenota" className="scroll-mt-24">
        <VenueBookingFlow venue={{ slug: venue.slug, name: venue.name, booking_mode: venue.booking_mode }} />
      </div>

      {/* ═══════ EVENTS — editorial cards ═══════ */}
      {upcomingEvents.length > 0 && (
        <section id="events" className="relative overflow-hidden bg-foreground py-10 md:py-24 border-t border-primary-foreground/[0.04]">
          <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="mb-10 md:mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
            >
              <div>
                <div className="mb-3 flex items-center gap-3">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                  <p className="text-[9px] uppercase tracking-[0.5em] text-accent/75">
                    {language === "it" ? "Programma 2026" : "2026 Program"}
                  </p>
                </div>
                <h2 className="font-serif text-3xl md:text-5xl leading-[0.95] text-primary-foreground">
                  {language === "it" ? "Prossimi eventi" : "Upcoming events"}
                </h2>
              </div>
              <a
                href="https://wa.me/393420639539"
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-primary to-accent px-7 py-3.5 text-[14px] font-semibold tracking-normal text-white shadow-[0_10px_30px_-8px_hsl(var(--accent)/0.4)] transition-all hover:scale-[1.03]"
              >
                <MessageCircle className="h-4 w-4" />
                {language === "it" ? "Prenota un evento" : "Book an event"}
              </a>
            </motion.div>

            {/* Highlight events grid */}
            {highlightEvents.length > 0 && (
              <div className="mb-10 grid gap-4 md:grid-cols-2">
                {highlightEvents.map((ev, i) => {
                  const { day, num, month } = formatDate(ev.date);
                  return (
                    <motion.div
                      key={ev.id}
                      initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                      transition={{ duration: 0.45, delay: i * 0.06 }}
                      className="group flex items-start gap-5 rounded-3xl border border-primary-foreground/[0.06] bg-gradient-to-br from-primary-foreground/[0.04] to-transparent p-6 transition-all duration-400 hover:border-accent/30 hover:-translate-y-1 hover:shadow-xl hover:shadow-accent/10"
                    >
                      <div className="min-w-[4rem] rounded-2xl bg-gradient-to-br from-accent/15 to-accent/5 border border-accent/15 px-3 py-3 text-center">
                        <p className="text-[8px] uppercase tracking-[0.3em] text-primary-foreground/50">{day}</p>
                        <p className="font-serif text-3xl leading-none text-primary-foreground mt-1">{num}</p>
                        <p className="text-[8px] uppercase tracking-[0.28em] text-accent mt-1">{month}</p>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          {ev.tag && (
                            <span className="rounded-full bg-accent/15 border border-accent/25 px-2.5 py-0.5 text-[8.5px] font-bold uppercase tracking-[0.22em] text-accent">{ev.tag}</span>
                          )}
                          {ev.time && (
                            <span className="inline-flex items-center gap-1 text-[10px] text-primary-foreground/40">
                              <Clock className="h-2.5 w-2.5" /> {ev.time}
                            </span>
                          )}
                        </div>
                        <h3 className="font-sans font-bold text-[18px] md:text-[20px] leading-tight text-primary-foreground transition-colors duration-300 group-hover:text-accent">
                          {ev.dj}
                        </h3>
                        {ev.description && (
                          <p className="mt-2 line-clamp-2 text-[12.5px] leading-[1.65] text-primary-foreground/45">{ev.description}</p>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* All upcoming — compact rounded list */}
            {upcomingEvents.length > highlightEvents.length && (
              <div className="rounded-3xl border border-primary-foreground/[0.05] bg-primary-foreground/[0.015] p-3 md:p-4">
                <div className="divide-y divide-primary-foreground/[0.05]">
                  {upcomingEvents.filter(e => !highlightEvents.find(h => h.id === e.id)).slice(0, 14).map((ev, i) => {
                    const { day, num, month } = formatDate(ev.date);
                    return (
                      <motion.div
                        key={ev.id}
                        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                        transition={{ delay: Math.min(i * 0.02, 0.15) }}
                        className="group flex items-center gap-4 rounded-2xl px-4 py-3.5 transition-all duration-300 hover:bg-primary-foreground/[0.04]"
                      >
                        <div className="min-w-[2.8rem] text-center">
                          <p className="text-[7px] uppercase tracking-wider text-primary-foreground/35">{day}</p>
                          <p className="font-serif text-lg leading-none text-primary-foreground mt-0.5">{num}</p>
                          <p className="text-[7px] uppercase tracking-wider text-accent/60 mt-0.5">{month}</p>
                        </div>
                        <div className="h-8 w-px bg-primary-foreground/[0.06]" />
                        <p className="flex-1 truncate text-[13.5px] text-primary-foreground/70 transition-colors group-hover:text-accent">{ev.dj}</p>
                        {ev.time && (
                          <span className="hidden text-[10px] text-primary-foreground/35 sm:block">{ev.time}</span>
                        )}
                        {ev.tag && (
                          <span className="hidden rounded-full bg-accent/10 px-2.5 py-0.5 text-[8px] font-bold uppercase tracking-[0.18em] text-accent/85 md:inline-block">{ev.tag}</span>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {upcomingEvents.length > 15 && (
              <div className="mt-6 text-center">
                <Link
                  to="/eventi"
                  className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/[0.1] bg-primary-foreground/[0.04] px-6 py-3 text-[10.5px] uppercase tracking-[0.28em] text-primary-foreground/65 transition hover:border-accent/30 hover:text-accent"
                >
                  {language === "it" ? `Vedi tutti i ${upcomingEvents.length} eventi` : `See all ${upcomingEvents.length} events`}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ═══════ RELATED VENUES ═══════ */}
      {related.length > 0 && (
        <section className="relative overflow-hidden bg-foreground py-12 md:py-28 border-t border-primary-foreground/[0.04]">
          <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="mb-10 md:mb-14 text-center"
            >
              <div className="mx-auto mb-4 flex items-center justify-center gap-3">
                <span className="h-px w-10 bg-accent/35" />
                <p className="text-[9px] uppercase tracking-[0.5em] text-accent/65">
                  {language === "it" ? "Scopri anche" : "Also discover"}
                </p>
                <span className="h-px w-10 bg-accent/35" />
              </div>
              <h2 className="font-serif text-3xl md:text-5xl text-primary-foreground">
                {language === "it" ? "Locali simili" : "Similar venues"}
              </h2>
            </motion.div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r, i) => (
                <motion.div
                  key={r.slug}
                  initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                >
                  <Link
                    to={`/locali/${r.slug}`}
                    className="group relative block overflow-hidden rounded-3xl border border-primary-foreground/[0.06] bg-primary-foreground/[0.02] transition-all duration-500 hover:border-accent/30 hover:-translate-y-1 hover:shadow-2xl hover:shadow-accent/10"
                  >
                    <div className="relative aspect-[4/5] overflow-hidden">
                      <img src={r.image} alt={r.name} loading="lazy"
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] group-hover:scale-[1.08]" />
                      <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/25 to-transparent" />
                    </div>
                    <div className="absolute inset-0 flex flex-col justify-between p-5 md:p-6">
                      <span className="self-start rounded-full bg-foreground/65 backdrop-blur-md border border-primary-foreground/15 px-3.5 py-1 text-[8px] font-bold uppercase tracking-[0.3em] text-primary-foreground/80">
                        {getCategoryLabel(r.category)}
                      </span>
                      <div>
                        <p className="mb-1.5 flex items-center gap-1 text-[10px] uppercase tracking-[0.28em] text-primary-foreground/55">
                          <MapPin className="h-2.5 w-2.5 text-accent/65" /> {r.zone}
                        </p>
                        <h3 className="font-serif text-2xl md:text-3xl leading-[0.95] text-primary-foreground transition-colors duration-300 group-hover:text-accent">
                          {r.name}
                        </h3>
                        <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-primary to-accent px-4 py-2 text-[9px] font-bold uppercase tracking-[0.3em] text-white opacity-0 -translate-y-1 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
                          {language === "it" ? "Scopri" : "Discover"} <ArrowRight className="h-3 w-3" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════ LIGHTBOX ═══════ */}
      <AnimatePresence>
        {lightboxIdx !== null && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/95 backdrop-blur-2xl"
            onClick={() => setLightboxIdx(null)}
          >
            <button
              onClick={() => setLightboxIdx(null)}
              className="absolute right-6 top-6 flex h-11 w-11 items-center justify-center rounded-full border border-primary-foreground/10 bg-primary-foreground/[0.05] hover:bg-primary-foreground/[0.1] transition"
            >
              <X className="h-5 w-5 text-primary-foreground/70" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setLightboxIdx(Math.max(0, (lightboxIdx ?? 0) - 1)); }}
              className="absolute left-4 flex h-11 w-11 items-center justify-center rounded-full border border-primary-foreground/10 bg-primary-foreground/[0.05] hover:bg-primary-foreground/[0.1] transition md:left-8"
            >
              <ChevronLeft className="h-5 w-5 text-primary-foreground/70" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setLightboxIdx(Math.min(galleryImages.length - 1, (lightboxIdx ?? 0) + 1)); }}
              className="absolute right-4 flex h-11 w-11 items-center justify-center rounded-full border border-primary-foreground/10 bg-primary-foreground/[0.05] hover:bg-primary-foreground/[0.1] transition md:right-8"
            >
              <ChevronRight className="h-5 w-5 text-primary-foreground/70" />
            </button>
            <motion.img
              key={lightboxIdx}
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              src={galleryImages[lightboxIdx]} alt=""
              className="max-h-[85vh] max-w-[90vw] rounded-3xl object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════ EXTRA INFO MODAL ═══════ */}
      <AnimatePresence>
        {showExtraInfo && venue.extraInfo && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/80 p-4 backdrop-blur-2xl md:items-center"
            onClick={() => setShowExtraInfo(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 50, scale: 0.97 }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-primary-foreground/[0.08] bg-foreground p-7 shadow-[0_40px_100px_-40px_hsl(var(--foreground)/0.9)] md:p-10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-8 flex items-start justify-between">
                <div>
                  <div className="mb-3 flex items-center gap-3">
                    <span className="h-px w-8 bg-accent/40" />
                    <p className="text-[9px] uppercase tracking-[0.4em] text-accent/70">
                      {language === "it" ? "Policy & dettagli" : "Policy & details"}
                    </p>
                  </div>
                  <h3 className="font-serif text-3xl text-primary-foreground">{language === "it" ? "Informazioni utili" : "Useful info"}</h3>
                </div>
                <button
                  onClick={() => setShowExtraInfo(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-primary-foreground/[0.08] bg-primary-foreground/[0.04] transition-colors hover:bg-primary-foreground/[0.08]"
                >
                  <X className="h-4 w-4 text-primary-foreground/60" />
                </button>
              </div>
              <p className="whitespace-pre-line text-[15px] leading-[2.1] text-primary-foreground/60">{venue.extraInfo}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
};

export default VenueDetail;
