import { Link } from "react-router-dom";
import { Instagram, Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import logoAln from "@/assets/logo-aln.png";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="relative bg-foreground text-primary-foreground/70 overflow-hidden">
      {/* Decorative glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-accent/5 blur-[120px]" />
      
      <div className="container mx-auto px-4 py-14 md:py-24 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-4">
            <img src={logoAln} alt="All You Need" className="h-16 w-auto brightness-0 invert mb-6" />
            <p className="text-sm leading-relaxed text-primary-foreground/40 max-w-xs">
              {t("hero.subtitle")}
            </p>
            <div className="flex items-center gap-4 mt-8">
              <a
                href="https://www.instagram.com/allyouneed.experience/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-2xl bg-primary-foreground/5 border border-primary-foreground/10 flex items-center justify-center hover:bg-accent/20 hover:border-accent/30 transition-all duration-300"
              >
                <Instagram className="h-5 w-5 text-accent" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3">
            <h4 className="font-serif text-lg font-bold text-primary-foreground mb-6">{t("footer.quickLinks")}</h4>
            <div className="flex flex-col gap-3">
              {[
                { to: "/villas", label: "Ville" },
                { to: "/apartments", label: "Appartamenti" },
                { to: "/rentals", label: t("nav.rentals") },
                { to: "/locations", label: t("nav.locations") },
                { to: "/concierge", label: "Concierge" },
                { to: "/contatti", label: "Contatti" },
                { to: "/work-with-us", label: t("nav.workWithUs") },
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="group flex items-center gap-2 text-sm hover:text-primary-foreground transition-colors duration-200"
                >
                  <ArrowRight className="h-3 w-3 text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span>{link.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="md:col-span-3">
            <h4 className="font-serif text-lg font-bold text-primary-foreground mb-6">{t("footer.contact")}</h4>
            <div className="flex flex-col gap-4">
              <a href="mailto:info@allyouneed.com" className="flex items-center gap-3 text-sm hover:text-primary-foreground transition-colors group">
                <div className="w-9 h-9 rounded-xl bg-primary-foreground/5 border border-primary-foreground/10 flex items-center justify-center group-hover:bg-accent/20 group-hover:border-accent/30 transition-all">
                  <Mail className="h-4 w-4 text-accent" />
                </div>
                info@allyouneed.com
              </a>
              <a href="tel:+390000000000" className="flex items-center gap-3 text-sm hover:text-primary-foreground transition-colors group">
                <div className="w-9 h-9 rounded-xl bg-primary-foreground/5 border border-primary-foreground/10 flex items-center justify-center group-hover:bg-accent/20 group-hover:border-accent/30 transition-all">
                  <Phone className="h-4 w-4 text-accent" />
                </div>
                +39 000 000 0000
              </a>
              <span className="flex items-center gap-3 text-sm">
                <div className="w-9 h-9 rounded-xl bg-primary-foreground/5 border border-primary-foreground/10 flex items-center justify-center">
                  <MapPin className="h-4 w-4 text-accent" />
                </div>
                Mykonos, Greece
              </span>
            </div>
          </div>

          {/* Newsletter teaser */}
          <div className="md:col-span-2">
            <h4 className="font-serif text-lg font-bold text-primary-foreground mb-6">{t("footer.followUs")}</h4>
            <p className="text-sm text-primary-foreground/40 leading-relaxed mb-4">
              {t("footer.followSubtitle")}
            </p>
            <a
              href="https://www.instagram.com/allyouneed.experience/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent text-sm font-semibold hover:text-accent/80 transition-colors"
            >
              @allyouneed.experience
            </a>
          </div>
        </div>

        <div className="border-t border-primary-foreground/8 mt-20 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-primary-foreground/25">{t("footer.rights")}</p>
          <p className="text-xs text-primary-foreground/25">Made with ♡ for Mykonos</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
