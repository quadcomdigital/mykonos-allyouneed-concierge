/* Homepage */
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Instagram,
  Compass,
  Star,
  Home,
  Play,
  Quote,
  MessageCircle,
  Plane,
  Sun,
  CreditCard,
  Ship,
  Utensils,
  ChevronDown,
} from "lucide-react";
import { Anchor, Music } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/i18n/LanguageContext";
import Layout from "@/components/layout/Layout";
import { useVillas, useApartments, useYachts, useVenues } from "@/hooks/useSupabaseData";
import HighlightsRow from "@/components/home/HighlightsRow";

import heroImg1 from "@/assets/hero-slide-1.jpg";
import heroImg2 from "@/assets/hero-slide-2.jpg";
import heroImg3 from "@/assets/hero-slide-3.jpg";
import heroVideo from "@/assets/heroscreen.mp4.asset.json";

import villaImg from "@/assets/villas/villa-hero.png";
import aptImg from "@/assets/apartments/appartamenti-hero.jpg";

import carImg from "@/assets/card-noleggio-veicoli.jpg";
import carSuv from "@/assets/card-transfer.png";

import imgUnUnico from "@/assets/un-unico-new.jpg";
import imgProntoVivere from "@/assets/pronto-a-vivere.png";

import imgConsigli from "@/assets/richiedi-preventivo-noleggio.png";
import imgEsperienza from "@/assets/esperienze-su-misura.jpg";
import imgAlloggi from "@/assets/migliori-alloggi.jpg";
import imgEventi from "@/assets/hero-eventi.jpg";

import imgNammos from "@/assets/locations/nammos.jpg";
import imgScorpios from "@/assets/locations/scorpios.jpg";
import imgToyroom from "@/assets/locations/toyroom.jpg";
import imgNoema from "@/assets/locations/noema.jpg";
import imgCoya from "@/assets/locations/coya.jpg";
import imgPrincipote from "@/assets/locations/principote.jpg";

// Social images
import igRistoranti from "@/assets/social/ig-ristoranti.png";
import igErrori from "@/assets/social/ig-errori.png";
import igSuitePalma from "@/assets/social/ig-suite-palma.png";
import igVillaDimitra from "@/assets/social/ig-villa-dimitra.png";
import tkImg1 from "@/assets/social/tk-1.jpg";
import tkImg2 from "@/assets/social/tk-2.jpg";
import tkImg3 from "@/assets/social/tk-3.jpg";
import tkImg4 from "@/assets/social/tk-4.jpg";
import tkImg5 from "@/assets/social/tk-5.jpg";
import tkImg6 from "@/assets/social/tk-6.jpg";
import tipTravel from "@/assets/social/tip-travel-new.png";
import tipPack from "@/assets/social/tip-pack.jpg";
import tipDining from "@/assets/social/tip-dining-new.png";
import tipIslands from "@/assets/social/tip-islands-new.png";
import tipBudget from "@/assets/social/tip-budget.jpg";
import tipTransport from "@/assets/social/tip-transport.jpg";

const heroImages = [heroImg1, heroImg2, heroImg3];

const heroSlides = [
  {
    headline: "Mykonos, senza pensieri.",
    subtitle: "Concierge dedicato, scelte curate, zero stress logistico.",
  },
  {
    headline: "Il lusso è non doversi occupare di nulla.",
    subtitle: "Ville, yacht e transfer coordinati da un unico referente.",
  },
  {
    headline: "La tua vacanza, già pronta.",
    subtitle: "Disponibilità in tempo reale, risposta in 30 minuti.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 1, ease: "easeOut" as const } },
};

const fadeScale = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 1, ease: "easeOut" as const } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.18 } },
};

/* Reveal text letter-by-letter */
const RevealText = ({ children, className = "" }: { children: string; className?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <span ref={ref} className={`inline-block overflow-hidden ${className}`}>
      <motion.span
        className="inline-block"
        initial={{ y: "110%" }}
        animate={isInView ? { y: "0%" } : { y: "110%" }}
        transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
      >
        {children}
      </motion.span>
    </span>
  );
};

const editorialCards = [
  {
    icon: Compass,
    label: "Esplora Mykonos al meglio",
    desc: "I migliori consigli per il tuo soggiorno",
    link: "/rentals",
    cta: "Scopri i veicoli",
    img: imgConsigli,
  },
  {
    icon: Star,
    label: "Esperienza su misura",
    desc: "Esperienze personalizzate per ogni esigenza",
    link: "/concierge",
    cta: "Scopri il Servizio",
    img: imgEsperienza,
  },
  {
    icon: Home,
    label: "I migliori alloggi sull'isola",
    desc: "Ville e appartamenti selezionati per te",
    link: "/villas",
    cta: "Vedi gli Alloggi",
    img: imgAlloggi,
  },
  {
    icon: Music,
    label: "Eventi da non perdere",
    desc: "I migliori locali, beach club e DJ set dell'isola",
    link: "/eventi",
    cta: "Scopri gli Eventi",
    img: imgEventi,
  },
];

const bentoVenues = [
  { img: imgNammos, label: "BEACH CLUB", title: "Nammos", link: "/locali/nammos" },
  { img: imgScorpios, label: "BEACH CLUB", title: "Scorpios", link: "/locali/scorpios" },
  { img: imgNoema, label: "RESTAURANT", title: "Noema", link: "/locali/noema" },
  { img: imgCoya, label: "RESTAURANT", title: "Coya", link: "/locali/coya" },
  { img: imgPrincipote, label: "BEACH CLUB", title: "Principote", link: "/locali/principote" },
];

