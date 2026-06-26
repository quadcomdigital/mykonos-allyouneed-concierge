import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, Waves, Home, Building, Filter, Wifi, Car, Tv, Wind, UtensilsCrossed, Shirt, ArrowRight, Star, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/i18n/LanguageContext";
import Layout from "@/components/layout/Layout";
import heroImg1 from "@/assets/hero-mykonos-1.jpg";
import heroImg2 from "@/assets/hero-mykonos-2.jpg";
import heroImg3 from "@/assets/hero-mykonos-3.jpg";
import amaris1 from "@/assets/villas/amaris-1.jpg";
import alextown1 from "@/assets/apartments/alextown-1.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const sampleProperties = [
  {
    id: "1",
    name: "Villa Aegean Breeze",
    zone: "Ornos",
    capacity: 10,
    type: "villa_pool",
    bedrooms: 5,
    bathrooms: 4,
    image: heroImg1,
    amenities: ["pool", "wifi", "parking", "tv", "ac", "kitchen", "laundry"],
  },
  {
    id: "2",
    name: "Villa Amaris",
    zone: "Kanalia",
    capacity: 12,
    type: "villa_pool",
    bedrooms: 6,
    bathrooms: 6,
    image: amaris1,
    amenities: ["pool", "wifi", "parking", "ac", "kitchen", "laundry"],
  },
  {
    id: "3",
    name: "Villa Sunset Paradise",
    zone: "Agios Ioannis",
    capacity: 9,
    type: "villa_pool",
    bedrooms: 4,
    bathrooms: 3,
    image: heroImg3,
    amenities: ["pool", "wifi", "parking", "tv", "ac", "kitchen", "laundry"],
  },
  {
    id: "4",
    name: "Seaside Loft",
    zone: "Platis Gialos",
    capacity: 4,
    type: "apartment_pool",
    bedrooms: 1,
    bathrooms: 1,
    image: heroImg1,
    amenities: ["pool", "wifi", "tv", "ac"],
  },
  {
    id: "5",
    name: "Grand Villa Mykonos",
    zone: "Elia",
    capacity: 12,
    type: "villa_pool",
    bedrooms: 6,
    bathrooms: 5,
    image: heroImg2,
    amenities: ["pool", "wifi", "parking", "tv", "ac", "kitchen", "laundry"],
  },
  {
    id: "6",
    name: "Central Studio",
    zone: "Mykonos Town",
    capacity: 2,
    type: "apartment",
    bedrooms: 1,
    bathrooms: 1,
    image: heroImg3,
    amenities: ["wifi", "tv", "ac"],
  },
  {
    id: "7",
    name: "Alex Town",
    zone: "Mykonos Town",
    capacity: 6,
    type: "apartment",
    bedrooms: 2,
    bathrooms: 1,
    image: alextown1,
    amenities: ["wifi", "ac", "kitchen", "laundry"],
  },
];

const capacityFilters = [
  { label: "Tutti", value: "all" },
  { label: "4 ospiti", value: "4" },
  { label: "9 ospiti", value: "9" },
  { label: "10+ ospiti", value: "10+" },
];

const typeFilters = [
  { label: "Tutte le tipologie", value: "all" },
  { label: "Villa con piscina", value: "villa_pool" },
  { label: "Appartamenti", value: "apartment" },
  { label: "Appartamenti con piscina", value: "apartment_pool" },
];

const amenityIcons: Record<string, { icon: typeof Wifi; label: string }> = {
  pool: { icon: Waves, label: "Piscina" },
  wifi: { icon: Wifi, label: "WiFi" },
  parking: { icon: Car, label: "Parcheggio" },
  tv: { icon: Tv, label: "TV" },
  ac: { icon: Wind, label: "A/C" },
  kitchen: { icon: UtensilsCrossed, label: "Cucina" },
  laundry: { icon: Shirt, label: "Biancheria" },
};

