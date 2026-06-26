import leopard1 from "@/assets/yachts/leopard24m-1.jpg";
import leopard2 from "@/assets/yachts/leopard24m-2.jpg";
import princessV55_1 from "@/assets/yachts/princess-v55-1.jpg";
import princessV55_2 from "@/assets/yachts/princess-v55-2.jpg";
import galeon1 from "@/assets/yachts/galeon53-1.jpg";
import galeon2 from "@/assets/yachts/galeon53-2.jpg";
import posillipo1 from "@/assets/yachts/posillipo64f-1.jpg";
import posillipo2 from "@/assets/yachts/posillipo64f-2.jpg";
import ferretti68_1 from "@/assets/yachts/ferretti68-1.jpg";
import ferretti68_2 from "@/assets/yachts/ferretti68-2.jpg";
import gazelle1 from "@/assets/yachts/gazelle-1.jpg";
import gazelle2 from "@/assets/yachts/gazelle-2.jpg";
import cigarette1 from "@/assets/yachts/cigarette360-1.jpg";
import cigarette2 from "@/assets/yachts/cigarette360-2.jpg";
import fairline43_1 from "@/assets/yachts/fairline43-new-1.jpg";
import fairline43_2 from "@/assets/yachts/fairline43-new-2.jpg";
import rodman1 from "@/assets/yachts/rodman43f-1.jpg";
import rodman2 from "@/assets/yachts/rodman43f-2.jpg";
import korina1 from "@/assets/yachts/korina-majesty-1.jpg";
import korina2 from "@/assets/yachts/korina-majesty-2.jpg";
import pershing1 from "@/assets/yachts/pershing54-1.jpg";
import pershing2 from "@/assets/yachts/pershing54-2.jpg";
import posillipo64_1 from "@/assets/yachts/posillipo64-1.jpg";
import posillipo64_2 from "@/assets/yachts/posillipo64-2.jpg";
import rodman43_1 from "@/assets/yachts/rodman43-1.jpg";
import rodman43_2 from "@/assets/yachts/rodman43-2.jpg";
import fairline43n1 from "@/assets/yachts/fairline43-1.jpg";
import fairline43n2 from "@/assets/yachts/fairline43-2.jpg";

export interface Yacht {
  slug: string;
  name: string;
  model: string;
  length: string;
  guests: number;
  overnightGuests: number;
  cabins: number;
  crew: number;
  speed: string;
  year: string;
  engines: string;
  description: {
    it: string;
    en: string;
  };
  includes: string[];
  images: string[];
}

