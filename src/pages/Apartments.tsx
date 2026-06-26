import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, BedDouble, Bath, MapPin, UtensilsCrossed, Waves, Wifi, Car, Tv, Wind, Shirt, Building, ArrowRight, Star, Home, Heart } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { useApartments } from "@/hooks/useSupabaseData";
import { CatalogFilterBar, CatalogFilterSheet, type FilterSpec } from "@/components/catalog/CatalogFilters";
import { PriceSeal } from "@/components/catalog/PriceSeal";
import { FeaturedRail, type FeaturedItem } from "@/components/catalog/FeaturedRail";
import { formatApartmentPrice } from "@/data/priceMap";
import aptHero from "@/assets/apartments/appartamenti-hero.jpg";


// Apartment card images from website
import windyStudios1 from "@/assets/apartments/cards/windy-studios-1.png";
import windyUpStudios from "@/assets/apartments/cards/windy-up-studios.png";
import sunsetApartments from "@/assets/apartments/cards/sunset-apartments.png";
import sophiasResidence from "@/assets/apartments/cards/sophias-residence.png";
import ochoDowntown from "@/assets/apartments/cards/ocho-downtown.png";
import mykonosOcho from "@/assets/apartments/cards/mykonos-ocho.png";
import miriamTown from "@/assets/apartments/cards/miriam-town.png";
import izaDowntown from "@/assets/apartments/cards/iza-downtown.png";
import milenaMaisonette from "@/assets/apartments/cards/milena-maisonette.png";
import lunaBlu from "@/assets/apartments/cards/luna-blu.png";
import izasResidence from "@/assets/apartments/cards/izas-residence.png";
import isabelStudios from "@/assets/apartments/cards/isabel-studios.png";
import hylasDowntown from "@/assets/apartments/cards/hylas-downtown.png";
import eiriniResort from "@/assets/apartments/cards/eirini-resort.png";
import dimeTown from "@/assets/apartments/cards/dime-town.png";
import beautySuites from "@/assets/apartments/cards/beauty-suites.png";
import anthosResort from "@/assets/apartments/cards/anthos-resort.png";
import anielApartments from "@/assets/apartments/cards/aniel-apartments.png";
import anamisMaisonette from "@/assets/apartments/cards/anamis-maisonette.png";
import alexTownMain from "@/assets/apartments/cards/alex-town.png";
import alexisResidence from "@/assets/apartments/cards/alexis-residence.png";
import agiosLazarosStudios from "@/assets/apartments/cards/agios-lazaros-studios.png";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

type PoolType = "none" | "shared" | "jacuzzi";

