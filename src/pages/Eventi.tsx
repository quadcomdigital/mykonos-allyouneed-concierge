import { useRef, useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight, Calendar as CalendarIcon, MapPin, Search, X, Sparkles, Ticket, ChevronLeft, ChevronRight, Clock, Repeat, Info,
} from "lucide-react";
import { format } from "date-fns";
import { it, enUS } from "date-fns/locale";
import { useLanguage } from "@/i18n/LanguageContext";
import Layout from "@/components/layout/Layout";
import heroEventiAsset from "@/assets/pagina-eventi.png.asset.json";
const heroEventi = heroEventiAsset.url;
import { useVenues, useEvents } from "@/hooks/useSupabaseData";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import { getDjPortrait, getPooledPortrait } from "@/lib/djPortraits";
import { BOOKING_MODES, getBookingMode, resolveBookingMode, type BookingMode } from "@/lib/bookingModes";


type PartyType = "all" | "lunch" | "sunset" | "night";
type VenueCategory = "restaurant" | "beachclub" | "club";

const inferPartyType = (time: string, tag: string): Exclude<PartyType, "all"> => {
  const t = (tag || "").toLowerCase();
  if (t.includes("sunset")) return "sunset";
  if (t.includes("lunch")) return "lunch";
  if (t.includes("night")) return "night";
  const h = parseInt((time || "").split(":")[0] || "22", 10);
  if (isNaN(h)) return "night";
  if (h < 16) return "lunch";
  if (h < 20) return "sunset";
  return "night";
};

const partyTypeLabels = {
  lunch: { it: "Lunch Party", en: "Lunch Party" },
  sunset: { it: "Sunset Party", en: "Sunset Party" },
  night: { it: "Night Party", en: "Night Party" },
} as const;

// Curated residencies — weekly recurring nights/artists
const residencies: {
  venue: string;
  venueSlug: string;
  artist: string;
  schedule: { it: string; en: string };
  partyType: Exclude<PartyType, "all">;
}[] = [
  { venue: "Tropicana", venueSlug: "tropicana", artist: "Ludwig", schedule: { it: "Ogni lunedì · sunset", en: "Every Monday · sunset" }, partyType: "sunset" },
  { venue: "Spilia", venueSlug: "spilia", artist: "Spilia Lunch Party", schedule: { it: "Tutti i giorni · pranzo", en: "Daily · lunch" }, partyType: "lunch" },
  { venue: "Principote", venueSlug: "principote", artist: "Principote Lunch Party", schedule: { it: "Tutti i giorni · pranzo", en: "Daily · lunch" }, partyType: "lunch" },
  { venue: "Scorpios", venueSlug: "scorpios", artist: "Sunset Ritual", schedule: { it: "Ogni giorno al tramonto", en: "Daily at sunset" }, partyType: "sunset" },
  { venue: "Nammos", venueSlug: "nammos", artist: "Lunch Sessions", schedule: { it: "Tutti i giorni · pranzo", en: "Daily · lunch" }, partyType: "lunch" },
];