export const yachts: Yacht[] = [
  // ═══════════════════════════════════════════
  // 1. LEOPARD 24M (da PDF)
  // Fonte: LEOPARD_24M_MYK_1_compressed_1.pdf
  // ═══════════════════════════════════════════
  {
    slug: "leopard-24m",
    name: "Leopard 24M",
    model: "Arno Leopard 24",
    length: "24.06m",
    guests: 20,
    overnightGuests: 8,
    cabins: 4,
    crew: 4,
    speed: "28 knots",
    year: "2008 / Refit 2023",
    engines: "2 x MTU 12v 2000 M91, 1500 HP ciascuno",
    description: {
      it: "Il Leopard 24M è un superyacht di quasi 25 metri, perfetto per crociere giornaliere e multi-day nelle Cicladi. 4 cabine lussuose (Master, VIP, Twin, Pullman), equipaggio di 4 persone e ogni comfort incluso: pranzo gourmet, vino illimitato e attrezzatura snorkeling.",
      en: "The Leopard 24M is a nearly 25-meter superyacht, perfect for daily and multi-day cruises in the Cyclades. 4 luxurious cabins (Master, VIP, Twin, Pullman), crew of 4, and every comfort included: gourmet lunch, unlimited wine, and snorkeling gear.",
    },
    includes: [
      "Capitano certificato, 3 hostess e marinaio",
      "Carburante per Delos-Rhenia o spiagge sud di Mykonos",
      "Pranzo gourmet a bordo e vino illimitato",
      "Lettino anteriore (8 persone) e lettino posteriore (6 persone)",
      "Doccia esterna e piattaforma balneare",
      "Connessione WiFi",
      "Attrezzatura snorkeling e medica",
      "Attività: immersioni, pesca sub, kiteboard, subwing, seabob",
      "Pernottamento esclusivo in 4 suite private per un massimo di 8 ospiti",
    ],
    images: [leopard1, leopard2],
  },

  // ═══════════════════════════════════════════
  // 2. FERRETTI 68 (da PDF)
  // Fonte: Ferretti_68_zik.pdf
  // ═══════════════════════════════════════════
  {
    slug: "ferretti-68",
    name: "Ferretti 68",
    model: "Ferretti 68' Flybridge",
    length: "21.20m",
    guests: 12,
    overnightGuests: 6,
    cabins: 3,
    crew: 3,
    speed: "22-24 knots",
    year: "Refit 2024",
    engines: "2 x 1200 HP MAN",
    description: {
      it: "Il Ferretti 68 va oltre l'ordinario, creando un mix armonioso di lusso, comfort e servizio personalizzato. Cabina master con walk-in closet, VIP e twin, tutte con bagno privato. Water toys disponibili: Jet Ski, E-foil, Seabob, SUP.",
      en: "The Ferretti 68 goes beyond the ordinary, creating a harmonious blend of luxury, comfort, and personalized service. Master cabin with walk-in closet, VIP and twin, all with ensuite. Water toys available: Jet Ski, E-foil, Seabob, SUP.",
    },
    includes: [
      "Equipaggio dedicato di 3 persone (Capitano, Marinaio, Hostess)",
      "Cabina master con cabina armadio e climatizzazione",
      "Cabina VIP king-size e cabina twin, tutte con bagno privato",
      "Biancheria belga premium e Wi-Fi con Netflix",
      "Pranzo a bordo: ponte di poppa o salone (8 persone)",
      "Piattaforma balneare e luci subacquee",
      "Water toys su richiesta: Jet Ski, E-foil, Seabob, SUP, Wakeboard",
      "Tender Avon 3.60m – 60HP",
      "Soggiorno notturno in 3 cabine raffinate per un massimo di 6 ospiti",
    ],
    images: [ferretti68_1, ferretti68_2],
  },

  // ═══════════════════════════════════════════
  // 3. SUPERPHANTOM 85 (da sito myluxgroup.com)
  // ═══════════════════════════════════════════
  {
    slug: "superphantom-85",
    name: "Superphantom 85",
    model: "Superphantom 85 Fly",
    length: "85ft (25.90m)",
    guests: 25,
    overnightGuests: 16,
    cabins: 8,
    crew: 5,
    speed: "30 knots",
    year: "2002 / Refit 2023",
    engines: "2 x MTU 2000 HP",
    description: {
      it: "Il Super Phantom 85ft è l'epitome del lusso con spazi interni ed esterni generosi. 4 bagni, bar interno, jacuzzi outdoor (su richiesta a €700) e deck spazioso per prendere il sole ed eventi esclusivi.",
      en: "The Super Phantom 85ft epitomizes luxury with expansive indoor and outdoor spaces. 4 bathrooms, indoor bar, outdoor jacuzzi (on request for €700), and spacious deck for sunbathing and hosting exclusive gatherings.",
    },
    includes: [
      "Equipaggio di 5 persone (Capitano, Marinai, Hostess)",
      "8 cabine ospiti e 4 bagni",
      "Area bar interna elegante",
      "Jacuzzi esterna (disponibile su preavviso a €700)",
      "Ponte spazioso per prendere il sole e ricevimenti",
      "Viste panoramiche sul mare",
      "Pernottamento di lusso in 8 cabine per un massimo di 16 ospiti",
      "Charter giornaliero: accesso a 1 cabina e 2 bagni",
    ],
    images: [
      "https://framerusercontent.com/images/Odknh6NAhbwSub5kVFBo0cTlWt8.png?width=1194&height=662",
      "https://framerusercontent.com/images/A3MYpp9T5SR2V7hIKB3f0Ex4K0.png?width=1418&height=802",
      "https://framerusercontent.com/images/MaVL7JRVkfFWoKDhaPdhdgA9JM.png?width=1410&height=790",
      "https://framerusercontent.com/images/jrRNFMVBCnAwolUYWIY1xljEMU.png?width=676&height=376",
    ],
  },

  // ═══════════════════════════════════════════
  // 4. TECNOMARINE 95 (da sito – Refit 2021)
  // ═══════════════════════════════════════════
  {
    slug: "tecnomarine-95",
    name: "Tecnomarine 95",
    model: "Tecnomarine 95",
    length: "95ft (29.00m)",
    guests: 49,
    overnightGuests: 18,
    cabins: 9,
    crew: 4,
    speed: "22 knots",
    year: "1990 / Refit 2021",
    engines: "2 x MTU 1500 HP (consumo 350 lt/h)",
    description: {
      it: "Il Tecnomarine 95 promette una vacanza charter eccezionale, combinando performance sportive con design moderno e finiture su misura. Grande prua per prendere il sole e cenare all'aperto, per ricordi indimenticabili a bordo.",
      en: "The Tecnomarine 95 promises an outstanding charter vacation, combining fast and sporty performance with modern design and bespoke fittings. Large foredeck for sunbathing and alfresco dining, guaranteeing unforgettable memories on board.",
    },
    includes: [
      "Equipaggio di 4 persone (Capitano, Marinai, Hostess)",
      "9 cabine ospiti e 4 bagni",
      "Ampia prua per prendere il sole",
      "Area pranzo all'aperto",
      "Pernottamento raffinato in 9 cabine per un massimo di 18 ospiti",
      "Consumo carburante: 350 lt/h alla velocità di crociera",
    ],
    images: [
      "https://framerusercontent.com/images/ewtmMvfbiq96iC8DO3FGPSd2gk4.png?width=1198&height=632",
      "https://framerusercontent.com/images/8LbWQvYoTaFWrY8BPdp2MUS079I.png?width=1402&height=744",
      "https://framerusercontent.com/images/d9sIrcMBR1nkX5k7FbvgiGG7M.png?width=1406&height=750",
      "https://framerusercontent.com/images/9rodHgjdBwdAuFJKn5YdvfwM4P4.png?width=660&height=364",
    ],
  },

  // ═══════════════════════════════════════════
  // 5. TECNOMARINE 95 CUSTOM (da sito – Refit 2022)
  // ═══════════════════════════════════════════
  {
    slug: "tecnomarine-95-custom",
    name: "Tecnomarine 95 Custom",
    model: "Tecnomarine Custom Order",
    length: "95ft (29.00m)",
    guests: 49,
    overnightGuests: 8,
    cabins: 4,
    crew: 4,
    speed: "22 knots",
    year: "1990 / Refit 2022",
    engines: "2 x MTU 1500 HP",
    description: {
      it: "Esperienza eccezionale che combina lusso e stile con finiture su misura e design elegante. Ideale per charter giornalieri e brevi fughe, offre ampi spazi esterni con prua espansiva per prendere il sole e cene all'aperto con viste mozzafiato sul mare.",
      en: "Outstanding experience combining luxury and style with bespoke fittings and elegant design. Ideal for daily charters and short getaways, offering spacious outdoor areas with an expansive foredeck for sunbathing and alfresco dining with stunning sea views.",
    },
    includes: [
      "Equipaggio di 4 persone (Capitano, Marinai, Hostess)",
      "4 cabine e 4 bagni",
      "Prua espansiva per prendere il sole",
      "Pranzo all'aperto con vista mare",
      "Snack gourmet e selezione di vino, birra e bibite",
      "Prodotti da bagno di alta qualità e asciugamani freschi",
      "Pernottamento elegante in 4 cabine per un massimo di 8 ospiti",
    ],
    images: [
      "https://framerusercontent.com/images/VZHynqAY3z0SpgFpuTZ1f64F3Gc.png?width=1200&height=664",
      "https://framerusercontent.com/images/yARkpvA12tyK87glJFeqRzZiXc.png?width=1396&height=784",
      "https://framerusercontent.com/images/hBOq4tKrY2vrcDSr3f0AoHQCTso.png?width=1408&height=782",
      "https://framerusercontent.com/images/z96HbIyZzQ6ctmTei98xw29ErCA.png?width=1506&height=660",
    ],
  },

  // ═══════════════════════════════════════════
  // 6. POSILLIPO 64F (da PDF)
  // ═══════════════════════════════════════════
  {
    slug: "posillipo-64f",
    name: "Posillipo 64F",
    model: "Posillipo 64F",
    length: "64ft (19.50m)",
    guests: 10,
    overnightGuests: 8,
    cabins: 4,
    crew: 2,
    speed: "21 knots",
    year: "2023",
    engines: "Twin Engine",
    description: {
      it: "Un elegante yacht di 64 piedi con 4 cabine, perfetto per crociere di lusso intorno alle Cicladi. Spazi ampi, design raffinato e un ponte ideale per il sole e le cene all'aperto.",
      en: "An elegant 64ft yacht with 4 cabins, perfect for luxury cruises around the Cyclades. Spacious layout, refined design, and a deck ideal for sunbathing and alfresco dining.",
    },
    includes: [
      "Equipaggio di 2 persone (Capitano e Hostess)",
      "4 cabine e 2 bagni",
      "Pernottamento esclusivo in 4 cabine per un massimo di 8 ospiti",
      "Velocità di crociera: 21 nodi",
    ],
    images: [posillipo1, posillipo2],
  },

  // ═══════════════════════════════════════════
  // 7. FERRETTI 58/64 (da sito)
  // ═══════════════════════════════════════════
  {
    slug: "ferretti-58-64",
    name: "Ferretti 58/64",
    model: "Ferretti 58/64",
    length: "64ft (19.50m)",
    guests: 12,
    overnightGuests: 6,
    cabins: 3,
    crew: 3,
    speed: "32 knots",
    year: "1991 / Refit 2001",
    engines: "Twin MTU diesel (consumo 280 lt/h)",
    description: {
      it: "Qualità e velocità si fondono perfettamente in questo elegante motor yacht firmato Luigi Sturchio. Cabina master con letto queen-size e bagno privato, due cabine convertibili, flybridge con lettini e area pranzo per sei.",
      en: "Quality and speed merge perfectly in this stylish motor yacht designed by Luigi Sturchio. Master cabin with queen-size bed and private bathroom, two convertible cabins, flybridge with sunbeds and dining area for six.",
    },
    includes: [
      "Equipaggio di 3 persone (Capitano, Marinaio, Hostess)",
      "Cabina master con letto queen-size e bagno privato",
      "2 cabine con 4 letti singoli convertibili in 2 queen, tutte con bagno privato",
      "Tavolo da pranzo per 6 sul ponte",
      "Flybridge con lettini, area pranzo e lounge",
      "Lettino di prua per prendere il sole",
      "Soggiorno notturno in 3 cabine raffinate per un massimo di 6 ospiti",
      "Consumo carburante: 280 lt/h alla velocità di crociera",
    ],
    images: [
      "https://framerusercontent.com/images/6fgiC6w24O0zryZqpk4oY1O5qY.jpg?width=1200&height=800",
      "https://framerusercontent.com/images/S5VNDX6xmHpcE990J2eRfB3SUw.jpg?width=1200&height=800",
      "https://framerusercontent.com/images/ahMGH8aPk2yEJjVRvLnXXvDLjwI.jpg?width=1200&height=800",
      "https://framerusercontent.com/images/m4nEnrDv9mO1Esxmk0cIbcxKM54.jpg?width=1200&height=800",
    ],
  },

  // ═══════════════════════════════════════════
  // 8. O YACHT (da sito)
  // ═══════════════════════════════════════════
  {
    slug: "o-yacht",
    name: "O Yacht",
    model: "Omikron OT60",
    length: "60ft (18.30m)",
    guests: 16,
    overnightGuests: 8,
    cabins: 8,
    crew: 2,
    speed: "10-12 knots",
    year: "2024",
    engines: "Hybrid Vela-Motore",
    description: {
      it: "L'Omikron OT60 combina design all'avanguardia ed eleganza moderna, costruito nel 2024 per fondere la tranquillità della vela con il comfort della navigazione a motore. 4 cabine spaziose, 3 bagni e servizio gourmet incluso.",
      en: "The Omikron OT60 combines state-of-the-art design and modern elegance, built in 2024 to blend the tranquility of sailing with the comfort of motor boating. 4 spacious cabins, 3 bathrooms, and gourmet service included.",
    },
    includes: [
      "Equipaggio di 2 persone (Capitano e Hostess)",
      "8 cabine ospiti, 4 bagni",
      "Snack gourmet e selezione esclusiva di vino e bibite",
      "Prodotti da bagno di alta qualità e asciugamani freschi",
      "Pernottamento intimo in 4 cabine spaziose per un massimo di 8 ospiti",
    ],
    images: [
      "https://framerusercontent.com/images/r6GDxaCTEhYYz7aDS1xsFHxR0v4.png?width=1188&height=654",
      "https://framerusercontent.com/images/TRiDVpS3ihcTldWDLg6GyUJZV4g.png?width=670&height=376",
      "https://framerusercontent.com/images/i74QqpHRr8hN4kssU9y8jVrKQVg.png?width=1402&height=782",
      "https://framerusercontent.com/images/I09vLE3t8QKzUrw7xHVcUm2MQOA.png?width=666&height=370",
    ],
  },

  // ═══════════════════════════════════════════
  // 9. AZIMUT 58 (da sito)
  // ═══════════════════════════════════════════
  {
    slug: "azimut-58",
    name: "Azimut 58",
    model: "Azimut 58 Fly",
    length: "58ft (17.68m)",
    guests: 12,
    overnightGuests: 6,
    cabins: 6,
    crew: 3,
    speed: "28 knots",
    year: "2003 / Refit 2023",
    engines: "2 x MAN V8 720 HP",
    description: {
      it: "Un cruiser flybridge italiano con tutte le caratteristiche del più grande produttore al mondo. Linee eleganti, interni lussuosi e un salone eccezionalmente confortevole. Tre cabine doppie con bagno privato, configurabili con letti doppi o singoli.",
      en: "A full-style Italian flybridge cruiser with all the features from the world's largest manufacturer. Elegant lines, luxurious accommodations, and an exceptionally comfortable salon. Three double-berth cabins with ensuite, configurable with double or single beds.",
    },
    includes: [
      "Equipaggio di 3 persone (Capitano, Marinaio, Hostess)",
      "3 cabine doppie con bagno privato (configurabili: letti doppi o singoli)",
      "Ampio salone confortevole",
      "Ponti solarium spaziosi per relax e abbronzatura",
      "Soggiorno notturno in 3 suite con bagno privato per un massimo di 6 ospiti",
    ],
    images: [
      "https://framerusercontent.com/images/PvNKLa1qkYjH2JIQafnsG4bdHE.png?width=1922&height=1284",
      "https://framerusercontent.com/images/fWtQfgdpSfGQvQXZa5RaOF5TQ8c.png?width=1204&height=684",
      "https://framerusercontent.com/images/UVw6XOuzYC1IfjHnigDndHx6h8.png?width=1410&height=810",
      "https://framerusercontent.com/images/wy3TCOpk6gVAcDwRPXgGbiqb454.png?width=676&height=388",
    ],
  },

  // ═══════════════════════════════════════════
  // 10. PRINCESS V55 (da PDF)
  // ═══════════════════════════════════════════
  {
    slug: "princess-v55",
    name: "Princess V55",
    model: "Princess V55",
    length: "55ft (16.76m)",
    guests: 10,
    overnightGuests: 6,
    cabins: 3,
    crew: 3,
    speed: "29 knots",
    year: "2001 / Refit 2023",
    engines: "2 x MAN 800 HP",
    description: {
      it: "La Princess V55 offre un'esperienza di crociera unica lungo le spiagge meridionali di Mykonos, Delos e Rhenia. 3 cabine, 2 bagni, attrezzatura Seabob e pranzo gourmet a bordo con vino illimitato.",
      en: "The Princess V55 offers a unique cruise experience along Mykonos' southern beaches, Delos, and Rhenia. 3 cabins, 2 bathrooms, Seabob equipment, and gourmet lunch on board with unlimited wine.",
    },
    includes: [
      "Capitano certificato e 2 hostess",
      "Carburante per Delos-Rhenia o spiagge sud di Mykonos",
      "Pranzo gourmet a bordo e vino illimitato",
      "Lettino anteriore e posteriore (4+4 persone)",
      "Doccia esterna e piattaforma balneare",
      "WiFi gratuito",
      "Attrezzatura Seabob e snorkeling",
      "Pernottamento esclusivo in 3 cabine per un massimo di 6 ospiti",
    ],
    images: [princessV55_1, princessV55_2],
  },

  // ═══════════════════════════════════════════
  // 11. PRINCESS V52 (da sito)
  // ═══════════════════════════════════════════
  {
    slug: "princess-v52",
    name: "Princess V52",
    model: "Princess V52",
    length: "52ft (15.85m)",
    guests: 10,
    overnightGuests: 6,
    cabins: 3,
    crew: 2,
    speed: "28 knots",
    year: "1997 / Refit 2022",
    engines: "2 x Alta Prestazione (consumo 170 lt/h)",
    description: {
      it: "Il modello originale della Princess combina eleganza, praticità e stile per un'esperienza nautica di prim'ordine. Tre cabine confortevoli per soggiorni multi-day; ideale anche per crociere giornaliere.",
      en: "The original Princess model combines elegance, practicality, and style for a best-in-class yachting experience. Three comfortable cabins for multi-day stays; also ideal for daily cruises.",
    },
    includes: [
      "Equipaggio di 2 persone (Capitano e Hostess)",
      "3 cabine (cabina extra disponibile a €100/notte in porto)",
      "Snack gourmet e selezione esclusiva di vino e bibite",
      "Prodotti da bagno di lusso e asciugamani freschi",
      "Soggiorno notturno in 3 cabine confortevoli per un massimo di 6 ospiti",
      "Consumo carburante: 170 lt/h alla velocità di crociera",
    ],
    images: [
      "https://framerusercontent.com/images/ExwMNPB9Uqq0brIeEJM3zgxgRH8.png?width=1204&height=690",
      "https://framerusercontent.com/images/6ReqdiDWqHqsUURx84kkLwok.png?width=1404&height=790",
      "https://framerusercontent.com/images/i14ea3vAvyS3qpLC8rtj3dRQxWg.png?width=1404&height=806",
      "https://framerusercontent.com/images/69gATMnnxWow8CMaZ2PAHtIMUg.png?width=666&height=378",
    ],
  },

  // ═══════════════════════════════════════════
  // 12. PERSHING 54 (da sito)
  // ═══════════════════════════════════════════
  {
    slug: "pershing-54",
    name: "Pershing 54",
    model: "Pershing 54 Open Sport",
    length: "58ft (17.68m)",
    guests: 10,
    overnightGuests: 8,
    cabins: 4,
    crew: 2,
    speed: "40 knots",
    year: "2002 / Refit 2022",
    engines: "Twin Alta Prestazione",
    description: {
      it: "Stile sportivo e crociera d'élite: il design italiano firmato Pershing fonde eleganza con ingegneria audace. Scafo argentato, interni minimalisti e motori ad alte prestazioni. Ampio sunpad, cockpit ergonomico e piattaforma poppiera integrata.",
      en: "Sporty style and elite cruising: signature Italian Pershing design merges elegance with bold engineering. Silver hull, minimalist interiors, and high-performance engines.",
    },
    includes: [
      "Equipaggio di 2 persone (Capitano e Hostess)",
      "4 cabine ospiti e 2 bagni",
      "Ampio sunpad e cockpit ergonomico",
      "Piattaforma poppiera integrata per accesso al mare",
      "Snack gourmet e selezione esclusiva di vino e bibite",
      "Prodotti da bagno di alta qualità e asciugamani freschi",
      "Pernottamento sportivo in 4 cabine per un massimo di 8 ospiti",
    ],
    images: [
      "https://framerusercontent.com/images/eh7kSjtmU5SNpYQZ1fel4Gy46lU.png?width=1204&height=670",
      "https://framerusercontent.com/images/DaKlp9HkTBsa4lA3oK3aaaLTE.png?width=668&height=430",
      "https://framerusercontent.com/images/MX0ocIzxxVCeOhS9JIDDTEH0NY.png?width=674&height=404",
      "https://framerusercontent.com/images/qtMmLI0okROC73nbWyPdQSDXHw.png?width=644&height=446",
    ],
  },

  // ═══════════════════════════════════════════
  // 13. KORINA (da sito)
  // ═══════════════════════════════════════════
  {
    slug: "korina-majesty-50",
    name: "Korina",
    model: "Majesty 50ft Flybridge",
    length: "50ft (15.50m)",
    guests: 12,
    overnightGuests: 6,
    cabins: 6,
    crew: 2,
    speed: "23 knots",
    year: "2014 / Refit 2023",
    engines: "2 x 575 HP Volvo",
    description: {
      it: "Un flybridge motor yacht di 50 piedi che unisce eleganza e potenza. 6 cabine ospiti, 3 bagni e crew di 2. Ideale per crociere giornaliere e soggiorni multi-day.",
      en: "A 50ft flybridge motor yacht combining elegance and power. 6 guest cabins, 3 bathrooms, and crew of 2. Perfect for daily cruises and multi-day stays.",
    },
    includes: [
      "Equipaggio di 2 persone (Capitano e Hostess)",
      "6 cabine ospiti e 3 bagni",
      "Pernottamento in 3 cabine doppie per un massimo di 6 ospiti",
    ],
    images: [
      "https://framerusercontent.com/images/IzPl19wQwLROOVeLMM5XMvwks.png?width=1588&height=1074",
      "https://framerusercontent.com/images/AQ4ed23Jp0KL1f2avcJuqtfcmg.png?width=844&height=536",
      "https://framerusercontent.com/images/JUL3FEl2QD5J8ou43dyWD0nneQ.png?width=692&height=418",
      "https://framerusercontent.com/images/gLJhNm4uFEachC3JnLlTi3vHV7M.png?width=842&height=374",
    ],
  },

  // ═══════════════════════════════════════════
  // 14. GALEON 53 (da PDF)
  // ═══════════════════════════════════════════
  {
    slug: "galeon-53",
    name: "Galeon 53",
    model: "Galeon 53",
    length: "53ft (16.15m)",
    guests: 20,
    overnightGuests: 6,
    cabins: 3,
    crew: 2,
    speed: "20 knots",
    year: "2008 / Refit 2022",
    engines: "Consumo 200 litri/ora",
    description: {
      it: "Il Galeon 53 è uno yacht versatile con ampi spazi per charter giornalieri. 3 cabine confortevoli per crociere multi-day, design polacco di eccellenza e prestazioni affidabili.",
      en: "The Galeon 53 is a versatile yacht with ample space for daily charters. 3 comfortable cabins for multi-day cruises, excellent Polish design, and reliable performance.",
    },
    includes: [
      "Equipaggio di 2 persone (Capitano e Hostess)",
      "3 cabine per charter multiday",
      "Soggiorno notturno in 3 cabine per un massimo di 6 ospiti",
      "Consumo carburante: 200 litri/ora",
      "Velocità di crociera: 20 nodi",
    ],
    images: [galeon1, galeon2],
  },

  // ═══════════════════════════════════════════
  // 15. M/Y QUEEN III – Rodman 43F (da PDF + sito)
  // ═══════════════════════════════════════════
  {
    slug: "rodman-43f",
    name: "M/Y Queen III",
    model: "Rodman 43F",
    length: "13.30m",
    guests: 10,
    overnightGuests: 6,
    cabins: 3,
    crew: 2,
    speed: "25 knots",
    year: "2006 / Refit 2022",
    engines: "Twin Engine",
    description: {
      it: "La M/Y Queen III è uno yacht versatile e raffinato costruito dalla Rodman. Perfetto per esplorare le baie nascoste di Mykonos con stile e comfort, con 3 cabine e 2 bagni (con doccia).",
      en: "The M/Y Queen III is a versatile and refined yacht built by Rodman. Perfect for exploring Mykonos' hidden bays with style and comfort, with 3 cabins and 2 bathrooms (with shower).",
    },
    includes: [
      "Equipaggio di 2 persone (Capitano e Hostess)",
      "3 cabine e 2 bagni con doccia",
      "Pernottamento in 3 cabine per un massimo di 6 ospiti",
      "Velocità di crociera: 25 nodi",
    ],
    images: [
      rodman1,
      rodman2,
      "https://framerusercontent.com/images/YC3WGu0rxRRK1QPjT8ywqvHdvVA.png?width=1588&height=952",
      "https://framerusercontent.com/images/pHogHrupbyngC1pkp69kteMgeQ.png?width=1590&height=1124",
    ],
  },

  // ═══════════════════════════════════════════
  // 16. FAIRLINE 43 (da PDF)
  // ═══════════════════════════════════════════
  {
    slug: "fairline-43",
    name: "Fairline 43",
    model: "Fairline 43",
    length: "43ft (13.10m)",
    guests: 10,
    overnightGuests: 4,
    cabins: 2,
    crew: 2,
    speed: "22 knots",
    year: "2008 / Refit 2022",
    engines: "Consumo 150 litri/ora",
    description: {
      it: "Il Fairline 43 offre un perfetto equilibrio tra comfort e spazio a bordo. 2 cabine accoglienti, ponte spazioso e sistema di navigazione Raymarine. Ideale per crociere giornaliere lungo le coste di Mykonos.",
      en: "The Fairline 43 offers a perfect balance of comfort and onboard space. 2 cozy cabins, spacious deck, and Raymarine navigation system. Ideal for daily cruises along Mykonos' coastline.",
    },
    includes: [
      "Equipaggio di 2 persone (Capitano e Hostess)",
      "2 cabine",
      "Sistema di navigazione Raymarine",
      "Pernottamento riservato in 2 cabine per un massimo di 4 ospiti",
      "Consumo carburante: 150 litri/ora",
      "Velocità di crociera: 22 nodi",
    ],
    images: [fairline43_1, fairline43_2],
  },

  // ═══════════════════════════════════════════
  // 17. FAIRLINE PHANTOM 43 (da sito)
  // ═══════════════════════════════════════════
  {
    slug: "fairline-phantom-43",
    name: "Fairline Phantom",
    model: "Fairline Phantom 43",
    length: "43ft (13.10m)",
    guests: 10,
    overnightGuests: 4,
    cabins: 2,
    crew: 2,
    speed: "22 knots",
    year: "2008 / Refit 2023",
    engines: "2 x Caterpillar 426 HP (consumo 150 lt/h)",
    description: {
      it: "Uno dei modelli di maggior successo mai costruiti: lo scafo Deep-V di Bernard Olensinski garantisce una navigazione sicura e confortevole. Velocità massima oltre 30 nodi con motori Caterpillar gemelli.",
      en: "One of the most successful models ever built: Bernard Olensinski's Deep-V hull ensures a sure-footed, comfortable ride. Top speed exceeding 30 knots with twin Caterpillar engines.",
    },
    includes: [
      "Equipaggio di 2 persone (Capitano e Hostess)",
      "2 cabine e 2 bagni",
      "Scafo Deep-V per navigazione confortevole",
      "Pernottamento riservato in 2 cabine per un massimo di 4 ospiti",
      "Velocità massima: oltre 30 nodi",
      "Consumo carburante: 150 lt/h",
    ],
    images: [
      "https://framerusercontent.com/images/SMWHYASgTxAqAyl8ayGRbMZrsTY.png?width=1208&height=688",
      "https://framerusercontent.com/images/xIwuWs60NQ3QLktpt4ajqMqIGpE.png?width=1410&height=810",
      "https://framerusercontent.com/images/uVo61kDOTtYpeJwKnIcAE9qy0.png?width=1406&height=756",
      "https://framerusercontent.com/images/fjeMJOVvzTvwgp3UnACABvDmGrc.png?width=670&height=384",
    ],
  },

  // ═══════════════════════════════════════════
  // 18. FERRETTI 52 (da sito)
  // ═══════════════════════════════════════════
  {
    slug: "ferretti-52",
    name: "Ferretti 52",
    model: "Ferretti 52",
    length: "52ft (15.85m)",
    guests: 22,
    overnightGuests: 6,
    cabins: 6,
    crew: 2,
    speed: "24 knots",
    year: "1991 / Refit 2001",
    engines: "Twin Engine (consumo 180 lt/h)",
    description: {
      it: "Costruito da Ferretti Yachts in Italia, questo Ferretti 52 con scafo deep-V e ponte in teak offre spazi ampi per charter giornalieri. 3 cabine spaziose per crociere multi-day.",
      en: "Built by Ferretti Yachts in Italy, this Ferretti 52 features a deep-V hull and teak-laid aft deck, offering spacious areas for daily charters.",
    },
    includes: [
      "Equipaggio di 2 persone (Capitano e Hostess)",
      "6 cabine ospiti e 3 bagni",
      "Scafo planante deep-V e ponte di poppa in teak",
      "Ampie aree interne ed esterne",
      "Soggiorno notturno in 3 cabine per un massimo di 6 ospiti",
      "Consumo carburante: 180 lt/h alla velocità di crociera",
    ],
    images: [
      "https://framerusercontent.com/images/veXr2OVZAlxt9BhnLagm82mPafw.png?width=670&height=440",
      "https://framerusercontent.com/images/LYZLqfU4Wt4vqKwBTd8Wo2PRQQ.png?width=658&height=424",
      "https://framerusercontent.com/images/HvxBbqeZPh0FP3sG2xiDwEAnLDo.png?width=672&height=446",
      "https://framerusercontent.com/images/JiYKR4qbxMI5b5kVGNs4bYmcS2o.png?width=668&height=442",
    ],
  },

  // ═══════════════════════════════════════════
  // 19. M/Y FERRETTI 62ft (da sito)
  // ═══════════════════════════════════════════
  {
    slug: "m-y-ferretti-62",
    name: "M/Y Ferretti 62ft",
    model: "Ferretti 62",
    length: "62ft (18.90m)",
    guests: 12,
    overnightGuests: 6,
    cabins: 6,
    crew: 3,
    speed: "26 knots",
    year: "1991 / Refit 2025",
    engines: "Twin Engine",
    description: {
      it: "Vivi il lusso a bordo del Ferretti 62ft mentre esplori la costa meridionale di Mykonos e le isole di Delos e Rhenia. Design contemporaneo ed elegante, flybridge con vista panoramica e lettini.",
      en: "Experience luxury aboard the Ferretti 62ft as you explore Mykonos' south coast and the islands of Delos and Rhenia. Contemporary elegant design, flybridge with panoramic views and sun loungers.",
    },
    includes: [
      "Equipaggio di 3 persone (Capitano, Marinaio, Hostess)",
      "6 cabine ospiti e 3 bagni",
      "Ponte spazioso per prendere il sole e pranzo all'aperto",
      "Flybridge con vista panoramica e lettini",
      "Soggiorno notturno in 3 cabine eleganti per un massimo di 6 ospiti",
    ],
    images: [
      "https://framerusercontent.com/images/JOToxQC1w69tOPMw4gMsVZVTDjE.png?width=1590&height=988",
      "https://framerusercontent.com/images/j0utnT6HIFWDlM2dPuWFhX7Qqjo.png?width=846&height=596",
      "https://framerusercontent.com/images/8Q1F7hgcMzEXKkqx1lmv6G4Kio.png?width=1280&height=562",
      "https://framerusercontent.com/images/z96HbIyZzQ6ctmTei98xw29ErCA.png?width=1506&height=660",
    ],
  },

  // ═══════════════════════════════════════════
  // 20. GAZELLE (da PDF)
  // ═══════════════════════════════════════════
  {
    slug: "gazelle",
    name: "Gazelle",
    model: "Alesta Marine",
    length: "12m",
    guests: 10,
    overnightGuests: 0,
    cabins: 0,
    crew: 2,
    speed: "45 knots",
    year: "2024",
    engines: "Motori fuoribordo (consumo 1.8 lt/miglio)",
    description: {
      it: "Velocità e lusso si fondono nella Gazelle, speedboat di 12 metri perfetta per esplorare la costa sud di Mykonos, Delos e Rhenia. Equipaggiata con sistema A/C completo, impianto audio Bluetooth e connessione WiFi.",
      en: "Speed and luxury merge in the Gazelle, a 12-meter speedboat perfect for exploring Mykonos' south coast, Delos and Rhenia. Equipped with full A/C system, Bluetooth sound system and WiFi connectivity.",
    },
    includes: [
      "Skipper e servizio di hosting",
      "Sistema A/C completo",
      "Impianto audio con USB/Bluetooth",
      "Connessione WiFi",
      "1 bagno/WC",
      "Velocità di crociera: 36 nodi / Massima: 45 nodi",
      "Capacità carburante: 300 litri / Acqua: 200 litri",
      "Consumo: 1,8 litri per miglio",
      "Solo crociere giornaliere – pernottamento non disponibile",
    ],
    images: [gazelle1, gazelle2],
  },

  // ═══════════════════════════════════════════
  // 21. CIGARETTE 360 (da PDF)
  // ═══════════════════════════════════════════
  {
    slug: "cigarette-360",
    name: "Cigarette 360",
    model: "Cigarette Racing",
    length: "12m",
    guests: 12,
    overnightGuests: 4,
    cabins: 1,
    crew: 2,
    speed: "60 knots",
    year: "2017",
    engines: "2 x 315 HP (consumo 100 lt/h)",
    description: {
      it: "Potenza pura e adrenalina: la Cigarette 360 è lo speedboat più veloce della nostra flotta, capace di raggiungere i 60 nodi. Ideale per crociere private lungo le spiagge meridionali di Mykonos, Delos e Rhenia.",
      en: "Pure power and adrenaline: the Cigarette 360 is the fastest speedboat in our fleet, reaching 60 knots. Ideal for private cruises along Mykonos' southern beaches, Delos and Rhenia.",
    },
    includes: [
      "Skipper e servizio di hosting",
      "1 cabina (4 pax)",
      "Crociera mattutina (4h), al tramonto (4h) o giornata intera (7h)",
      "Snack gourmet e bevande: vino, prosecco, birre e bibite",
      "Teli mare e attrezzatura snorkeling",
      "Attrezzatura di sicurezza completa",
      "Pernottamento intimo in 1 cabina per un massimo di 4 ospiti",
    ],
    images: [cigarette1, cigarette2],
  },

  // ═══════════════════════════════════════════
  // 22. POSILLIPO 64 (da asset esistenti)
  // ═══════════════════════════════════════════
  {
    slug: "posillipo-64",
    name: "Posillipo 64",
    model: "Posillipo 64",
    length: "64ft (19.50m)",
    guests: 12,
    overnightGuests: 6,
    cabins: 3,
    crew: 2,
    speed: "22 knots",
    year: "2005 / Refit 2023",
    engines: "Twin Engine",
    description: {
      it: "Il Posillipo 64 è un classico motor yacht italiano con linee eleganti e interni raffinati. 3 cabine spaziose, ampio salone e ponte per prendere il sole. Perfetto per esplorare le Cicladi con stile.",
      en: "The Posillipo 64 is a classic Italian motor yacht with elegant lines and refined interiors. 3 spacious cabins, large salon, and sundeck. Perfect for exploring the Cyclades in style.",
    },
    includes: [
      "Equipaggio di 2 persone (Capitano e Hostess)",
      "3 cabine con bagno privato",
      "Ampio salone e ponte di poppa",
      "Aree solarium",
      "Soggiorno notturno in 3 cabine per un massimo di 6 ospiti",
    ],
    images: [posillipo64_1, posillipo64_2],
  },
];
