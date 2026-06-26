import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { useVillas, useApartments, useYachts, useVenues } from "@/hooks/useSupabaseData";
import HighlightSheet, { type HighlightItem } from "./HighlightSheet";

import villaFallback from "@/assets/villas/villa-hero.png";
import aptFallback from "@/assets/apartments/appartamenti-hero.jpg";
import yachtFallback from "@/assets/esperienze-su-misura.jpg";
import venueFallback from "@/assets/locations/nammos.jpg";

type Kind = "villas" | "apartments" | "yachts" | "venues";

interface HighlightGroup {
  kind: Kind;
  label: string;
  title: string;
  items: HighlightItem[];
  fallbackImage: string;
  basePath: string;
}

const featuredOrTop = <T extends { is_featured?: boolean | null }>(
  list: T[] | undefined,
  max = 6,
): T[] => {
  if (!list || list.length === 0) return [];
  const featured = list.filter((x) => x.is_featured);
  return (featured.length > 0 ? featured : list).slice(0, max);
};

const HighlightsRow = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [openKind, setOpenKind] = useState<Kind | null>(null);

  const { data: villasData } = useVillas();
  const { data: apartmentsData } = useApartments();
  const { data: yachtsData } = useYachts();
  const { data: venuesData } = useVenues();

  // Prioritize the SAME image used on the listing card so the highlight sheet
  // matches what the user sees in the catalog (es. Aniel mostra la foto dell'appartamento Aniel).
  const villaItems: HighlightItem[] = featuredOrTop(villasData as any[]).map((v: any) => ({
    id: v.id, slug: v.slug, name: v.name, zone: v.zone,
    image: v.images?.[0] || v.featured_image || villaFallback,
    capacity: v.capacity, bedrooms: v.bedrooms, bathrooms: v.bathrooms,
    href: `/accommodation/${v.slug}`,
  }));
  const aptItems: HighlightItem[] = featuredOrTop(apartmentsData as any[]).map((a: any) => ({
    id: a.id, slug: a.slug, name: a.name, zone: a.zone,
    image: a.images?.[0] || a.featured_image || aptFallback,
    capacity: a.capacity, bedrooms: a.bedrooms, bathrooms: a.bathrooms,
    href: `/accommodation/${a.slug}`,
  }));
  const yachtItems: HighlightItem[] = featuredOrTop(yachtsData as any[]).map((y: any) => ({
    id: y.id, slug: y.slug, name: y.name, zone: y.model,
    image: y.images?.[0] || y.featured_image || yachtFallback,
    capacity: y.guests, bedrooms: y.cabins, category: y.model,
    href: `/yachts`,
  }));
  const venueItems: HighlightItem[] = featuredOrTop(venuesData as any[]).map((v: any) => ({
    id: v.id, slug: v.slug, name: v.name, zone: v.zone,
    image: v.image_url || v.featured_image || v.gallery?.[0] || venueFallback,
    category: v.category,
    href: `/locali/${v.slug}`,
  }));

  const groups: HighlightGroup[] = [
    { kind: "villas", label: "Ville", title: "Ville in evidenza", items: villaItems, fallbackImage: villaFallback, basePath: "/villas" },
    { kind: "apartments", label: "Appartamenti", title: "Appartamenti in evidenza", items: aptItems, fallbackImage: aptFallback, basePath: "/apartments" },
    { kind: "yachts", label: "Yacht", title: "Yacht in evidenza", items: yachtItems, fallbackImage: yachtFallback, basePath: "/yachts" },
    { kind: "venues", label: "Locali", title: "Locali in evidenza", items: venueItems, fallbackImage: venueFallback, basePath: "/eventi" },
  ];

  const handleClick = (g: HighlightGroup) => {
    if (g.items.length === 0) { navigate(g.basePath); return; }
    if (isMobile) { setOpenKind(g.kind); return; }
    navigate(g.basePath);
  };

  const activeGroup = groups.find((g) => g.kind === openKind) ?? null;

  return (
    <section className="bg-background border-b border-border/40">
      <div className="container mx-auto px-4 py-6 md:py-9">
        <div className="text-center mb-4 md:mb-6">
          <span className="text-accent text-[9px] md:text-[10px] uppercase tracking-[0.4em] font-medium">
            In evidenza
          </span>
          <h3 className="font-serif text-base md:text-xl text-foreground mt-1">
            Selezione curata
          </h3>
        </div>

        <div className="flex justify-center items-start gap-5 md:gap-12">
          {groups.map((g) => {
            const cover = g.items[0]?.image ?? g.fallbackImage;
            return (
              <button
                key={g.kind}
                onClick={() => handleClick(g)}
                className="group flex flex-col items-center gap-2 md:gap-3 w-[68px] md:w-[110px] active:scale-95 transition-transform"
              >
                <span className="relative block">
                  {/* Gradient ring */}
                  <span className="absolute -inset-[2px] rounded-full bg-gradient-to-tr from-accent via-primary to-accent opacity-90 group-hover:opacity-100 transition-opacity" />
                  <span className="relative block w-[64px] h-[64px] md:w-[104px] md:h-[104px] rounded-full overflow-hidden bg-muted ring-2 ring-background">
                    <img
                      src={cover}
                      alt={g.label}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </span>
                  {g.items.length > 0 && (
                    <span className="absolute -bottom-1 -right-1 min-w-[20px] h-[20px] md:min-w-[22px] md:h-[22px] px-1.5 rounded-full bg-foreground text-background text-[9px] md:text-[10px] font-semibold flex items-center justify-center ring-2 ring-background">
                      {g.items.length}
                    </span>
                  )}
                </span>
                <span className="text-foreground text-[10px] md:text-xs font-medium tracking-wide text-center leading-tight">
                  {g.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {activeGroup && (
        <HighlightSheet
          open={openKind !== null}
          onClose={() => setOpenKind(null)}
          title={activeGroup.title}
          items={activeGroup.items}
          kind={activeGroup.kind}
        />
      )}
    </section>
  );
};

export default HighlightsRow;