const apartments = [
  { id: "windy1", name: "Windy Studios 1", zone: "Glastros", capacity: 8, bedrooms: 1, bathrooms: 2, hasKitchen: true, pool: "none" as PoolType, image: windyStudios1, amenities: ["wifi", "ac", "kitchen"], guestOptions: [2, 4, 6, 8] },
  { id: "windyup", name: "Windy UP Studios", zone: "Glastros", capacity: 5, bedrooms: 1, bathrooms: 2, hasKitchen: true, pool: "none" as PoolType, image: windyUpStudios, amenities: ["wifi", "ac", "kitchen"], guestOptions: [2, 3, 5] },
  { id: "sunset", name: "Sunset Apartments", zone: "Mykonos Town", capacity: 6, bedrooms: 2, bathrooms: 1, hasKitchen: true, pool: "none" as PoolType, image: sunsetApartments, amenities: ["wifi", "ac", "kitchen"], guestOptions: [2, 4, 6] },
  { id: "sophia", name: "Sophia's Residence", zone: "Mykonos Town", capacity: 4, bedrooms: 1, bathrooms: 1, hasKitchen: true, pool: "none" as PoolType, image: sophiasResidence, amenities: ["wifi", "ac", "kitchen"], guestOptions: [2, 3, 4] },
  { id: "ocho", name: "Ocho Downtown", zone: "Mykonos Town", capacity: 4, bedrooms: 1, bathrooms: 1, hasKitchen: true, pool: "none" as PoolType, image: ochoDowntown, amenities: ["wifi", "ac", "kitchen"], guestOptions: [2, 3, 4] },
  { id: "mykocho", name: "Mykonos Ocho", zone: "Argyraina", capacity: 6, bedrooms: 2, bathrooms: 2, hasKitchen: true, pool: "shared" as PoolType, image: mykonosOcho, amenities: ["pool", "wifi", "ac", "kitchen"], guestOptions: [2, 4, 6] },
  { id: "miriam", name: "Miriam Town", zone: "Mykonos Town", capacity: 5, bedrooms: 1, bathrooms: 1, hasKitchen: false, pool: "none" as PoolType, image: miriamTown, amenities: ["wifi", "ac"], guestOptions: [2, 3, 5] },
  { id: "iza", name: "Iza Downtown", zone: "Mykonos Town", capacity: 4, bedrooms: 1, bathrooms: 1, hasKitchen: false, pool: "none" as PoolType, image: izaDowntown, amenities: ["wifi", "ac"], guestOptions: [2, 3, 4] },
  { id: "milena", name: "Milena Maisonette", zone: "Mykonos Town", capacity: 4, bedrooms: 1, bathrooms: 1, hasKitchen: true, pool: "none" as PoolType, image: milenaMaisonette, amenities: ["wifi", "ac", "kitchen"], guestOptions: [2, 3, 4] },
  { id: "lunablu", name: "Luna Blu", zone: "Agios Ioannis", capacity: 6, bedrooms: 3, bathrooms: 3, hasKitchen: true, pool: "none" as PoolType, image: lunaBlu, amenities: ["wifi", "ac", "kitchen", "laundry"], guestOptions: [2, 4, 6] },
  { id: "izares", name: "Iza's Residence", zone: "Glastros", capacity: 4, bedrooms: 1, bathrooms: 1, hasKitchen: true, pool: "none" as PoolType, image: izasResidence, amenities: ["wifi", "ac", "kitchen"], guestOptions: [2, 3, 4] },
  { id: "isabel", name: "Isabel Studios", zone: "Fabrike Square", capacity: 4, bedrooms: 1, bathrooms: 1, hasKitchen: true, pool: "none" as PoolType, image: isabelStudios, amenities: ["wifi", "ac", "kitchen"], guestOptions: [2, 3, 4] },
  { id: "hylas", name: "Hylas Downtown", zone: "Mykonos Town", capacity: 6, bedrooms: 1, bathrooms: 1, hasKitchen: false, pool: "none" as PoolType, image: hylasDowntown, amenities: ["wifi", "ac"], guestOptions: [2, 4, 6] },
  { id: "eirini", name: "Eirini Resort", zone: "Argyraina", capacity: 8, bedrooms: 3, bathrooms: 1, hasKitchen: true, pool: "shared" as PoolType, image: eiriniResort, amenities: ["pool", "wifi", "ac", "kitchen"], guestOptions: [2, 4, 6, 8] },
  { id: "dime", name: "Dime Town", zone: "Mykonos Town", capacity: 6, bedrooms: 1, bathrooms: 1, hasKitchen: false, pool: "none" as PoolType, image: dimeTown, amenities: ["wifi", "ac"], guestOptions: [2, 4, 6] },
  { id: "beauty", name: "Beauty Suites", zone: "Mykonos Town", capacity: 6, bedrooms: 1, bathrooms: 1, hasKitchen: true, pool: "none" as PoolType, image: beautySuites, amenities: ["wifi", "ac", "kitchen"], guestOptions: [2, 4, 6] },
  { id: "anthos", name: "Anthos Resort", zone: "Ornos", capacity: 6, bedrooms: 2, bathrooms: 1, hasKitchen: true, pool: "shared" as PoolType, image: anthosResort, amenities: ["pool", "wifi", "ac", "kitchen"], guestOptions: [2, 4, 6] },
  { id: "aniel", name: "Aniel Apartments", zone: "Klouvas", capacity: 4, bedrooms: 1, bathrooms: 1, hasKitchen: true, pool: "none" as PoolType, image: anielApartments, amenities: ["wifi", "ac", "kitchen"], guestOptions: [2, 3, 4] },
  { id: "anamis", name: "Anamis Maisonette", zone: "Mykonos Town", capacity: 4, bedrooms: 1, bathrooms: 1, hasKitchen: true, pool: "none" as PoolType, image: anamisMaisonette, amenities: ["wifi", "ac", "kitchen"], guestOptions: [2, 3, 4] },
  { id: "alextown", name: "Alex Town", zone: "Mykonos Town", capacity: 6, bedrooms: 1, bathrooms: 1, hasKitchen: true, pool: "none" as PoolType, image: alexTownMain, amenities: ["wifi", "ac", "kitchen", "laundry"], guestOptions: [2, 4, 6] },
  { id: "alexis", name: "Alexis Residence", zone: "Klouvas", capacity: 5, bedrooms: 1, bathrooms: 1, hasKitchen: true, pool: "none" as PoolType, image: alexisResidence, amenities: ["wifi", "ac", "kitchen"], guestOptions: [2, 3, 5] },
  { id: "agiosstudios", name: "Agios Lazaros Studios", zone: "Agios Lazaros", capacity: 4, bedrooms: 1, bathrooms: 1, hasKitchen: true, pool: "none" as PoolType, image: agiosLazarosStudios, amenities: ["wifi", "ac", "kitchen"], guestOptions: [2, 3, 4] },
];

