import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Users, BedDouble, Bath, ArrowRight, Ship, Music } from "lucide-react";

export type HighlightItem = {
  id: string;
  slug: string;
  name: string;
  zone?: string | null;
  image: string;
  capacity?: number | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  category?: string | null;
  href: string;
};

interface HighlightSheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  items: HighlightItem[];
  initialIndex?: number;
  /** Token to color the category label */
  kind: "villas" | "apartments" | "yachts" | "venues";
}

const kindMeta: Record<HighlightSheetProps["kind"], { label: string }> = {
  villas: { label: "VILLE" },
  apartments: { label: "APPARTAMENTI" },
  yachts: { label: "YACHT" },
  venues: { label: "LOCALI" },
};

const HighlightSheet = ({ open, onClose, title, items, initialIndex = 0, kind }: HighlightSheetProps) => {
  const [active, setActive] = useState(initialIndex);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) setActive(initialIndex);
  }, [open, initialIndex]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handler = () => {
      const w = el.clientWidth;
      const i = Math.round(el.scrollLeft / w);
      setActive(i);
    };
    el.addEventListener("scroll", handler, { passive: true });
    return () => el.removeEventListener("scroll", handler);
  }, [open]);

  const goTo = (i: number) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="hl-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[80] bg-foreground/60 backdrop-blur-md"
            onClick={onClose}
          />
          <motion.div
            key="hl-sheet"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 280 }}
            className="fixed inset-x-0 bottom-0 z-[81] rounded-t-[2rem] bg-background border-t border-border/40 shadow-[0_-25px_60px_-15px_rgba(0,0,0,0.4)] max-h-[88vh] flex flex-col"
          >
            {/* Drag handle */}
            <div className="pt-3 pb-2 flex justify-center">
              <span className="block h-1 w-12 rounded-full bg-muted-foreground/30" />
            </div>

            {/* Story-style progress bars */}
            <div className="px-4 pb-3 flex items-center gap-2">
              <div className="flex-1 flex items-center gap-1">
                {items.map((it, i) => (
                  <button
                    key={it.id}
                    onClick={() => goTo(i)}
                    className="flex-1 h-[3px] rounded-full overflow-hidden bg-white/15"
                    aria-label={`Vai a ${it.name}`}
                  >
                    <span
                      className={`block h-full rounded-full transition-all duration-500 ${
                        i < active
                          ? "w-full bg-white/70"
                          : i === active
                            ? "w-full bg-gradient-to-r from-accent to-primary"
                            : "w-0 bg-white/40"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <button
                onClick={onClose}
                className="shrink-0 w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground hover:bg-muted active:scale-95 transition-all"
                aria-label="Chiudi"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Category label */}
            <div className="px-5 pb-2 flex items-center justify-between">
              <span className="text-accent text-[10px] uppercase tracking-[0.4em] font-semibold">
                {kindMeta[kind].label}
              </span>
              <span className="text-muted-foreground text-[10px] tracking-wider">
                {active + 1} / {items.length}
              </span>
            </div>

            {/* Swipeable cards */}
            <div
              ref={scrollRef}
              className="flex-1 flex overflow-x-auto snap-x snap-mandatory scrollbar-hide overscroll-contain"
              style={{ scrollbarWidth: "none" }}
            >
              {items.map((it) => (
                <div
                  key={it.id}
                  className="snap-center shrink-0 w-full px-5 pb-6"
                  style={{ scrollSnapStop: "always" }}
                >
                  <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-muted">
                    <img
                      src={it.image}
                      alt={it.name}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/10 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <h3 className="text-white font-serif text-2xl leading-tight drop-shadow-lg">{it.name}</h3>
                      {it.zone && (
                        <p className="flex items-center gap-1.5 text-white/85 text-sm mt-1.5">
                          <MapPin className="h-3.5 w-3.5 text-accent" /> {it.zone}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Meta chips */}
                  {(it.capacity || it.bedrooms || it.bathrooms || it.category) && (
                    <div className="flex flex-wrap gap-2 mt-4 justify-center">
                      {it.capacity != null && (
                        <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-muted/60 text-foreground text-xs font-medium">
                          <Users className="h-3.5 w-3.5 text-accent" /> {it.capacity} ospiti
                        </span>
                      )}
                      {it.bedrooms != null && (
                        <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-muted/60 text-foreground text-xs font-medium">
                          <BedDouble className="h-3.5 w-3.5 text-accent" /> {it.bedrooms} camere
                        </span>
                      )}
                      {it.bathrooms != null && (
                        <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-muted/60 text-foreground text-xs font-medium">
                          <Bath className="h-3.5 w-3.5 text-accent" /> {it.bathrooms} bagni
                        </span>
                      )}
                      {it.category && kind === "yachts" && (
                        <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-muted/60 text-foreground text-xs font-medium">
                          <Ship className="h-3.5 w-3.5 text-accent" /> {it.category}
                        </span>
                      )}
                      {it.category && kind === "venues" && (
                        <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-muted/60 text-foreground text-xs font-medium">
                          <Music className="h-3.5 w-3.5 text-accent" /> {it.category}
                        </span>
                      )}
                    </div>
                  )}

                  {/* CTAs */}
                  <div className="mt-5 space-y-2.5">
                    <Link
                      to={it.href}
                      onClick={onClose}
                      className="block w-full text-center py-3.5 rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground text-sm font-semibold shadow-lg shadow-accent/25"
                    >
                      Prenota ora
                    </Link>
                    <Link
                      to={it.href}
                      onClick={onClose}
                      className="flex items-center justify-center gap-2 w-full py-3.5 rounded-full border border-border/60 text-foreground text-sm font-medium hover:bg-muted/50 transition-colors"
                    >
                      Apri scheda completa <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>

                  <p className="text-center text-muted-foreground/70 text-[11px] mt-3">
                    Trascina la card per scoprire altre proposte
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default HighlightSheet;