const Eventi = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [partyType, setPartyType] = useState<PartyType>("all");
  const [customDate, setCustomDate] = useState<Date | undefined>();
  const [searchQuery, setSearchQuery] = useState("");
  const heroRef = useRef<HTMLElement | null>(null);
  const featuredRailRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

  const { data: dbVenues } = useVenues();
  const { data: dbEvents } = useEvents();

  const venueMap = useMemo(() => {
    const m = new Map<string, { slug: string; name: string; category: VenueCategory; zone: string; image: string; bookingMode: BookingMode }>();
    (dbVenues || []).forEach((v) => m.set(v.slug, {
      slug: v.slug, name: v.name, category: v.category as VenueCategory,
      zone: v.zone || "", image: v.image_url || "/placeholder.svg",
      bookingMode: resolveBookingMode((v as any).booking_mode),
    }));
    return m;
  }, [dbVenues]);

  const events = useMemo(() => {
    return (dbEvents || []).map((e) => {
      const v = venueMap.get(e.venue_slug || "");
      return {
        id: e.id, date: e.date, dj: e.dj, venue: e.venue_name || "",
        venueSlug: e.venue_slug || "", description: e.description || "",
        highlight: e.highlight || false, tag: e.tag || "", time: e.time || "", image_url: e.image_url || "",
        accredito_deadline: e.accredito_deadline,
        partyType: inferPartyType(e.time || "", e.tag || ""),
        bookingMode: v?.bookingMode || resolveBookingMode(null),
      };
    });
  }, [dbEvents, venueMap]);

  const filteredEvents = useMemo(() => {
    const now = new Date(); now.setHours(0, 0, 0, 0);
    return events
      .filter((e) => new Date(e.date + "T00:00:00") >= now)
      .filter((e) => !customDate || format(new Date(e.date + "T00:00:00"), "yyyy-MM-dd") === format(customDate, "yyyy-MM-dd"))
      .filter((e) => partyType === "all" || e.partyType === partyType)
      .filter((e) => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return e.dj.toLowerCase().includes(q) || e.venue.toLowerCase().includes(q) || (e.tag && e.tag.toLowerCase().includes(q));
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [events, customDate, partyType, searchQuery]);

  const featuredEvents = useMemo(() => filteredEvents.filter((e) => e.highlight).slice(0, 12), [filteredEvents]);
  const otherEvents = useMemo(() => filteredEvents.filter((e) => !featuredEvents.find((f) => f.id === e.id)), [filteredEvents, featuredEvents]);

  const filteredResidencies = useMemo(() => {
    return residencies
      .filter((r) => partyType === "all" || r.partyType === partyType)
      .filter((r) => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return r.artist.toLowerCase().includes(q) || r.venue.toLowerCase().includes(q);
      });
  }, [partyType, searchQuery]);

  const formatDate = (iso: string) => {
    const d = new Date(iso + "T00:00:00");
    const dayNames = language === "it" ? ["Dom","Lun","Mar","Mer","Gio","Ven","Sab"] : ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
    const monthNames = language === "it" ? ["Gen","Feb","Mar","Apr","Mag","Giu","Lug","Ago","Set","Ott","Nov","Dic"] : ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    return { dayName: dayNames[d.getDay()], dayNum: d.getDate(), month: monthNames[d.getMonth()] };
  };

  const scrollRail = (dir: "left" | "right") => {
    const el = featuredRailRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -el.clientWidth * 0.85 : el.clientWidth * 0.85, behavior: "smooth" });
  };

  const partyFilters: { key: PartyType; label: string }[] = [
    { key: "all", label: language === "it" ? "Tutte" : "All" },
    { key: "lunch", label: "Lunch" },
    { key: "sunset", label: "Sunset" },
    { key: "night", label: "Night" },
  ];

  // Group "other" events by date for cleaner row layout
  const groupedByDate = useMemo(() => {
    const groups = new Map<string, typeof otherEvents>();
    otherEvents.forEach((e) => {
      const arr = groups.get(e.date) || [];
      arr.push(e);
      groups.set(e.date, arr);
    });
    return Array.from(groups.entries());
  }, [otherEvents]);

  return (
    <Layout>
      {/* HERO */}
      <section ref={heroRef} className="relative h-[58svh] md:h-[72svh] overflow-hidden">
        <motion.div className="absolute inset-0" style={{ scale: heroScale }}>
          <img src={heroEventi} alt="" className="h-full w-full object-cover" />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/40 via-foreground/55 to-foreground" />
        <motion.div style={{ opacity: heroOpacity }} className="relative z-10 flex h-full flex-col justify-end pb-10 md:pb-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-10">
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}>
              <div className="mb-4 md:mb-6 flex items-center gap-3">
                <span className="h-px w-8 md:w-12 bg-accent/60" />
                <p className="font-sans text-[9px] md:text-[10px] uppercase tracking-[0.45em] md:tracking-[0.6em] text-accent/90">Mykonos · Summer 26</p>
              </div>
              <h1 className="font-serif text-[2.6rem] md:text-8xl lg:text-[8.5rem] leading-[0.9] text-primary-foreground tracking-tight">
                {language === "it" ? "Eventi" : "Events"}
              </h1>
              <p className="mt-4 md:mt-6 max-w-md font-sans text-[12.5px] md:text-[13.5px] leading-[1.7] md:leading-[1.8] text-primary-foreground/55">
                {language === "it"
                  ? "Il calendario delle notti più ambite dell'isola."
                  : "The calendar of the island's most coveted nights."}
              </p>
            </motion.div>
          </div>
        </motion.div>
      </section>


      {/* FILTERS — search + date + party type */}
      <nav className="sticky top-16 z-40 border-b border-primary-foreground/[0.05] bg-foreground/[0.97] backdrop-blur-2xl">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex items-center gap-2 md:gap-3 py-3 md:py-3.5 overflow-x-auto scrollbar-hide">
            {/* Search */}
            <div className="relative flex-1 min-w-[140px] max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-primary-foreground/30" />
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === "it" ? "Cerca DJ o locale..." : "Search DJ or venue..."}
                className="w-full border border-primary-foreground/[0.08] bg-primary-foreground/[0.04] pl-8 pr-8 py-2 font-sans text-[12px] text-primary-foreground placeholder:text-primary-foreground/25 outline-none focus:border-accent/30" />
              {searchQuery && <button onClick={() => setSearchQuery("")} className="absolute right-2 top-1/2 -translate-y-1/2"><X className="h-3 w-3 text-primary-foreground/40" /></button>}
            </div>

            {/* Date filter */}
            <Popover>
              <PopoverTrigger asChild>
                <button className={`shrink-0 flex items-center gap-1.5 md:gap-2 border px-2.5 md:px-3.5 py-2 font-sans text-[10px] uppercase tracking-[0.2em] md:tracking-[0.25em] transition ${customDate ? "border-accent/30 bg-accent/10 text-accent" : "border-primary-foreground/[0.08] bg-primary-foreground/[0.04] text-primary-foreground/55 hover:text-primary-foreground"}`}>
                  <CalendarIcon className="h-3 w-3" />
                  {customDate ? format(customDate, "dd MMM", { locale: language === "it" ? it : enUS }) : (language === "it" ? "Data" : "Date")}
                  {customDate && <X className="h-3 w-3 ml-1" onClick={(e) => { e.stopPropagation(); setCustomDate(undefined); }} />}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar mode="single" selected={customDate} onSelect={setCustomDate} className="p-3 pointer-events-auto" />
              </PopoverContent>
            </Popover>

            {/* Party type filter */}
            <Popover>
              <PopoverTrigger asChild>
                <button className={`shrink-0 flex items-center gap-1.5 md:gap-2 border px-2.5 md:px-3.5 py-2 font-sans text-[10px] uppercase tracking-[0.2em] md:tracking-[0.25em] transition ${partyType !== "all" ? "border-accent/30 bg-accent/10 text-accent" : "border-primary-foreground/[0.08] bg-primary-foreground/[0.04] text-primary-foreground/55 hover:text-primary-foreground"}`}>
                  <Sparkles className="h-3 w-3" />
                  {partyType === "all" ? (language === "it" ? "Tipo" : "Type") : partyTypeLabels[partyType as Exclude<PartyType, "all">][language as "it" | "en"]}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-44 p-1.5 bg-foreground border-primary-foreground/[0.08]" align="end">
                {partyFilters.map((f) => (
                  <button key={f.key} onClick={() => setPartyType(f.key)}
                    className={`w-full text-left px-3 py-2 font-sans text-[11px] uppercase tracking-[0.2em] transition ${partyType === f.key ? "bg-accent/15 text-accent" : "text-primary-foreground/60 hover:bg-primary-foreground/[0.05] hover:text-primary-foreground"}`}>
                    {f.label}
                  </button>
                ))}
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </nav>

      {/* (legend removed for a cleaner editorial layout) */}





      {/* FEATURED — editorial carousel */}
      {featuredEvents.length > 0 && (
        <section className="relative bg-gradient-to-b from-foreground via-[hsl(225_50%_7%)] to-foreground pt-10 md:pt-20 pb-10 md:pb-16 overflow-hidden">
          {/* Ambient accent glow */}
          <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-[420px] w-[820px] rounded-full bg-accent/[0.07] blur-3xl" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-10 relative">
            <div className="mb-6 md:mb-12 flex items-end justify-between gap-4">
              <div>
                <div className="mb-3 md:mb-4 flex items-center gap-3">
                  <span className="h-px w-10 md:w-12 bg-gradient-to-r from-transparent via-accent to-transparent" />
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                  <p className="font-sans text-[9px] md:text-[10px] uppercase tracking-[0.45em] md:tracking-[0.55em] text-accent/90">{language === "it" ? "In evidenza" : "Featured"}</p>
                </div>
                <h2 className="font-sans font-bold text-[26px] md:text-5xl lg:text-6xl leading-[0.95] tracking-tight text-primary-foreground">
                  {language === "it" ? "Eventi imperdibili" : "Must-see events"}
                </h2>

                <p className="mt-2.5 md:mt-3 font-sans text-[12px] md:text-[12.5px] text-primary-foreground/45 max-w-md leading-relaxed">
                  {language === "it" ? "Le notti più attese della stagione, selezionate per chi non vuole perdere nulla." : "The most anticipated nights of the season, curated for the in-the-know."}
                </p>
              </div>
              <div className="hidden md:flex items-center gap-2">
                <button onClick={() => scrollRail("left")} className="rounded-full border border-primary-foreground/[0.1] bg-primary-foreground/[0.03] p-2.5 text-primary-foreground/60 hover:text-accent hover:border-accent/40 hover:bg-accent/10 transition">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button onClick={() => scrollRail("right")} className="rounded-full border border-primary-foreground/[0.1] bg-primary-foreground/[0.03] p-2.5 text-primary-foreground/60 hover:text-accent hover:border-accent/40 hover:bg-accent/10 transition">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div ref={featuredRailRef} className="flex gap-3.5 md:gap-5 overflow-x-auto scrollbar-hide snap-x snap-mandatory -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10 pb-4">
              {featuredEvents.map((event, i) => {
                const { dayName, dayNum, month } = formatDate(event.date);
                const v = venueMap.get(event.venueSlug);
                const portrait = getDjPortrait(event.dj);
                const img = portrait || event.image_url || v?.image || getPooledPortrait(i);
                return (
                  <motion.article
                    key={event.id}
                    initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    transition={{ delay: i * 0.06, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    className="shrink-0 snap-start w-[85%] sm:w-[58%] md:w-[44%] lg:w-[32%] xl:w-[26%]"
                  >
                    <Link to={`/eventi/${event.id}`} className="group block relative">


                    <div className="relative aspect-[4/5] overflow-hidden rounded-[2px] border border-primary-foreground/[0.08] bg-foreground/40 transition-all duration-700 ease-out group-hover:border-accent/55 group-hover:shadow-[0_0_0_1px_hsl(var(--accent)/0.25),0_18px_50px_-25px_hsl(var(--accent)/0.35)]">
                      {img && img !== "/placeholder.svg" ? (
                        <img src={img} alt={event.dj} className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-[2000ms] ease-out group-hover:scale-[1.02]" />
                      ) : <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/15" />}

                      {/* Soft gradient for legibility */}
                      <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/40 to-transparent" />

                      {/* Delicate inner accent ring on hover */}
                      <div className="pointer-events-none absolute inset-0 ring-0 ring-inset ring-accent/0 transition-all duration-700 ease-out group-hover:ring-1 group-hover:ring-accent/30" />


                      {/* Date — editorial */}
                      <div className="absolute top-3 md:top-4 left-3 md:left-4">
                        <div className="border-l-2 border-accent pl-2 md:pl-2.5">
                          <p className="font-sans text-[8px] md:text-[8.5px] uppercase tracking-[0.32em] md:tracking-[0.35em] text-primary-foreground/55">{dayName}</p>
                          <p className="font-serif text-[28px] md:text-[40px] font-light leading-none text-primary-foreground mt-0.5">{dayNum}</p>
                          <p className="mt-0.5 md:mt-1 font-sans text-[8px] md:text-[8.5px] uppercase tracking-[0.3em] md:tracking-[0.32em] text-accent/85">{month}</p>
                        </div>
                      </div>




                      {/* Bottom content */}
                      <div className="absolute inset-x-0 bottom-0 p-4 md:p-6">
                        <h3 className="font-serif text-[17px] md:text-[24px] leading-[1.05] text-primary-foreground transition-colors duration-500 group-hover:text-accent">
                          {event.dj}
                        </h3>
                        <p className="mt-1.5 md:mt-2 flex items-center gap-1.5 font-sans text-[10.5px] md:text-[11.5px] text-primary-foreground/65">
                          <MapPin className="h-3 w-3 text-accent/80 shrink-0" />
                          <span className="truncate">{event.venue}</span>
                          {event.time && <><span className="text-primary-foreground/25">·</span><span>{event.time}</span></>}
                        </p>
                        <p className="mt-1 font-sans text-[9px] md:text-[10px] uppercase tracking-[0.28em] md:tracking-[0.3em] text-primary-foreground/40">
                          {partyTypeLabels[event.partyType][language as "it" | "en"]}
                        </p>

                        {/* CTA — appears on hover */}
                        <div className="mt-4 flex items-center gap-2 text-accent opacity-0 -translate-y-1 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
                          <span className="font-sans text-[11px] font-semibold tracking-normal">{language === "it" ? "Prenota la serata" : "Book this night"}</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </div>
                      </div>
                    </div>
                    </Link>
                  </motion.article>

                );
              })}
            </div>
          </div>
        </section>
      )}


      {/* RESIDENCIES — weekly recurring */}
      {filteredResidencies.length > 0 && (
        <section className="bg-foreground py-8 md:py-14 border-t border-primary-foreground/[0.04]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-10">
            <div className="mb-5 md:mb-8">
              <div className="mb-2.5 md:mb-3 flex items-center gap-3">
                <Repeat className="h-3 w-3 text-accent/75" />
                <p className="font-sans text-[9px] uppercase tracking-[0.4em] md:tracking-[0.5em] text-accent/75">{language === "it" ? "Residenze" : "Residencies"}</p>
              </div>
              <h2 className="font-sans font-bold text-[22px] md:text-4xl tracking-tight text-primary-foreground">
                {language === "it" ? "Appuntamenti fissi" : "Weekly rituals"}
              </h2>
              <p className="mt-2 font-sans text-[11.5px] md:text-[12px] text-primary-foreground/45 max-w-xl">
                {language === "it" ? "I dj e i locali che tornano ogni settimana, stesso giorno, stessa magia." : "The DJs and venues that return every week, same day, same magic."}
              </p>
            </div>
            <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-2">
              {filteredResidencies.map((r, i) => {
                const venueInfo = venueMap.get(r.venueSlug);
                const portrait = getDjPortrait(r.artist);
                const img = portrait || venueInfo?.image || getPooledPortrait(i + 7);
                return (
                  <motion.div key={r.venueSlug + r.artist}
                    initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                    transition={{ delay: i * 0.06, duration: 0.5 }}
                    className="group relative flex items-center gap-3 md:gap-4 border border-primary-foreground/[0.06] bg-primary-foreground/[0.02] p-2.5 md:p-3 transition-all hover:border-accent/30 hover:bg-primary-foreground/[0.04]"
                  >
                    <div className="relative h-16 w-16 md:h-20 md:w-20 shrink-0 overflow-hidden border border-primary-foreground/[0.05] bg-foreground/60">
                      <img src={img} alt={r.artist} className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-1000 group-hover:scale-105" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 md:gap-2 mb-1">
                        <Clock className="h-3 w-3 text-accent/70 shrink-0" />
                        <p className="font-sans text-[8.5px] md:text-[9px] uppercase tracking-[0.25em] md:tracking-[0.3em] text-accent/85 truncate">{r.schedule[language as "it" | "en"]}</p>
                      </div>
                      <h3 className="font-sans font-bold text-[13.5px] md:text-[15px] text-primary-foreground truncate transition-colors group-hover:text-accent">{r.artist}</h3>
                      <p className="mt-0.5 flex items-center gap-1 md:gap-1.5 font-sans text-[10.5px] md:text-[11px] text-primary-foreground/55 truncate">
                        <MapPin className="h-3 w-3 text-accent/70 shrink-0" /><span className="truncate">{r.venue}</span>
                      </p>
                    </div>
                    <Link to={`/locali/${r.venueSlug}#prenota`} className="shrink-0 border border-primary-foreground/[0.08] px-2.5 md:px-3 py-1.5 md:py-2 font-sans text-[9px] uppercase tracking-[0.2em] md:tracking-[0.25em] text-primary-foreground/60 transition group-hover:border-accent/40 group-hover:text-accent">
                      {language === "it" ? "Prenota" : "Book"}
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* LINEUP — row layout grouped by date */}
      <section className="bg-foreground py-10 md:py-16 border-t border-primary-foreground/[0.04]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10">
          <div className="mb-6 md:mb-10 flex items-end justify-between flex-wrap gap-3">
            <div>
              <div className="mb-2.5 md:mb-3 flex items-center gap-3">
                <span className="h-px w-8 md:w-10 bg-accent/40" />
                <p className="font-sans text-[9px] uppercase tracking-[0.4em] md:tracking-[0.5em] text-accent/75">Line-up</p>
              </div>
              <h2 className="font-sans font-bold text-[22px] md:text-4xl tracking-tight text-primary-foreground">
                {language === "it" ? "Calendario completo" : "Full agenda"}
              </h2>
            </div>
            <span className="border border-accent/20 bg-accent/5 px-2.5 md:px-3 py-1 font-sans text-[9.5px] md:text-[10px] text-accent tracking-wider">
              {otherEvents.length} {language === "it" ? "eventi" : "events"}
            </span>
          </div>

          {otherEvents.length === 0 && featuredEvents.length === 0 ? (
            <div className="text-center py-20 md:py-24">
              <Sparkles className="mx-auto h-8 w-8 text-accent/40 mb-3" />
              <p className="font-sans text-primary-foreground/40">{language === "it" ? "Nessun evento per questi filtri" : "No events for these filters"}</p>
            </div>
          ) : (
            <div className="space-y-8 md:space-y-14">
              <AnimatePresence mode="popLayout">
                {groupedByDate.map(([date, dayEvents], groupIdx) => {
                  const { dayName, dayNum, month } = formatDate(date);
                  return (
                    <motion.div key={date} layout
                      initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      transition={{ delay: Math.min(groupIdx, 8) * 0.04, duration: 0.5 }}
                    >
                      {/* Date header */}
                      <div className="mb-3 md:mb-4 flex items-baseline gap-3 md:gap-4 border-b border-primary-foreground/[0.06] pb-2.5 md:pb-3">
                        <div className="flex items-baseline gap-2">
                          <span className="font-sans font-bold text-2xl md:text-4xl text-primary-foreground leading-none">{dayNum}</span>
                          <span className="font-sans text-[9.5px] md:text-[10px] uppercase tracking-[0.25em] md:tracking-[0.3em] text-accent/85">{month}</span>
                        </div>
                        <span className="font-sans text-[9.5px] md:text-[10px] uppercase tracking-[0.25em] md:tracking-[0.3em] text-primary-foreground/40">{dayName}</span>
                      </div>

                      {/* Rows */}
                      <div className="divide-y divide-primary-foreground/[0.05]">
                        {dayEvents.map((event, i) => {
                          const v = venueMap.get(event.venueSlug);
                          const portrait = getDjPortrait(event.dj);
                          const img = portrait || event.image_url || v?.image || getPooledPortrait(i + groupIdx * 3);
                          return (
                            <motion.div
                              key={event.id}
                              onClick={() => navigate(`/eventi/${event.id}`)}
                              whileHover={{ x: 6 }}
                              transition={{ type: "spring", stiffness: 260, damping: 22 }}
                              className="group relative grid grid-cols-[68px_1fr_auto] md:grid-cols-[110px_1fr_auto] items-center gap-3 md:gap-6 py-3 md:py-4 cursor-pointer"
                            >
                              {/* Portrait */}
                              <div className="relative h-[68px] md:h-[110px] w-[68px] md:w-[110px] overflow-hidden border border-primary-foreground/[0.06] bg-foreground/40">
                                {img && img !== "/placeholder.svg" ? (
                                  <img src={img} alt={event.dj} loading="lazy"
                                    className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-[1200ms] ease-out group-hover:scale-[1.08]" />
                                ) : <div className="absolute inset-0 bg-gradient-to-br from-primary/25 to-accent/10" />}
                                <div className="absolute inset-0 ring-0 ring-accent/0 transition-all duration-500 group-hover:ring-1 group-hover:ring-accent/40" />
                              </div>

                              {/* Info */}
                              <div className="min-w-0">
                                <div className="flex items-center gap-2 mb-1 md:mb-1.5 flex-wrap">
                                  <span className="font-sans text-[8px] md:text-[8.5px] uppercase tracking-[0.24em] md:tracking-[0.28em] text-primary-foreground/40">
                                    {partyTypeLabels[event.partyType][language as "it" | "en"]}
                                  </span>
                                  {event.time && (
                                    <span className="flex items-center gap-1 font-sans text-[9.5px] md:text-[10px] text-primary-foreground/45">
                                      <Clock className="h-2.5 w-2.5" />{event.time}
                                    </span>
                                  )}
                                </div>

                                <h3 className="font-sans font-bold text-[14px] md:text-[20px] leading-tight text-primary-foreground transition-colors group-hover:text-accent line-clamp-2">
                                  {event.dj}
                                </h3>
                                <p className="mt-1 md:mt-1.5 flex items-center gap-1 md:gap-1.5 font-sans text-[10.5px] md:text-[12px] text-primary-foreground/55 line-clamp-1">
                                  <MapPin className="h-3 w-3 text-accent/70 shrink-0" /><span className="truncate">{event.venue}</span>
                                </p>
                              </div>

                              {/* CTA */}
                              <div className="flex flex-col items-end gap-2 md:gap-2.5">
                                <span className="hidden md:inline-flex items-center gap-1.5 border border-primary-foreground/[0.18] bg-transparent px-5 py-2.5 font-sans text-[12px] font-semibold text-primary-foreground/80 transition group-hover:border-accent/60 group-hover:text-accent">
                                  <Ticket className="h-3.5 w-3.5" />{language === "it" ? "Prenota ora" : "Book now"}
                                </span>
                                <span className="md:hidden inline-flex items-center gap-1 border border-primary-foreground/[0.18] bg-transparent px-2.5 py-1.5 font-sans text-[9.5px] uppercase tracking-[0.2em] text-primary-foreground/75 transition group-hover:border-accent/60 group-hover:text-accent">
                                  <Ticket className="h-3 w-3" />{language === "it" ? "Prenota" : "Book"}
                                </span>
                              </div>


                            </motion.div>
                          );
                        })}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}

          <div className="mt-10 md:mt-14 text-center">
            <Link to="/locali" className="inline-flex items-center gap-2 font-sans text-[10px] uppercase tracking-[0.3em] md:tracking-[0.35em] text-accent/80 hover:text-accent transition">
              {language === "it" ? "Scopri i locali partner" : "Discover partner venues"} <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      
    </Layout>
  );
};

export default Eventi;