const Accommodation = () => {
  const { t } = useLanguage();
  const [capacityFilter, setCapacityFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const filtered = sampleProperties.filter((p) => {
    const matchCapacity =
      capacityFilter === "all" ||
      (capacityFilter === "4" && p.capacity <= 4) ||
      (capacityFilter === "9" && p.capacity <= 9 && p.capacity > 4) ||
      (capacityFilter === "10+" && p.capacity >= 10);
    const matchType = typeFilter === "all" || p.type === typeFilter;
    return matchCapacity && matchType;
  });

  return (
    <Layout>
      {/* Hero — immersive */}
      <section className="relative h-[55vh] overflow-hidden">
        <img src={heroImg2} alt="" className="w-full h-full object-cover scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/30 to-foreground/20" />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <span className="inline-block px-5 py-2 rounded-full bg-accent/20 backdrop-blur-md text-accent text-xs font-semibold uppercase tracking-[0.3em] mb-6 border border-accent/30">
              Luxury Collection
            </span>
            <h1 className="font-serif text-5xl md:text-7xl font-bold text-primary-foreground drop-shadow-2xl">
              {t("accommodation.title")}
            </h1>
            <p className="text-primary-foreground/60 mt-4 max-w-md mx-auto text-lg">
              Ville e appartamenti esclusivi per la tua vacanza da sogno
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters — floating glassmorphism bar */}
      <section className="relative -mt-8 z-30 pb-8">
        <div className="container mx-auto px-4">
          <div className="rounded-2xl bg-card/80 backdrop-blur-xl border border-border/50 shadow-2xl shadow-foreground/5 p-6">
            <div className="flex flex-col md:flex-row gap-6 md:items-center">
              <div className="flex items-center gap-2 text-sm text-muted-foreground shrink-0">
                <Users className="h-4 w-4 text-accent" />
                <span className="font-semibold uppercase tracking-wider text-xs">Capacità</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {capacityFilters.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => setCapacityFilter(f.value)}
                    className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                      capacityFilter === f.value
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                        : "bg-secondary/50 text-secondary-foreground hover:bg-secondary"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
              <div className="hidden md:block w-px h-8 bg-border mx-2" />
              <div className="flex items-center gap-2 text-sm text-muted-foreground shrink-0">
                <Filter className="h-4 w-4 text-accent" />
                <span className="font-semibold uppercase tracking-wider text-xs">Tipologia</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {typeFilters.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => setTypeFilter(f.value)}
                    className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                      typeFilter === f.value
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                        : "bg-secondary/50 text-secondary-foreground hover:bg-secondary"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filtered.map((property) => (
              <motion.div key={property.id} variants={fadeUp}>
                <Link
                  to={`/accommodation/${property.id}`}
                  className="group block rounded-3xl overflow-hidden bg-card border border-border/50 hover:border-accent/30 hover:shadow-[0_20px_60px_-15px_hsl(var(--accent)/0.15)] transition-all duration-500"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={property.image}
                      alt={property.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1200ms] ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute top-4 right-4 px-4 py-2 rounded-full bg-primary/90 backdrop-blur-sm text-primary-foreground text-xs font-semibold">
                      {property.capacity} ospiti
                    </div>
                    <div className="absolute top-4 left-4 flex items-center gap-1 px-3 py-1.5 rounded-full bg-foreground/60 backdrop-blur-sm text-primary-foreground text-xs">
                      <Star className="h-3 w-3 text-accent fill-accent" />
                      <span>5.0</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-serif text-2xl font-bold mb-2 group-hover:text-primary transition-colors">{property.name}</h3>
                    <p className="text-sm text-accent flex items-center gap-1.5 mb-4 font-medium">
                      <MapPin className="h-3.5 w-3.5" /> {property.zone}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <span>{property.bedrooms} camere</span>
                      <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
                      <span>{property.bathrooms} bagni</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {property.amenities.slice(0, 4).map((a) => {
                        const info = amenityIcons[a];
                        if (!info) return null;
                        return (
                          <span
                            key={a}
                            className="flex items-center gap-1.5 bg-secondary/60 text-secondary-foreground px-3 py-1.5 rounded-full text-xs font-medium"
                          >
                            <info.icon className="h-3 w-3 text-accent" />
                            {info.label}
                          </span>
                        );
                      })}
                      {property.amenities.length > 4 && (
                        <span className="text-xs text-muted-foreground px-3 py-1.5">
                          +{property.amenities.length - 4}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {filtered.length === 0 && (
            <div className="text-center py-24 text-muted-foreground">
              <Building className="h-16 w-16 mx-auto mb-6 opacity-30" />
              <p className="text-lg">Nessun alloggio trovato con i filtri selezionati</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Accommodation;
