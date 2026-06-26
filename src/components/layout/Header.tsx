import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Globe, Instagram, Mail, Phone } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import logoAln from "@/assets/logo-aln.png";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const transparent = isHome && !scrolled;

  const leftCol = [
    { to: "/villas", label: t("nav.villas") },
    { to: "/apartments", label: t("nav.apartments") },
    { to: "/rentals", label: t("nav.rentals") },
    { to: "/yachts", label: "Yacht" },
    { to: "/locali", label: language === "it" ? "Locali" : "Venues" },
    { to: "/eventi", label: language === "it" ? "Eventi" : "Events" },
  ];

  const rightCol = [
    { to: "/transfer", label: t("nav.transfer") },
    { to: "/concierge", label: "Concierge" },
    { to: "/chi-siamo", label: t("nav.chiSiamo") },
    { to: "/contatti", label: t("nav.contatti") },
  ];


  const toggleLang = () => setLanguage(language === "it" ? "en" : "it");

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${transparent ? "bg-transparent border-b border-transparent" : "bg-background/90 backdrop-blur-xl border-b border-border/30 shadow-sm"}`}>
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 py-2">
            <img src={logoAln} alt="All You Need" className={`h-12 w-auto transition-all duration-500 ${transparent ? "brightness-0 invert drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]" : ""}`} />
          </Link>

          <div className="hidden md:flex items-center gap-4">
            <p className={`text-sm max-w-xs leading-snug transition-colors duration-500 ${transparent ? "text-white/85 drop-shadow-[0_1px_6px_rgba(0,0,0,0.5)]" : "text-muted-foreground"}`}>
              {language === "it"
                ? "Personalizza il tuo viaggio con il nostro servizio concierge"
                : "Customize your trip with our concierge service"}
            </p>
            <Button
              className={`rounded-full px-6 whitespace-nowrap transition-all duration-500 ${transparent ? "bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-md shadow-lg" : "bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90 shadow-lg shadow-primary/20"}`}
              asChild
            >
              <Link to="/concierge">Contatta il Concierge</Link>
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLang}
              className={`gap-1.5 rounded-full transition-colors duration-500 ${transparent ? "text-white/80 hover:bg-white/10 hover:text-white" : "text-foreground/60 hover:bg-muted"}`}
            >
              <Globe className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">{language}</span>
            </Button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors duration-500 ${transparent ? "text-white hover:bg-white/10" : "text-foreground hover:bg-muted"}`}
              aria-label="Toggle menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>


      {/* Fullscreen overlay menu — two-column editorial layout */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[60] flex flex-col"
            style={{
              background: 'linear-gradient(180deg, hsl(222 47% 6%) 0%, hsl(222 47% 11%) 40%, hsl(225 50% 16%) 70%, hsl(222 47% 10%) 100%)',
            }}
          >
            {/* Top bar */}
            <div className="container mx-auto px-4 h-16 flex items-center justify-between shrink-0">
              <img src={logoAln} alt="All You Need" className="h-12 w-auto brightness-0 invert" />
              <motion.button
                onClick={() => setIsOpen(false)}
                className="w-10 h-10 flex items-center justify-center text-white/80 hover:bg-white/10 rounded-full transition-colors"
                aria-label="Close menu"
                whileHover={{ rotate: 90 }}
                transition={{ duration: 0.3 }}
              >
                <X className="h-6 w-6" />
              </motion.button>
            </div>

            {/* Content area */}
            <div className="flex-1 flex flex-col justify-center overflow-y-auto px-5 md:px-4 py-3 md:py-6">
              <div className="container mx-auto max-w-4xl">
                {/* Section label */}
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.5 }}
                  className="text-accent text-[9.5px] md:text-[11px] font-semibold uppercase tracking-[0.4em] md:tracking-[0.5em] mb-3 md:mb-8"
                >
                  {language === "it" ? "Esplora" : "Explore"}
                </motion.p>

                {/* Navigation links — 2 cols on mobile, 2 on desktop */}
                <nav className="grid grid-cols-2 gap-x-6 md:gap-x-16 gap-y-0 md:gap-y-2 mb-4 md:mb-12">
                  {[...leftCol, ...rightCol].map((link, i) => (
                    <motion.div
                      key={link.to}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: 0.05 * i, duration: 0.45, ease: [0.33, 1, 0.68, 1] }}
                    >
                      <Link
                        to={link.to}
                        onClick={() => setIsOpen(false)}
                        className={`group block text-left py-1.5 md:py-2.5 transition-all duration-300 ${
                          location.pathname === link.to
                            ? "text-accent"
                            : "text-white hover:text-accent"
                        }`}
                      >
                        <span className="font-serif text-[15px] md:text-3xl lg:text-4xl font-bold relative leading-tight">
                          {link.label}
                          <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-accent group-hover:w-full transition-all duration-500" />
                        </span>
                      </Link>
                    </motion.div>
                  ))}
                </nav>

                {/* Concierge CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="mb-4 md:mb-10"
                >
                  <div className="w-10 md:w-16 h-[1px] bg-accent/30 mb-3 md:mb-6" />
                  <p className="text-white/60 text-[9.5px] md:text-[10px] font-semibold uppercase tracking-[0.28em] md:tracking-[0.4em] mb-2.5 md:mb-4 leading-relaxed">
                    {language === "it"
                      ? "Personalizza il tuo viaggio con il nostro concierge"
                      : "Customize your trip with our concierge"}
                  </p>
                  <Button
                    className="rounded-full px-5 md:px-8 py-2.5 md:py-4 bg-transparent border border-accent/40 text-accent hover:bg-accent/10 transition-all duration-300 text-[11px] md:text-sm font-semibold tracking-wider uppercase"
                    onClick={() => setIsOpen(false)}
                    asChild
                  >
                    <Link to="/concierge">
                      Contatta il Concierge
                    </Link>
                  </Button>
                </motion.div>

                {/* Contact row */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="flex flex-col md:flex-row md:flex-wrap md:items-center gap-2 md:gap-6 text-white/55 text-[11px] md:text-xs"
                >
                  <a href="mailto:info@allyouneedexperience.com" className="flex items-center gap-2 hover:text-accent transition-colors truncate">
                    <Mail className="h-3.5 w-3.5 shrink-0" /> info@allyouneedexperience.com
                  </a>
                  <span className="hidden md:block w-px h-4 bg-white/10" />
                  <a href="tel:+393420639539" className="flex items-center gap-2 hover:text-accent transition-colors">
                    <Phone className="h-3.5 w-3.5 shrink-0" /> +39 342 063 9539
                  </a>
                  <span className="hidden md:block w-px h-4 bg-white/10" />
                  <div className="flex items-center gap-3">
                    <a href="https://www.instagram.com/allyouneed.experience/" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
                      <Instagram className="h-4 w-4" />
                    </a>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