const Index = () => {
  const { t, language } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const { data: villasData } = useVillas();
  const { data: apartmentsData } = useApartments();
  const { data: yachtsData } = useYachts();
  const { data: venuesData } = useVenues();
  // Highlights data consumed by <HighlightsRow /> component directly
  void villasData; void apartmentsData; void yachtsData; void venuesData;
  const parallaxRef = useRef(null);
  const carouselRef1 = useRef<HTMLDivElement>(null);
  const carouselRef2 = useRef<HTMLDivElement>(null);
  const carouselRef3 = useRef<HTMLDivElement>(null);
  const carouselRef4 = useRef<HTMLDivElement>(null);
  const [activeCards, setActiveCards] = useState<Record<string, number>>({ c1: 0, c2: 0, c3: 0, c4: 0 });
  const { scrollYProgress } = useScroll({ target: parallaxRef, offset: ["start end", "end start"] });
  const parallaxY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide((s) => (s + 1) % heroImages.length), 6000);
    return () => clearInterval(timer);
  }, []);

  // Track active card index for each carousel
  const getActiveIndex = (el: HTMLDivElement | null, itemCount: number) => {
    if (!el) return 0;
    const cardWidth = el.scrollWidth / itemCount;
    return Math.round(el.scrollLeft / cardWidth);
  };

  useEffect(() => {
    const refs = [
      { ref: carouselRef1, key: "c1", count: editorialCards.length },
      { ref: carouselRef2, key: "c2", count: 3 },
      { ref: carouselRef3, key: "c3", count: 2 },
      { ref: carouselRef4, key: "c4", count: 3 },
    ];
    const handlers: Array<() => void> = [];
    refs.forEach(({ ref, key, count }) => {
      const el = ref.current;
      if (!el) return;
      const handler = () => {
        setActiveCards((prev) => ({ ...prev, [key]: getActiveIndex(el, count) }));
      };
      el.addEventListener("scroll", handler, { passive: true });
      handlers.push(() => el.removeEventListener("scroll", handler));
    });
    return () => handlers.forEach((h) => h());
  }, []);

  // Auto-scroll carousels — smoother with CSS scroll-behavior
  useEffect(() => {
    const autoScroll = (ref: React.RefObject<HTMLDivElement>, itemCount: number) => {
      const el = ref.current;
      if (!el || window.innerWidth >= 640) return;
      const cardWidth = el.scrollWidth / itemCount;
      const currentIndex = Math.round(el.scrollLeft / cardWidth);
      const nextIndex = (currentIndex + 1) % itemCount;
      el.scrollTo({ left: nextIndex * cardWidth, behavior: "smooth" });
    };
    const timer = setInterval(() => {
      autoScroll(carouselRef1, editorialCards.length);
      autoScroll(carouselRef2, 3);
      autoScroll(carouselRef3, 2);
      autoScroll(carouselRef4, 3);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <Layout>
      {/* ══════ HERO ══════ */}
      <section className="relative h-screen -mt-16 overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={heroImages[0]}
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={heroVideo.url} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/15 to-black/70" />

        <button
          onClick={() => setCurrentSlide((s) => (s - 1 + heroImages.length) % heroImages.length)}
          className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-10 w-9 h-9 md:w-12 md:h-12 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:bg-white/10 hover:border-white/40 transition-all backdrop-blur-sm"
        >
          <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
        </button>
        <button
          onClick={() => setCurrentSlide((s) => (s + 1) % heroImages.length)}
          className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-10 w-9 h-9 md:w-12 md:h-12 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:bg-white/10 hover:border-white/40 transition-all backdrop-blur-sm"
        >
          <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
        </button>

        <div className="absolute inset-0 flex flex-col items-center justify-center px-6">
          <div className="flex items-center justify-center gap-2 mb-3">
            <MapPin className="h-3 w-3 text-accent" strokeWidth={1.5} />
            <span className="text-[10px] uppercase tracking-[0.4em] text-white/55 font-light">Mykonos, Greece</span>
          </div>

          <div className="relative w-full max-w-3xl text-center min-h-[110px] md:min-h-[130px]">
            {heroSlides.map((slide, i) => (
              <motion.div
                key={i}
                className="absolute inset-0 flex flex-col items-center justify-start gap-2 md:gap-3"
                initial={false}
                animate={{
                  opacity: i === currentSlide ? 1 : 0,
                  y: i === currentSlide ? 0 : 12,
                }}
                transition={{ duration: 0.9, ease: "easeOut" }}
                style={{ pointerEvents: i === currentSlide ? "auto" : "none" }}
              >
                <h1 className="font-serif text-[26px] md:text-4xl lg:text-[44px] text-white drop-shadow-2xl leading-[1.1] tracking-tight">
                  {slide.headline}
                </h1>
                <p className="text-xs md:text-sm text-white/75 font-light max-w-md mx-auto leading-relaxed drop-shadow-lg">
                  {slide.subtitle}
                </p>
              </motion.div>
            ))}
          </div>

          <Button
            className="mt-3 md:mt-4 rounded-full px-7 py-4 text-[11px] font-semibold bg-gradient-to-r from-primary to-accent text-white hover:opacity-90 shadow-xl shadow-accent/20 border-0 tracking-wide"
            asChild
          >
            <a href="#discover">Scopri di più</a>
          </Button>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-[2px] rounded-full transition-all duration-700 ${
                i === currentSlide ? "bg-white w-10" : "bg-white/25 w-5 hover:bg-white/50"
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </section>

      {/* ══════ HIGHLIGHTS — Instagram-style ══════ */}
      <HighlightsRow />



      {/* ══════ 4 EDITORIAL CARDS — Minimal Luxury ══════ */}
      <section id="discover" className="py-24 md:py-32 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.span
              variants={fadeUp}
              className="text-accent text-[10px] uppercase tracking-[0.4em] font-medium mb-4 block"
            >
              Luxury Concierge
            </motion.span>
            <motion.h2
              variants={fadeUp}
              className="font-serif text-2xl md:text-3xl lg:text-4xl text-foreground leading-[1.15]"
            >
              <span className="block">Esplora Mykonos</span>
              <span className="block">al meglio</span>
            </motion.h2>
          </motion.div>

          {/* Mobile: horizontal scroll, Desktop: grid */}
          <div
            ref={carouselRef1}
            className="sm:hidden flex gap-3 overflow-x-auto snap-x snap-mandatory pb-4 -mx-2 px-2 scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {editorialCards.map((card, i) => (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className={`snap-center shrink-0 w-[75vw] transition-all duration-500 ${activeCards.c1 === i ? "scale-[1.03]" : "scale-[0.97] opacity-60"}`}
              >
                <Link
                  to={card.link}
                  className={`group relative block overflow-hidden rounded-2xl h-[230px] border-2 transition-all duration-500 ${activeCards.c1 === i ? "border-accent/70 shadow-[0_0_25px_-5px_hsl(var(--accent)/0.4)]" : "border-transparent"}`}
                >
                  <img
                    src={card.img}
                    alt={card.label}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1400ms]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--primary))] via-[hsl(var(--primary)/0.7)] to-[hsl(var(--primary)/0.15)]" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="w-7 h-7 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center mb-2">
                      <card.icon className="h-3.5 w-3.5 text-white" />
                    </div>
                    <h3 className="font-serif text-base text-white mb-1 drop-shadow-lg">{card.label}</h3>
                    <p className="text-white/75 text-[11px] leading-snug mb-2 font-medium">{card.desc}</p>
                    <span className="inline-flex items-center gap-1.5 text-white text-[9px] font-semibold uppercase tracking-widest">
                      {card.cta} <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {editorialCards.map((card) => (
              <motion.div key={card.label} variants={fadeUp}>
                <Link to={card.link} className="group relative block overflow-hidden rounded-2xl h-[260px]">
                  <img
                    src={card.img}
                    alt={card.label}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1400ms]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--primary))] via-[hsl(var(--primary)/0.7)] to-[hsl(var(--primary)/0.15)]" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <div className="w-8 h-8 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center mb-3">
                      <card.icon className="h-3.5 w-3.5 text-white" />
                    </div>
                    <h3 className="font-serif text-lg md:text-xl text-white mb-1.5 drop-shadow-lg">{card.label}</h3>
                    <p className="text-white/75 text-xs leading-snug mb-3 font-medium">{card.desc}</p>
                    <span className="inline-flex items-center gap-1.5 text-white text-[10px] font-semibold uppercase tracking-widest group-hover:gap-3 transition-all duration-500">
                      {card.cta} <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════ RISTORANTI · BEACH CLUBS · CLUBS ══════ */}
      <section className="py-20 md:py-28 bg-foreground">
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="mb-10 md:mb-14 flex flex-col md:flex-row md:items-end md:justify-between gap-6"
          >
            <div>
              <motion.span
                variants={fadeUp}
                className="text-accent text-[10px] uppercase tracking-[0.4em] font-medium mb-4 block"
              >
                Selezionati per te
              </motion.span>
              <motion.h2
                variants={fadeUp}
                className="font-serif text-2xl md:text-4xl text-primary-foreground leading-[1.05]"
              >
                Ristoranti, Beach Club<br className="hidden md:block" /> & Clubs
              </motion.h2>
            </div>
            <motion.div variants={fadeUp}>
              <Button
                asChild
                className="rounded-full px-7 py-5 text-xs font-semibold bg-gradient-to-r from-primary to-accent text-white hover:opacity-90 shadow-xl shadow-accent/20 border-0"
              >
                <Link to="/eventi">
                  Scopri tutti <ArrowRight className="ml-2 h-3.5 w-3.5" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Mobile: dynamic luxury horizontal showcase */}
          <div
            className="md:hidden flex gap-3 overflow-x-auto snap-x snap-mandatory pb-3 -mx-4 px-4 scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {bentoVenues.map((v, i) => (
              <motion.div
                key={v.title}
                variants={fadeUp}
                className={`snap-center shrink-0 ${i === 0 ? "w-[68vw]" : "w-[52vw]"}`}
              >
                <Link to={v.link} className="group relative block overflow-hidden rounded-2xl aspect-[3/4] h-full w-full">
                  <img src={v.img} alt={v.title} className="w-full h-full object-cover group-active:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/5" />
                  <div className="absolute top-2.5 left-2.5">
                    <span className="px-1.5 py-0.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-accent text-[7px] uppercase tracking-[0.3em] font-bold">
                      {v.label}
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <h3 className={`font-serif text-white drop-shadow-lg leading-tight ${i === 0 ? "text-xl" : "text-base"}`}>
                      {v.title}
                    </h3>
                    <span className="mt-1 inline-flex items-center gap-1 text-white/85 text-[8px] font-semibold uppercase tracking-widest">
                      Scopri <ArrowRight className="h-2.5 w-2.5" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Desktop: original bento grid */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="hidden md:grid md:grid-cols-4 md:grid-rows-2 gap-4 md:h-[560px]"
          >
            {bentoVenues.map((v, i) => (
              <motion.div
                key={v.title}
                variants={fadeUp}
                className={i === 0 ? "col-span-2 row-span-2" : ""}
              >
                <Link
                  to={v.link}
                  className="group relative block overflow-hidden rounded-2xl h-full w-full"
                >
                  <img
                    src={v.img}
                    alt={v.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1400ms]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <span className="text-accent text-[10px] uppercase tracking-[0.4em] font-medium mb-1.5 block">
                      {v.label}
                    </span>
                    <h3 className={`font-serif text-white drop-shadow-lg ${i === 0 ? "text-4xl" : "text-xl"}`}>
                      {v.title}
                    </h3>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════ ALLOGGI — Full-Impact Luxury ══════ */}
      {[
        {
          img: villaImg,
          label: "Private Villas",
          title: "Ville",
          desc: (
            <>
              <span className="block">Lusso, privacy e panorami</span>
              <span className="block">mozzafiato sull'Egeo.</span>
            </>
          ),
          cta: "Scopri le Ville",
          link: "/villas",
        },
        {
          img: aptImg,
          label: "Design Apartments",
          title: "Appartamenti",
          desc: (
            <>
              <span className="block">Comfort e stile nel cuore</span>
              <span className="block">pulsante dell'isola.</span>
            </>
          ),
          cta: "Scopri gli Appartamenti",
          link: "/apartments",
        },
      ].map((item, idx) => (
        <section key={item.title} className="relative h-[92vh] md:h-screen overflow-hidden">
          <motion.img
            src={item.img}
            alt={item.title}
            className="w-full h-full object-cover"
            initial={{ scale: 1.1 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.8, ease: "easeOut" }}
          />
          <div
            className={`absolute inset-0 ${idx % 2 === 0 ? "bg-gradient-to-r from-black/70 via-black/30 to-transparent" : "bg-gradient-to-l from-black/70 via-black/30 to-transparent"}`}
          />
          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-6 md:px-20">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={stagger}
                className={`max-w-lg ${idx % 2 !== 0 ? "ml-auto text-right" : ""}`}
              >
                <motion.span
                  variants={fadeUp}
                  className="text-accent text-[10px] uppercase tracking-[0.4em] font-medium mb-4 block"
                >
                  {item.label}
                </motion.span>
                <motion.h2
                  variants={fadeUp}
                  className="font-serif text-2xl md:text-4xl lg:text-5xl text-white leading-[1.05] mb-3 md:mb-4 drop-shadow-2xl"
                >
                  {item.title}
                </motion.h2>
                <motion.p
                  variants={fadeUp}
                  className={`text-white text-sm md:text-base font-light leading-relaxed mb-6 max-w-sm drop-shadow-lg ${idx % 2 !== 0 ? "ml-auto" : ""}`}
                >
                  {item.desc}
                </motion.p>
                <motion.div variants={fadeUp} className={idx % 2 !== 0 ? "flex justify-end" : ""}>
                  <Button
                    className="rounded-full px-5 md:px-7 py-2.5 md:py-4 text-[10px] md:text-xs font-semibold bg-gradient-to-r from-primary to-accent text-white hover:opacity-90 shadow-xl shadow-accent/20 border-0"
                    asChild
                  >
                    <Link to={item.link}>
                      {item.cta} <ArrowRight className="ml-2 h-3 w-3 md:h-3.5 md:w-3.5" />
                    </Link>
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>
      ))}

      {/* ══════ SEA EXPERIENCES — Yachts, Boat Party, Escursioni ══════ */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        {/* Video background */}
        <div className="absolute inset-0">
          <video autoPlay muted loop playsInline className="w-full h-full object-cover">
            <source src="/videos/yacht-lovable.mov" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/85" />
        </div>
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent/40 to-transparent" />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.div variants={fadeUp} className="text-center mb-16">
              <span className="text-accent text-[10px] uppercase tracking-[0.4em] font-medium mb-4 block">
                Esperienze in Mare
              </span>
              <h2 className="font-serif text-2xl md:text-4xl lg:text-5xl text-white">Il mare, il tuo palcoscenico</h2>
            </motion.div>

            {/* Mobile: horizontal scroll */}
            <div
              ref={carouselRef2}
              className="md:hidden flex gap-3 overflow-x-auto snap-x snap-mandatory pb-4 -mx-2 px-2 max-w-6xl mx-auto"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {[
                {
                  icon: Anchor,
                  label: "Private Charter",
                  title: "Yacht Privati",
                  desc: "Naviga le Cicladi a bordo dei nostri yacht esclusivi. Flotta da 43 a 64 piedi.",
                  link: "/yachts",
                  cta: "Scopri la Flotta",
                },
                {
                  icon: Music,
                  label: "Party on the Sea",
                  title: "Boat Party",
                  desc: "Feste esclusive in mare aperto. DJ, cocktail premium e tramonti indimenticabili.",
                  link: "/boat-party",
                  cta: "Scopri le Feste",
                },
                {
                  icon: Compass,
                  label: "Island Adventures",
                  title: "Escursioni",
                  desc: "Delos, Rhenia e le isole vicine. Avventure private tra storia e natura.",
                  link: "/excursions",
                  cta: "Scopri le Escursioni",
                },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  variants={fadeUp}
                  className={`snap-center shrink-0 w-[75vw] transition-all duration-500 ${activeCards.c2 === i ? "scale-[1.02]" : "scale-100 opacity-70"}`}
                >
                  <Link
                    to={item.link}
                    className={`group relative block overflow-hidden rounded-2xl border bg-white/5 backdrop-blur-sm p-6 h-full transition-all duration-500 ${activeCards.c2 === i ? "border-accent/50 shadow-lg shadow-accent/10" : "border-white/10"}`}
                  >
                    <div className="w-11 h-11 rounded-full bg-accent/15 border border-accent/25 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                      <item.icon className="h-5 w-5 text-accent" />
                    </div>
                    <span className="text-accent/80 text-[8px] uppercase tracking-[0.4em] font-medium mb-2 block">
                      {item.label}
                    </span>
                    <h3 className="font-serif text-xl text-white mb-2 drop-shadow-lg">{item.title}</h3>
                    <p className="text-white/50 text-xs leading-relaxed mb-5">{item.desc}</p>
                    <span className="inline-flex items-center gap-2 text-white text-[10px] font-semibold uppercase tracking-widest">
                      {item.cta} <ArrowRight className="h-3 w-3" />
                    </span>
                    <div className="absolute -bottom-12 -right-12 w-[150px] h-[150px] rounded-full bg-accent/10 blur-[60px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  </Link>
                </motion.div>
              ))}
            </div>
            {/* Desktop: grid */}
            <div className="hidden md:grid md:grid-cols-3 gap-4 max-w-6xl mx-auto">
              {[
                {
                  icon: Anchor,
                  label: "Private Charter",
                  title: "Yacht Privati",
                  desc: "Naviga le Cicladi a bordo dei nostri yacht esclusivi. Flotta da 43 a 64 piedi.",
                  link: "/yachts",
                  cta: "Scopri la Flotta",
                },
                {
                  icon: Music,
                  label: "Party on the Sea",
                  title: "Boat Party",
                  desc: "Feste esclusive in mare aperto. DJ, cocktail premium e tramonti indimenticabili.",
                  link: "/boat-party",
                  cta: "Scopri le Feste",
                },
                {
                  icon: Compass,
                  label: "Island Adventures",
                  title: "Escursioni",
                  desc: "Delos, Rhenia e le isole vicine. Avventure private tra storia e natura.",
                  link: "/excursions",
                  cta: "Scopri le Escursioni",
                },
              ].map((item) => (
                <motion.div key={item.title} variants={fadeUp}>
                  <Link
                    to={item.link}
                    className="group relative block overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-8 md:p-10 h-full hover:border-accent/40 hover:bg-white/10 transition-all duration-700"
                  >
                    <div className="w-14 h-14 rounded-full bg-accent/15 border border-accent/25 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                      <item.icon className="h-6 w-6 text-accent" />
                    </div>
                    <span className="text-accent/80 text-[9px] uppercase tracking-[0.4em] font-medium mb-3 block">
                      {item.label}
                    </span>
                    <h3 className="font-serif text-2xl md:text-3xl text-white mb-3 drop-shadow-lg">{item.title}</h3>
                    <p className="text-white/50 text-sm leading-relaxed mb-8">{item.desc}</p>
                    <span className="inline-flex items-center gap-2 text-white text-xs font-semibold uppercase tracking-widest group-hover:gap-4 transition-all duration-500">
                      {item.cta} <ArrowRight className="h-3 w-3" />
                    </span>
                    <div className="absolute -bottom-12 -right-12 w-[150px] h-[150px] rounded-full bg-accent/10 blur-[60px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section ref={parallaxRef} className="relative h-[80vh] md:h-[75vh] overflow-hidden -mb-1">
        <motion.div className="absolute inset-0" style={{ y: parallaxY }}>
          <img src={imgUnUnico} alt="Mykonos experience" className="w-full h-[150%] object-cover object-bottom" />
        </motion.div>
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="text-center px-6"
          >
            <h2 className="font-serif text-2xl md:text-6xl text-white leading-tight max-w-3xl mx-auto">
              <RevealText>Un unico referente, ogni tuo desiderio</RevealText>
            </h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.6 }}
              className="mt-6 text-base md:text-lg max-w-md mx-auto font-light"
            >
              <span className="text-white">Dalla villa al ristorante, dal transfer al beach club.</span>{" "}
              <span className="text-accent font-medium">Ci pensiamo noi a tutto.</span>
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ══════ NOLEGGIO & TRANSFER ══════ */}
      <section className="py-16 md:py-32 bg-background relative">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.div variants={fadeUp} className="text-center mb-16">
              <span className="text-accent text-[10px] uppercase tracking-[0.4em] font-medium mb-4 block">
                Mobilità Premium
              </span>
              <h2 className="font-serif text-2xl md:text-4xl text-foreground">L'isola, ai tuoi ritmi</h2>
            </motion.div>

            {/* Mobile: horizontal scroll */}
            <div
              ref={carouselRef3}
              className="md:hidden flex gap-3 overflow-x-auto snap-x snap-mandatory pb-4 -mx-2 px-2"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {[
                {
                  img: carImg,
                  link: "/rentals",
                  label: "Premium Fleet",
                  title: "Noleggio Veicoli",
                  desc: "Cabrio, SUV, scooter e quad. Consegna in villa o aeroporto.",
                  cta: "Vedi i Veicoli",
                },
                {
                  img: carSuv,
                  link: "/transfer",
                  label: "VIP Transfer",
                  title: "Transfer Privati",
                  desc: "Dall'aeroporto alla tua villa, in totale comfort. Servizio 24/7.",
                  cta: "Prenota Transfer",
                },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  variants={fadeUp}
                  className={`snap-center shrink-0 w-[80vw] transition-all duration-500 ${activeCards.c3 === i ? "scale-[1.03]" : "scale-[0.97] opacity-60"}`}
                >
                  <Link
                    to={item.link}
                    className={`group relative block overflow-hidden rounded-2xl h-[280px] border-2 transition-all duration-500 ${activeCards.c3 === i ? "border-accent/70 shadow-[0_0_25px_-5px_hsl(var(--accent)/0.4)]" : "border-transparent"}`}
                  >
                    <img
                      src={item.img}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-[1400ms]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/65 to-black/40" />
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <span className="text-accent text-[9px] uppercase tracking-[0.3em] font-medium">
                        {item.label}
                      </span>
                      <h3
                        style={{ fontFamily: "Parkinsans, sans-serif" }}
                        className="text-xl text-white mt-1.5 mb-2 font-semibold"
                      >
                        {item.title}
                      </h3>
                      <p className="text-white/50 text-xs mb-4 max-w-xs">{item.desc}</p>
                      <span className="inline-flex items-center gap-2 text-white text-[10px] font-semibold uppercase tracking-widest">
                        {item.cta} <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
            {/* Desktop: grid */}
            <div className="hidden md:grid md:grid-cols-2 gap-4 max-w-5xl mx-auto">
              {[
                {
                  img: carImg,
                  link: "/rentals",
                  label: "Premium Fleet",
                  title: "Noleggio Veicoli",
                  desc: "Cabrio, SUV, scooter e quad. Consegna in villa o aeroporto.",
                  cta: "Vedi i Veicoli",
                },
                {
                  img: carSuv,
                  link: "/transfer",
                  label: "VIP Transfer",
                  title: "Transfer Privati",
                  desc: "Dall'aeroporto alla tua villa, in totale comfort. Servizio 24/7.",
                  cta: "Prenota Transfer",
                },
              ].map((item) => (
                <motion.div key={item.title} variants={fadeUp}>
                  <Link
                    to={item.link}
                    className="group relative block overflow-hidden rounded-2xl h-[320px] md:h-[480px]"
                  >
                    <img
                      src={item.img}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-[1400ms]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/65 to-black/40" />
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                      <span className="text-accent text-[10px] uppercase tracking-[0.3em] font-medium">
                        {item.label}
                      </span>
                      <h3
                        style={{ fontFamily: "Parkinsans, sans-serif" }}
                        className="text-2xl md:text-3xl text-white mt-2 mb-3 font-semibold"
                      >
                        {item.title}
                      </h3>
                      <p className="text-white/50 text-sm mb-5 max-w-xs">{item.desc}</p>
                      <span className="inline-flex items-center gap-3 text-white text-sm font-medium group-hover:gap-5 transition-all duration-500">
                        {item.cta} <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════ CTA FINALE ══════ */}
      <section className="relative h-[60vh] md:h-[80vh] overflow-hidden">
        <img src={imgProntoVivere} alt="Mykonos sunset" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center px-6 max-w-2xl"
          >
            <motion.span
              variants={fadeUp}
              className="text-accent text-[10px] uppercase tracking-[0.4em] font-medium mb-6 block"
            >
              La Tua Esperienza
            </motion.span>
            <motion.h2 variants={fadeUp} className="font-serif text-2xl md:text-4xl text-white leading-tight mb-5">
              Pronto a vivere
              <br />
              Mykonos?
            </motion.h2>
            <motion.div variants={fadeUp} className="max-w-md mx-auto mb-10">
              <p className="text-white text-xs md:text-lg font-light leading-relaxed">
                Raccontaci come immagini la tua vacanza.
              </p>
              <p className="text-accent text-xs md:text-lg font-medium leading-relaxed mt-1">
                Il nostro team creerà un'esperienza su misura.
              </p>
            </motion.div>
            <motion.div variants={fadeUp}>
              <Button
                className="rounded-full px-8 md:px-12 py-4 md:py-6 text-xs md:text-sm font-semibold bg-gradient-to-r from-primary to-accent text-white hover:opacity-90 shadow-xl shadow-accent/20 border-0"
                asChild
              >
                <a href="https://wa.me/393400000000" target="_blank" rel="noopener noreferrer">
                  Contatta il Concierge
                </a>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ══════ SOCIAL — Instagram + TikTok unified ══════ */}
      <section className="py-16 md:py-28 bg-foreground relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[200px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[150px] pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            {/* Header */}
            <motion.div variants={fadeUp} className="text-center mb-10 md:mb-14">
              <span className="text-accent text-[10px] uppercase tracking-[0.4em] font-medium mb-3 block">
                @allyouneed.experience
              </span>
              <h2 className="font-serif text-2xl md:text-4xl text-white">Seguici sui social</h2>
              <p className="text-white/55 text-xs md:text-sm font-light mt-3 max-w-md mx-auto">
                {language === "it"
                  ? "Mykonos attraverso i nostri occhi: contenuti esclusivi, luoghi segreti e momenti indimenticabili."
                  : "Mykonos through our eyes: exclusive content, secret spots and unforgettable moments."}
              </p>
            </motion.div>

            {/* Bento social grid: big TikTok phone + asymmetric IG tiles */}
            <motion.div
              variants={fadeUp}
              className="grid grid-cols-4 grid-rows-4 gap-2 md:gap-3 max-w-5xl mx-auto h-[460px] md:h-[560px]"
            >
              {/* TikTok hero — vertical phone, spans 2 cols x 4 rows */}
              <a
                href="https://www.tiktok.com/@allyouneed.experience"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative rounded-2xl md:rounded-3xl overflow-hidden bg-black col-span-2 row-span-4"
              >
                <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1800ms]">
                  <source src="/videos/partito-riferimento.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-black/30" />
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-black flex items-center justify-center shadow-lg border border-white/20">
                    <svg viewBox="0 0 24 24" className="h-4 w-4 text-white fill-current">
                      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.88-2.89 2.89 2.89 0 012.88-2.89c.28 0 .54.04.79.1V9a6.33 6.33 0 00-.79-.05A6.34 6.34 0 003.15 15.3a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V9.03a8.3 8.3 0 004.76 1.5V7.08a4.84 4.84 0 01-1-.39z" />
                    </svg>
                  </span>
                  <span className="text-[10px] font-medium text-white/80 tracking-wider uppercase">TikTok · Live</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
                  <p className="text-white font-serif text-lg md:text-2xl leading-tight">Mykonos in motion</p>
                  <p className="text-white/70 text-[11px] md:text-xs mt-1">@allyouneed.experience</p>
                </div>
              </a>

              {/* IG tile 1 — big */}
              <a
                href="https://www.instagram.com/allyouneed.experience/"
                target="_blank" rel="noopener noreferrer"
                className="group relative rounded-2xl md:rounded-3xl overflow-hidden col-span-2 row-span-2"
              >
                <img src={igVillaDimitra} alt="Villa Dimitra" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1800ms]" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
                <span className="absolute top-2.5 left-2.5 w-7 h-7 rounded-full bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737] flex items-center justify-center shadow-lg">
                  <Instagram className="h-3.5 w-3.5 text-white" />
                </span>
                <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
                  <span className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-white/60">In evidenza</span>
                  <p className="text-white text-xs md:text-sm font-medium mt-0.5 leading-tight">Villa Dimitra — sunset views 🌅</p>
                </div>
              </a>

              {/* IG tile 2 */}
              <a
                href="https://www.instagram.com/allyouneed.experience/"
                target="_blank" rel="noopener noreferrer"
                className="group relative rounded-2xl md:rounded-3xl overflow-hidden col-span-1 row-span-2"
              >
                <img src={igRistoranti} alt="Ristoranti" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1800ms]" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
                <span className="absolute top-2 left-2 w-6 h-6 rounded-full bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737] flex items-center justify-center">
                  <Instagram className="h-3 w-3 text-white" />
                </span>
                <p className="absolute bottom-2 left-2 right-2 text-white text-[10px] md:text-xs font-medium leading-tight">5 Ristoranti 🍷</p>
              </a>

              {/* IG tile 3 */}
              <a
                href="https://www.instagram.com/allyouneed.experience/"
                target="_blank" rel="noopener noreferrer"
                className="group relative rounded-2xl md:rounded-3xl overflow-hidden col-span-1 row-span-2"
              >
                <img src={igErrori} alt="Errori" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1800ms]" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
                <span className="absolute top-2 left-2 w-6 h-6 rounded-full bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737] flex items-center justify-center">
                  <Instagram className="h-3 w-3 text-white" />
                </span>
                <p className="absolute bottom-2 left-2 right-2 text-white text-[10px] md:text-xs font-medium leading-tight">5 Errori ⚠️</p>
              </a>
            </motion.div>

            {/* CTAs */}
            <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-3 mt-8 md:mt-10">
              <Button
                className="rounded-full px-6 py-4 text-xs font-semibold bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white hover:opacity-90 border-0"
                asChild
              >
                <a href="https://www.instagram.com/allyouneed.experience/" target="_blank" rel="noopener noreferrer">
                  <Instagram className="mr-2 h-4 w-4" /> Instagram
                </a>
              </Button>
              <Button
                className="rounded-full px-6 py-4 text-xs font-semibold bg-white/10 backdrop-blur-xl text-white hover:bg-white/20 border border-white/20"
                asChild
              >
                <a href="https://www.tiktok.com/@allyouneed.experience" target="_blank" rel="noopener noreferrer">
                  <svg viewBox="0 0 24 24" className="mr-2 h-4 w-4 fill-current">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.88-2.89 2.89 2.89 0 012.88-2.89c.28 0 .54.04.79.1V9a6.33 6.33 0 00-.79-.05A6.34 6.34 0 003.15 15.3a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V9.03a8.3 8.3 0 004.76 1.5V7.08a4.84 4.84 0 01-1-.39z" />
                  </svg>
                  TikTok
                </a>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ══════ RECENSIONI — Editorial Luxury ══════ */}
      <section className="py-12 md:py-24 bg-foreground relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/3 rounded-full blur-[200px] pointer-events-none" />

        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.div variants={fadeUp} className="text-center mb-8 md:mb-14">
              <span className="text-accent text-[10px] uppercase tracking-[0.4em] font-medium mb-3 block">
                {t("reviews.subtitle")}
              </span>
              <h2 className="font-serif text-xl md:text-3xl text-white">{t("reviews.title")}</h2>
            </motion.div>

            {/* Mobile: horizontal scroll carousel */}
            <div
              ref={carouselRef4}
              className="md:hidden flex gap-3 overflow-x-auto snap-x snap-mandatory pb-4 -mx-2 px-2"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {[
                {
                  name: "Marco & Giulia",
                  from: "Milano, Italia",
                  initial: "M",
                  text: "Un'esperienza indimenticabile. Dalla villa al transfer, tutto perfetto. Il team è stato incredibilmente attento ad ogni dettaglio. Non abbiamo dovuto pensare a nulla.",
                  rating: 5,
                  featured: true,
                },
                {
                  name: "James & Sophie",
                  from: "London, UK",
                  initial: "J",
                  text: "The best concierge service we've ever experienced. They arranged everything from restaurant bookings to yacht tours. Absolutely flawless.",
                  rating: 5,
                  featured: false,
                },
                {
                  name: "Pierre & Marie",
                  from: "Paris, France",
                  initial: "P",
                  text: "Service exceptionnel. Notre villa était magnifique et les recommandations de restaurants étaient parfaites. On reviendra sans hésiter!",
                  rating: 5,
                  featured: false,
                },
              ].map((review, i) => (
                <div
                  key={i}
                  className={`snap-center shrink-0 w-[80vw] transition-all duration-500 ${activeCards.c4 === i ? "scale-[1.02]" : "scale-100 opacity-70"}`}
                >
                  <div
                    className={`relative p-5 rounded-2xl bg-white/[0.04] h-full border transition-all duration-500 ${activeCards.c4 === i ? "border-accent/40 shadow-lg shadow-accent/10" : "border-white/8"}`}
                  >
                    <div className="flex gap-1 mb-3">
                      {Array.from({ length: review.rating }).map((_, s) => (
                        <Star key={s} className="h-3 w-3 text-accent fill-accent" />
                      ))}
                    </div>
                    <p className="text-white/70 text-xs leading-relaxed mb-4 italic">"{review.text}"</p>
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{review.initial}</span>
                      </div>
                      <div>
                        <p className="text-white text-xs font-semibold">{review.name}</p>
                        <p className="text-white/40 text-[10px]">{review.from}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop: 3 compact cards side-by-side */}
            <div className="hidden md:block">
              <motion.div variants={fadeUp} className="grid md:grid-cols-3 gap-5 max-w-6xl mx-auto">
                {[
                  {
                    name: "Marco & Giulia",
                    from: "Milano",
                    initial: "MG",
                    text: "Dalla villa al transfer: coordinamento impeccabile e risposte immediate.",
                    meta: "Ville · Agosto 2024",
                    rating: 5,
                  },
                  {
                    name: "James & Sophie",
                    from: "London",
                    initial: "JS",
                    text: "Best concierge orchestration we have experienced in the Cyclades.",
                    meta: "Yacht · July 2024",
                    rating: 5,
                  },
                  {
                    name: "Pierre & Marie",
                    from: "Paris",
                    initial: "PM",
                    text: "Organisation precise, recommandations parfaites et execution fluide.",
                    meta: "Villa · Juin 2024",
                    rating: 5,
                  },
                ].map((review, i) => (
                  <motion.div
                    key={i}
                    variants={fadeUp}
                    className="relative p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-accent/25 transition-all duration-500 group"
                    whileHover={{ y: -3 }}
                  >
                    <div className="flex gap-1 mb-4">
                      {Array.from({ length: review.rating }).map((_, s) => (
                        <Star key={s} className="h-3 w-3 text-accent fill-accent" />
                      ))}
                    </div>
                    <p className="text-white/70 text-[13px] leading-relaxed mb-6 italic">«{review.text}»</p>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center">
                        <span className="text-white/70 text-[10px] font-semibold tracking-wider">{review.initial}</span>
                      </div>
                      <div>
                        <p className="text-white text-[13px] font-semibold leading-tight">{review.name}</p>
                        <p className="text-white/45 text-[11px]">{review.from}</p>
                        <p className="text-white/35 text-[10px] italic mt-0.5">{review.meta}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════ CONSIGLI DI VIAGGIO — Magazine Style ══════ */}
      <section className="py-12 md:py-24 bg-background relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.div variants={fadeUp} className="text-center mb-10">
              <span className="text-accent text-[10px] uppercase tracking-[0.4em] font-medium mb-3 block">
                {t("tips.subtitle")}
              </span>
              <h2 className="font-serif text-xl md:text-3xl text-foreground mb-3">{t("tips.title")}</h2>
              <p className="text-muted-foreground text-sm font-light max-w-lg mx-auto">
                {language === "it"
                  ? "Tutto quello che devi sapere per vivere Mykonos come un insider."
                  : "Everything you need to know to experience Mykonos like an insider."}
              </p>
            </motion.div>

            {/* Two-column editorial layout — photo left, text right on mobile too */}
            <div className="max-w-6xl mx-auto space-y-4 md:space-y-6">
              {[
                {
                  icon: Plane,
                  img: tipTravel,
                  title: { it: "Quando Prenotare", en: "When to Book" },
                  desc: {
                    it: "Prenota il volo tra gennaio e marzo per le migliori tariffe. Gli alloggi di lusso si esauriscono velocemente: contattaci almeno 3 mesi prima.",
                    en: "Book your flight between January and March for the best rates. Luxury accommodations sell out fast: contact us at least 3 months in advance.",
                  },
                },
                {
                  icon: Utensils,
                  img: tipDining,
                  title: { it: "Dove Mangiare", en: "Where to Eat" },
                  desc: {
                    it: "I ristoranti top richiedono prenotazione. Chiedici i nostri preferiti: abbiamo accesso a tavoli esclusivi nei locali più richiesti dell'isola.",
                    en: "Top restaurants require reservations. Ask us for our favorites: we have access to exclusive tables at the island's most sought-after venues.",
                  },
                },
                {
                  icon: Ship,
                  img: tipIslands,
                  title: { it: "Isole Vicine", en: "Nearby Islands" },
                  desc: {
                    it: "Da Mykonos puoi raggiungere Delos (20 min) e Tinos (30 min). Organizziamo gite in barca privata per esplorare le isole circostanti.",
                    en: "From Mykonos you can reach Delos (20 min) and Tinos (30 min). We organize private boat trips to explore the surrounding islands.",
                  },
                },
              ].map((tip, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: i * 0.1 }}
                  className={`grid grid-cols-[110px_1fr] md:grid-cols-[260px_1fr] gap-0 rounded-xl overflow-hidden border border-border/50 bg-card shadow-md group hover:border-accent/20 transition-all duration-700 ${i % 2 !== 0 ? "md:direction-rtl" : ""}`}
                >
                  <div className={`relative h-full overflow-hidden ${i % 2 !== 0 ? "md:order-2" : ""}`}>
                    <img
                      src={tip.img}
                      alt={tip.title[language]}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2000ms]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
                  </div>
                  <div className={`p-4 md:p-6 flex flex-col justify-center ${i % 2 !== 0 ? "md:order-1" : ""}`}>
                    <div className="w-7 h-7 md:w-9 md:h-9 rounded-lg md:rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-2 md:mb-3 shadow-md shadow-accent/20">
                      <tip.icon className="h-3 w-3 md:h-4 md:w-4 text-white" />
                    </div>
                    <h3 className="font-serif text-sm md:text-xl text-foreground mb-1.5 md:mb-2">
                      {tip.title[language]}
                    </h3>
                    <p className="text-muted-foreground text-[10px] md:text-[13px] leading-relaxed">
                      {tip.desc[language]}
                    </p>
                  </div>
                </motion.div>
              ))}

              {/* Bottom row — 3 compact cards */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={stagger}
                className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 pt-2 md:pt-4"
              >
                {[
                  {
                    icon: Sun,
                    title: { it: "Cosa Portare", en: "What to Pack" },
                    desc: {
                      it: "Abbigliamento leggero di giorno, elegante per la sera. Crema solare SPF50+ e foulard per il Meltemi.",
                      en: "Light clothing during the day, elegant for the evening. SPF50+ sunscreen and a scarf for the Meltemi.",
                    },
                  },
                  {
                    icon: CreditCard,
                    title: { it: "Budget & Pagamenti", en: "Budget & Payments" },
                    desc: {
                      it: "Le carte sono accettate ovunque. Prevedi 150-300€/giorno. Il nostro concierge base è gratuito.",
                      en: "Cards accepted everywhere. Budget 150-300€/day. Our basic concierge is free.",
                    },
                  },
                  {
                    icon: Compass,
                    title: { it: "Spostarsi sull'Isola", en: "Getting Around" },
                    desc: {
                      it: "Noleggia scooter o auto per massima libertà. I taxi sono limitati in alta stagione.",
                      en: "Rent a scooter or car for freedom. Taxis are limited in peak season.",
                    },
                  },
                ].map((tip, i) => (
                  <motion.div
                    key={i}
                    variants={fadeUp}
                    className="p-5 md:p-8 rounded-2xl border border-border/50 bg-card hover:border-accent/20 transition-all duration-500 group"
                    whileHover={{ y: -4 }}
                  >
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-3 md:mb-5 shadow-lg shadow-accent/10 group-hover:scale-110 transition-transform duration-500">
                      <tip.icon className="h-3.5 w-3.5 md:h-4 md:w-4 text-white" />
                    </div>
                    <h3
                      className="text-foreground font-semibold text-sm md:text-lg mb-2 md:mb-3"
                      style={{ fontFamily: "'Parkinsans', sans-serif" }}
                    >
                      {tip.title[language]}
                    </h3>
                    <p className="text-muted-foreground text-[11px] md:text-sm leading-relaxed">{tip.desc[language]}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════ FAQ — Luxury Minimalist ══════ */}
      <section className="py-16 md:py-36 bg-foreground relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 max-w-6xl mx-auto">
              {/* Left — Title */}
              <motion.div variants={fadeUp} className="lg:sticky lg:top-32 lg:self-start">
                <span className="text-accent text-[10px] uppercase tracking-[0.4em] font-medium mb-4 block">
                  {t("faq.subtitle")}
                </span>
                <h2 className="font-serif text-2xl md:text-4xl text-white mb-5">{t("faq.title")}</h2>
                <p className="text-white/40 text-base font-light leading-relaxed mb-8 max-w-sm">
                  {language === "it"
                    ? "Non trovi la risposta che cerchi? Scrivici su WhatsApp e ti risponderemo in pochi minuti."
                    : "Can't find what you're looking for? Message us on WhatsApp and we'll reply in minutes."}
                </p>
                <Button
                  className="rounded-full px-8 text-sm font-semibold bg-gradient-to-r from-primary to-accent text-white hover:opacity-90 shadow-xl shadow-accent/20 border-0"
                  asChild
                >
                  <a href="https://wa.me/393400000000" target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="mr-2 h-4 w-4" /> WhatsApp
                  </a>
                </Button>
              </motion.div>

              {/* Right — Accordion */}
              <motion.div variants={fadeUp}>
                <Accordion type="single" collapsible className="space-y-4">
                  {[
                    {
                      q: { it: "Come funziona il servizio concierge?", en: "How does the concierge service work?" },
                      a: {
                        it: "Basta contattarci su WhatsApp o tramite il modulo di contatto. Il nostro team si occuperà di organizzare ogni aspetto della tua vacanza: dall'alloggio al transfer, dai ristoranti alle esperienze esclusive.",
                        en: "Simply contact us on WhatsApp or through the contact form. Our team will handle every aspect of your vacation: from accommodation to transfers, from restaurants to exclusive experiences.",
                      },
                    },
                    {
                      q: {
                        it: "Quando è il periodo migliore per visitare Mykonos?",
                        en: "When is the best time to visit Mykonos?",
                      },
                      a: {
                        it: "La stagione va da maggio a ottobre. Giugno e settembre offrono il miglior equilibrio tra clima, prezzi e vivacità. Luglio e agosto sono i mesi più movimentati.",
                        en: "The season runs from May to October. June and September offer the best balance of weather, prices, and vibrancy. July and August are the busiest months.",
                      },
                    },
                    {
                      q: {
                        it: "Il servizio è incluso nel prezzo dell'alloggio?",
                        en: "Is the service included in the accommodation price?",
                      },
                      a: {
                        it: "Il servizio concierge di base è completamente gratuito per i nostri ospiti. Servizi aggiuntivi come noleggio yacht e chef privato hanno un costo separato.",
                        en: "The basic concierge service is completely free for our guests. Additional services such as yacht rental and private chef have a separate cost.",
                      },
                    },
                    {
                      q: {
                        it: "Come posso prenotare un transfer dall'aeroporto?",
                        en: "How can I book an airport transfer?",
                      },
                      a: {
                        it: "Puoi prenotare dalla sezione Transfer del nostro sito o contattarci su WhatsApp. Offriamo servizio 24/7 con veicoli premium.",
                        en: "You can book from the Transfer section of our website or contact us on WhatsApp. We offer 24/7 service with premium vehicles.",
                      },
                    },
                    {
                      q: {
                        it: "Posso cancellare o modificare la prenotazione?",
                        en: "Can I cancel or modify my booking?",
                      },
                      a: {
                        it: "Sì, le cancellazioni sono gratuite fino a 48 ore prima dell'arrivo. Per modifiche last-minute, contattaci direttamente.",
                        en: "Yes, cancellations are free up to 48 hours before arrival. For last-minute changes, contact us directly.",
                      },
                    },
                  ].map((faq, i) => (
                    <AccordionItem
                      key={i}
                      value={`faq-${i}`}
                      className="border border-white/8 rounded-xl px-6 bg-white/[0.03] backdrop-blur-sm data-[state=open]:border-accent/25 data-[state=open]:bg-white/[0.06] transition-all duration-500"
                    >
                      <AccordionTrigger
                        className="text-white text-left text-sm md:text-base font-medium hover:no-underline py-5 [&[data-state=open]]:text-accent transition-colors"
                        style={{ fontFamily: "'Parkinsans', sans-serif" }}
                      >
                        {faq.q[language]}
                      </AccordionTrigger>
                      <AccordionContent className="text-white/50 text-sm leading-relaxed pb-5">
                        {faq.a[language]}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
