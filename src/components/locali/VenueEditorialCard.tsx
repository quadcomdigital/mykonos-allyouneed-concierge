import { ArrowRight, Clock, MapPin, Music } from "lucide-react";
import { Link } from "react-router-dom";

interface VenueEditorialCardProps {
  venue: {
    slug: string;
    name: string;
    image: string;
    zone: string;
    desc: string;
    openingHours: string;
    season: string;
    musicStyle?: string;
  };
  categoryLabel: string;
  featured?: boolean;
}

const VenueEditorialCard = ({ venue, categoryLabel, featured = false }: VenueEditorialCardProps) => {
  return (
    <Link to={`/locali/${venue.slug}`} className="block h-full">
      <article
        className={`group relative h-full overflow-hidden rounded-[2rem] border border-border/10 bg-foreground shadow-[0_40px_100px_-45px_hsl(var(--foreground)/0.55)] ${
          featured ? "min-h-[28rem]" : "min-h-[22rem]"
        }`}
      >
        <img
          src={venue.image}
          alt={venue.name}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1800ms] ease-out group-hover:scale-[1.06]"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-foreground/15 via-foreground/25 to-foreground/95" />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-foreground/55 to-transparent" />

        <div className="relative flex h-full flex-col justify-between p-5 md:p-7">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-3">
              <span className="inline-flex rounded-full border border-primary-foreground/10 bg-primary-foreground/[0.06] px-4 py-1.5 text-[9px] uppercase tracking-[0.35em] text-primary-foreground/75 backdrop-blur-md">
                {categoryLabel}
              </span>
              <p className="flex items-center gap-1.5 text-[11px] font-light text-primary-foreground/55">
                <MapPin className="h-3 w-3 text-accent/80" />
                {venue.zone}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-primary-foreground/10 bg-primary-foreground/[0.05] backdrop-blur-md transition-all duration-500 group-hover:border-accent/30 group-hover:bg-accent">
              <ArrowRight className="h-4 w-4 text-primary-foreground/75 transition-colors duration-500 group-hover:text-accent-foreground" />
            </div>
          </div>

          <div className="max-w-xl">
            {venue.musicStyle && (
              <p className="mb-3 flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-accent/75">
                <Music className="h-3 w-3" />
                {venue.musicStyle}
              </p>
            )}

            <h3 className={`${featured ? "text-3xl md:text-4xl" : "text-2xl md:text-[2rem]"} font-serif leading-[1.02] text-primary-foreground transition-colors duration-500 group-hover:text-accent`}>
              {venue.name}
            </h3>

            <p className={`mt-3 max-w-lg text-sm leading-7 text-primary-foreground/62 ${featured ? "md:text-[15px]" : ""}`}>
              {venue.desc}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-2.5 text-[10px] uppercase tracking-[0.24em] text-primary-foreground/55">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary-foreground/10 bg-primary-foreground/[0.05] px-3 py-1.5 backdrop-blur-md">
                <Clock className="h-3 w-3 text-accent/80" />
                {venue.openingHours}
              </span>
              <span className="inline-flex rounded-full border border-primary-foreground/10 bg-primary-foreground/[0.05] px-3 py-1.5 backdrop-blur-md">
                {venue.season}
              </span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default VenueEditorialCard;