const zoneOptionsFor = (data: { zone: string }[]): { label: string; value: string }[] => {
  const zones = Array.from(new Set(data.map((v) => v.zone))).sort();
  return [{ label: "Tutti", value: "all" }, ...zones.map((z) => ({ label: z, value: z }))];
};

const bedroomOpts = [
  { label: "Tutti", value: "all" }, { label: "1", value: "1" }, { label: "2", value: "2" }, { label: "3+", value: "3+" },
];
const bathroomOpts = [
  { label: "Tutti", value: "all" }, { label: "1", value: "1" }, { label: "2+", value: "2+" },
];
const capacityOpts = [
  { label: "Tutti", value: "all" }, { label: "2+", value: "2+" }, { label: "4+", value: "4+" }, { label: "6+", value: "6+" }, { label: "8+", value: "8+" },
];
const kitchenOpts = [
  { label: "Tutti", value: "all" }, { label: "Sì", value: "yes" }, { label: "No", value: "no" },
];
const poolOpts = [
  { label: "Tutti", value: "all" }, { label: "Condivisa", value: "shared" }, { label: "Jacuzzi", value: "jacuzzi" },
];

const amenityIcons: Record<string, { icon: typeof Wifi; label: string }> = {
  pool: { icon: Waves, label: "Piscina" }, wifi: { icon: Wifi, label: "WiFi" }, parking: { icon: Car, label: "Parking" },
  tv: { icon: Tv, label: "TV" }, ac: { icon: Wind, label: "A/C" }, kitchen: { icon: UtensilsCrossed, label: "Cucina" }, laundry: { icon: Shirt, label: "Biancheria" },
};

type AptCardData = {
  id: string; name: string; zone: string; capacity: number; bedrooms: number; bathrooms: number;
  hasKitchen: boolean; pool: PoolType; image: string; amenities: string[];
  priceFrom: string | null; isFeatured: boolean;
};

const ApartmentMobileCard = ({ property }: { property: AptCardData }) => (
  <Link to={`/accommodation/${property.id}`} className="md:hidden block group">
    <div className="relative flex gap-3 p-2.5 rounded-2xl bg-gradient-to-br from-card via-card to-secondary/40 border border-border/40 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.35)] overflow-hidden">
      <div className="relative shrink-0 w-[42%] aspect-[4/5] rounded-xl overflow-hidden">
        <img src={property.image} alt={property.name} className="w-full h-full object-cover group-active:scale-105 transition-transform duration-700" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
        <div className="absolute top-1.5 left-1.5 w-6 h-6 rounded-full bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center">
          <Home className="h-3 w-3 text-white" strokeWidth={1.6} />
        </div>
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
          className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center active:scale-90 transition"
          aria-label="Aggiungi a wishlist"
        >
          <Heart className="h-3 w-3 text-white" strokeWidth={1.6} />
        </button>
        {property.priceFrom && (
          <PriceSeal price={property.priceFrom} suffix="notte" size="sm" className="absolute bottom-1.5 right-1.5 z-10" />
        )}
      </div>
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
);


