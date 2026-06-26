import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, BedDouble, Bath, MapPin, Wifi, Car, Tv, Wind, UtensilsCrossed, Shirt, Waves, Building, ArrowRight, Star, Home, Heart } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { useVillas } from "@/hooks/useSupabaseData";
import { CatalogFilterBar, CatalogFilterSheet, type FilterSpec } from "@/components/catalog/CatalogFilters";
import { PriceSeal } from "@/components/catalog/PriceSeal";
import { FeaturedRail, type FeaturedItem } from "@/components/catalog/FeaturedRail";
import { formatVillaPrice } from "@/data/priceMap";
import villaHero from "@/assets/villas/villa-hero.png";


// Villa images (static fallback)
import zoraVillas2 from "@/assets/villas/zora-villas-2.jpg";
import zoraVillas3 from "@/assets/villas/zora-villas-3.jpg";
import zoraVillas1 from "@/assets/villas/zora-villas-1.jpg";
import whiterockKanalia from "@/assets/villas/whiterock-kanalia.jpg";
import chatzis3 from "@/assets/villas/chatzis3-card.png";
import adoreKanalia from "@/assets/villas/adore-kanalia.jpg";
import adore2 from "@/assets/villas/adore-2.jpg";
import megaAdore3 from "@/assets/villas/mega-adore-3.jpg";
import chatzis1 from "@/assets/villas/chatzis-1.png";
import chatzis2 from "@/assets/villas/chatzis-2.png";
import sophie from "@/assets/villas/sophie.png";
import villaOfMoments from "@/assets/villas/villa-of-moments.png";
import orus from "@/assets/villas/orus.png";
import yza from "@/assets/villas/yza.png";
import dimitra from "@/assets/villas/dimitra.png";
import nuvola from "@/assets/villas/nuvola.png";
import arkhos from "@/assets/villas/arkhos.png";
import dana from "@/assets/villas/dana.png";
import anes from "@/assets/villas/anes.png";
import amarisMain from "@/assets/villas/amaris-main.webp";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const villas = [
  { id: "zora2", name: "Zora Villas 2", zone: "Agios Lazaros", capacity: 10, bedrooms: 5, bathrooms: 4, image: zoraVillas2, amenities: ["pool", "wifi", "parking", "ac", "kitchen", "laundry"] },
  { id: "zora3", name: "Zora Villas 3", zone: "Agios Lazaros", capacity: 6, bedrooms: 3, bathrooms: 2, image: zoraVillas3, amenities: ["pool", "wifi", "parking", "ac", "kitchen", "laundry"] },
  { id: "zora1", name: "Zora Villas 1", zone: "Agios Lazaros", capacity: 16, bedrooms: 8, bathrooms: 7, image: zoraVillas1, amenities: ["pool", "wifi", "parking", "tv", "ac", "kitchen", "laundry"] },
  { id: "whiterock", name: "Villa Whiterock Kanalia", zone: "Kanalia", capacity: 12, bedrooms: 6, bathrooms: 3, image: whiterockKanalia, amenities: ["pool", "wifi", "parking", "tv", "ac", "kitchen", "laundry"] },
  { id: "chatzis3", name: "Villa Chatzis 3", zone: "Agios Ioannis - Kanalia", capacity: 5, bedrooms: 2, bathrooms: 2, image: chatzis3, amenities: ["pool", "wifi", "ac", "kitchen"] },
  { id: "adorekan", name: "Villa Adoré Kanalia", zone: "Kanalia - Ornos", capacity: 6, bedrooms: 2, bathrooms: 3, image: adoreKanalia, amenities: ["pool", "wifi", "parking", "ac", "kitchen"] },
  { id: "adore2", name: "Villa Adoré 2", zone: "Kanalia - Ornos", capacity: 10, bedrooms: 3, bathrooms: 4, image: adore2, amenities: ["pool", "wifi", "parking", "ac", "kitchen", "laundry"] },
  { id: "megaadore", name: "Villa Mega Adoré 3", zone: "Kanalia - Ornos", capacity: 16, bedrooms: 5, bathrooms: 7, image: megaAdore3, amenities: ["pool", "wifi", "parking", "tv", "ac", "kitchen", "laundry"] },
  { id: "chatzis1", name: "Villa Chatzis 1", zone: "Agios Ioannis - Kanalia", capacity: 8, bedrooms: 4, bathrooms: 3, image: chatzis1, amenities: ["pool", "wifi", "parking", "ac", "kitchen", "laundry"] },
  { id: "chatzis2", name: "Villa Chatzis 2", zone: "Agios Ioannis - Kanalia", capacity: 11, bedrooms: 4, bathrooms: 3, image: chatzis2, amenities: ["pool", "wifi", "parking", "ac", "kitchen", "laundry"] },
  { id: "sophie", name: "Villa Sophie", zone: "Glatros", capacity: 4, bedrooms: 2, bathrooms: 2, image: sophie, amenities: ["pool", "wifi", "ac", "kitchen"] },
  { id: "moments", name: "Villa of Moments", zone: "Ornos", capacity: 8, bedrooms: 4, bathrooms: 5, image: villaOfMoments, amenities: ["pool", "wifi", "parking", "tv", "ac", "kitchen", "laundry"] },
  { id: "orus", name: "Villa Orus", zone: "Kanalia", capacity: 10, bedrooms: 5, bathrooms: 5, image: orus, amenities: ["pool", "wifi", "parking", "ac", "kitchen", "laundry"] },
  { id: "yza", name: "Villa Yza", zone: "Agios Lazaros", capacity: 14, bedrooms: 6, bathrooms: 6, image: yza, amenities: ["pool", "wifi", "parking", "tv", "ac", "kitchen", "laundry"] },
  { id: "dimitra", name: "Villa Dimitra", zone: "Plintri", capacity: 16, bedrooms: 8, bathrooms: 8, image: dimitra, amenities: ["pool", "wifi", "parking", "tv", "ac", "kitchen", "laundry"] },
  { id: "nuvola", name: "Villa Nuvola", zone: "Kanalia", capacity: 9, bedrooms: 4, bathrooms: 5, image: nuvola, amenities: ["pool", "wifi", "parking", "ac", "kitchen", "laundry"] },
  { id: "arkhos", name: "Villa Arkhos", zone: "Agios Ioannis", capacity: 8, bedrooms: 3, bathrooms: 3, image: arkhos, amenities: ["pool", "wifi", "parking", "ac", "kitchen"] },
  { id: "dana", name: "Villa Dana", zone: "Kanalia", capacity: 9, bedrooms: 4, bathrooms: 5, image: dana, amenities: ["pool", "wifi", "parking", "ac", "kitchen", "laundry"] },
  { id: "anes", name: "Villa Anes", zone: "Kanalia", capacity: 8, bedrooms: 4, bathrooms: 4, image: anes, amenities: ["pool", "wifi", "parking", "ac", "kitchen", "laundry"] },
  { id: "amaris", name: "Villa Amaris", zone: "Kanalia", capacity: 11, bedrooms: 6, bathrooms: 6, image: amarisMain, amenities: ["pool", "wifi", "parking", "tv", "ac", "kitchen", "laundry"] },
];

