import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { slugify } from "@/pages/VehicleDetail";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Calendar as CalendarIcon, User, Mail, Phone, Plane, MapPin, CheckCircle2, Sparkles, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { cn } from "@/lib/utils";
import Layout from "@/components/layout/Layout";
import heroImg from "@/assets/noleggio-hero.jpg";
import imgMeraki from "@/assets/meraki.jpg";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CatalogFilterBar, CatalogFilterSheet, type FilterSpec } from "@/components/catalog/CatalogFilters";
import { PriceSeal } from "@/components/catalog/PriceSeal";
import { FeaturedRail, type FeaturedItem } from "@/components/catalog/FeaturedRail";
import { Fuel, Gauge } from "lucide-react";


const getSeasonColor = (date: Date): string | null => {
  const m = date.getMonth();
  if (m === 4 || m === 5) return "bg-emerald-500";
  if (m === 6) return "bg-amber-500";
  if (m === 7 || m === 8) return "bg-rose-500";
  return null;
};

const SeasonDatePicker = ({
  value, onChange, placeholder, className,
}: {
  value?: Date; onChange: (d: Date | undefined) => void; placeholder: string; className?: string;
}) => (
  <Popover>
    <PopoverTrigger asChild>
      <Button variant="outline" className={cn("w-full justify-start text-left font-normal mt-1 bg-primary-foreground/10 border-primary-foreground/15 text-primary-foreground rounded-xl hover:bg-primary-foreground/20 hover:text-primary-foreground", !value && "text-primary-foreground/30", className)}>
        <CalendarIcon className="mr-2 h-4 w-4" />
        {value ? format(value, "dd/MM/yyyy", { locale: it }) : placeholder}
      </Button>
    </PopoverTrigger>
    <PopoverContent className="w-auto p-0" align="start">
      <Calendar mode="single" selected={value} onSelect={onChange} className="p-3 pointer-events-auto" locale={it}
        modifiers={{ low: (date) => { const m = date.getMonth(); return m === 4 || m === 5; }, mid: (date) => date.getMonth() === 6, high: (date) => { const m = date.getMonth(); return m === 7 || m === 8; } }}
        modifiersStyles={{}}
        components={{ DayContent: ({ date }) => { const color = getSeasonColor(date); return (<div className="relative flex items-center justify-center w-full h-full"><span>{date.getDate()}</span>{color && (<span className={`absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full ${color}`} />)}</div>); } }}
      />
      <div className="flex items-center justify-center gap-4 px-3 pb-3 text-[10px] text-muted-foreground">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" />Bassa</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" />Media</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500" />Alta</span>
      </div>
    </PopoverContent>
  </Popover>
);

