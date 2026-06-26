import { useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, Calendar as CalIcon, MapPin, Clock } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { useLanguage } from "@/i18n/LanguageContext";
import { useEvents, useVenues } from "@/hooks/useSupabaseData";
import { getDjPortrait, getPooledPortrait } from "@/lib/djPortraits";
import { AccreditoCountdown } from "@/components/events/AccreditoCountdown";
import VenueBookingFlow from "@/components/booking/VenueBookingFlow";

const EventoDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { data: dbEvents } = useEvents();
  const { data: dbVenues } = useVenues();

  const event = useMemo(() => (dbEvents || []).find((e) => e.id === id), [dbEvents, id]);
  const venue = useMemo(
    () => (dbVenues || []).find((v) => v.slug === event?.venue_slug),
    [dbVenues, event]
  );

  if (!dbEvents) {
    return <Layout><div className="min-h-screen grid place-items-center bg-foreground"><Loader2 className="h-6 w-6 animate-spin text-accent" /></div></Layout>;
  }
  if (!event) {
    return (
      <Layout>
        <div className="min-h-screen grid place-items-center bg-foreground text-primary-foreground/70 px-6 text-center">
          <div>
            <p className="font-serif text-3xl mb-3">{language === "it" ? "Evento non trovato" : "Event not found"}</p>
            <Link to="/eventi" className="text-accent hover:underline">← {language === "it" ? "Torna agli eventi" : "Back to events"}</Link>
          </div>
        </div>
      </Layout>
    );
  }

  const d = new Date(event.date + "T00:00:00");
  const fmtDate = d.toLocaleDateString(language === "it" ? "it-IT" : "en-US", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const portrait = getDjPortrait(event.dj) || event.image_url || venue?.image_url || getPooledPortrait(0);

  return (
    <Layout>
      {/* HERO */}
      <section className="relative min-h-[52svh] md:min-h-[52svh] overflow-hidden bg-foreground">
        <img src={portrait} alt={event.dj} className="absolute inset-0 h-full w-full object-cover object-top opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/40 via-foreground/70 to-foreground" />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/30 to-transparent" />

        <div className="relative z-10 container mx-auto px-5 sm:px-6 lg:px-10 pt-24 md:pt-32 pb-14 md:pb-20">
          <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 mb-8 md:mb-10 text-[10.5px] md:text-[11px] uppercase tracking-[0.28em] md:tracking-[0.3em] text-primary-foreground/55 hover:text-accent transition">
            <ArrowLeft className="h-3.5 w-3.5" /> {language === "it" ? "Torna agli eventi" : "Back to events"}
          </button>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} className="max-w-3xl">
            <div className="mb-4 md:mb-5 flex items-center gap-3">
              <span className="h-px w-10 md:w-12 bg-accent/70" />
              <p className="font-sans text-[9.5px] md:text-[10px] uppercase tracking-[0.4em] md:tracking-[0.5em] text-accent/90">{event.tag || (language === "it" ? "Evento" : "Event")}</p>
            </div>
            <h1 className="font-sans font-bold mt-2 text-[1.35rem] md:text-[2.5rem] lg:text-[3rem] leading-[1.15] md:leading-[1.1] tracking-tight text-primary-foreground">{event.dj}</h1>
            <div className="mt-4 md:mt-7 flex flex-row flex-wrap items-center gap-x-2.5 md:gap-x-7 gap-y-1.5 text-[10.5px] md:text-[13.5px] text-primary-foreground/75">
              <span className="flex items-center gap-1.5 min-w-0"><CalIcon className="h-3.5 w-3.5 text-accent shrink-0" /> <span className="truncate">{fmtDate}</span></span>
              <span className="flex items-center gap-1.5 min-w-0"><MapPin className="h-3.5 w-3.5 text-accent shrink-0" /> <span className="truncate">{event.venue_name}</span></span>
              {event.time && <span className="flex items-center gap-1.5 min-w-0"><Clock className="h-3.5 w-3.5 text-accent shrink-0" /> <span className="truncate">{event.time}</span></span>}
            </div>
            <div className="mt-5">
              <AccreditoCountdown deadline={event.accredito_deadline} eventDate={(event as any).date} eventTime={event.time} />
            </div>
            {event.description && <p className="mt-6 md:mt-6 max-w-xl text-[13.5px] md:text-[14px] text-primary-foreground/60 leading-[1.8] md:leading-[1.85]">{event.description}</p>}
          </motion.div>
        </div>
      </section>

      <VenueBookingFlow
        venue={{
          slug: venue?.slug || event.venue_slug || "",
          name: venue?.name || event.venue_name || "",
          booking_mode: (venue as any)?.booking_mode,
        }}
        event={{
          id: event.id,
          dj: event.dj,
          date: event.date,
          time: event.time,
          tag: event.tag,
          venue_name: event.venue_name,
          venue_slug: event.venue_slug,
        }}
      />
    </Layout>
  );
};

export default EventoDetail;