const zoneOptionsFor = (data: { zone: string }[]): { label: string; value: string }[] => {
  const zones = Array.from(new Set(data.map((v) => v.zone))).sort();
  return [{ label: "Tutti", value: "all" }, ...zones.map((z) => ({ label: z, value: z }))];
};

const bedroomOpts = [
  { label: "Tutti", value: "all" }, { label: "1", value: "1" }, { label: "2", value: "2" }, { label: "3", value: "3" }, { label: "4+", value: "4+" },
];
const bathroomOpts = [
  { label: "Tutti", value: "all" }, { label: "1", value: "1" }, { label: "2", value: "2" }, { label: "3", value: "3" }, { label: "4+", value: "4+" },
];
const capacityOpts = [
  { label: "Tutti", value: "all" }, { label: "2+", value: "2+" }, { label: "4+", value: "4+" }, { label: "6+", value: "6+" }, { label: "8+", value: "8+" }, { label: "10+", value: "10+" }, { label: "12+", value: "12+" }, { label: "16+", value: "16+" },
];
const poolOpts = [
  { label: "Tutti", value: "all" }, { label: "Sì", value: "yes" },
];

const amenityIcons: Record<string, { icon: typeof Wifi; label: string }> = {
  pool: { icon: Waves, label: "Piscina" }, wifi: { icon: Wifi, label: "WiFi" }, parking: { icon: Car, label: "Parking" },
  tv: { icon: Tv, label: "TV" }, ac: { icon: Wind, label: "A/C" }, kitchen: { icon: UtensilsCrossed, label: "Cucina" }, laundry: { icon: Shirt, label: "Biancheria" },
};