// Auto images
import citroenC1 from "@/assets/vehicles/citroen-c1.png";
import kiaPicanto from "@/assets/vehicles/kia-picanto.png";
import nissanMicra from "@/assets/vehicles/nissan-micra.png";
import fiat500Cabrio from "@/assets/vehicles/fiat-500-cabrio.png";
import smartCar from "@/assets/vehicles/smart-car.png";
import peugeot108Cabrio from "@/assets/vehicles/peugeot-108-cabrio.png";
import opelCorsa from "@/assets/vehicles/opel-corsa.png";
import citroenC3 from "@/assets/vehicles/citroen-c3.png";
import renaultClio from "@/assets/vehicles/renault-clio.png";
import peugeot208 from "@/assets/vehicles/peugeot-208.png";
import miniCooperCabrio from "@/assets/vehicles/mini-cooper-cabrio.png";
import kiaStonic from "@/assets/vehicles/kia-stonic.png";
import mercedesGla from "@/assets/vehicles/mercedes-gla.png";
import suzukiVitara from "@/assets/vehicles/suzuki-vitara.png";
import vwGolf from "@/assets/vehicles/vw-golf.png";
import nissanQashqai from "@/assets/vehicles/nissan-qashqai.png";
import bmwX1 from "@/assets/vehicles/bmw-x1.png";
import bmw116 from "@/assets/vehicles/bmw-116.png";
import jeepSahara2019 from "@/assets/vehicles/jeep-wrangler-sahara-2019.png";
import jeepSahara2022 from "@/assets/vehicles/jeep-wrangler-sahara-2022.png";
import jeepRubicon2022 from "@/assets/vehicles/jeep-wrangler-rubicon-2022.png";
import jeepWrangler2024 from "@/assets/vehicles/jeep-wrangler-2024.png";
import jeep5door2014 from "@/assets/vehicles/jeep-wrangler-5door-2014.webp";
import atvSegway from "@/assets/vehicles/atv-segway.png";
import atvGoes from "@/assets/vehicles/atv-goes.png";
import atvAeon200 from "@/assets/vehicles/atv-aeon-200.png";
import buggyPolaris from "@/assets/vehicles/buggy-polaris.webp";
import libertyBoulevard50 from "@/assets/vehicles/liberty-boulevard-50.png";
import hondaPiaggio125 from "@/assets/vehicles/honda-piaggio-125.png";
import piaggioBeverly300 from "@/assets/vehicles/piaggio-beverly-300.png";
import piaggioLiberty125 from "@/assets/vehicles/piaggio-liberty-125.png";
import hondaSh125 from "@/assets/vehicles/honda-sh-125.png";
import piaggioMedley150 from "@/assets/vehicles/piaggio-medley-150.png";
import yamahaTrieity125 from "@/assets/vehicles/yamaha-tricity-125.png";
import libertyRstAbs from "@/assets/vehicles/liberty-rst-abs.png";
import variant50 from "@/assets/vehicles/variant-50.png";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

type Vehicle = { name: string; image: string; low: string; mid: string; high: string };

const categoryOpts = [
  { label: "Tutti", value: "Tutti" },
  { label: "Auto", value: "Auto" },
  { label: "Jeep", value: "Jeep" },
  { label: "ATV", value: "ATV" },
  { label: "Scooter", value: "Scooter" },
];


