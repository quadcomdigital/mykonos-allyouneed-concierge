import { Search, SlidersHorizontal, Sparkles } from "lucide-react";

type Props = {
  searchValue: string;
  onSearchChange: (v: string) => void;
  placeholder: string;
  count?: number;
  countLabel?: string;
  onOpenFilters: () => void;
  featuredActive: boolean;
  onToggleFeatured: () => void;
  activeFilterCount?: number;
};

export const CatalogFilterBar = ({
  searchValue, onSearchChange, placeholder, count, countLabel,
  onOpenFilters, featuredActive, onToggleFeatured, activeFilterCount = 0,
}: Props) => (
  <div className="container mx-auto px-3 md:px-4">
    <div className="relative max-w-4xl mx-auto">
      <div className="flex items-center gap-1.5 md:gap-2 rounded-full bg-card/95 backdrop-blur-xl border border-border/40 shadow-[0_18px_50px_-24px_rgba(0,0,0,0.25)] px-1.5 md:px-2 py-1.5 md:py-2">
        {/* Search */}
        <div className="flex-1 min-w-0 flex items-center gap-2 px-3 md:px-4 py-2 md:py-2.5">
          <Search className="h-3.5 w-3.5 md:h-4 md:w-4 text-accent shrink-0" />
          <input
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={placeholder}
            className="flex-1 min-w-0 bg-transparent text-xs md:text-sm text-foreground placeholder:text-muted-foreground/55 focus:outline-none font-medium"
          />
        </div>

        {/* Divider */}
        <span className="hidden md:block w-px h-7 bg-gradient-to-b from-transparent via-border to-transparent" />

        {/* Filtri */}
        <button
          onClick={onOpenFilters}
          className="relative flex items-center gap-1.5 px-3 md:px-4 py-2 md:py-2.5 rounded-full bg-secondary/60 hover:bg-secondary text-foreground text-[11px] md:text-[13px] font-semibold tracking-wide transition shrink-0 border border-border/30"
        >
          <SlidersHorizontal className="h-3.5 w-3.5 md:h-4 md:w-4 text-accent" />
          <span>Filtri</span>
          {activeFilterCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-gradient-to-br from-primary to-accent text-white text-[9px] font-bold flex items-center justify-center shadow-md">
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* In evidenza */}
        <button
          onClick={onToggleFeatured}
          className={`flex items-center gap-1.5 px-3 md:px-4 py-2 md:py-2.5 rounded-full text-[11px] md:text-[13px] font-semibold tracking-wide transition shrink-0 ${
            featuredActive
              ? "bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-accent/20 border-0"
              : "bg-secondary/60 hover:bg-secondary text-foreground border border-border/30"
          }`}
        >
          <Sparkles className={`h-3.5 w-3.5 md:h-4 md:w-4 ${featuredActive ? "text-white" : "text-accent"}`} />
          <span>In evidenza</span>
        </button>
      </div>

      {count !== undefined && countLabel && (
        <p className="text-[10px] md:text-xs text-muted-foreground mt-2.5 ml-4 flex items-center gap-1.5 tracking-wide">
          <Sparkles className="h-2.5 w-2.5 text-accent" />
          <span className="font-semibold text-foreground">{count}</span> {countLabel}
        </p>
      )}
    </div>
  </div>
);

export type FilterSpec = {
  key: string;
  label: string;
  options: { label: string; value: string }[];
  value: string;
  onChange: (v: string) => void;
};

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export const CatalogFilterSheet = ({
  open, onOpenChange, filters, onReset,
}: {
  open: boolean;
  onOpenChange: (b: boolean) => void;
  filters: FilterSpec[];
  onReset?: () => void;
}) => (
  <Sheet open={open} onOpenChange={onOpenChange}>
    <SheetContent side="bottom" className="rounded-t-3xl max-h-[88vh] overflow-y-auto p-6 pb-0">
      <SheetHeader className="mb-6">
        <SheetTitle className="font-serif text-2xl text-left">Filtri</SheetTitle>
      </SheetHeader>
      <div className="space-y-6 pb-32">
        {filters.map((f) => (
          <div key={f.key}>
            <p className="text-xs text-muted-foreground mb-3">{f.label}</p>
            <div className="flex flex-wrap gap-2">
              {f.options.map((o) => {
                const active = f.value === o.value;
                const label = (o.value === "all" && (o.label.toLowerCase() === "tutti" || o.label.toLowerCase() === "tutte"))
                  ? "TUTTI" : o.label.toUpperCase();
                return (
                  <button
                    key={o.value}
                    onClick={() => f.onChange(o.value)}
                    className={`px-4 py-2 rounded-full text-[11px] font-bold tracking-wider transition ${
                      active
                        ? "bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-accent/20 border-0"
                        : "bg-card border border-border/40 text-muted-foreground hover:border-accent/40 hover:text-foreground"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="sticky bottom-0 left-0 right-0 -mx-6 px-6 pt-4 pb-6 bg-background/95 backdrop-blur-md border-t border-border/30 flex gap-3">
        {onReset && (
          <Button variant="ghost" onClick={onReset} className="rounded-full text-xs">
            Azzera
          </Button>
        )}
        <Button
          onClick={() => onOpenChange(false)}
          className="flex-1 rounded-full bg-foreground text-background hover:bg-foreground/90 py-6 text-sm font-semibold"
        >
          Chiudi
        </Button>
      </div>
    </SheetContent>
  </Sheet>
);