const Villas = () => {
  const [capacityFilter, setCapacityFilter] = useState("all");
  const [bedroomFilter, setBedroomFilter] = useState("all");
  const [bathroomFilter, setBathroomFilter] = useState("all");
  const [zoneFilter, setZoneFilter] = useState("all");
  const [poolFilter, setPoolFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [featuredOnly, setFeaturedOnly] = useState(false);

  const { data: dbVillas } = useVillas();

  const staticImageBySlug = useMemo(
    () => Object.fromEntries(villas.map((v) => [v.id, v.image])),
    []
  );

  const villasData = useMemo(() => {
    if (dbVillas && dbVillas.length > 0) {
      return dbVillas.map((v) => ({
        id: v.slug,
        name: v.name,
        zone: v.zone,
        capacity: v.capacity,
        bedrooms: v.bedrooms,
        bathrooms: v.bathrooms,
        image: v.images?.[0] || staticImageBySlug[v.slug] || "/placeholder.svg",
        amenities: v.amenities || [],
        priceFrom: formatVillaPrice(v.slug, v.price_range),
        isFeatured: v.is_featured || false,
      }));
    }
    return villas.map((v) => ({ ...v, priceFrom: formatVillaPrice(v.id, null), isFeatured: false }));
  }, [dbVillas, staticImageBySlug]);

  const zoneOpts = useMemo(() => zoneOptionsFor(villasData), [villasData]);

  const filtered = villasData.filter((p) => {
    const matchCapacity = capacityFilter === "all" || p.capacity >= parseInt(capacityFilter);
    const matchBedrooms = bedroomFilter === "all"
      || (bedroomFilter === "4+" ? p.bedrooms >= 4 : p.bedrooms === parseInt(bedroomFilter));
    const matchBathrooms = bathroomFilter === "all"
      || (bathroomFilter === "4+" ? p.bathrooms >= 4 : p.bathrooms === parseInt(bathroomFilter));
    const matchZone = zoneFilter === "all" || p.zone === zoneFilter;
    const matchPool = poolFilter === "all" || (poolFilter === "yes" && p.amenities.includes("pool"));
    const matchFeatured = !featuredOnly || (p as any).isFeatured;
    const q = searchQuery.trim().toLowerCase();
    const matchSearch = !q || p.name.toLowerCase().includes(q) || p.zone.toLowerCase().includes(q);
    return matchCapacity && matchBedrooms && matchBathrooms && matchZone && matchPool && matchFeatured && matchSearch;
  }).sort((a, b) => {
    if (featuredOnly) return 0;
    return Number((b as any).isFeatured) - Number((a as any).isFeatured);
  });

  const filterSpecs: FilterSpec[] = [
    { key: "zone", label: "Zona", options: zoneOpts, value: zoneFilter, onChange: setZoneFilter },
    { key: "bedrooms", label: "Camere", options: bedroomOpts, value: bedroomFilter, onChange: setBedroomFilter },
    { key: "bathrooms", label: "Bagni", options: bathroomOpts, value: bathroomFilter, onChange: setBathroomFilter },
    { key: "capacity", label: "Ospiti", options: capacityOpts, value: capacityFilter, onChange: setCapacityFilter },
    { key: "pool", label: "Piscina", options: poolOpts, value: poolFilter, onChange: setPoolFilter },
  ];

  const activeFilterCount = filterSpecs.filter((f) => f.value !== "all").length;

  const resetFilters = () => {
    setCapacityFilter("all"); setBedroomFilter("all"); setBathroomFilter("all");
    setZoneFilter("all"); setPoolFilter("all");
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="relative h-[50vh] md:h-[65vh] overflow-hidden">
        <motion.img src={villaHero} alt="" className="w-full h-full object-cover" initial={{ scale: 1.15 }} animate={{ scale: 1.05 }} transition={{ duration: 1.5, ease: "easeOut" }} />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/40 to-transparent" />
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 pb-10 md:pb-20">
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.2 }}>
              <div className="flex items-center gap-3 mb-3 md:mb-5">
                <div className="h-px w-10 md:w-12 bg-accent" />
                <span className="text-accent text-[10px] md:text-xs font-semibold uppercase tracking-[0.35em]">Private Collection</span>
              </div>
              <h1 className="font-serif text-4xl md:text-8xl font-bold text-primary-foreground leading-[0.9] mb-2 md:mb-4">Ville</h1>
              <p className="text-primary-foreground/60 max-w-lg text-xs md:text-lg leading-relaxed">
                <span className="block">Lusso, privacy e panorami mozzafiato</span>
                <span className="block">sull'Egeo</span>
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Search + Filtri + In evidenza */}
      <section className="relative -mt-6 md:-mt-10 z-30 mb-3 md:mb-6">
        <CatalogFilterBar
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          placeholder="Cerca nome o zona…"
          count={filtered.length}
          countLabel="ville"
          onOpenFilters={() => setFiltersOpen(true)}
          featuredActive={featuredOnly}
          onToggleFeatured={() => setFeaturedOnly((v) => !v)}
          activeFilterCount={activeFilterCount}
        />
      </section>

      <CatalogFilterSheet open={filtersOpen} onOpenChange={setFiltersOpen} filters={filterSpecs} onReset={resetFilters} />

      {/* Featured rail — i più prenotati */}
      {(() => {
        const featured = villasData.filter((v: any) => v.isFeatured).slice(0, 3);
        const list = featured.length >= 3
          ? featured
          : [...featured, ...villasData.filter((v: any) => !featured.find((f: any) => f.id === v.id))].slice(0, 3);
        const items: FeaturedItem[] = list.map((v: any) => ({
          id: v.id,
          name: v.name,
          image: v.image,
          href: `/accommodation/${v.id}`,
          zone: v.zone,
          priceFrom: v.priceFrom,
          priceSuffix: "notte",
          chips: [
            { icon: Users, label: `${v.capacity}` },
            ...((v.amenities || [])
              .filter((a: string) => amenityIcons[a])
              .slice(0, 3)
              .map((a: string) => ({ icon: amenityIcons[a].icon, label: amenityIcons[a].label }))),
          ],
          proof: v.isFeatured ? "Tra le più richieste" : undefined,
        }));
        return <FeaturedRail title="Le più prenotate" subtitle="In evidenza" items={items} />;
      })()}

      {/* Cards */}
      <section className="py-6 md:py-16 bg-background">
        <div className="container mx-auto px-3 md:px-4">
          <div className="mb-4 md:mb-6">
            <span className="inline-block text-[9px] md:text-[10px] uppercase tracking-[0.35em] font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Tutte le ville</span>
            <h2 style={{ fontFamily: "'Parkinsans', sans-serif" }} className="font-bold text-lg md:text-3xl mt-1 bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">La collezione completa</h2>
            <div className="mt-2 h-px w-12 bg-gradient-to-r from-primary via-accent to-transparent" />
          </div>
          <motion.div initial="hidden" animate="visible" variants={stagger} className="flex flex-col gap-3 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-8">
            {filtered.map((property) => (
              <motion.div key={property.id} variants={fadeUp}>
                {/* Mobile: luxury horizontal booking-style card */}
                <Link to={`/accommodation/${property.id}`} className="md:hidden block group">
                  <div className="relative flex gap-3 p-2.5 rounded-2xl bg-gradient-to-br from-card via-card to-secondary/40 border border-border/40 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.35)] overflow-hidden">
                    {/* Image */}
                    <div className="relative shrink-0 w-[42%] aspect-[4/5] rounded-xl overflow-hidden">
                      <img src={property.image} alt={property.name} className="w-full h-full object-cover group-active:scale-105 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                      {/* Home minimal badge (left) */}
                      <div className="absolute top-1.5 left-1.5 w-6 h-6 rounded-full bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center">
                        <Home className="h-3 w-3 text-white" strokeWidth={1.6} />
                      </div>
                      {/* Wishlist (right) */}
                      <button
                        type="button"
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                        className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center active:scale-90 transition"
                        aria-label="Aggiungi a wishlist"
                      >
                        <Heart className="h-3 w-3 text-white" strokeWidth={1.6} />
                      </button>
                      {(property as any).priceFrom && (
                        <PriceSeal
                          price={(property as any).priceFrom}
                          suffix="notte"
                          size="sm"
                          className="absolute bottom-1.5 right-1.5 z-10"
                        />
                      )}
                    </div>
                    {/* Content */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between py-1 pr-1">
                      <div>
                        <span className="text-muted-foreground/70 text-[8px] uppercase tracking-[0.28em] font-medium flex items-center gap-1">
                          <MapPin className="h-2 w-2 text-accent" />{property.zone}
                        </span>
                        <h3 style={{ fontFamily: "'Parkinsans', sans-serif" }} className="mt-1 font-bold text-[15px] text-foreground leading-tight line-clamp-2">{property.name}</h3>
                        <div className="mt-1 h-px w-10 bg-gradient-to-r from-primary/60 via-accent/50 to-transparent" />
                      </div>
                      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[10px] text-foreground/75 mt-2">
                        <span className="flex items-center gap-1"><Users className="h-2.5 w-2.5 text-accent" />{property.capacity}</span>
                        <span className="flex items-center gap-1"><BedDouble className="h-2.5 w-2.5 text-accent" />{property.bedrooms}</span>
                        <span className="flex items-center gap-1"><Bath className="h-2.5 w-2.5 text-accent" />{property.bathrooms}</span>
                        {property.amenities?.slice(0, 2).map((a) => {
                          const info = amenityIcons[a];
                          if (!info) return null;
                          return (
                            <span key={a} className="flex items-center gap-1"><info.icon className="h-2.5 w-2.5 text-accent" /></span>
                          );
                        })}
                      </div>
                      <span className="mt-2 inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground text-[9px] font-bold uppercase tracking-wider shadow-md shadow-accent/20 w-fit">
                        Vedi dettaglio <ArrowRight className="h-2.5 w-2.5" />
                      </span>
                    </div>
                  </div>
                </Link>


                {/* Desktop: editorial luxury card — integrated info bar */}
                <Link
                  to={`/accommodation/${property.id}`}
                  className="hidden md:flex flex-col group rounded-[1.75rem] overflow-hidden bg-gradient-to-b from-card via-card to-secondary/30 border border-border/40 group-hover:border-accent/40 group-hover:shadow-[0_30px_80px_-30px_hsl(var(--accent)/0.35)] transition-all duration-700"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={property.image}
                      alt={property.name}
                      className="w-full h-full object-cover group-hover:scale-[1.06] transition-transform duration-[1500ms] ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/15 to-transparent" />

                    {/* Minimal home icon (left) */}
                    <div className="absolute top-3.5 left-3.5 w-9 h-9 rounded-full bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center">
                      <Home className="h-4 w-4 text-white" strokeWidth={1.5} />
                    </div>

                    {/* Wishlist heart (right) */}
                    <button
                      type="button"
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                      className="absolute top-3.5 right-3.5 w-9 h-9 rounded-full bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center hover:bg-white/25 transition"
                      aria-label="Aggiungi a wishlist"
                    >
                      <Heart className="h-4 w-4 text-white" strokeWidth={1.5} />
                    </button>

                    {(property as any).isFeatured && (
                      <div className="absolute top-16 left-3.5 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-primary to-accent text-white text-[10px] font-bold uppercase tracking-wider shadow-lg">
                        <Star className="h-3 w-3 fill-current" /> In evidenza
                      </div>
                    )}

                    <div className="absolute bottom-0 left-0 right-0 p-5 pr-32">
                      <span className="text-white/75 text-[10px] uppercase tracking-[0.35em] font-medium mb-2 flex items-center gap-1.5">
                        <MapPin className="h-3 w-3 text-accent" /> {property.zone}
                      </span>
                      <h3 style={{ fontFamily: "'Parkinsans', sans-serif" }} className="font-bold text-2xl lg:text-[1.7rem] leading-tight text-white drop-shadow-lg">
                        {property.name}
                      </h3>
                    </div>

                    {(property as any).priceFrom && (
                      <PriceSeal
                        price={(property as any).priceFrom}
                        suffix="notte"
                        size="md"
                        className="absolute bottom-4 right-4 z-10"
                      />
                    )}
                  </div>

                  {/* Integrated info bar — luxury layout */}
                  <div className="px-5 pt-4 pb-5 bg-card border-t border-border/30">
                    {/* Headline specs */}
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-foreground/85 font-medium mb-3">
                      <span className="flex items-center gap-1.5"><BedDouble className="h-4 w-4 text-accent" />{property.bedrooms} {property.bedrooms === 1 ? "camera" : "camere"}</span>
                      <span className="text-accent/40">•</span>
                      <span className="flex items-center gap-1.5"><Bath className="h-4 w-4 text-accent" />{property.bathrooms} {property.bathrooms === 1 ? "bagno" : "bagni"}</span>
                      {property.amenities?.includes("pool") && (
                        <>
                          <span className="text-accent/40">•</span>
                          <span className="flex items-center gap-1.5"><Waves className="h-4 w-4 text-accent" />Piscina privata</span>
                        </>
                      )}
                    </div>

                    {/* Service chips */}
                    {(() => {
                      const services = (property.amenities || []).filter((a) => a !== "pool");
                      const visible = services.slice(0, 5);
                      const extra = services.length - visible.length;
                      return (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {visible.map((a) => {
                            const info = amenityIcons[a];
                            if (!info) return null;
                            return (
                              <span key={a} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary/40 border border-border/40 text-foreground/75 text-[10px] font-semibold uppercase tracking-wider">
                                <info.icon className="h-3 w-3 text-accent" /> {info.label}
                              </span>
                            );
                          })}
                          {extra > 0 && (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-secondary/40 border border-border/40 text-foreground/65 text-[10px] font-semibold uppercase tracking-wider">
                              +{extra} servizi
                            </span>
                          )}
                        </div>
                      );
                    })()}

                    {/* Full-width gradient CTA */}
                    <span className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-full bg-gradient-to-r from-primary via-primary to-accent text-primary-foreground text-[13px] font-semibold tracking-wide shadow-md shadow-accent/20 group-hover:shadow-lg group-hover:shadow-accent/35 transition-all">
                      Scopri di più <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
          {filtered.length === 0 && (
            <div className="text-center py-24 text-muted-foreground">
              <Building className="h-16 w-16 mx-auto mb-6 opacity-30" />
              <p className="text-lg">Nessuna villa trovata con i filtri selezionati</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Villas;
