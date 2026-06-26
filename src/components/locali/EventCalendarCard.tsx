import { ArrowRight, MapPin, Clock, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

interface EventCalendarCardProps {
  event: {
    id: string;
    dj: string;
    venue: string;
    venueSlug: string;
    tag?: string;
    description?: string;
    time?: string;
  };
  dayName: string;
  dayNum: number;
  month: string;
  venueImage?: string;
  featured?: boolean;
  language: string;
}

const EventCalendarCard = ({
  event,
  dayName,
  dayNum,
  month,
  venueImage,
  featured = false,
  language,
}: EventCalendarCardProps) => {
  if (featured) {
    return (
      <article className="group relative h-full min-h-[26rem] overflow-hidden rounded-[2rem] border border-border/10 bg-foreground shadow-[0_40px_100px_-45px_hsl(var(--foreground)/0.55)]">
        {venueImage && (
          <img
            src={venueImage}
            alt={event.venue}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1800ms] ease-out group-hover:scale-[1.06]"
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-b from-foreground/20 via-foreground/45 to-foreground/98" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,hsl(var(--accent)/0.12),transparent_60%)]" />

        <div className="relative flex h-full min-h-[26rem] flex-col justify-between p-6 md:p-8">
          <div className="flex items-start justify-between gap-4">
            <div className="rounded-[1.5rem] border border-primary-foreground/10 bg-primary-foreground/[0.08] px-5 py-4 text-center backdrop-blur-md">
              <p className="text-[9px] uppercase tracking-[0.35em] text-primary-foreground/60">{dayName}</p>
              <p className="font-serif text-4xl leading-none text-primary-foreground">{dayNum}</p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.28em] text-accent/80">{month}</p>
            </div>

            <div className="flex flex-col items-end gap-2">
              {event.tag && (
                <span className="inline-flex rounded-full border border-accent/25 bg-accent/[0.1] px-4 py-1.5 text-[9px] uppercase tracking-[0.28em] text-accent backdrop-blur-md">
                  {event.tag}
                </span>
              )}
              {event.time && (
                <span className="flex items-center gap-1.5 text-[10px] text-primary-foreground/45">
                  <Clock className="h-3 w-3" /> {event.time}
                </span>
              )}
            </div>
          </div>

          <div>
            <p className="mb-3 text-[10px] uppercase tracking-[0.35em] text-accent/75">
              {language === "it" ? "Evento in evidenza" : "Featured event"}
            </p>
            <h3 className="font-serif text-3xl leading-[1.02] text-primary-foreground transition-colors duration-500 group-hover:text-accent md:text-4xl">
              {event.dj}
            </h3>
            {event.description && (
              <p className="mt-3 line-clamp-2 text-sm leading-7 text-primary-foreground/45">
                {event.description}
              </p>
            )}
            <div className="mt-5 flex items-center justify-between">
              <p className="flex items-center gap-2 text-sm text-primary-foreground/55">
                <MapPin className="h-4 w-4 text-accent/80" />
                {event.venue}
              </p>
              <a
                href="https://wa.me/393420639539"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.24em] text-accent-foreground shadow-[0_10px_30px_-10px_hsl(var(--accent)/0.35)] transition-all duration-300 hover:shadow-[0_15px_40px_-10px_hsl(var(--accent)/0.5)]"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                {language === "it" ? "Prenota" : "Book"}
              </a>
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <Link to={`/locali/${event.venueSlug}`} className="block">
      <article className="group relative overflow-hidden rounded-[2rem] border border-border/10 bg-card/85 shadow-[0_30px_80px_-45px_hsl(var(--foreground)/0.35)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_35px_90px_-40px_hsl(var(--foreground)/0.45)]">
        <div className="absolute -right-10 top-0 h-32 w-32 rounded-full bg-accent/10 blur-3xl" />

        <div className="relative grid items-center gap-4 p-4 md:grid-cols-[92px_80px_minmax(0,1fr)_auto] md:p-5">
          <div className="rounded-[1.3rem] bg-foreground px-3 py-4 text-center text-primary-foreground shadow-[0_20px_50px_-30px_hsl(var(--foreground)/0.7)]">
            <p className="text-[9px] uppercase tracking-[0.32em] text-primary-foreground/55">{dayName}</p>
            <p className="font-serif text-3xl leading-none">{dayNum}</p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.3em] text-accent/80">{month}</p>
          </div>

          {venueImage ? (
            <div className="hidden overflow-hidden rounded-[1.3rem] md:block">
              <img src={venueImage} alt={event.venue} loading="lazy" className="h-20 w-20 object-cover transition-transform duration-700 group-hover:scale-110" />
            </div>
          ) : (
            <div className="hidden md:block" />
          )}

          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              {event.tag && (
                <span className="inline-flex rounded-full border border-accent/20 bg-accent/[0.08] px-3 py-1 text-[9px] uppercase tracking-[0.28em] text-accent">
                  {event.tag}
                </span>
              )}
              {event.time && (
                <span className="flex items-center gap-1 text-[9px] text-muted-foreground/50">
                  <Clock className="h-3 w-3" /> {event.time}
                </span>
              )}
            </div>

            <h3 className="font-serif text-2xl leading-[1.02] text-foreground transition-colors duration-300 group-hover:text-accent md:text-[1.75rem]">
              {event.dj}
            </h3>
            <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground/70">
              <MapPin className="h-4 w-4 text-accent/75" />
              {event.venue}
            </p>
          </div>

          <div className="hidden flex-col items-center gap-3 md:flex">
            <a
              href="https://wa.me/393420639539"
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-accent/20 bg-accent/[0.08] transition-all duration-500 hover:border-accent/40 hover:bg-accent"
            >
              <MessageCircle className="h-4 w-4 text-accent transition-colors duration-500 group-hover:text-accent-foreground" />
            </a>
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-border/10 bg-secondary/40 transition-all duration-500 group-hover:border-accent/30 group-hover:bg-accent">
              <ArrowRight className="h-3.5 w-3.5 text-foreground/50 transition-colors duration-500 group-hover:text-accent-foreground" />
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default EventCalendarCard;
