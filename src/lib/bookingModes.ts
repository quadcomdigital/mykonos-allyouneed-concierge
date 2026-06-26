import { Utensils, Sparkles, Sun, Wine, Ticket, Crown, type LucideIcon } from "lucide-react";

export type BookingMode =
  | "restaurant_dinner"
  | "restaurant_dinner_show"
  | "restaurant_lunch_show"
  | "beach_daybed"
  | "club_table_only"
  | "club_accredito_table";

/** What is bookable: a guest-list pass with QR, a privé table, or both. */
export type BookingKind = "pass" | "table" | "pass-and-table";

export interface BookingModeConfig {
  kind: BookingKind;
  icon: LucideIcon;
  /** Short label shown on small badges (1-2 words). */
  shortLabel: { it: string; en: string };
  /** Longer label for hero / legend. */
  label: { it: string; en: string };
  /** One-liner describing what the guest gets. */
  hint: { it: string; en: string };
  /** Tailwind tones (text, bg, border) — kept self-contained for clarity. */
  tone: {
    text: string;
    bg: string;
    border: string;
    /** Solid accent for the kind badge — used as the "what you can book" chip. */
    chip: string;
  };
}

export const BOOKING_MODES: Record<BookingMode, BookingModeConfig> = {
  restaurant_dinner: {
    kind: "table",
    icon: Utensils,
    shortLabel: { it: "Cena", en: "Dinner" },
    label: { it: "Prenotazione cena", en: "Dinner reservation" },
    hint: { it: "Tavolo per cena à la carte.", en: "À la carte dinner table." },
    tone: {
      text: "text-amber-300",
      bg: "bg-amber-400/10",
      border: "border-amber-400/25",
      chip: "bg-amber-400/15 text-amber-300 border-amber-400/30",
    },
  },
  restaurant_dinner_show: {
    kind: "table",
    icon: Sparkles,
    shortLabel: { it: "Cena Show", en: "Dinner Show" },
    label: { it: "Cena spettacolo", en: "Dinner show" },
    hint: {
      it: "Tavolo per cena con spettacolo dal vivo.",
      en: "Table for dinner with live performance.",
    },
    tone: {
      text: "text-rose-300",
      bg: "bg-rose-400/10",
      border: "border-rose-400/25",
      chip: "bg-rose-400/15 text-rose-300 border-rose-400/30",
    },
  },
  restaurant_lunch_show: {
    kind: "table",
    icon: Wine,
    shortLabel: { it: "Lunch", en: "Lunch" },
    label: { it: "Lunch con musica dal vivo", en: "Lunch with live music" },
    hint: {
      it: "Tavolo per pranzo con dj-set / musica dal vivo.",
      en: "Lunch table with dj-set / live music.",
    },
    tone: {
      text: "text-orange-300",
      bg: "bg-orange-400/10",
      border: "border-orange-400/25",
      chip: "bg-orange-400/15 text-orange-300 border-orange-400/30",
    },
  },
  beach_daybed: {
    kind: "table",
    icon: Sun,
    shortLabel: { it: "Tavolo + Lettini", en: "Table + Daybeds" },
    label: { it: "Tavolo privé + Lettini", en: "Privé table + Daybeds" },
    hint: {
      it: "Solo prenotazione di tavolo privé e/o lettini in spiaggia. Nessun accredito in lista.",
      en: "Privé table and/or beach daybeds only. No guest-list passes.",
    },
    tone: {
      text: "text-teal-300",
      bg: "bg-teal-400/10",
      border: "border-teal-400/25",
      chip: "bg-teal-400/15 text-teal-300 border-teal-400/30",
    },
  },
  club_table_only: {
    kind: "table",
    icon: Crown,
    shortLabel: { it: "Solo Tavolo", en: "Table only" },
    label: { it: "Solo tavolo privé", en: "Privé table only" },
    hint: {
      it: "Accesso al locale garantito solo con tavolo privé. Nessun accredito in lista.",
      en: "Entry only with a privé table. No guest-list passes.",
    },
    tone: {
      text: "text-violet-300",
      bg: "bg-violet-400/10",
      border: "border-violet-400/25",
      chip: "bg-violet-400/15 text-violet-300 border-violet-400/30",
    },
  },
  club_accredito_table: {
    kind: "pass-and-table",
    icon: Ticket,
    shortLabel: { it: "Accredito + Tavolo", en: "Pass + Table" },
    label: { it: "Accredito (QR) o tavolo privé", en: "Guest list (QR) or privé table" },
    hint: {
      it: "Accredito QR automatico per donne, su richiesta per uomini. Oppure tavolo privé.",
      en: "QR pass: automatic for women, on request for men. Or privé table.",
    },
    tone: {
      text: "text-emerald-300",
      bg: "bg-emerald-400/10",
      border: "border-emerald-400/25",
      chip: "bg-emerald-400/15 text-emerald-300 border-emerald-400/30",
    },
  },
};

export const DEFAULT_BOOKING_MODE: BookingMode = "club_table_only";

export const resolveBookingMode = (value?: string | null): BookingMode => {
  if (value && value in BOOKING_MODES) return value as BookingMode;
  return DEFAULT_BOOKING_MODE;
};

export const getBookingMode = (value?: string | null): BookingModeConfig =>
  BOOKING_MODES[resolveBookingMode(value)];