const vehicleData: Record<string, Vehicle[]> = {
  Auto: [
    { name: "Citroen C1", image: citroenC1, low: "€45", mid: "€60", high: "€75" },
    { name: "Kia Picanto", image: kiaPicanto, low: "€45", mid: "€60", high: "€75" },
    { name: "Nissan Micra", image: nissanMicra, low: "€55", mid: "€65", high: "€75" },
    { name: "Opel Corsa", image: opelCorsa, low: "€50", mid: "€75", high: "€80" },
    { name: "Renault Clio", image: renaultClio, low: "€50", mid: "€70", high: "€85" },
    { name: "Peugeot 208", image: peugeot208, low: "€50", mid: "€70", high: "€85" },
    { name: "Citroen C3", image: citroenC3, low: "€60", mid: "€70", high: "€85" },
    { name: "Fiat 500 Cabrio", image: fiat500Cabrio, low: "€65", mid: "€90", high: "€140" },
    { name: "Smart", image: smartCar, low: "€70", mid: "€85", high: "€100" },
    { name: "Peugeot 108 Cabrio", image: peugeot108Cabrio, low: "€70", mid: "€85", high: "€110" },
    { name: "Kia Stonic", image: kiaStonic, low: "€70", mid: "€90", high: "€110" },
    { name: "Suzuki Vitara", image: suzukiVitara, low: "€70", mid: "€85", high: "€110" },
    { name: "VW Golf", image: vwGolf, low: "€80", mid: "€90", high: "€130" },
    { name: "Nissan Qashqai", image: nissanQashqai, low: "€80", mid: "€100", high: "€150" },
    { name: "BMW 116", image: bmw116, low: "€90", mid: "€100", high: "€130" },
    { name: "BMW X1", image: bmwX1, low: "€100", mid: "€180", high: "€200" },
    { name: "Mini Cooper Cabrio", image: miniCooperCabrio, low: "€130", mid: "€160", high: "€220" },
    { name: "Mercedes GLA", image: mercedesGla, low: "€130", mid: "€150", high: "€190" },
  ],
  Jeep: [
    { name: "Jeep Wrangler Sahara 2019", image: jeepSahara2019, low: "€190", mid: "€250", high: "€310" },
    { name: "Jeep Wrangler 5 Door 2014", image: jeep5door2014, low: "€190", mid: "€190", high: "€250" },
    { name: "Jeep Wrangler Sahara 2022", image: jeepSahara2022, low: "€250", mid: "€310", high: "€370" },
    { name: "Jeep Wrangler Rubicon 2022", image: jeepRubicon2022, low: "€280", mid: "€320", high: "€400" },
    { name: "Jeep Wrangler 2024 Hybrid", image: jeepWrangler2024, low: "€310", mid: "€370", high: "€440" },
  ],
  ATV: [
    { name: "Kymco MXU 50cc", image: atvSegway, low: "€35", mid: "€40", high: "€45" },
    { name: "ATV Aeon 200cc", image: atvAeon200, low: "€45", mid: "€50", high: "€70" },
    { name: "ATV Goes 450cc", image: atvGoes, low: "€50", mid: "€70", high: "€90" },
    { name: "Kymco MXU 150cc", image: atvSegway, low: "€55", mid: "€60", high: "€70" },
    { name: "ATV Goes 550cc", image: atvGoes, low: "€60", mid: "€80", high: "€100" },
    { name: "Kymco MXU 450cc", image: atvGoes, low: "€70", mid: "€80", high: "€90" },
    { name: "ATV Segway 620cc", image: atvSegway, low: "€70", mid: "€90", high: "€120" },
    { name: "Buggy Polaris RZR 570", image: buggyPolaris, low: "Su richiesta", mid: "Su richiesta", high: "Su richiesta" },
  ],
  Scooter: [
    { name: "Liberty/Boulevard 50cc", image: libertyBoulevard50, low: "€23", mid: "€25", high: "€30" },
    { name: "Variant 50cc", image: variant50, low: "€25", mid: "€30", high: "€35" },
    { name: "Honda/Piaggio 125cc", image: hondaPiaggio125, low: "€30", mid: "€35", high: "€40" },
    { name: "Liberty/Yamaha Ray ZR 125cc", image: libertyBoulevard50, low: "€35", mid: "€40", high: "€45" },
    { name: "Piaggio Liberty 125cc", image: piaggioLiberty125, low: "€35", mid: "€40", high: "€45" },
    { name: "Honda SH 125cc", image: hondaSh125, low: "€35", mid: "€40", high: "€45" },
    { name: "Piaggio Medley 150cc", image: piaggioMedley150, low: "€40", mid: "€40", high: "€45" },
    { name: "Piaggio Beverly 300cc", image: piaggioBeverly300, low: "€40", mid: "€55", high: "€60" },
    { name: "Liberty RST ABS / Honda SH ABS", image: libertyRstAbs, low: "€40", mid: "€45", high: "€50" },
    { name: "Yamaha Tricity 125cc", image: yamahaTrieity125, low: "€40", mid: "€45", high: "€50" },
  ],
};

