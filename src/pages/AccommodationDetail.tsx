import { useState, useRef, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useVillaBySlug, useApartmentBySlug } from "@/hooks/useSupabaseData";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import {
  Users, Waves, Wifi, Car, Tv, Wind, UtensilsCrossed, Shirt, Sofa,
  MapPin, BedDouble, Bath, ArrowLeft, ChevronLeft, ChevronRight, X, Star, Sparkles,
  Plane, Navigation, ShowerHead, HandPlatter, Bike, CalendarIcon, Send, Minus, Plus,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/layout/Layout";
import heroImg1 from "@/assets/hero-mykonos-1.jpg";
import heroImg2 from "@/assets/hero-mykonos-2.jpg";
import heroImg3 from "@/assets/hero-mykonos-3.jpg";
import amaris1 from "@/assets/villas/amaris-1.jpg";
import amaris2 from "@/assets/villas/amaris-2.webp";
import amaris3 from "@/assets/villas/amaris-3.webp";
import amaris4 from "@/assets/villas/amaris-4.webp";
import amaris5 from "@/assets/villas/amaris-5.webp";
import amaris6 from "@/assets/villas/amaris-6.jpg";
import amaris7 from "@/assets/villas/amaris-7.jpg";
import amaris8 from "@/assets/villas/amaris-8.webp";
import amaris9 from "@/assets/villas/amaris-9.webp";
import amaris10 from "@/assets/villas/amaris-10.jpg";
import alextown1 from "@/assets/apartments/alextown-1.jpg";
import alextown2 from "@/assets/apartments/alextown-2.jpg";
import alextown3 from "@/assets/apartments/alextown-3.jpg";
import alextown4 from "@/assets/apartments/alextown-4.png";
import alextown5 from "@/assets/apartments/alextown-5.jpg";
import alextown6 from "@/assets/apartments/alextown-6.jpg";
import alextown7 from "@/assets/apartments/alextown-7.png";
import alextown8 from "@/assets/apartments/alextown-8.png";
import alextown9 from "@/assets/apartments/alextown-9.jpg";
import alextown10 from "@/assets/apartments/alextown-10.png";

// Card images for villas
import cardAmarisMain from "@/assets/villas/amaris-main.webp";
import cardZoraVillas2 from "@/assets/villas/zora-villas-2.jpg";
import cardZoraVillas3 from "@/assets/villas/zora-villas-3.jpg";
import cardZoraVillas1 from "@/assets/villas/zora-villas-1.jpg";
import cardWhiterock from "@/assets/villas/whiterock-kanalia.jpg";
import cardChatzis3 from "@/assets/villas/chatzis3-card.png";
import cardAdoreKanalia from "@/assets/villas/adore-kanalia.jpg";
import cardAdore2 from "@/assets/villas/adore-2.jpg";
import cardMegaAdore3 from "@/assets/villas/mega-adore-3.jpg";
import cardChatzis1 from "@/assets/villas/chatzis-1.png";
import cardChatzis2 from "@/assets/villas/chatzis-2.png";
import cardSophie from "@/assets/villas/sophie.png";
import cardMoments from "@/assets/villas/villa-of-moments.png";
import cardOrus from "@/assets/villas/orus.png";
import cardYza from "@/assets/villas/yza.png";
import cardDimitra from "@/assets/villas/dimitra.png";
import cardNuvola from "@/assets/villas/nuvola.png";
import cardArkhos from "@/assets/villas/arkhos.png";
import cardDana from "@/assets/villas/dana.png";
import cardAnes from "@/assets/villas/anes.png";

// Card images for apartments
import cardWindyStudios1 from "@/assets/apartments/cards/windy-studios-1.png";
import cardWindyUpStudios from "@/assets/apartments/cards/windy-up-studios.png";
import cardSunsetApartments from "@/assets/apartments/cards/sunset-apartments.png";
import cardSophiasResidence from "@/assets/apartments/cards/sophias-residence.png";
import cardOchoDowntown from "@/assets/apartments/cards/ocho-downtown.png";
import cardMykonosOcho from "@/assets/apartments/cards/mykonos-ocho.png";
import cardMiriamTown from "@/assets/apartments/cards/miriam-town.png";
import cardIzaDowntown from "@/assets/apartments/cards/iza-downtown.png";
import cardMilenaMaisonette from "@/assets/apartments/cards/milena-maisonette.png";
import cardLunaBlu from "@/assets/apartments/cards/luna-blu.png";
import cardIzasResidence from "@/assets/apartments/cards/izas-residence.png";
import cardIsabelStudios from "@/assets/apartments/cards/isabel-studios.png";
import cardHylasDowntown from "@/assets/apartments/cards/hylas-downtown.png";
import cardEiriniResort from "@/assets/apartments/cards/eirini-resort.png";
import cardDimeTown from "@/assets/apartments/cards/dime-town.png";
import cardBeautySuites from "@/assets/apartments/cards/beauty-suites.png";
import cardAnthosResort from "@/assets/apartments/cards/anthos-resort.png";
import cardAnielApartments from "@/assets/apartments/cards/aniel-apartments.png";
import cardAnamisMaisonette from "@/assets/apartments/cards/anamis-maisonette.png";
import cardAlexTown from "@/assets/apartments/cards/alex-town.png";
import cardAlexisResidence from "@/assets/apartments/cards/alexis-residence.png";
import cardAgiosLazarosStudios from "@/assets/apartments/cards/agios-lazaros-studios.png";

// Map property IDs to their card/hero images
const cardHeroImages: Record<string, string> = {
  amaris: cardAmarisMain,
  zora2: cardZoraVillas2,
  zora3: cardZoraVillas3,
  zora1: cardZoraVillas1,
  whiterock: cardWhiterock,
  chatzis3: cardChatzis3,
  adorekan: cardAdoreKanalia,
  adore2: cardAdore2,
  megaadore: cardMegaAdore3,
  chatzis1: cardChatzis1,
  chatzis2: cardChatzis2,
  sophie: cardSophie,
  moments: cardMoments,
  orus: cardOrus,
  yza: cardYza,
  dimitra: cardDimitra,
  nuvola: cardNuvola,
  arkhos: cardArkhos,
  dana: cardDana,
  anes: cardAnes,
  windy1: cardWindyStudios1,
  windyup: cardWindyUpStudios,
  sunset: cardSunsetApartments,
  sophia: cardSophiasResidence,
  ocho: cardOchoDowntown,
  mykocho: cardMykonosOcho,
  miriam: cardMiriamTown,
  iza: cardIzaDowntown,
  milena: cardMilenaMaisonette,
  lunablu: cardLunaBlu,
  izares: cardIzasResidence,
  isabel: cardIsabelStudios,
  hylas: cardHylasDowntown,
  eirini: cardEiriniResort,
  dime: cardDimeTown,
  beauty: cardBeautySuites,
  anthos: cardAnthosResort,
  aniel: cardAnielApartments,
  anamis: cardAnamisMaisonette,
  alextown: cardAlexTown,
  alexis: cardAlexisResidence,
  agiosstudios: cardAgiosLazarosStudios,
};

const amenityIcons: Record<string, { icon: typeof Wifi; label: string; desc: string }> = {
  beds: { icon: BedDouble, label: "Letti matrimoniali o singoli", desc: "Configurazione flessibile per ogni esigenza" },
  bathroom: { icon: ShowerHead, label: "Bagno privato con doccia", desc: "Ogni camera con bagno privato e doccia" },
  wifi: { icon: Wifi, label: "WiFi gratuito", desc: "Connessione ad alta velocità in tutta la villa" },
  ac: { icon: Wind, label: "Aria condizionata", desc: "Climatizzazione in ogni ambiente" },
  parking: { icon: Car, label: "Parcheggio privato", desc: "Posto auto riservato e custodito" },
  pool: { icon: Waves, label: "Piscina privata", desc: "Grande piscina con illuminazione notturna" },
  kitchen: { icon: UtensilsCrossed, label: "Cucina attrezzata", desc: "Cucina completa con elettrodomestici moderni" },
  hairdryer: { icon: Wind, label: "Asciugacapelli", desc: "Disponibile in ogni bagno" },
  laundry: { icon: Shirt, label: "Pulizie e cambio biancheria", desc: "Servizio pulizie e biancheria incluso" },
  concierge: { icon: HandPlatter, label: "Servizio concierge H24", desc: "Assistenza dedicata disponibile 24 ore su 24" },
  rental: { icon: Bike, label: "Servizio noleggio", desc: "Noleggio scooter, quad e auto direttamente in villa" },
  livingarea: { icon: Sofa, label: "Area soggiorno", desc: "Spazio living confortevole e luminoso" },
};

const propertiesData: Record<string, {
  name: string;
  zone: string;
  capacity: number;
  bedrooms: number;
  bathrooms: number;
  tagline: string;
  description: string;
  highlights: string[];
  amenities: string[];
  images: string[];
  distances?: { label: string; time: string }[];
}> = {
  // ====== VILLAS ======
  "amaris": {
    name: "Villa Amaris",
    zone: "Kanalia",
    capacity: 11,
    bedrooms: 6,
    bathrooms: 6,
    tagline: "Eleganza cicladica e piscina privata nella quiete di Kanalia",
    description: "Villa Amaris sorge nella tranquilla e prestigiosa zona di Kanalia, una delle aree più esclusive di Mykonos. Residenza di charme che accoglie fino a 12 ospiti, unisce architettura cicladica in pietra e calce bianca a interni dal design contemporaneo, impreziositi da materiali naturali e dettagli artigianali. La grande piscina privata, circondata da un solarium in pietra, rappresenta il cuore della villa, perfetta per momenti di relax immersi nel panorama dell'isola.",
    highlights: ["Servizio concierge H24", "Servizio noleggio", "Zona tranquilla e riservata", "Architettura cicladica autentica"],
    amenities: ["beds", "bathroom", "wifi", "ac", "parking", "pool", "kitchen", "hairdryer", "laundry", "concierge", "rental"],
    images: [amaris1, amaris8, amaris7, amaris2, amaris3, amaris6, amaris5, amaris9, amaris4, amaris10],
    distances: [
      { label: "Aeroporto", time: "10 min" },
      { label: "Mykonos Town", time: "12 min" },
      { label: "Tropicana & SantAnna", time: "17 min" },
    ],
  },
  "zora2": {
    name: "Zora Villas 2",
    zone: "Agios Lazaros",
    capacity: 10,
    bedrooms: 5,
    bathrooms: 4,
    tagline: "Un equilibrio perfetto tra design e\npanorama ad Agios Lazaros",
    description: "Zora Villa 2 è una soluzione intermedia del complesso, perfetta per gruppi che desiderano indipendenza mantenendo la vicinanza alle altre unità. Con 5 camere da letto e 4 bagni, può accogliere fino a 10 ospiti in ambienti funzionali e ben distribuiti. La piscina privata e le terrazze esterne permettono di vivere momenti di relax in un contesto conviviale, a breve distanza dalle spiagge e dai beach club più rinomati dell'isola.",
    highlights: ["Servizio concierge H24", "Servizio noleggio", "Ideale gruppi medi o famiglie", "Vista mare"],
    amenities: ["wifi", "parking", "ac", "kitchen", "laundry", "pool", "concierge", "rental"],
    images: [heroImg1, heroImg2, heroImg3],
    distances: [
      { label: "Mykonos Town", time: "8 min" },
    ],
  },
  "zora3": {
    name: "Zora Villas 3",
    zone: "Agios Lazaros",
    capacity: 6,
    bedrooms: 3,
    bathrooms: 2,
    tagline: "Un equilibrio perfetto tra design e\npanorama ad Agios Lazaros",
    description: "Zora Villa 3 rappresenta la soluzione più raccolta del complesso, ideale per piccoli gruppi o famiglie. Dispone di 3 camere da letto e 2 bagni, con una capacità massima di 6 ospiti. La villa offre piscina privata, ambienti climatizzati e spazi esterni funzionali, garantendo comfort e praticità in una delle zone più richieste di Mykonos.",
    highlights: ["Servizio concierge H24", "Servizio noleggio", "Ideale per piccoli gruppi o famiglie", "Vista mare"],
    amenities: ["wifi", "parking", "ac", "kitchen", "laundry", "pool", "concierge", "rental"],
    images: [heroImg1, heroImg2, heroImg3],
    distances: [
      { label: "Mykonos Town", time: "8 min" },
    ],
  },
  "zora1": {
    name: "Zora Villas 1",
    zone: "Agios Lazaros",
    capacity: 16,
    bedrooms: 8,
    bathrooms: 7,
    tagline: "Un equilibrio perfetto tra design e\npanorama ad Agios Lazaros",
    description: "Zora Villa 1 si trova nella rinomata zona di Agios Lazaros ed è la più ampia tra le tre unità del complesso. Con 8 camere da letto e 7 bagni, può ospitare fino a 16 persone, risultando ideale per gruppi numerosi o famiglie che desiderano condividere l'esperienza di Mykonos in un'unica residenza. La villa dispone di piscina privata, terrazze vivibili e ambienti climatizzati, con spazi pensati per garantire comfort e convivialità in un contesto dinamico e panoramico.",
    highlights: ["Servizio concierge H24", "Servizio noleggio", "Ideale per gruppi numerosi", "Vista mare"],
    amenities: ["wifi", "parking", "ac", "kitchen", "laundry", "pool", "concierge", "rental"],
    images: [heroImg1, heroImg2, heroImg3],
    distances: [
      { label: "Mykonos Town", time: "8 min" },
    ],
  },
  "whiterock": {
    name: "Villa Whiterock Kanalia",
    zone: "Kanalia",
    capacity: 12,
    bedrooms: 6,
    bathrooms: 3,
    tagline: "Eleganza cicladica e piscina privata nella quiete di Kanalia",
    description: "Villa Whiterock Kanalia è una residenza panoramica situata nella zona di Kanalia, in posizione strategica per raggiungere Mykonos Town pur mantenendo privacy e tranquillità. La proprietà si distingue per gli spazi ampi e luminosi, pensati per accogliere gruppi o famiglie in un contesto confortevole e funzionale. Con sei camere da letto e tre bagni, ambienti climatizzati e una cucina completamente attrezzata, la villa offre tutto il necessario per un soggiorno in totale autonomia. All'esterno, la piscina privata con area bar e l'ampia terrazza vista mare creano l'ambiente ideale per condividere momenti di relax e convivialità, immersi nel panorama dell'isola.",
    highlights: ["Servizio concierge H24", "Servizio noleggio", "Piscina privata con area bar", "Vista mare"],
    amenities: ["wifi", "parking", "ac", "kitchen", "laundry", "pool", "concierge", "rental"],
    images: [heroImg1, heroImg2, heroImg3],
    distances: [
      { label: "Mykonos Town", time: "12 min" },
    ],
  },
  "chatzis3": {
    name: "Villa Chatzis 3",
    zone: "Agios Ioannis - Kanalia",
    capacity: 5,
    bedrooms: 2,
    bathrooms: 2,
    tagline: "Eleganza cicladica e piscina privata nella quiete di Agios Ioannis Diakoftis – Kanalia",
    description: "Villa Chatzis 3 è una residenza elegante pensata per chi desidera vivere Mykonos in un ambiente riservato e confortevole. Gli spazi esterni, tra patio arredato, giardino curato e terrazza, creano un'atmosfera intima ideale per rilassarsi in totale privacy, mentre la piscina privata diventa il cuore della proprietà. Gli interni, completamente climatizzati, comprendono due camere da letto, due bagni dal design contemporaneo, un ampio soggiorno luminoso e una cucina moderna completamente attrezzata. Una soluzione raffinata e funzionale, perfetta per coppie o piccoli gruppi che cercano comfort e tranquillità sull'isola.",
    highlights: ["Servizio concierge H24", "Servizio noleggio", "Giardino con area barbecue", "Terrazza solarium"],
    amenities: ["wifi", "parking", "ac", "kitchen", "laundry", "pool", "concierge", "rental"],
    images: [heroImg1, heroImg2, heroImg3],
    distances: [
      { label: "Mykonos Town", time: "12 min" },
    ],
  },
  "adorekan": {
    name: "Villa Adoré Kanalia",
    zone: "Kanalia - Ornos",
    capacity: 6,
    bedrooms: 2,
    bathrooms: 3,
    tagline: "Privacy e comodità nella zona Kanalia - Ornos",
    description: "Villa Adoré Kanalia è una residenza di circa 100 mq situata nella panoramica zona di Kanalia – Ornos, con splendide viste sul Mar Egeo. Pensata per offrire un soggiorno riservato e confortevole, unisce ambienti luminosi a uno stile essenziale e curato. La villa dispone di due camere matrimoniali con bagno en suite, una zona living accogliente e una cucina completamente attrezzata, ideali per vivere l'isola in totale autonomia. Gli spazi esterni, tra terrazze panoramiche e salotti all'aperto, valorizzano il panorama, mentre la mini piscina privata con jacuzzi aggiunge un tocco dedicato al relax, rendendo la proprietà perfetta per un soggiorno intimo e suggestivo a Mykonos.",
    highlights: ["Servizio concierge H24", "Servizio noleggio", "Vasca idromassaggio/jacuzzi", "Terrazze attrezzate con salotti outdoor"],
    amenities: ["wifi", "parking", "ac", "kitchen", "laundry", "pool", "concierge", "rental"],
    images: [heroImg1, heroImg2, heroImg3],
    distances: [
      { label: "Mykonos Town", time: "12 min" },
    ],
  },
  "adore2": {
    name: "Villa Adoré 2",
    zone: "Kanalia - Ornos",
    capacity: 10,
    bedrooms: 3,
    bathrooms: 4,
    tagline: "Privacy e comodità nella zona Kanalia - Ornos",
    description: "Villa Adoré 2 è una residenza panoramica affacciata su Mykonos Town, ideale per chi desidera un soggiorno tranquillo con vista aperta sulla città. Gli spazi esterni, tra terrazze e balconi, permettono di vivere appieno l'atmosfera dell'isola, mentre la piscina privata offre un ambiente riservato dedicato al relax. All'interno, la villa dispone di tre camere da letto e quattro bagni, ambienti climatizzati e una zona living luminosa affiancata da una cucina completamente attrezzata con elettrodomestici moderni. Una soluzione pratica ed elegante, perfetta per piccoli gruppi che cercano comfort e una posizione panoramica a Mykonos.",
    highlights: ["Servizio concierge H24", "Servizio noleggio", "Terrazza solarium", "Vista panoramica sulla città"],
    amenities: ["wifi", "parking", "ac", "kitchen", "laundry", "pool", "concierge", "rental"],
    images: [heroImg1, heroImg2, heroImg3],
    distances: [
      { label: "Mykonos Town", time: "12 min" },
    ],
  },
  "megaadore": {
    name: "Villa Mega Adoré 3",
    zone: "Kanalia - Ornos",
    capacity: 16,
    bedrooms: 5,
    bathrooms: 7,
    tagline: "Privacy e comodità nella zona Kanalia - Ornos",
    description: "Villa Mega Adoré 3 si trova in posizione panoramica con vista su Mykonos Town. Nella zona di Ornos, offre un contesto riservato e piacevolmente spazioso. Gli ambienti, luminosi e ben distribuiti, uniscono comfort e funzionalità in uno stile contemporaneo essenziale. La proprietà dispone di cinque camere da letto e sette bagni, oltre a una zona living accogliente e a una cucina completamente attrezzata con elettrodomestici moderni. All'esterno, la piscina privata rappresenta lo spazio ideale per rilassarsi e godere del panorama, rendendo la villa perfetta per gruppi che desiderano vivere Mykonos in totale comodità.",
    highlights: ["Servizio concierge H24", "Servizio noleggio", "Eleganza cicladica tra calce bianca e pietra locale", "Vista panoramica sulla città"],
    amenities: ["wifi", "parking", "ac", "kitchen", "laundry", "pool", "concierge", "rental"],
    images: [heroImg1, heroImg2, heroImg3],
    distances: [
      { label: "Mykonos Town", time: "12 min" },
    ],
  },
  "chatzis1": {
    name: "Villa Chatzis 1",
    zone: "Agios Ioannis - Kanalia",
    capacity: 8,
    bedrooms: 4,
    bathrooms: 3,
    tagline: "Eleganza cicladica e piscina privata nella quiete di Agios Ioannis Diakoftis – Kanalia",
    description: "Villa Chatzis I è una residenza luminosa ed elegante, ideale per vivere Mykonos in un'atmosfera rilassata ma ricercata. La proprietà dispone di piscina privata all'aperto, adiacente a quella di Villa Chatzis II, e di spazi esterni curati che invitano a momenti di quiete e convivialità. Gli interni climatizzati accolgono una zona living raffinata con balcone o terrazza vista città e una cucina completamente attrezzata, pensata per garantire autonomia e comfort. Le camere, tra cui una soluzione con letto a castello e una matrimoniale open space, rendono la villa perfetta per coppie o piccoli gruppi che desiderano un soggiorno intimo con un tocco esclusivo.",
    highlights: ["Servizio concierge H24", "Servizio noleggio", "Piscina privata adiacente a Villa Chatzis II", "Architettura cicladica autentica"],
    amenities: ["wifi", "parking", "ac", "kitchen", "laundry", "pool", "concierge", "rental"],
    images: [heroImg1, heroImg2, heroImg3],
    distances: [
      { label: "Mykonos Town", time: "12 min" },
    ],
  },
  "chatzis2": {
    name: "Villa Chatzis 2",
    zone: "Agios Ioannis - Kanalia",
    capacity: 11,
    bedrooms: 4,
    bathrooms: 3,
    tagline: "Eleganza cicladica e piscina privata nella quiete di Agios Ioannis Diakoftis – Kanalia",
    description: "Villa Chatzis II si distingue per il suo stile contemporaneo e per la posizione panoramica con vista sulla città, ideale per chi cerca maggiore indipendenza e spazi ben definiti. La proprietà offre una piscina privata affiancata a quella di Villa Chatzis I, oltre a terrazze e balconi che valorizzano la luce naturale e l'apertura verso l'esterno. Con quattro camere da letto e tre bagni, ambienti climatizzati e una cucina completamente attrezzata, la villa garantisce funzionalità e comfort in un contesto elegante e riservato. Una soluzione perfetta per gruppi che desiderano vivere Mykonos con stile, in un'atmosfera più strutturata e raffinata.",
    highlights: ["Servizio concierge H24", "Servizio noleggio", "Piscina privata adiacente a Villa Chatzis I", "Architettura cicladica autentica"],
    amenities: ["wifi", "parking", "ac", "kitchen", "laundry", "pool", "concierge", "rental"],
    images: [heroImg1, heroImg2, heroImg3],
    distances: [
      { label: "Mykonos Town", time: "12 min" },
    ],
  },
  "sophie": {
    name: "Villa Sophie",
    zone: "Glatros",
    capacity: 4,
    bedrooms: 2,
    bathrooms: 2,
    tagline: "Atmosfera riservata nel cuore di Glastros",
    description: "Villa Sophie sorge a Glastros, in una posizione riservata ma comoda per raggiungere Mykonos Town, offrendo il giusto equilibrio tra tranquillità e vivacità dell'isola. Ideale per un massimo di quattro ospiti, dispone di due camere da letto e due bagni, con ambienti armoniosi e ben organizzati. La proprietà vanta una piscina privata per momenti di totale relax, oltre all'accesso a una piscina condivisa con bar, perfetta per godere di un'atmosfera più dinamica. Una scelta perfetta per chi cerca un rifugio intimo a pochi minuti dal cuore pulsante di Mykonos.",
    highlights: ["Servizio concierge H24", "Servizio noleggio", "Posizione tranquilla e riservata", "Vicina al centro"],
    amenities: ["wifi", "parking", "ac", "kitchen", "pool", "concierge", "rental"],
    images: [heroImg1, heroImg2, heroImg3],
  },
  "moments": {
    name: "Villa of Moments",
    zone: "Ornos",
    capacity: 8,
    bedrooms: 4,
    bathrooms: 5,
    tagline: "Privacy e comodità nel cuore di Ornos",
    description: "Villa of Moments si trova nella vivace zona di Ornos e gode di una splendida vista sulla città, combinando tranquillità e vicinanza ai principali punti d'interesse dell'isola. La proprietà dispone di quattro camere da letto e cinque bagni, ambienti climatizzati e un'ampia zona living affiancata da una cucina completamente attrezzata, pensata per garantire autonomia e comfort. Piscina stagionale e terrazza panoramica completano l'esperienza, offrendo uno scenario perfetto per rilassarsi dopo una giornata tra mare, beach club e Mykonos Town, facilmente raggiungibile insieme ai celebri Mulini a Vento e a Little Venice.",
    highlights: ["Servizio concierge H24", "Servizio noleggio", "Relax e privacy a pochi minuti dal centro", "Vista panoramica sulla città"],
    amenities: ["wifi", "parking", "ac", "kitchen", "laundry", "pool", "concierge", "rental"],
    images: [heroImg1, heroImg2, heroImg3],
  },
  "orus": {
    name: "Villa Orus",
    zone: "Kanalia",
    capacity: 10,
    bedrooms: 5,
    bathrooms: 5,
    tagline: "Eleganza cicladica e piscina privata nella quiete di Kanalia",
    description: "Villa Orus si trova nella zona di Kanalia e si distingue per la sua posizione panoramica e l'atmosfera riservata, ideale per chi desidera privacy e comfort in un contesto esclusivo. La proprietà offre cinque camere da letto e cinque bagni, ambienti climatizzati e una cucina completamente attrezzata che si integra armoniosamente con la zona pranzo e gli spazi living. All'esterno, piscina privata, giardino curato e patio vista mare creano un equilibrio perfetto tra convivialità e relax, rendendo questa residenza la soluzione ideale per famiglie o gruppi in cerca di un soggiorno raffinato sull'isola.",
    highlights: ["Servizio concierge H24", "Servizio noleggio", "Terrazza panoramica", "Vista mare"],
    amenities: ["wifi", "parking", "ac", "kitchen", "laundry", "pool", "concierge", "rental"],
    images: [heroImg1, heroImg2, heroImg3],
  },
  "yza": {
    name: "Villa Yza",
    zone: "Agios Lazaros",
    capacity: 14,
    bedrooms: 6,
    bathrooms: 6,
    tagline: "Un equilibrio perfetto tra design e\npanorama ad Agios Lazaros",
    description: "Villa Yza si trova nell'esclusiva cornice di Agios Lazaros, una delle zone più ambite di Mykonos, rinomata per privacy e panorami aperti sul mare. La residenza offre ambienti eleganti e ben distribuiti, con cucina completamente attrezzata e spazi pensati per garantire comfort e indipendenza durante il soggiorno. All'esterno, la piscina privata diventa il fulcro della proprietà, mentre la jacuzzi, disponibile su richiesta, regala un'esperienza di benessere aggiuntiva. La posizione strategica consente di raggiungere facilmente spiagge iconiche, beach club rinomati, Mykonos Town e l'aeroporto, rendendola una scelta ideale per chi desidera vivere l'isola con stile e discrezione.",
    highlights: ["Servizio concierge H24", "Servizio noleggio", "Location privilegiata vicino alle spiagge più iconiche", "Ambienti eleganti e curati nei dettagli"],
    amenities: ["wifi", "parking", "ac", "kitchen", "laundry", "pool", "concierge", "rental"],
    images: [heroImg1, heroImg2, heroImg3],
  },
  "dimitra": {
    name: "Villa Dimitra",
    zone: "Plintri",
    capacity: 16,
    bedrooms: 8,
    bathrooms: 8,
    tagline: "Charme cicladico e posizione strategica nella zona di Plintri",
    description: "Villa Dimitra si distingue come una dimora di charme nella zona di Plintri, ideale per gruppi numerosi in cerca di spazio e riservatezza. Otto camere da letto e otto bagni garantiscono massima comodità, mentre gli ambienti climatizzati e la cucina completamente attrezzata assicurano funzionalità e autonomia durante il soggiorno. All'esterno, la piscina privata e le terrazze panoramiche affacciate sulla città diventano il palcoscenico perfetto per serate al tramonto; la jacuzzi completa l'esperienza con un tocco esclusivo dedicato al benessere e al relax.",
    highlights: ["Servizio concierge H24", "Servizio noleggio", "Ideale per grandi gruppi", "Vista panoramica sulla città"],
    amenities: ["wifi", "parking", "ac", "kitchen", "laundry", "pool", "concierge", "rental"],
    images: [heroImg1, heroImg2, heroImg3],
  },
  "nuvola": {
    name: "Villa Nuvola",
    zone: "Kanalia",
    capacity: 9,
    bedrooms: 4,
    bathrooms: 5,
    tagline: "Eleganza cicladica e piscina privata nella quiete di Kanalia",
    description: "Villa Nuvola sorge nella prestigiosa zona di Kanalia, una delle aree più riservate e panoramiche di Mykonos, con una vista mare aperta che regala scenari suggestivi dall'alba al tramonto. Le quattro camere da letto e i cinque bagni moderni garantiscono comfort e privacy, mentre gli interni climatizzati e la cucina completamente attrezzata uniscono funzionalità ed eleganza. La piscina privata e la terrazza affacciata sull'orizzonte creano un'atmosfera intima e sofisticata, perfetta per vivere l'isola tra relax, luce e silenzio.",
    highlights: ["Servizio concierge H24", "Servizio noleggio", "Architettura moderna ed elegante", "Vista mare"],
    amenities: ["wifi", "parking", "ac", "kitchen", "laundry", "pool", "concierge", "rental"],
    images: [heroImg1, heroImg2, heroImg3],
  },
  "arkhos": {
    name: "Villa Arkhos",
    zone: "Agios Ioannis",
    capacity: 8,
    bedrooms: 3,
    bathrooms: 3,
    tagline: "Nella suggestiva cornice di Agios Ioannis, tra mare cristallino e tramonti iconici",
    description: "Villa Arkhos è un'esclusiva dimora fronte mare ad Agios Ioannis, dove il privilegio della spiaggia si fonde con un'eleganza essenziale e contemporanea. La villa accoglie gli ospiti in tre camere da letto con tre bagni dotati di vasca idromassaggio, ambienti luminosi e una cucina completamente attrezzata pensata per vivere la casa in totale autonomia. Piscina privata, giardino e terrazze affacciate sul mare creano un'esperienza intima e sofisticata, perfetta per chi desidera Mykonos in prima linea sull'Egeo.",
    highlights: ["Servizio concierge H24", "Servizio noleggio", "Posizione esclusiva tra comfort e privacy", "Villa fronte mare"],
    amenities: ["wifi", "parking", "ac", "kitchen", "laundry", "pool", "concierge", "rental"],
    images: [heroImg1, heroImg2, heroImg3],
  },
  "dana": {
    name: "Villa Dana",
    zone: "Kanalia",
    capacity: 9,
    bedrooms: 4,
    bathrooms: 5,
    tagline: "Eleganza cicladica e piscina privata nella quiete di Kanalia",
    description: "Villa Dana sorge nella tranquilla zona di Kanalia, a breve distanza da Ornos, e regala una splendida vista sul mare in un contesto riservato ed elegante. La villa dispone di quattro camere da letto e cinque bagni, ampi spazi living e una cucina attrezzata, offrendo comfort e funzionalità in un'atmosfera raffinata. Gli spazi outdoor, con piscina, terrazza attrezzata e area barbecue, sono pensati per vivere appieno la bellezza del panorama, tra cene al tramonto e momenti di autentico relax.",
    highlights: ["Servizio concierge H24", "Servizio noleggio", "Terrazza con area barbecue", "Vista mare"],
    amenities: ["wifi", "parking", "ac", "kitchen", "laundry", "pool", "concierge", "rental"],
    images: [heroImg1, heroImg2, heroImg3],
  },
  "anes": {
    name: "Villa Anes",
    zone: "Kanalia",
    capacity: 8,
    bedrooms: 4,
    bathrooms: 4,
    tagline: "Eleganza cicladica con piscina privata nella quiete di Kanalia",
    description: "Villa Anes è un'elegante residenza nella zona di Kanalia con piscina privata e splendida vista sul mare. La villa dispone di quattro camere da letto e quattro bagni, oltre a un ampio living e una cucina completamente attrezzata, offrendo ambienti raffinati e confortevoli. La terrazza panoramica e gli spazi esterni curati completano l'esperienza, per un soggiorno esclusivo all'insegna del relax e della bellezza dell'Egeo.",
    highlights: ["Servizio concierge H24", "Servizio noleggio", "Location esclusiva e riservata", "Vista mare"],
    amenities: ["wifi", "parking", "ac", "kitchen", "laundry", "pool", "concierge", "rental"],
    images: [heroImg1, heroImg2, heroImg3],
  },

  // ====== APARTMENTS ======
  "alextown": {
    name: "Alex Town",
    zone: "Mykonos Town",
    capacity: 6,
    bedrooms: 1,
    bathrooms: 1,
    tagline: "Nel cuore pulsante dell'isola",
    description: "Per chi desidera soggiornare nel pieno centro di Mykonos Town con amici o famiglia, questo appartamento climatizzato rappresenta una scelta ideale. La struttura offre WiFi gratuito e una terrazza comune dove rilassarsi dopo una giornata tra cultura, mare e vita notturna. L'alloggio è dotato di balcone con vista sulla città, zona salotto accogliente, TV a schermo piatto, cucina completamente attrezzata e bagno privato completo di comfort. Perfetto per vivere Mykonos a piedi, tra ristoranti, boutique e scorci caratteristici.",
    highlights: ["Servizio concierge H24", "Servizio noleggio", "Ideale per gruppi numerosi o famiglie", "Tutto a pochi passi"],
    amenities: ["wifi", "ac", "kitchen", "laundry", "concierge", "rental"],
    images: [alextown1, alextown2, alextown3, alextown4, alextown5, alextown6, alextown7, alextown8, alextown9, alextown10],
    distances: [
      { label: "Aeroporto", time: "3 km" },
      { label: "Mykonos Town", time: "100 metri" },
    ],
  },
  "windy1": {
    name: "Windy Studios 1",
    zone: "Glastros",
    capacity: 8,
    bedrooms: 1,
    bathrooms: 2,
    tagline: "Atmosfera riservata nel cuore di Glastros",
    description: "La tipologia per otto ospiti è la soluzione più ampia proposta da Windy Studios 1, pensata per gruppi numerosi che desiderano condividere l'esperienza dell'isola in un ambiente comodo e funzionale. Gli spazi consentono di vivere momenti conviviali, mantenendo al tempo stesso praticità e organizzazione. La posizione a Glastros garantisce un equilibrio ideale tra tranquillità e accesso alle principali zone di Mykonos. A soli 150 metri, la piscina con bar completa l'offerta, rendendo il soggiorno dinamico e piacevole, perfetto per chi cerca libertà, semplicità e comodità.",
    highlights: ["Servizio concierge H24", "Servizio noleggio", "Ideale per gruppi numerosi", "Piscina con bar a soli 150 metri"],
    amenities: ["wifi", "ac", "kitchen", "concierge", "rental"],
    images: [heroImg1, heroImg2, heroImg3],
  },
  "windyup": {
    name: "Windy UP Studios",
    zone: "Glastros",
    capacity: 5,
    bedrooms: 1,
    bathrooms: 2,
    tagline: "Atmosfera riservata nel cuore di Glastros",
    description: "La soluzione per cinque ospiti è ideale per gruppi che desiderano condividere l'esperienza di Mykonos in un ambiente conviviale e ben posizionato all'interno del complesso. L'alloggio è dotato di letti matrimoniali o singoli, bagno privato con doccia e asciugacapelli, aria condizionata e WiFi gratuito, offrendo comfort essenziali per tutta la durata del soggiorno. La cucina attrezzata permette di gestire in autonomia i pasti, mentre il servizio di pulizie e cambio biancheria garantisce ordine e praticità. La vicinanza alla piscina comune e la disponibilità di parcheggio privato completano l'offerta, rendendo Windy UP Studios una scelta funzionale e strategica per gruppi dinamici.",
    highlights: ["Servizio concierge H24", "Servizio noleggio", "Ideale per gruppi numerosi", "Posizione comoda e strategica"],
    amenities: ["wifi", "ac", "kitchen", "laundry", "parking", "concierge", "rental"],
    images: [heroImg1, heroImg2, heroImg3],
  },
  "sunset": {
    name: "Sunset Apartments",
    zone: "Mykonos Town",
    capacity: 6,
    bedrooms: 2,
    bathrooms: 1,
    tagline: "Nel cuore pulsante dell'isola",
    description: "La soluzione per sei ospiti è ideale per famiglie numerose o gruppi di amici che desiderano condividere l'esperienza di Mykonos in un ambiente spazioso, funzionale e ben collegato al centro. Situati a soli 800 metri da Mykonos Town, i Sunset Apartments permettono di raggiungere facilmente il cuore dell'isola, mantenendo al tempo stesso un'atmosfera più tranquilla e rilassata. L'appartamento dispone di cucina attrezzata, bagno privato, frigorifero, aria condizionata e connessione Wi-Fi, offrendo autonomia e comfort durante tutto il soggiorno.",
    highlights: ["Servizio concierge H24", "Servizio noleggio", "A soli 800 metri da Mykonos Town", "Posizione comoda e strategica"],
    amenities: ["wifi", "ac", "kitchen", "laundry", "concierge", "rental"],
    images: [heroImg1, heroImg2, heroImg3],
  },
  "sophia": {
    name: "Sophia's Residence",
    zone: "Mykonos Town",
    capacity: 4,
    bedrooms: 1,
    bathrooms: 1,
    tagline: "Nel cuore pulsante dell'isola",
    description: "Ideale per famiglie o piccoli gruppi, la sistemazione per quattro ospiti si trova a soli 900 metri dalla città di Mykonos, in un ambiente curato e rilassante. Arredata in stile cicladico, offre vista sul Mar Egeo e sulle isole circostanti. L'alloggio è dotato di aria condizionata, frigorifero, bollitore e TV. A disposizione degli ospiti piscina, giardino e area colazioni con terrazza all'aperto. La fermata degli autobus diretti alle spiagge si trova proprio accanto alla struttura, ed è disponibile un parcheggio privato gratuito. La colazione à la carte viene servita presso il Liberty Café, a pochi passi dalla struttura.",
    highlights: ["Servizio concierge H24", "Servizio noleggio", "A soli 900 metri da Mykonos Town", "Posizione comoda e strategica"],
    amenities: ["wifi", "ac", "parking", "pool", "concierge", "rental"],
    images: [heroImg1, heroImg2, heroImg3],
  },
  "ocho": {
    name: "Ocho Downtown",
    zone: "Mykonos Town",
    capacity: 4,
    bedrooms: 1,
    bathrooms: 1,
    tagline: "Nel cuore pulsante dell'isola",
    description: "Ocho Downtown offre un soggiorno nel cuore pulsante di Mykonos, con due eleganti appartamenti bilocali situati in una posizione ideale per vivere appieno l'energia della città. Ispirati al fascino autentico delle Cicladi e arricchiti da comfort moderni, gli alloggi sono pensati per coppie, gruppi di amici e famiglie in cerca di un'esperienza autentica sull'isola. A pochi passi da boutique, ristoranti e locali notturni, la struttura riesce comunque a offrire un'atmosfera rilassante, grazie a una splendida piscina in comune con lettini e a un giardino curato, perfetto per momenti di tranquillità. Entrambi gli appartamenti dispongono di una camera da letto separata e di una zona giorno con cucina attrezzata e divano letto, offrendo spazi funzionali e ben organizzati.",
    highlights: ["Servizio concierge H24", "Servizio noleggio", "Comfort e privacy nel centro città", "A pochi passi da boutique, ristoranti e locali notturni"],
    amenities: ["wifi", "ac", "kitchen", "pool", "concierge", "rental"],
    images: [heroImg1, heroImg2, heroImg3],
  },
  "mykocho": {
    name: "Mykonos Ocho",
    zone: "Argyraina",
    capacity: 6,
    bedrooms: 2,
    bathrooms: 2,
    tagline: "Tranquillità e comfort nella zona di Argyraina",
    description: "Spaziosa e ben distribuita, questa tipologia è ideale per famiglie o gruppi numerosi che desiderano condividere l'esperienza di Mykonos senza rinunciare a comfort e organizzazione. Le due camere da letto e i due bagni assicurano maggiore privacy, mentre gli ambienti luminosi e dal design contemporaneo creano un'atmosfera elegante ma informale. La cucina completamente attrezzata permette di vivere il soggiorno in totale autonomia, affiancata da terrazza o balcone privato che regalano uno spazio esterno riservato. La piscina stagionale all'aperto, il giardino curato e l'area barbecue completano l'offerta, rendendo Mykonos Ocho una soluzione equilibrata tra relax, funzionalità e vicinanza al centro. Parcheggio privato disponibile in struttura.",
    highlights: ["Servizio concierge H24", "Servizio noleggio", "Ambienti moderni e luminosi", "Posizione comoda e strategica"],
    amenities: ["wifi", "ac", "kitchen", "pool", "parking", "concierge", "rental"],
    images: [heroImg1, heroImg2, heroImg3],
  },
  "miriam": {
    name: "Miriam Town",
    zone: "Mykonos Town",
    capacity: 5,
    bedrooms: 1,
    bathrooms: 1,
    tagline: "Nel cuore pulsante dell'isola",
    description: "Perfetta per gruppi numerosi che desiderano condividere l'esperienza di Mykonos nel pieno centro della città, questa unità per cinque persone unisce spazi funzionali e stile contemporaneo. Gli interni, caratterizzati da linee moderne e dettagli ispirati alla tradizione cicladica, offrono ambienti luminosi e ben organizzati. Dotata di balcone o terrazza privata, aria condizionata, Wi-Fi e TV a schermo piatto, rappresenta una soluzione comoda e pratica per chi vuole vivere l'isola senza rinunciare alla centralità. Tutti i principali punti di interesse, i vicoli caratteristici e la vivace nightlife di Mykonos sono facilmente raggiungibili a piedi.",
    highlights: ["Servizio concierge H24", "Servizio noleggio", "Comfort e privacy nel centro città", "A pochi passi dai locali iconici di Mykonos"],
    amenities: ["wifi", "ac", "concierge", "rental"],
    images: [heroImg1, heroImg2, heroImg3],
  },
  "iza": {
    name: "Iza Downtown",
    zone: "Mykonos Town",
    capacity: 4,
    bedrooms: 1,
    bathrooms: 1,
    tagline: "Nel cuore pulsante dell'isola",
    description: "Iza Downtown si trova nel cuore di Mykonos Town, in una posizione privilegiata a soli 2/5 minuti a piedi dal Mediterraneo, Skandinavian e Toyroom, ideale per vivere appieno l'energia e la nightlife dell'isola. La struttura propone un monolocale elegante e accogliente, climatizzato e dotato di Wi-Fi gratuito, in grado di ospitare da 2 a 4 persone. L'alloggio dispone di bagno privato, cucina attrezzata e una terrazza con vista sulla città, perfetta per rilassarsi dopo una giornata trascorsa tra mare e passeggiate. A soli 300 metri dalla spiaggia di Megali Ammos e nelle immediate vicinanze di ristoranti, boutique e locali, Iza Downtown rappresenta la scelta ideale per chi desidera soggiornare nel centro più vivace di Mykonos, unendo comfort, autonomia e posizione strategica.",
    highlights: ["Servizio concierge H24", "Servizio noleggio", "Comfort e privacy nel centro città", "A pochi passi dai locali iconici di Mykonos"],
    amenities: ["wifi", "ac", "kitchen", "concierge", "rental"],
    images: [heroImg1, heroImg2, heroImg3],
    distances: [
      { label: "Spiaggia Megali Ammos", time: "300 metri" },
    ],
  },
  "milena": {
    name: "Milena Maisonette",
    zone: "Mykonos Town",
    capacity: 4,
    bedrooms: 1,
    bathrooms: 1,
    tagline: "Nel cuore pulsante dell'isola",
    description: "Ideale per coppie o piccoli gruppi, Milena Maisonette offre un soggiorno confortevole nel pieno centro di Mykonos, a pochi passi dalla Spiaggia di Agia Anna. Climatizzata e accogliente, dispone di una camera da letto, balcone con vista mare e terrazza con affaccio sulla città, perfetta per rilassarsi dopo una giornata sull'isola. La cucina completamente attrezzata con frigorifero, forno e piano cottura permette di organizzare i pasti in autonomia. L'alloggio include inoltre TV a schermo piatto, bagno con doccia e asciugacapelli e connessione WiFi gratuita. La posizione centrale consente di raggiungere comodamente le principali attrazioni e i luoghi iconici di Mykonos Town.",
    highlights: ["Servizio concierge H24", "Servizio noleggio", "Comfort e privacy nel centro città", "Tutto a pochi passi"],
    amenities: ["wifi", "ac", "kitchen", "concierge", "rental"],
    images: [heroImg1, heroImg2, heroImg3],
  },
  "lunablu": {
    name: "Luna Blu",
    zone: "Agios Ioannis",
    capacity: 6,
    bedrooms: 3,
    bathrooms: 3,
    tagline: "Nella suggestiva cornice di Agios Ioannis, tra mare cristallino e tramonti iconici",
    description: "Spazioso e ben distribuito, l'appartamento è composto da tre camere da letto, tre bagni e un'ampia zona living con cucina, offrendo ambienti ideali per famiglie o gruppi di amici. La soluzione garantisce comfort, privacy e la possibilità di organizzare i propri spazi in autonomia, il tutto in una posizione privilegiata a pochi passi dalla spiaggia. La vista mare e l'atmosfera tranquilla di Agios Ioannis completano l'esperienza di soggiorno. È disponibile, su richiesta e a pagamento, il servizio di colazione in camera.",
    highlights: ["Servizio concierge H24", "Servizio noleggio", "Ideale per famiglie o gruppi", "A pochi passi dalla spiaggia"],
    amenities: ["wifi", "ac", "kitchen", "laundry", "concierge", "rental"],
    images: [heroImg1, heroImg2, heroImg3],
  },
  "izares": {
    name: "Iza's Residence",
    zone: "Glastros",
    capacity: 4,
    bedrooms: 1,
    bathrooms: 1,
    tagline: "Atmosfera riservata nel cuore di Glastros",
    description: "Perfetto per famiglie o gruppi, questo monolocale per quattro persone offre ambienti funzionali e un'atmosfera accogliente. L'alloggio include patio privato, angolo cottura con frigorifero, bagno privato e aria condizionata. La struttura mette a disposizione piscina, vasca idromassaggio e area barbecue in un ampio cortile in stile cicladico. Parcheggio gratuito disponibile in loco.",
    highlights: ["Servizio concierge H24", "Servizio noleggio", "Spazi funzionali e confortevoli", "A 1 km da Mykonos Town"],
    amenities: ["wifi", "ac", "laundry", "parking", "pool", "concierge", "rental"],
    images: [heroImg1, heroImg2, heroImg3],
    distances: [
      { label: "Mykonos Town", time: "1 km" },
    ],
  },
  "isabel": {
    name: "Isabel Studios",
    zone: "Fabrike Square",
    capacity: 4,
    bedrooms: 1,
    bathrooms: 1,
    tagline: "Nel cuore pulsante dell'isola",
    description: "Perfetto per famiglie o gruppi di amici, questo studio per quattro persone offre spazi accoglienti e una cucina attrezzata per ogni esigenza. Il servizio di pulizia quotidiano assicura un soggiorno sempre ordinato e piacevole. La struttura si trova a breve distanza pedonale da Toyroom, Interni Restaurant, Mediterraneo, Skandinavian e Bonbonniere, nel cuore della movida di Mykonos.",
    highlights: ["Servizio concierge H24", "Servizio noleggio", "Comfort e privacy nel centro città", "A pochi passi dai locali iconici di Mykonos"],
    amenities: ["wifi", "ac", "kitchen", "laundry", "concierge", "rental"],
    images: [heroImg1, heroImg2, heroImg3],
  },
  "hylas": {
    name: "Hylas Downtown",
    zone: "Mykonos Town",
    capacity: 6,
    bedrooms: 1,
    bathrooms: 1,
    tagline: "Nel cuore pulsante dell'isola",
    description: "La soluzione più ampia può ospitare fino a sei persone ed è ideale per gruppi che desiderano soggiornare nel cuore di Mykonos Town. Gli ambienti moderni includono angolo cottura attrezzato, TV a schermo piatto, aria condizionata e bagno privato. La vicinanza alla Spiaggia di Agia Anna, al Porto Vecchio e ai punti di interesse rende il soggiorno comodo e dinamico.",
    highlights: ["Servizio concierge H24", "Servizio noleggio", "Spazi confortevoli", "Posizione centrale"],
    amenities: ["wifi", "ac", "kitchen", "laundry", "concierge", "rental"],
    images: [heroImg1, heroImg2, heroImg3],
  },
  "eirini": {
    name: "Eirini Resort",
    zone: "Argyraina",
    capacity: 8,
    bedrooms: 3,
    bathrooms: 1,
    tagline: "Tranquillità a pochi minuti da Mykonos Town",
    description: "La tipologia più ampia del complesso può ospitare fino a otto persone e dispone di tre camere da letto, ideale per famiglie numerose o gruppi di amici. Ambienti curati e comfort moderni si uniscono agli spazi comuni, tra cui piscina e bar, per un soggiorno all'insegna della comodità e del relax.",
    highlights: ["Servizio concierge H24", "Servizio noleggio", "Ideale per gruppi numerosi", "Bar in struttura"],
    amenities: ["wifi", "ac", "kitchen", "parking", "pool", "laundry", "concierge", "rental"],
    images: [heroImg1, heroImg2, heroImg3],
  },
  "dime": {
    name: "Dime Town",
    zone: "Mykonos Town",
    capacity: 6,
    bedrooms: 1,
    bathrooms: 1,
    tagline: "Nel cuore pulsante dell'isola",
    description: "La soluzione più ampia della struttura può ospitare fino a sei persone ed è ideale per gruppi numerosi che desiderano soggiornare nel cuore dell'isola. L'unità dispone di cucina attrezzata e bagno, offrendo autonomia e comfort in una posizione strategica a pochi passi da ristoranti e locali. Aria condizionata, Wi-Fi e servizio di pulizie giornaliere sono inclusi.",
    highlights: ["Servizio concierge H24", "Servizio noleggio", "1 minuto a piedi da Interni Restaurant", "Tutto a pochi passi"],
    amenities: ["wifi", "ac", "kitchen", "laundry", "concierge", "rental"],
    images: [heroImg1, heroImg2, heroImg3],
  },
  "beauty": {
    name: "Beauty Suites",
    zone: "Mykonos Town",
    capacity: 6,
    bedrooms: 1,
    bathrooms: 1,
    tagline: "Nel cuore pulsante dell'isola",
    description: "Spaziosa e raffinata, la suite per sei ospiti è la soluzione ideale per chi desidera condividere un soggiorno esclusivo a Mykonos. Gli interni moderni e accoglienti si completano con una terrazza privata dotata di jacuzzi, perfetta per rilassarsi ammirando il panorama. Cucina attrezzata, Wi-Fi gratuito e aria condizionata garantiscono un'esperienza confortevole e indipendente.",
    highlights: ["Servizio concierge H24", "Servizio noleggio", "Terrazza privata con jacuzzi", "Tutto a pochi passi"],
    amenities: ["wifi", "ac", "kitchen", "laundry", "concierge", "rental"],
    images: [heroImg1, heroImg2, heroImg3],
  },
  "anthos": {
    name: "Anthos Resort",
    zone: "Ornos",
    capacity: 6,
    bedrooms: 2,
    bathrooms: 1,
    tagline: "Privacy e comodità nel cuore di Ornos",
    description: "Pensata per gruppi o famiglie che desiderano spazi meglio distribuiti, questa tipologia può accogliere fino a sei ospiti e dispone di due camere da letto. Arredata in stile tradizionale con dettagli che richiamano i colori dell'isola, è dotata di aria condizionata, TV, frigorifero e Wi-Fi gratuito. A 300 metri dalla spiaggia di Ornos, la struttura mette a disposizione terrazza solarium, giardino curato e snack bar panoramico con vista sul Mar Egeo, offrendo un soggiorno confortevole e ben collegato ai principali servizi.",
    highlights: ["Servizio concierge H24", "Servizio noleggio", "A 500 m dalla spiaggia di Ornos", "Terrazza solarium e snack bar vista mare"],
    amenities: ["wifi", "ac", "parking", "pool", "kitchen", "concierge", "rental"],
    images: [heroImg1, heroImg2, heroImg3],
    distances: [
      { label: "Spiaggia di Ornos", time: "300 metri" },
    ],
  },
  "aniel": {
    name: "Aniel Apartments",
    zone: "Klouvas",
    capacity: 4,
    bedrooms: 1,
    bathrooms: 1,
    tagline: "Comfort e relax nella zona di Klouvas",
    description: "Soluzione più ampia della struttura, questo appartamento può ospitare fino a cinque persone ed è ideale per famiglie o gruppi. La cucina completamente attrezzata permette di gestire i pasti in autonomia, mentre aria condizionata, bagno privato e zona living garantiscono comfort. La posizione panoramica, il giardino con terrazza vista mare e il parcheggio privato rendono il soggiorno pratico e piacevole.",
    highlights: ["Servizio concierge H24", "Servizio noleggio", "Ideale per famiglie o gruppi", "Spazi funzionali e indipendenti"],
    amenities: ["wifi", "ac", "kitchen", "laundry", "parking", "concierge", "rental"],
    images: [heroImg1, heroImg2, heroImg3],
  },
  "anamis": {
    name: "Anamis Maisonette",
    zone: "Mykonos Town",
    capacity: 4,
    bedrooms: 1,
    bathrooms: 1,
    tagline: "Nel cuore pulsante dell'isola",
    description: "Situata a Mykonos Town, Anamis Maisonette è una soluzione indipendente ideale per un soggiorno fino a 4 ospiti. Inserita in un quartiere vivace e piacevole, permette di vivere l'isola a piedi, tra ristoranti, locali e scorci caratteristici facilmente raggiungibili. La maisonette dispone di una camera da letto, due letti e un bagno, offrendo ambienti funzionali e confortevoli. La cucina attrezzata consente piena autonomia durante il soggiorno, mentre l'area di lavoro dedicata con Wi-Fi la rende adatta anche a chi necessita di uno spazio pratico per lavorare. Affacciata sul mare, la proprietà offre accesso condiviso alla spiaggia e comfort come aria condizionata, TV, asciugacapelli e connessione Wi-Fi. Una soluzione ideale per chi desidera combinare posizione centrale, vista mare e comodità.",
    highlights: ["Servizio concierge H24", "Servizio noleggio", "Accesso diretto alla spiaggia", "Tutto a pochi passi"],
    amenities: ["wifi", "ac", "kitchen", "concierge", "rental"],
    images: [heroImg1, heroImg2, heroImg3],
  },
  "alexis": {
    name: "Alexis Residence",
    zone: "Klouvas",
    capacity: 5,
    bedrooms: 1,
    bathrooms: 1,
    tagline: "Comfort e relax nella zona di Klouvas",
    description: "Spazioso e funzionale, lo studio per quattro persone è una soluzione ideale per famiglie o piccoli gruppi. La cucina attrezzata garantisce autonomia, mentre gli ambienti climatizzati assicurano comfort in ogni momento della giornata. La piscina condivisa e la posizione tranquilla completano un soggiorno piacevole a pochi minuti dalle principali attrazioni dell'isola.",
    highlights: ["Servizio concierge H24", "Servizio noleggio", "Soluzione ideale per famiglie", "Posizione tranquilla a Klouvas"],
    amenities: ["wifi", "ac", "parking", "laundry", "pool", "concierge", "rental"],
    images: [heroImg1, heroImg2, heroImg3],
  },
  "agiosstudios": {
    name: "Agios Lazaros Studios",
    zone: "Agios Lazaros",
    capacity: 4,
    bedrooms: 1,
    bathrooms: 1,
    tagline: "Comfort e relax nella zona di Agios Lazaros",
    description: "Agios Lazaros Studios offre un soggiorno confortevole nella rinomata zona di Agios Lazaros, a breve distanza dalle spiagge più iconiche dell'isola. L'alloggio è dotato di tutti i comfort essenziali per un soggiorno piacevole e funzionale, con ambienti climatizzati e ben organizzati. La posizione strategica permette di raggiungere facilmente le principali attrazioni di Mykonos.",
    highlights: ["Servizio concierge H24", "Servizio noleggio", "Vicinanza alle spiagge iconiche", "Posizione strategica"],
    amenities: ["wifi", "ac", "kitchen", "concierge", "rental"],
    images: [heroImg1, heroImg2, heroImg3],
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

const getSeasonModifiers = () => {
  const currentYear = new Date().getFullYear();
  const years = [currentYear, currentYear + 1];
  const lowDays: Date[] = [];
  const midDays: Date[] = [];
  const highDays: Date[] = [];

  years.forEach((y) => {
    // Bassa: May 1 – Jun 14
    for (let d = new Date(y, 4, 1); d <= new Date(y, 5, 14); d.setDate(d.getDate() + 1)) lowDays.push(new Date(d));
    // Media: Jun 15 – Jul 14
    for (let d = new Date(y, 5, 15); d <= new Date(y, 6, 14); d.setDate(d.getDate() + 1)) midDays.push(new Date(d));
    // Alta: Jul 15 – Aug 31
    for (let d = new Date(y, 6, 15); d <= new Date(y, 7, 31); d.setDate(d.getDate() + 1)) highDays.push(new Date(d));
  });

  return { lowSeason: lowDays, midSeason: midDays, highSeason: highDays };
};

const seasonModifiers = getSeasonModifiers();
const seasonModifiersClassNames = {
  lowSeason: "!text-green-600 font-semibold",
  midSeason: "!text-amber-500 font-semibold",
  highSeason: "!text-red-500 font-semibold",
};

const AccommodationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [guests, setGuests] = useState(2);
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formNotes, setFormNotes] = useState("");
  const bookingFormRef = useRef<HTMLDivElement>(null);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  // Fetch from DB
  const { data: dbVilla } = useVillaBySlug(id || "");
  const { data: dbApartment } = useApartmentBySlug(id || "");

  // Build property from DB data or fall back to static
  const property = useMemo(() => {
    const dbItem = dbVilla || dbApartment;
    if (dbItem) {
      const distances = dbItem && 'distances' in dbItem && dbItem.distances
        ? (Array.isArray(dbItem.distances) ? dbItem.distances as { label: string; time: string }[] : [])
        : [];
      return {
        name: dbItem.name,
        zone: dbItem.zone,
        capacity: dbItem.capacity,
        bedrooms: dbItem.bedrooms,
        bathrooms: dbItem.bathrooms,
        tagline: dbItem.tagline || "",
        description: dbItem.description || "",
        highlights: dbItem.highlights || [],
        amenities: dbItem.amenities || [],
        images: dbItem.images || [],
        distances,
      };
    }
    // Fallback to static data
    return id ? propertiesData[id] || null : null;
  }, [id, dbVilla, dbApartment]);

  if (!property) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6">
          <p className="text-xl text-muted-foreground">Struttura non trovata</p>
          <Link to="/accommodation" className="text-accent hover:underline flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> Torna agli alloggi
          </Link>
        </div>
      </Layout>
    );
  }

  // Use card image as hero if available
  const heroImage = (id && cardHeroImages[id]) ? cardHeroImages[id] : property.images[0];

  const openLightbox = (index: number) => {
    setActiveImage(index);
    setLightboxOpen(true);
  };

  const nextImage = () => setActiveImage((prev) => (prev + 1) % property.images.length);
  const prevImage = () => setActiveImage((prev) => (prev - 1 + property.images.length) % property.images.length);

  return (
    <Layout>
      {/* Cinematic Hero — immersive parallax */}
      <section className="relative h-[60vh] md:h-[90vh] overflow-hidden">
        <motion.img
          initial={{ scale: 1.15 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          src={heroImage}
          alt={property.name}
          className="w-full h-full object-cover"
        />
        {/* Bottom fade — starts higher for more coverage under text */}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-[55%] bg-gradient-to-t from-foreground via-foreground/70 to-transparent" />

        {/* Hero content overlay — positioned higher */}
        <div className="absolute inset-0 flex flex-col justify-center pb-16 md:pb-32">
          <div className="container mx-auto px-4">
            <motion.div initial="hidden" animate="visible" className="max-w-3xl">
              <motion.div custom={0} variants={fadeUp} className="flex flex-wrap items-center gap-2 md:gap-3 mb-3 md:mb-6">
                <span className="inline-flex items-center gap-1.5 md:gap-2 px-3 md:px-5 py-1.5 md:py-2.5 rounded-full bg-accent/20 backdrop-blur-xl border border-accent/30 shadow-lg shadow-accent/10">
                  <Sparkles className="h-3 w-3 md:h-3.5 md:w-3.5 text-accent" />
                  <span className="text-accent text-[9px] md:text-xs font-bold uppercase tracking-[0.2em] md:tracking-[0.25em]">Luxury Collection</span>
                </span>
                <a
                  href={`https://www.google.com/maps/search/${encodeURIComponent(property.zone + ", Mykonos, Greece")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 md:px-4 py-1.5 md:py-2.5 rounded-full bg-primary-foreground/10 backdrop-blur-xl text-primary-foreground/80 text-[10px] md:text-xs hover:bg-primary-foreground/20 transition-colors cursor-pointer border border-primary-foreground/10"
                >
                  <MapPin className="h-3 w-3 text-accent" /> {property.zone}
                </a>
              </motion.div>
              <motion.h1 custom={1} variants={fadeUp} className="text-3xl md:text-8xl lg:text-9xl font-bold text-primary-foreground leading-[0.9] mb-3 md:mb-6 drop-shadow-[0_4px_40px_hsl(var(--accent)/0.3)]">
                {property.name}
              </motion.h1>
              <motion.p custom={2} variants={fadeUp} className="text-primary-foreground/50 text-sm md:text-xl max-w-xl leading-relaxed whitespace-pre-line">
                {property.tagline}
              </motion.p>
              <motion.div custom={3} variants={fadeUp} className="flex flex-wrap items-center gap-x-2 md:gap-x-4 gap-y-1 text-primary-foreground/60 text-xs md:text-sm mt-4 md:mt-8">
                {[
                  { icon: Users, label: `${property.capacity} ospiti` },
                  { icon: BedDouble, label: `${property.bedrooms} camere da letto` },
                  { icon: Bath, label: `${property.bathrooms} bagni` },
                  ...(property.amenities.includes("pool") ? [{ icon: Waves, label: "Piscina privata" }] : []),
                ].map((stat, i, arr) => (
                  <span key={i} className="flex items-center gap-1.5">
                    <stat.icon className="h-3 w-3 md:h-3.5 md:w-3.5 text-accent/70" />
                    <span className="text-primary-foreground/60 text-[11px] md:text-sm">{stat.label}</span>
                    {i < arr.length - 1 && <span className="text-primary-foreground/30 ml-1">•</span>}
                  </span>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Highlights - directly below hero, seamless transition */}
      <section className="relative pb-10 md:pb-20 -mt-16 md:-mt-20 bg-foreground" style={{ zIndex: 5 }}>
        <div className="container mx-auto px-4 pt-10 md:pt-16">
          <div className="flex items-center justify-center gap-3 mb-10 md:mb-14">
            <div className="h-[1px] w-10 md:w-16 bg-accent/40" />
            <span className="text-accent/80 text-[10px] md:text-[11px] uppercase tracking-[0.45em]">Perché sceglierla</span>
            <div className="h-[1px] w-10 md:w-16 bg-accent/40" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
            {property.highlights.map((h, i) => {
              const highlightIcons = [HandPlatter, Bike, Star, MapPin];
              const HighlightIcon = highlightIcons[i % highlightIcons.length];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                  className="group relative text-center pt-9 md:pt-11 pb-8 md:pb-10 px-4 md:px-6 rounded-2xl border border-primary-foreground/10 bg-primary-foreground/[0.02] hover:border-accent/30 hover:bg-primary-foreground/[0.04] transition-all duration-500"
                >
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-foreground border border-primary-foreground/15 flex items-center justify-center transition-all duration-500 group-hover:border-accent/40">
                    <HighlightIcon className="h-4 w-4 md:h-[18px] md:w-[18px] text-accent" />
                  </div>
                  <p className="text-primary-foreground/85 text-[12px] md:text-sm font-normal leading-snug">{h}</p>
                  <div className="w-6 md:w-8 h-[1px] bg-accent/40 mx-auto mt-4 md:mt-5 transition-all duration-500 group-hover:w-12" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-10 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          {/* Back */}
          <Link
            to="/accommodation"
            className="inline-flex items-center gap-2 text-xs md:text-sm text-muted-foreground hover:text-accent transition-colors mb-8 md:mb-16"
          >
            <ArrowLeft className="h-3.5 w-3.5 md:h-4 md:w-4" /> Torna alla collezione
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-20">
            {/* Left */}
            <div className="lg:col-span-2 space-y-12 md:space-y-20">

              {/* Description — first, editorial */}
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <span className="text-accent text-[10px] font-semibold uppercase tracking-[0.4em]">L'esperienza</span>
                <h2 className="text-2xl md:text-4xl font-bold mt-3 mb-4 md:mb-8">Un soggiorno senza paragoni</h2>
                <p className="text-muted-foreground leading-[1.8] text-sm md:text-lg">{property.description}</p>
              </motion.div>

              {/* Stats — clean inline row */}
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <span className="text-accent text-[10px] font-semibold uppercase tracking-[0.4em]">La villa in breve</span>
                <div className="grid grid-cols-4 gap-2 md:flex md:flex-wrap md:gap-6 mt-4 md:mt-6">
                  {[
                    { icon: Users, value: property.capacity, label: "Ospiti" },
                    { icon: BedDouble, value: property.bedrooms, label: "Camere" },
                    { icon: Bath, value: property.bathrooms, label: "Bagni" },
                    ...(property.amenities.includes("pool") ? [{ icon: Waves, value: "✓", label: "Piscina" }] : []),
                  ].map((stat, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.06 }}
                      className="flex flex-col items-center gap-1 md:flex-row md:gap-3"
                    >
                      <div className="w-8 h-8 md:w-11 md:h-11 rounded-lg md:rounded-xl bg-accent/10 flex items-center justify-center">
                        <stat.icon className="h-3.5 w-3.5 md:h-[18px] md:w-[18px] text-accent" />
                      </div>
                      <div className="text-center md:text-left">
                        <p className="text-base md:text-xl font-bold leading-none">{stat.value}</p>
                        <p className="text-[9px] md:text-[11px] text-muted-foreground mt-0.5 md:mt-1 uppercase tracking-wider">{stat.label}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Distances — inline pills */}
                {property.distances && property.distances.length > 0 && (
                  <div className="flex flex-wrap gap-3 mt-8">
                    {property.distances.map((d, i) => (
                      <div
                        key={i}
                        className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full border border-border/60 bg-muted/30"
                      >
                        {d.label === "Aeroporto" ? (
                          <Plane className="h-3.5 w-3.5 text-accent" />
                        ) : (
                          <Navigation className="h-3.5 w-3.5 text-accent" />
                        )}
                        <span className="text-xs font-semibold">{d.label}</span>
                        <span className="text-xs text-muted-foreground">{d.time}</span>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>

              {/* Amenities — clean list */}
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <span className="text-accent text-[10px] font-semibold uppercase tracking-[0.4em]">Comfort & Servizi</span>
                <h2 className="text-2xl md:text-4xl font-bold mt-3 mb-4 md:mb-8">
                  <span className="md:hidden">Tutto ciò<br />che desideri</span>
                  <span className="hidden md:inline">Tutto ciò che desideri</span>
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-2 gap-2 md:gap-4">
                  {property.amenities.map((a, i) => {
                    const info = amenityIcons[a];
                    if (!info) return null;
                    return (
                      <motion.div
                        key={a}
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.03 }}
                        className="flex flex-col md:flex-row items-center md:items-center gap-2 md:gap-4 py-3 px-3 md:py-4 md:px-5 rounded-xl border border-border/40 hover:border-accent/20 hover:bg-accent/[0.03] transition-all duration-300 group text-center md:text-left"
                      >
                        <div className="w-8 h-8 md:w-9 md:h-9 rounded-lg bg-accent/10 group-hover:bg-accent/15 flex items-center justify-center shrink-0 transition-colors">
                          <info.icon className="h-3.5 w-3.5 md:h-4 md:w-4 text-accent" />
                        </div>
                        <div>
                          <p className="font-semibold text-xs md:text-sm">{info.label}</p>
                          <p className="text-[10px] md:text-xs text-muted-foreground mt-0.5 hidden md:block">{info.desc}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-24 space-y-4 md:space-y-6">
                {/* CTA Card */}
                <div className="rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-[hsl(220,60%,15%)] via-[hsl(210,50%,20%)] to-[hsl(190,60%,30%)]">
                  <div className="p-5 md:p-8 pb-3 md:pb-6">
                    <div className="flex items-center gap-2 mb-1">
                      <Sparkles className="h-3.5 w-3.5 md:h-4 md:w-4 text-accent" />
                      <span className="text-accent text-[9px] md:text-[10px] font-bold uppercase tracking-[0.3em]">Esperienza esclusiva</span>
                    </div>
                    <h3 className="text-xl md:text-3xl font-bold text-primary-foreground mt-2 md:mt-3" style={{ fontFamily: "'Ultra', serif" }}>Prenota ora</h3>
                    <p className="text-primary-foreground/50 mt-1.5 md:mt-3 text-[11px] md:text-sm leading-relaxed">
                      Contattaci per disponibilità e un preventivo personalizzato.
                    </p>
                  </div>
                  <div className="p-5 md:p-8 pt-1 md:pt-4 space-y-2 md:space-y-3">
                    <a href="https://wa.me/393XXXXXXXXX" target="_blank" rel="noopener noreferrer"
                      className="block w-full py-2.5 md:py-4 rounded-full bg-gradient-to-r from-accent to-accent/80 text-accent-foreground text-center font-bold hover:opacity-90 transition-all text-[11px] md:text-sm tracking-wide shadow-xl shadow-accent/20">
                      Chatta con noi
                    </a>
                    <a href="mailto:info@example.com"
                      className="block w-full py-2.5 md:py-4 rounded-full bg-primary-foreground/10 text-primary-foreground text-center font-semibold hover:bg-primary-foreground/20 transition-colors border border-primary-foreground/15 text-[11px] md:text-sm">
                      Scopri il prezzo ora
                    </a>
                    <a href="#"
                      className="block w-full py-2.5 md:py-4 rounded-full bg-primary-foreground/5 text-primary-foreground text-center font-semibold hover:bg-primary-foreground/10 transition-colors border border-primary-foreground/10 text-[11px] md:text-sm">
                      Scarica la Brochure
                    </a>
                  </div>
                </div>

                {/* Details Card */}
                <div className="rounded-2xl md:rounded-3xl bg-card border border-border/50 p-5 md:p-8">
                  <h4 className="text-[10px] md:text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-4 md:mb-6">Dettagli struttura</h4>
                  <div className="space-y-0">
                    {[
                      { label: "Zona", value: property.zone },
                      { label: "Capacità massima", value: `${property.capacity} ospiti` },
                      { label: "Camere da letto", value: String(property.bedrooms) },
                      { label: "Bagni", value: String(property.bathrooms) },
                      { label: "Tipologia", value: property.bedrooms >= 3 ? "Villa" : "Appartamento" },
                    ].map((item, i) => (
                      <div key={i} className="flex justify-between items-center py-2.5 md:py-3 border-b border-border/50 last:border-0">
                        <span className="text-xs md:text-sm text-muted-foreground">{item.label}</span>
                        <span className="text-xs md:text-sm font-semibold">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mosaic Gallery */}
      <section className="py-10 md:py-16 bg-foreground">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-6 md:mb-8">
            <div className="w-8 md:w-12 h-[2px] bg-accent" />
            <span className="text-accent text-[10px] md:text-xs font-semibold uppercase tracking-[0.3em]">Gallery</span>
            <span className="text-primary-foreground/40 text-[10px] md:text-xs ml-auto">{property.images.length} foto</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5 md:gap-3 auto-rows-[140px] md:auto-rows-[240px]">
            {property.images.slice(0, 8).map((img, i) => {
              const spanClass =
                i === 0 ? "col-span-2 row-span-2" :
                i === 3 ? "col-span-2" :
                i === 6 ? "col-span-2" :
                "";
              return (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => openLightbox(i)}
                  className={`relative overflow-hidden rounded-2xl group ${spanClass}`}
                >
                  <img
                    src={img}
                    alt={`${property.name} ${i + 1}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-foreground/20 group-hover:bg-transparent transition-colors duration-500" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="px-4 py-2 rounded-full bg-card/90 backdrop-blur-sm text-xs font-semibold shadow-lg">
                      Ingrandisci
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {property.images.length > 8 && (
            <div className="flex justify-center mt-6">
              <button
                onClick={() => openLightbox(0)}
                className="px-8 py-3 rounded-full bg-accent text-accent-foreground font-semibold text-sm hover:bg-accent/90 transition-colors"
              >
                Vedi tutte le {property.images.length} foto
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Booking CTA with villa photo */}
      <section className="relative min-h-[45vh] md:min-h-[60vh] flex items-center overflow-hidden">
        <motion.img
          initial={{ scale: 1.05 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
          src={property.images[Math.min(1, property.images.length - 1)]}
          alt={property.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/70 to-foreground/40" />
        <div className="relative container mx-auto px-4 py-12 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-lg"
          >
            <span className="text-accent text-[10px] font-semibold uppercase tracking-[0.4em]">Disponibilità</span>
            <h2 className="text-2xl md:text-5xl font-bold text-primary-foreground mt-3 mb-3 md:mb-4 leading-tight">Scegli le date</h2>
            <p className="text-primary-foreground/60 text-sm md:text-lg leading-relaxed mb-6 md:mb-8">
              Inserisci il periodo per scoprire le nostre disponibilità
            </p>
            <motion.button
              onClick={() => {
                setShowBookingForm(true);
                setTimeout(() => bookingFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
              }}
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-5 md:px-10 py-3 md:py-5 rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground font-bold text-[11px] md:text-sm tracking-wide hover:opacity-90 shadow-lg shadow-primary/20 transition-all duration-300"
            >
              <CalendarIcon className="h-3 w-3 md:h-4 md:w-4" />
              Prenota il tuo soggiorno
              <Sparkles className="h-3 w-3 md:h-3.5 md:w-3.5 text-accent opacity-70" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Booking Form */}
      <AnimatePresence>
        {showBookingForm && (
          <motion.section
            ref={bookingFormRef}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="bg-background overflow-hidden"
          >
            <div className="container mx-auto px-4 py-10 md:py-20">
              <div className="max-w-2xl mx-auto">
                <div className="flex items-center justify-between mb-6 md:mb-10">
                  <div>
                    <span className="text-accent text-[10px] font-semibold uppercase tracking-[0.4em]">Richiesta</span>
                    <h3 className="text-xl md:text-3xl font-bold mt-2">Verifica disponibilità</h3>
                  </div>
                  <button
                    onClick={() => setShowBookingForm(false)}
                    className="w-10 h-10 rounded-full border border-border/60 flex items-center justify-center hover:bg-muted/50 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Dates row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">Check-in</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <button className={cn(
                            "w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border border-border/60 text-left hover:border-accent/30 transition-colors",
                            !checkIn && "text-muted-foreground"
                          )}>
                            <CalendarIcon className="h-4 w-4 text-accent shrink-0" />
                            {checkIn ? format(checkIn, "d MMMM yyyy", { locale: it }) : "Seleziona data"}
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={checkIn}
                            onSelect={setCheckIn}
                            disabled={(date) => date < new Date()}
                            modifiers={seasonModifiers}
                            modifiersClassNames={seasonModifiersClassNames}
                            initialFocus
                            className={cn("p-3 pointer-events-auto")}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">Check-out</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <button className={cn(
                            "w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border border-border/60 text-left hover:border-accent/30 transition-colors",
                            !checkOut && "text-muted-foreground"
                          )}>
                            <CalendarIcon className="h-4 w-4 text-accent shrink-0" />
                            {checkOut ? format(checkOut, "d MMMM yyyy", { locale: it }) : "Seleziona data"}
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={checkOut}
                            onSelect={setCheckOut}
                            disabled={(date) => date < (checkIn || new Date())}
                            modifiers={seasonModifiers}
                            modifiersClassNames={seasonModifiersClassNames}
                            initialFocus
                            className={cn("p-3 pointer-events-auto")}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  {/* Season legend */}
                  <div className="flex flex-wrap items-center gap-5 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-green-500" /> Bassa stagione</div>
                    <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Media stagione</div>
                    <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Alta stagione</div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">Ospiti</label>
                    <div className="flex items-center gap-4 px-4 py-3 rounded-xl border border-border/60">
                      <Users className="h-4 w-4 text-accent shrink-0" />
                      <button
                        onClick={() => setGuests(Math.max(1, guests - 1))}
                        className="w-8 h-8 rounded-full border border-border/60 flex items-center justify-center hover:bg-muted/50 transition-colors"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="text-lg font-bold min-w-[2rem] text-center">{guests}</span>
                      <button
                        onClick={() => setGuests(Math.min(property.capacity, guests + 1))}
                        className="w-8 h-8 rounded-full border border-border/60 flex items-center justify-center hover:bg-muted/50 transition-colors"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                      <span className="text-xs text-muted-foreground ml-auto">max {property.capacity}</span>
                    </div>
                  </div>

                  {/* Contact info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">Nome e cognome</label>
                      <input
                        type="text"
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="Mario Rossi"
                        maxLength={100}
                        className="w-full px-4 py-3.5 rounded-xl border border-border/60 bg-transparent text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-accent/40 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">Email</label>
                      <input
                        type="email"
                        value={formEmail}
                        onChange={(e) => setFormEmail(e.target.value)}
                        placeholder="mario@email.com"
                        maxLength={255}
                        className="w-full px-4 py-3.5 rounded-xl border border-border/60 bg-transparent text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-accent/40 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">Telefono / WhatsApp</label>
                    <input
                      type="tel"
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      placeholder="+39 333 1234567"
                      maxLength={20}
                      className="w-full px-4 py-3.5 rounded-xl border border-border/60 bg-transparent text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-accent/40 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">Note aggiuntive</label>
                    <textarea
                      value={formNotes}
                      onChange={(e) => setFormNotes(e.target.value)}
                      placeholder="Richieste speciali, orario di arrivo, servizi extra..."
                      rows={3}
                      maxLength={1000}
                      className="w-full px-4 py-3.5 rounded-xl border border-border/60 bg-transparent text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-accent/40 transition-colors resize-none"
                    />
                  </div>

                  {/* Submit */}
                  <button
                    onClick={async () => {
                      if (!checkIn || !checkOut || !formName.trim() || !formEmail.trim()) {
                        toast.error("Compila tutti i campi obbligatori: date, nome ed email.");
                        return;
                      }
                      const isVilla = id && !id.startsWith("alex");
                      const { error } = await supabase.from("bookings").insert({
                        service_type: isVilla ? "villa" : "apartment",
                        service_name: property.name,
                        customer_name: formName.trim(),
                        customer_email: formEmail.trim(),
                        customer_phone: formPhone.trim() || null,
                        check_in: format(checkIn, "yyyy-MM-dd"),
                        check_out: format(checkOut, "yyyy-MM-dd"),
                        guests,
                        message: formNotes.trim() || null,
                        source: "website",
                      } as any);
                      if (error) {
                        toast.error("Errore nell'invio. Riprova.");
                        return;
                      }
                      toast.success("Richiesta inviata! Ti risponderemo al più presto.");
                      setFormName(""); setFormEmail(""); setFormPhone(""); setFormNotes("");
                      setCheckIn(undefined); setCheckOut(undefined); setGuests(1);
                      setShowBookingForm(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 py-4 rounded-full bg-accent text-accent-foreground font-bold text-sm tracking-wide hover:bg-accent/90 transition-colors"
                  >
                    <Send className="h-4 w-4" />
                    Invia richiesta di disponibilità
                  </button>
                  <p className="text-[11px] text-muted-foreground text-center">
                    Ti risponderemo entro 24 ore con disponibilità e preventivo personalizzato.
                  </p>
                </div>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-foreground/95 backdrop-blur-sm flex items-center justify-center"
            onClick={() => setLightboxOpen(false)}
          >
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-6 right-6 w-12 h-12 rounded-full bg-primary-foreground/10 flex items-center justify-center text-primary-foreground hover:bg-primary-foreground/20 transition-colors z-10"
            >
              <X className="h-6 w-6" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              className="absolute left-4 md:left-8 w-14 h-14 rounded-full bg-primary-foreground/10 flex items-center justify-center text-primary-foreground hover:bg-primary-foreground/20 transition-colors"
            >
              <ChevronLeft className="h-7 w-7" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              className="absolute right-4 md:right-8 w-14 h-14 rounded-full bg-primary-foreground/10 flex items-center justify-center text-primary-foreground hover:bg-primary-foreground/20 transition-colors"
            >
              <ChevronRight className="h-7 w-7" />
            </button>
            <motion.img
              key={activeImage}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.3 }}
              src={property.images[activeImage]}
              alt={`${property.name} ${activeImage + 1}`}
              className="max-h-[85vh] max-w-[90vw] object-contain rounded-2xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="absolute bottom-8 flex items-center gap-3">
              {property.images.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setActiveImage(i); }}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${i === activeImage ? "bg-accent w-8" : "bg-primary-foreground/30 hover:bg-primary-foreground/50"}`}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
};

export default AccommodationDetail;
