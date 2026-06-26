import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Heart, MapPin, Sparkles, Flame } from "lucide-react";
import { PriceSeal } from "@/components/catalog/PriceSeal";
import { cn } from "@/lib/utils";

export type FeaturedItem = {
  id: string;
  name: string;
  image: string;
  href: string;
  zone?: string;
  priceFrom?: string | null;
  priceSuffix?: string;
  /** small inline chips at the bottom: e.g. "8 ospiti", "4 camere" */
  chips?: { icon: React.ComponentType<{ className?: string }>; label: string }[];
  /** scarcity / proof microcopy (e.g. "12 prenotazioni a luglio") */
  proof?: string;
  category?: string;
  /** override the "Più prenotata/o" pill label */
  topLabel?: string;
};

export const FeaturedRail = ({
  title,
  subtitle,
  items,
  ctaLabel = "Vedi dettaglio",
}: {
  title: string;
  subtitle?: string;
  items: FeaturedItem[];
  ctaLabel?: string;
}) => {
  if (!items.length) return null;

  return (
    <section className="relative py-6 md:py-12 bg-gradient-to-b from-secondary/20 via-background to-background">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full bg-accent/5 blur-[160px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-primary/5 blur-[140px]" />
      </div>

      <div className="container mx-auto px-3 md:px-4 relative z-10">
        {/* Section header */}
        <div className="flex items-end justify-between mb-4 md:mb-7">
          <div>
            <span className="inline-flex items-center gap-1.5 text-[9px] md:text-[10px] uppercase tracking-[0.35em] font-semibold mb-1.5 md:mb-2">
              <Flame className="h-3 w-3 text-accent fill-accent" />
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {subtitle ?? "I più prenotati"}
              </span>
            </span>
            <h2
              style={{ fontFamily: "'Parkinsans', sans-serif" }}
              className="font-bold text-xl md:text-4xl leading-tight bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent"
            >
              {title}
            </h2>
            <div className="mt-2 h-px w-12 md:w-16 bg-gradient-to-r from-primary via-accent to-transparent" />
          </div>
        </div>

        {/* Rail: mobile snap-scroll / desktop 3-col grid */}
        <div className="flex md:grid md:grid-cols-3 gap-3 md:gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory pb-3 -mx-3 px-3 md:mx-0 md:px-0 scrollbar-hide">
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="shrink-0 w-[78%] md:w-auto snap-center"
            >
              <Link
                to={item.href}
                className="group block relative rounded-tl-[2.25rem] rounded-br-[2.25rem] rounded-tr-md rounded-bl-md overflow-hidden border border-border/40 hover:border-accent/40 hover:shadow-[0_30px_70px_-25px_hsl(var(--accent)/0.3)] transition-all duration-700"
              >
                {/* Image */}
                <div className="relative aspect-[3/4] md:aspect-[4/5] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className={cn(
                      "w-full h-full transition-transform duration-[1500ms] ease-out group-hover:scale-[1.07]",
                      item.category === "vehicle" ? "object-contain p-6 bg-[radial-gradient(circle_at_30%_25%,hsl(var(--secondary))_0%,hsl(var(--secondary)/0.3)_70%,hsl(var(--background))_100%)]" : "object-cover"
                    )}
                  />
                  {item.category !== "vehicle" && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                  )}

                  {/* TOP pill */}
                  <div className="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground text-[8px] md:text-[9px] font-bold uppercase tracking-[0.2em] shadow-lg">
                    <Sparkles className="h-2.5 w-2.5" /> {item.topLabel ?? "Più prenotata"}
                  </div>

                  {/* Wishlist */}
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    className="absolute top-3 right-3 w-7 h-7 md:w-8 md:h-8 rounded-full bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center hover:bg-white/25 active:scale-90 transition"
                    aria-label="Aggiungi a wishlist"
                  >
                    <Heart className="h-3.5 w-3.5 text-white" strokeWidth={1.6} />
                  </button>

                  {/* Price seal */}
                  {item.priceFrom && (
                    <PriceSeal
                      price={item.priceFrom}
                      suffix={item.priceSuffix ?? "notte"}
                      size="md"
                      className="absolute bottom-3 right-3 z-10"
                    />
                  )}

                  {/* Bottom content overlay (only for photo categories) */}
                  {item.category !== "vehicle" && (
                    <div className="absolute bottom-0 left-0 right-0 p-4 pr-24">
                      {item.zone && (
                        <span className="text-white/75 text-[9px] uppercase tracking-[0.3em] font-medium flex items-center gap-1 mb-1.5">
                          <MapPin className="h-2.5 w-2.5 text-accent" /> {item.zone}
                        </span>
                      )}
                      <h3
                        style={{ fontFamily: "'Parkinsans', sans-serif" }}
                        className="font-bold text-lg md:text-xl text-white leading-tight drop-shadow-lg line-clamp-2"
                      >
                        {item.name}
                      </h3>
                    </div>
                  )}
                </div>

                {/* Info bar (always visible) */}
                <div className="px-4 py-3 md:py-3.5 bg-gradient-to-r from-card via-card to-secondary/30 border-t border-border/30">
                  {item.category === "vehicle" && (
                    <h3
                      style={{ fontFamily: "'Parkinsans', sans-serif" }}
                      className="font-bold text-[13px] md:text-base text-foreground leading-tight truncate mb-1.5"
                    >
                      {item.name}
                    </h3>
                  )}
                  <div className="flex items-center justify-between gap-2">
                    {item.chips && item.chips.length > 0 ? (
                      <div className="flex items-center gap-2.5 md:gap-3 text-[10px] md:text-[11px] text-foreground/75 font-medium overflow-hidden">
                        {item.chips.slice(0, 4).map((c, idx) => (
                          <span key={idx} className="inline-flex items-center gap-1 shrink-0">
                            <c.icon className="h-3 w-3 text-accent" />
                            {c.label}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-[10px] text-muted-foreground italic">Premium selection</span>
                    )}
                    <ArrowRight className="h-3.5 w-3.5 text-accent shrink-0 group-hover:translate-x-1 transition-transform" />
                  </div>
                  {item.proof && (
                    <p className="mt-1.5 text-[9px] md:text-[10px] text-accent/90 font-medium uppercase tracking-wider">
                      {item.proof}
                    </p>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedRail;