const Rentals = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState<string>("Tutti");
  const [searchQuery, setSearchQuery] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [hasLicense, setHasLicense] = useState(false);
  const [pickupPoint, setPickupPoint] = useState("");
  const [rentalFrom, setRentalFrom] = useState<Date>();
  const [rentalTo, setRentalTo] = useState<Date>();
  const [flightOutDate, setFlightOutDate] = useState<Date>();
  const [flightReturnDate, setFlightReturnDate] = useState<Date>();
  const [birthDate, setBirthDate] = useState<Date>();


  // Auto-open form if ?vehicle= is present (coming from detail page)
  useEffect(() => {
    const v = searchParams.get("vehicle");
    if (v) {
      setSelectedVehicle(v);
      setShowForm(true);
      setTimeout(() => { document.getElementById("rental-form")?.scrollIntoView({ behavior: "smooth" }); }, 200);
    }
  }, [searchParams]);

  const handleViewDetail = (vehicleName: string) => {
    navigate(`/rentals/${slugify(vehicleName)}`);
  };

  const handleBookNow = (vehicleName: string) => {
    setSelectedVehicle(vehicleName);
    setShowForm(true);
    setTimeout(() => { document.getElementById("rental-form")?.scrollIntoView({ behavior: "smooth" }); }, 100);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formElements = form.elements as any;
    const { error } = await supabase.from("bookings").insert({
      service_type: "rental",
      service_name: selectedVehicle,
      customer_name: `${formElements[4]?.value || ""} ${formElements[5]?.value || ""}`.trim(),
      customer_email: formElements[7]?.value || null,
      customer_phone: formElements[6]?.value || null,
      check_in: rentalFrom ? format(rentalFrom, "yyyy-MM-dd") : null,
      check_out: rentalTo ? format(rentalTo, "yyyy-MM-dd") : null,
      message: `Pickup: ${pickupPoint}, Patente: ${hasLicense ? "Sì" : "No"}`,
      source: "website",
    } as any);
    if (error) {
      toast({ title: "Errore", description: "Riprova più tardi.", variant: "destructive" });
      return;
    }
    toast({ title: "Richiesta inviata!", description: "Ti contatteremo al più presto con il preventivo." });
    setShowForm(false);
  };

  const baseVehicles = activeCategory === "Tutti"
    ? Object.values(vehicleData).flat()
    : (vehicleData[activeCategory] || []);
  const q = searchQuery.trim().toLowerCase();
  const currentVehicles = q ? baseVehicles.filter(v => v.name.toLowerCase().includes(q)) : baseVehicles;

  return (
    <Layout>
      {/* Hero */}
      <section className="relative h-[50vh] md:h-[75vh] overflow-hidden">
        <motion.img src={heroImg} alt="" className="w-full h-full object-cover" initial={{ scale: 1.15 }} animate={{ scale: 1 }} transition={{ duration: 2, ease: "easeOut" }} />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/50 to-foreground/10" />
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 pb-10 md:pb-20">
            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
              <div className="flex items-center gap-3 mb-3 md:mb-6">
                <div className="h-px w-10 md:w-14 bg-accent" />
                <span className="text-accent text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.4em]">Esplora l'Isola</span>
              </div>
              <h1 className="font-serif text-3xl md:text-9xl font-bold text-primary-foreground leading-[0.85]">Noleggio Veicoli</h1>
              <p className="text-primary-foreground/60 mt-3 md:mt-5 max-w-md text-xs md:text-lg leading-relaxed">
                <span className="md:inline">Scooter, quad, auto e jeep selezionati per</span>
                <span className="block md:inline"> vivere Mykonos in totale libertà</span>
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Search + Filtri + In evidenza */}
      <section className="relative -mt-6 md:-mt-10 z-30 mb-3 md:mb-5">
        <CatalogFilterBar
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          placeholder="Cerca veicolo per nome…"
          count={currentVehicles.length}
          countLabel="veicoli"
          onOpenFilters={() => setFiltersOpen(true)}
          featuredActive={featuredOnly}
          onToggleFeatured={() => setFeaturedOnly((v) => !v)}
          activeFilterCount={activeCategory !== "Tutti" ? 1 : 0}
        />
      </section>

      <CatalogFilterSheet
        open={filtersOpen}
        onOpenChange={setFiltersOpen}
        filters={[
          { key: "category", label: "Categoria", options: categoryOpts, value: activeCategory, onChange: setActiveCategory },
        ]}
        onReset={() => setActiveCategory("Tutti")}
      />


      {/* Featured rail — i mezzi più prenotati */}
      {(() => {
        const featuredNames = [
          "Mercedes GLA",
          "Mini Cooper Cabrio",
          "Jeep Wrangler Sahara 2022",
          "BMW X1",
          "Honda SH 125cc",
          "ATV Segway 620cc",
        ];
        const all = Object.entries(vehicleData).flatMap(([cat, list]) => list.map((v) => ({ ...v, category: cat })));
        const featured = featuredNames
          .map((n) => all.find((v) => v.name === n))
          .filter(Boolean)
          .slice(0, 3) as (Vehicle & { category: string })[];
        const items: FeaturedItem[] = featured.map((v) => ({
          id: v.name,
          name: v.name,
          image: v.image,
          href: `/rentals/${slugify(v.name)}`,
          priceFrom: v.low,
          priceSuffix: "giorno",
          category: "vehicle",
          chips: [
            { icon: Sparkles, label: v.category },
            { icon: Gauge, label: v.high },
          ],
          proof: "Mezzo più richiesto",
          topLabel: "Più prenotato",
        }));
        return <FeaturedRail title="I più prenotati" subtitle="In evidenza" items={items} ctaLabel="Noleggia subito" />;
      })()}

      {/* Vehicle showcase — luxury cards */}
      <section className="pb-16 md:pb-24 pt-2 md:pt-6 bg-background">
        <div className="container mx-auto px-3 md:px-4">
          <div className="mb-4 md:mb-6">
            <span className="inline-block text-[9px] md:text-[10px] uppercase tracking-[0.35em] font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Tutti i mezzi</span>
            <h2 style={{ fontFamily: "'Parkinsans', sans-serif" }} className="font-bold text-lg md:text-3xl mt-1 bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">La flotta completa</h2>
            <div className="mt-2 h-px w-12 bg-gradient-to-r from-primary via-accent to-transparent" />
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial="hidden" animate="visible" exit="hidden" variants={stagger}
              className="grid grid-cols-2 gap-3 md:grid-cols-2 lg:grid-cols-3 md:gap-8"
            >
              {currentVehicles.map((v) => (
                <motion.div key={v.name} variants={fadeUp}>
                  {/* Mobile: luxury vertical card */}
                  <div onClick={() => handleViewDetail(v.name)} className="md:hidden relative cursor-pointer group">
                    <div className="relative overflow-hidden rounded-2xl">
                      <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-[radial-gradient(circle_at_30%_25%,hsl(var(--secondary))_0%,hsl(var(--secondary)/0.3)_70%,hsl(var(--background))_100%)] border border-border/30 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.35)]">
                        <img src={v.image} alt={v.name} className="absolute inset-0 w-full h-full object-contain p-4 drop-shadow-[0_8px_18px_rgba(0,0,0,0.25)] group-active:scale-105 transition-transform duration-500" />
                        <div className="absolute top-2 left-2">
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-foreground/35 backdrop-blur-md border border-white/15 text-white text-[7px] font-bold uppercase tracking-[0.2em] shadow-sm">
                            <Sparkles className="h-2 w-2 text-accent" /> {activeCategory === "Tutti" ? "Premium" : activeCategory}
                          </span>
                        </div>
                        <PriceSeal price={v.low} suffix="giorno" size="sm" className="absolute bottom-2 right-2 z-10" />
                      </div>
                    </div>
                    <div className="px-1 pt-2.5">
                      <h3 style={{ fontFamily: "'Parkinsans', sans-serif" }} className="font-bold text-[13px] text-foreground leading-tight line-clamp-2 min-h-[2.2em]">{v.name}</h3>
                      <div className="mt-1.5 flex items-center gap-2 text-[9px] text-foreground/70 font-medium">
                        <span className="inline-flex items-center gap-1"><Sparkles className="h-2.5 w-2.5 text-accent" />{activeCategory === "Tutti" ? "Premium" : activeCategory}</span>
                        <span className="text-foreground/30">•</span>
                        <span className="inline-flex items-center gap-1"><Gauge className="h-2.5 w-2.5 text-accent" />fino a {v.high}</span>
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); handleBookNow(v.name); }}
                        className="mt-2 w-full py-2 rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground text-[9px] font-bold uppercase tracking-wider shadow-md shadow-accent/20 flex items-center justify-center gap-1">
                        Noleggia subito <ArrowRight className="h-2.5 w-2.5" />
                      </button>
                    </div>
                  </div>

                  {/* Desktop: editorial luxury vehicle card */}
                  <div className="hidden md:flex flex-col group">
                    <div className="relative overflow-hidden rounded-[1.75rem]">
                      <button
                        type="button"
                        onClick={() => handleViewDetail(v.name)}
                        className="relative aspect-[16/11] w-full overflow-hidden rounded-[1.75rem] bg-[radial-gradient(circle_at_30%_25%,hsl(var(--secondary))_0%,hsl(var(--secondary)/0.3)_70%,hsl(var(--background))_100%)] border border-border/30 group-hover:border-accent/40 group-hover:shadow-[0_30px_80px_-30px_hsl(var(--accent)/0.3)] transition-all duration-700 text-left"
                      >
                        <motion.img
                          src={v.image}
                          alt={v.name}
                          className="absolute inset-0 w-full h-full object-contain p-8 drop-shadow-[0_18px_30px_rgba(0,0,0,0.3)]"
                          whileHover={{ scale: 1.06, rotate: -1 }}
                          transition={{ duration: 0.6, ease: "easeOut" }}
                        />
                        <div className="absolute top-3.5 left-3.5 w-9 h-9 rounded-full bg-foreground/35 backdrop-blur-md border border-white/15 flex items-center justify-center">
                          <Sparkles className="h-4 w-4 text-white" />
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-5 pr-32 bg-gradient-to-t from-foreground/75 via-foreground/15 to-transparent">
                          <span className="text-white/70 text-[10px] uppercase tracking-[0.35em] font-medium mb-2 block">
                            {activeCategory === "Tutti" ? "Premium Fleet" : activeCategory}
                          </span>
                          <h3 style={{ fontFamily: "'Parkinsans', sans-serif" }} className="font-bold text-xl lg:text-2xl leading-tight text-white drop-shadow-lg truncate">
                            {v.name}
                          </h3>
                        </div>
                        <PriceSeal price={v.low} suffix="giorno" size="md" className="absolute bottom-4 right-4 z-10" />
                      </button>
                    </div>

                    {/* Info + CTA */}
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center justify-between gap-2 text-[11px] text-foreground/75 font-medium">
                        <span className="inline-flex items-center gap-1.5"><Sparkles className="h-3 w-3 text-accent" />{activeCategory === "Tutti" ? "Premium Fleet" : activeCategory}</span>
                        <span className="inline-flex items-center gap-1.5"><Gauge className="h-3 w-3 text-accent" />fino a {v.high} / giorno</span>
                      </div>
                      <button
                        onClick={() => handleBookNow(v.name)}
                        className="w-full px-4 py-2.5 rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground text-[11px] font-bold uppercase tracking-wider shadow-md shadow-accent/20 hover:shadow-lg hover:shadow-accent/30 transition-all flex items-center justify-center gap-1.5"
                      >
                        Noleggia subito <ArrowRight className="h-3 w-3" />
                      </button>
                    </div>
                  </div>

                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Divider */}
      <section className="relative h-[30vh] md:h-[40vh] overflow-hidden">
        <img src={imgMeraki} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center px-6">
            <p className="text-white/50 text-sm md:text-lg mb-2 md:mb-3">La tua libertà inizia qui.</p>
            <h2 className="font-serif text-xl md:text-5xl text-white leading-tight">Scegli il mezzo.<br />Noi pensiamo al resto.</h2>
          </motion.div>
        </div>
      </section>

      {/* Rental form */}
      {showForm && (
        <section id="rental-form" className="relative py-16 md:py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-accent" />
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, hsl(var(--accent)) 0%, transparent 50%), radial-gradient(circle at 80% 20%, hsl(var(--primary-foreground)) 0%, transparent 40%)' }} />
          <div className="relative container mx-auto px-4 max-w-3xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="text-center mb-8 md:mb-12">
                <span className="inline-block px-4 py-1.5 rounded-full bg-primary-foreground/15 text-primary-foreground text-[10px] md:text-xs font-semibold uppercase tracking-[0.3em] mb-4 md:mb-6 backdrop-blur-sm">Preventivo Gratuito</span>
                <h2 className="font-serif text-2xl md:text-5xl font-bold text-primary-foreground mb-2 md:mb-3">Richiesta Preventivo</h2>
                <p className="text-primary-foreground/60 text-sm md:text-lg">Veicolo: <span className="font-semibold text-primary-foreground">{selectedVehicle}</span></p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                <div className="rounded-2xl bg-primary-foreground/10 backdrop-blur-md border border-primary-foreground/15 p-4 md:p-6 space-y-3 md:space-y-4">
                  <h3 className="text-sm md:text-lg font-semibold flex items-center gap-2 text-primary-foreground"><CalendarIcon className="h-4 w-4 md:h-5 md:w-5 text-accent" /> Veicolo e Date</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    <div><Label className="text-primary-foreground/80 text-[10px] md:text-xs uppercase tracking-wider">Veicolo scelto</Label><Input value={selectedVehicle} readOnly className="mt-1 bg-primary-foreground/10 border-primary-foreground/15 text-primary-foreground rounded-xl text-sm" /></div>
                    <div><Label className="text-primary-foreground/80 text-[10px] md:text-xs uppercase tracking-wider">Data inizio</Label><SeasonDatePicker value={rentalFrom} onChange={setRentalFrom} placeholder="Seleziona data inizio" /></div>
                    <div><Label className="text-primary-foreground/80 text-[10px] md:text-xs uppercase tracking-wider">Data fine</Label><SeasonDatePicker value={rentalTo} onChange={setRentalTo} placeholder="Seleziona data fine" /></div>
                  </div>
                </div>
                <div className="rounded-2xl bg-primary-foreground/10 backdrop-blur-md border border-primary-foreground/15 p-4 md:p-6 space-y-3 md:space-y-4">
                  <h3 className="text-sm md:text-lg font-semibold flex items-center gap-2 text-primary-foreground"><User className="h-4 w-4 md:h-5 md:w-5 text-accent" /> Dati Personali</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    <div><Label className="text-primary-foreground/80 text-[10px] md:text-xs uppercase tracking-wider">Nome</Label><Input required placeholder="Mario" className="mt-1 bg-primary-foreground/10 border-primary-foreground/15 text-primary-foreground placeholder:text-primary-foreground/30 rounded-xl text-sm" /></div>
                    <div><Label className="text-primary-foreground/80 text-[10px] md:text-xs uppercase tracking-wider">Cognome</Label><Input required placeholder="Rossi" className="mt-1 bg-primary-foreground/10 border-primary-foreground/15 text-primary-foreground placeholder:text-primary-foreground/30 rounded-xl text-sm" /></div>
                    <div><Label className="text-primary-foreground/80 text-[10px] md:text-xs uppercase tracking-wider">Telefono</Label><Input type="tel" required placeholder="+39 333 1234567" className="mt-1 bg-primary-foreground/10 border-primary-foreground/15 text-primary-foreground placeholder:text-primary-foreground/30 rounded-xl text-sm" /></div>
                    <div><Label className="text-primary-foreground/80 text-[10px] md:text-xs uppercase tracking-wider">Email</Label><Input type="email" required placeholder="mario@email.com" className="mt-1 bg-primary-foreground/10 border-primary-foreground/15 text-primary-foreground placeholder:text-primary-foreground/30 rounded-xl text-sm" /></div>
                    <div><Label className="text-primary-foreground/80 text-[10px] md:text-xs uppercase tracking-wider">Data di nascita</Label><SeasonDatePicker value={birthDate} onChange={setBirthDate} placeholder="Seleziona data" /></div>
                  </div>
                  <div className="flex items-center gap-3 pt-2">
                    <Checkbox id="license" checked={hasLicense} onCheckedChange={(v) => setHasLicense(v === true)} className="border-primary-foreground/30 data-[state=checked]:bg-accent data-[state=checked]:border-accent" />
                    <Label htmlFor="license" className="text-primary-foreground/80 cursor-pointer text-xs md:text-sm">Confermo di essere in possesso di patente di guida valida</Label>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div className="rounded-2xl bg-primary-foreground/10 backdrop-blur-md border border-primary-foreground/15 p-4 md:p-6 space-y-3 md:space-y-4">
                    <h3 className="text-sm md:text-lg font-semibold flex items-center gap-2 text-primary-foreground"><Plane className="h-4 w-4 md:h-5 md:w-5 text-accent" /> Volo Andata</h3>
                    <div className="space-y-2 md:space-y-3">
                      <div><Label className="text-primary-foreground/80 text-[10px] md:text-xs uppercase tracking-wider">N° volo</Label><Input required placeholder="FR1234" className="mt-1 bg-primary-foreground/10 border-primary-foreground/15 text-primary-foreground placeholder:text-primary-foreground/30 rounded-xl text-sm" /></div>
                      <div><Label className="text-primary-foreground/80 text-[10px] md:text-xs uppercase tracking-wider">Aeroporto partenza</Label><Input required placeholder="Roma Fiumicino" className="mt-1 bg-primary-foreground/10 border-primary-foreground/15 text-primary-foreground placeholder:text-primary-foreground/30 rounded-xl text-sm" /></div>
                      <div><Label className="text-primary-foreground/80 text-[10px] md:text-xs uppercase tracking-wider">Data</Label><SeasonDatePicker value={flightOutDate} onChange={setFlightOutDate} placeholder="Seleziona data" /></div>
                      <div><Label className="text-primary-foreground/80 text-[10px] md:text-xs uppercase tracking-wider">Ora</Label><Input type="time" required className="mt-1 bg-primary-foreground/10 border-primary-foreground/15 text-primary-foreground rounded-xl text-sm" /></div>
                    </div>
                  </div>
                  <div className="rounded-2xl bg-primary-foreground/10 backdrop-blur-md border border-primary-foreground/15 p-4 md:p-6 space-y-3 md:space-y-4">
                    <h3 className="text-sm md:text-lg font-semibold flex items-center gap-2 text-primary-foreground"><Plane className="h-4 w-4 md:h-5 md:w-5 text-accent rotate-180" /> Volo Ritorno</h3>
                    <div className="space-y-2 md:space-y-3">
                      <div><Label className="text-primary-foreground/80 text-[10px] md:text-xs uppercase tracking-wider">N° volo</Label><Input required placeholder="FR4321" className="mt-1 bg-primary-foreground/10 border-primary-foreground/15 text-primary-foreground placeholder:text-primary-foreground/30 rounded-xl text-sm" /></div>
                      <div><Label className="text-primary-foreground/80 text-[10px] md:text-xs uppercase tracking-wider">Città di arrivo</Label><Input required placeholder="Milano Malpensa" className="mt-1 bg-primary-foreground/10 border-primary-foreground/15 text-primary-foreground placeholder:text-primary-foreground/30 rounded-xl text-sm" /></div>
                      <div><Label className="text-primary-foreground/80 text-[10px] md:text-xs uppercase tracking-wider">Data</Label><SeasonDatePicker value={flightReturnDate} onChange={setFlightReturnDate} placeholder="Seleziona data" /></div>
                      <div><Label className="text-primary-foreground/80 text-[10px] md:text-xs uppercase tracking-wider">Ora</Label><Input type="time" required className="mt-1 bg-primary-foreground/10 border-primary-foreground/15 text-primary-foreground rounded-xl text-sm" /></div>
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl bg-primary-foreground/10 backdrop-blur-md border border-primary-foreground/15 p-4 md:p-6 space-y-3 md:space-y-4">
                  <h3 className="text-sm md:text-lg font-semibold flex items-center gap-2 text-primary-foreground"><MapPin className="h-4 w-4 md:h-5 md:w-5 text-accent" /> Punto di Ritiro</h3>
                  <div className="flex flex-wrap gap-2 md:gap-3">
                    {["Aeroporto", "Porto", "Altro"].map((opt) => (
                      <button key={opt} type="button" onClick={() => setPickupPoint(opt)} className={`px-4 md:px-6 py-2 md:py-3 rounded-full text-xs md:text-sm font-medium transition-all ${pickupPoint === opt ? "bg-accent text-accent-foreground shadow-lg shadow-accent/30" : "bg-primary-foreground/10 text-primary-foreground/70 hover:bg-primary-foreground/20 border border-primary-foreground/15"}`}>{opt}</button>
                    ))}
                  </div>
                </div>
                <Button type="submit" size="lg" className="w-full rounded-full bg-primary-foreground text-primary py-5 md:py-6 text-sm md:text-base font-semibold hover:bg-primary-foreground/90 shadow-xl" disabled={!hasLicense || !pickupPoint}>
                  <CheckCircle2 className="mr-2 h-4 w-4 md:h-5 md:w-5" /> Invia Richiesta Preventivo
                </Button>
              </form>
            </motion.div>
          </div>
        </section>
      )}
    </Layout>
  );
};

export default Rentals;