const Apartments = () => {
  const [capacityFilter, setCapacityFilter] = useState("all");
  const [bedroomFilter, setBedroomFilter] = useState("all");
  const [bathroomFilter, setBathroomFilter] = useState("all");
  const [kitchenFilter, setKitchenFilter] = useState("all");
  const [poolFilter, setPoolFilter] = useState("all");
  const [zoneFilter, setZoneFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [featuredOnly, setFeaturedOnly] = useState(false);

  const { data: dbApartments } = useApartments();

  const staticImageBySlug = useMemo(
    () => Object.fromEntries(apartments.map((a) => [a.id, a.image])),
    []
  );

  const apartmentsData: AptCardData[] = useMemo(() => {
    if (dbApartments && dbApartments.length > 0) {
      return dbApartments.map((a) => ({
        id: a.slug,
        name: a.name,
        zone: a.zone,
        capacity: a.capacity,
        bedrooms: a.bedrooms,
        bathrooms: a.bathrooms,
        hasKitchen: a.has_kitchen || false,
        pool: (a.pool_type || "none") as PoolType,
        image: a.images?.[0] || staticImageBySlug[a.slug] || "/placeholder.svg",
        amenities: a.amenities || [],
        priceFrom: formatApartmentPrice(a.slug, a.price_range),
        isFeatured: a.is_featured || false,
      }));
    }
    return apartments.map((a) => ({
      id: a.id, name: a.name, zone: a.zone, capacity: a.capacity, bedrooms: a.bedrooms, bathrooms: a.bathrooms,
      hasKitchen: a.hasKitchen, pool: a.pool, image: a.image, amenities: a.amenities,
      priceFrom: formatApartmentPrice(a.id, null), isFeatured: false,
    }));
  }, [dbApartments, staticImageBySlug]);

  const zoneOpts = useMemo(() => zoneOptionsFor(apartmentsData), [apartmentsData]);

  const filtered = apartmentsData.filter((p) => {
    const matchCapacity = capacityFilter === "all" || p.capacity >= parseInt(capacityFilter);
    const matchBedrooms = bedroomFilter === "all"
      || (bedroomFilter === "3+" ? p.bedrooms >= 3 : p.bedrooms === parseInt(bedroomFilter));
    const matchBathrooms = bathroomFilter === "all"
      || (bathroomFilter === "2+" ? p.bathrooms >= 2 : p.bathrooms === parseInt(bathroomFilter));
    const matchKitchen = kitchenFilter === "all" || (kitchenFilter === "yes" && p.hasKitchen) || (kitchenFilter === "no" && !p.hasKitchen);
    const matchPool = poolFilter === "all" || p.pool === poolFilter;
    const matchZone = zoneFilter === "all" || p.zone === zoneFilter;
    const matchFeatured = !featuredOnly || p.isFeatured;
    const q = searchQuery.trim().toLowerCase();
    const matchSearch = !q || p.name.toLowerCase().includes(q) || p.zone.toLowerCase().includes(q);
    return matchCapacity && matchBedrooms && matchBathrooms && matchKitchen && matchPool && matchZone && matchFeatured && matchSearch;
  }).sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured));

  const filterSpecs: FilterSpec[] = [
    { key: "zone", label: "Zona", options: zoneOpts, value: zoneFilter, onChange: setZoneFilter },
    { key: "bedrooms", label: "Camere", options: bedroomOpts, value: bedroomFilter, onChange: setBedroomFilter },
    { key: "bathrooms", label: "Bagni", options: bathroomOpts, value: bathroomFilter, onChange: setBathroomFilter },
    { key: "capacity", label: "Ospiti", options: capacityOpts, value: capacityFilter, onChange: setCapacityFilter },
    { key: "kitchen", label: "Cucina", options: kitchenOpts, value: kitchenFilter, onChange: setKitchenFilter },
    { key: "pool", label: "Piscina", options: poolOpts, value: poolFilter, onChange: setPoolFilter },
  ];
  const activeFilterCount = filterSpecs.filter((f) => f.value !== "all").length;
  const resetFilters = () => {
    setCapacityFilter("all"); setBedroomFilter("all"); setBathroomFilter("all");
    setKitchenFilter("all"); setPoolFilter("all"); setZoneFilter("all");
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="relative h-[50vh] md:h-[65vh] overflow-hidden">
        <motion.img src={aptHero} alt="" className="w-full h-full object-cover" initial={{ scale: 1.15 }} animate={{ scale: 1.05 }} transition={{ duration: 1.5, ease: "easeOut" }} />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/40 to-transparent" />
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 pb-10 md:pb-20">
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.2 }}>
              <div className="flex items-center gap-3 mb-3 md:mb-5">
                <div className="h-px w-10 md:w-12 bg-accent" />
                <span className="text-accent text-[10px] md:text-xs font-semibold uppercase tracking-[0.35em]">Design Collection</span>
              </div>
              <h1 className="font-serif text-4xl md:text-8xl font-bold text-primary-foreground leading-[0.9] mb-2 md:mb-4">Appartamenti</h1>
              <p className="text-primary-foreground/60 max-w-lg text-xs md:text-lg leading-relaxed">
                <span className="block">Comfort e stile nel cuore</span>
                <span className="block">pulsante dell'isola</span>
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
          countLabel="appartamenti"
          onOpenFilters={() => setFiltersOpen(true)}
          featuredActive={featuredOnly}
          onToggleFeatured={() => setFeaturedOnly((v) => !v)}
          activeFilterCount={activeFilterCount}
        />
      </section>

      <CatalogFilterSheet open={filtersOpen} onOpenChange={setFiltersOpen} filters={filterSpecs} onReset={resetFilters} />

      {/* Featured rail — i più prenotati */}
      {(() => {
        const featured = apartmentsData.filter((a) => a.isFeatured).slice(0, 3);
        const list = featured.length >= 3
          ? featured
          : [...featured, ...apartmentsData.filter((a) => !featured.find((f) => f.id === a.id))].slice(0, 3);
        const items: FeaturedItem[] = list.map((a) => ({
          id: a.id,
          name: a.name,
          image: a.image,
          href: `/accommodation/${a.id}`,
          zone: a.zone,
          priceFrom: a.priceFrom,
          priceSuffix: "notte",
          chips: [
            { icon: Users, label: `${a.capacity}` },
            ...((a.amenities || [])
              .filter((x: string) => amenityIcons[x])
              .slice(0, 3)
              .map((x: string) => ({ icon: amenityIcons[x].icon, label: amenityIcons[x].label }))),
          ],
          proof: a.isFeatured ? "Tra i più richiesti" : undefined,
        }));
        return <FeaturedRail title="I più prenotati" subtitle="In evidenza" items={items} />;
      })()}

      {/* Cards */}
      <section className="py-6 md:py-16 bg-background">
        <div className="container mx-auto px-3 md:px-4">
          <div className="mb-4 md:mb-6">
            <span className="inline-block text-[9px] md:text-[10px] uppercase tracking-[0.35em] font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Tutti gli appartamenti</span>
            <h2 style={{ fontFamily: "'Parkinsans', sans-serif" }} className="font-bold text-lg md:text-3xl mt-1 bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">La collezione completa</h2>
            <div className="mt-2 h-px w-12 bg-gradient-to-r from-primary via-accent to-transparent" />
          </div>
          <motion.div initial="hidden" animate="visible" variants={stagger} className="flex flex-col gap-2.5 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-8">
            {filtered.map((property) => (
              <motion.div key={property.id} variants={fadeUp}>
                <ApartmentMobileCard property={property} />



                {/* Desktop: editorial luxury card — integrated info bar */}
                <Link
                  to={`/accommodation/${property.id}`}
                  className="hidden md:flex flex-col group rounded-[1.75rem] overflow-hidden bg-gradient-to-b from-card via-card to-secondary/30 border border-border/40 hover:border-accent/40 hover:shadow-[0_30px_80px_-30px_hsl(var(--accent)/0.35)] transition-all duration-700"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={property.image}
                      alt={property.name}
                      className="w-full h-full object-cover group-hover:scale-[1.06] transition-transform duration-[1500ms] ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/15 to-transparent" />

                    <div className="absolute top-3.5 left-3.5 w-9 h-9 rounded-full bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center">
                      <Home className="h-4 w-4 text-white" strokeWidth={1.5} />
                    </div>

                    <button
                      type="button"
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                      className="absolute top-3.5 right-3.5 w-9 h-9 rounded-full bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center hover:bg-white/25 transition"
                      aria-label="Aggiungi a wishlist"
                    >
                      <Heart className="h-4 w-4 text-white" strokeWidth={1.5} />
                    </button>

                    {property.isFeatured && (
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

                    {property.priceFrom && (
                      <PriceSeal
                        price={property.priceFrom}
                        suffix="notte"
                        size="md"
                        className="absolute bottom-4 right-4 z-10"
                      />
                    )}
                  </div>

                  <div className="px-5 pt-4 pb-5 bg-card border-t border-border/30">
                    {/* Headline specs */}
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-foreground/85 font-medium mb-3">
                      <span className="flex items-center gap-1.5"><BedDouble className="h-4 w-4 text-accent" />{property.bedrooms} {property.bedrooms === 1 ? "camera" : "camere"}</span>
                      <span className="text-accent/40">•</span>
                      <span className="flex items-center gap-1.5"><Bath className="h-4 w-4 text-accent" />{property.bathrooms} {property.bathrooms === 1 ? "bagno" : "bagni"}</span>
                      {property.pool !== "none" && (
                        <>
                          <span className="text-accent/40">•</span>
                          <span className="flex items-center gap-1.5">
                            <Waves className="h-4 w-4 text-accent" />
                            {property.pool === "jacuzzi" ? "Jacuzzi" : "Piscina condivisa"}
                          </span>
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
              <p className="text-lg">Nessun appartamento trovato con i filtri selezionati</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Apartments;
