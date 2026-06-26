import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import {
  Loader2, Check, Download, Calendar as CalIcon, Sparkles, Ticket, Crown, AlertCircle, Clock, Users, Wallet, Sun, Utensils,
} from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { useLanguage } from "@/i18n/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { getBookingMode, resolveBookingMode } from "@/lib/bookingModes";

type Flow = "pass" | "table" | "daybed" | "dining";

export interface VenueBookingFlowProps {
  /** Venue identity & booking mode (required). */
  venue: { slug: string; name: string; booking_mode?: string | null };
  /** Optional event context. When omitted, the user picks a date inside the form. */
  event?: {
    id: string;
    dj: string;
    date: string;
    time?: string | null;
    tag?: string | null;
    venue_name?: string | null;
    venue_slug?: string | null;
  } | null;
  /** Visual variant. "section" = full padded sections (default). "compact" = single inline card. */
  variant?: "section" | "compact";
  /** Optional title shown above the option picker. */
  title?: { it: string; en: string };
  /** Optional subtitle. */
  subtitle?: { it: string; en: string };
}

const passSchema = z.object({
  full_name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(6).max(30),
  gender: z.enum(["F", "M"]),
  guests: z.number().int().min(1).max(20),
  booking_date: z.string().trim().min(1).max(20),
});
const tableSchema = z.object({
  full_name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(6).max(30),
  pax: z.number().int().min(1).max(50),
  booking_date: z.string().trim().min(1).max(20),
  booking_time: z.string().trim().min(1).max(20),
  spend: z.string().trim().min(1).max(50),
  booker: z.string().trim().max(100).optional(),
  notes: z.string().trim().max(500).optional(),
});
const daybedSchema = z.object({
  full_name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(6).max(30),
  guests: z.number().int().min(1).max(20),
  booking_date: z.string().trim().min(1).max(20),
  booking_time: z.string().trim().min(1).max(20),
});
const diningSchema = z.object({
  service: z.enum(["pranzo", "cena"]),
  full_name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(6).max(30),
  guests: z.number().int().min(1).max(30),
  booking_date: z.string().trim().min(1).max(20),
  booking_time: z.string().trim().min(1).max(20),
});

const inputCls =
  "w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-3 md:px-4 md:py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-accent/50 transition";


const Field = ({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) => (
  <label className="block">
    <span className="block mb-1.5 text-[10px] uppercase tracking-[0.3em] text-primary-foreground/55">{label}</span>
    {children}
    {error && <span className="mt-1 block text-[10px] text-red-400">{error}</span>}
  </label>
);

const Stepper = ({ value, onChange, min, max }: { value: number; onChange: (v: number) => void; min: number; max: number }) => (
  <div className="flex items-center gap-2 md:gap-3">
    <button type="button" onClick={() => onChange(Math.max(min, value - 1))} className="h-8 w-8 md:h-10 md:w-10 rounded-full border border-white/10 hover:bg-white/5 text-sm md:text-base">−</button>
    <span className="font-sans font-bold text-lg md:text-xl w-8 md:w-10 text-center">{value}</span>
    <button type="button" onClick={() => onChange(Math.min(max, value + 1))} className="h-8 w-8 md:h-10 md:w-10 rounded-full border border-white/10 hover:bg-white/5 text-sm md:text-base">+</button>
  </div>
);

const todayIso = () => new Date().toISOString().slice(0, 10);

export const VenueBookingFlow = ({ venue, event, variant = "section", title, subtitle }: VenueBookingFlowProps) => {
  const { language } = useLanguage();

  const venueMode = resolveBookingMode(venue.booking_mode);
  const mode = getBookingMode(venueMode);
  const isRestaurant =
    venueMode === "restaurant_dinner" ||
    venueMode === "restaurant_dinner_show" ||
    venueMode === "restaurant_lunch_show";

  const availableFlows: Flow[] = useMemo(() => {
    if (isRestaurant) return ["dining"];
    if (mode.kind === "pass") return ["pass"];
    if (venueMode === "beach_daybed") return ["table", "daybed"];
    if (mode.kind === "pass-and-table") return ["pass", "table"];
    return ["table"];
  }, [mode.kind, venueMode, isRestaurant]);

  const defaultService: "pranzo" | "cena" = venueMode === "restaurant_lunch_show" ? "pranzo" : "cena";
  const eventDate = event?.date || todayIso();
  const eventTime = event?.time || "";

  const [flow, setFlow] = useState<Flow>(availableFlows[0] || "table");
  useEffect(() => { if (availableFlows[0]) setFlow(availableFlows[0]); /* eslint-disable-next-line */ }, [venueMode]);

  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<
    | { kind: "qr"; code: string; data: any }
    | { kind: "pending"; data: any; flow: Flow }
    | null
  >(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [passForm, setPassForm] = useState({ full_name: "", email: "", phone: "", gender: "F" as "F" | "M", guests: 1, booking_date: eventDate });
  const [tableForm, setTableForm] = useState({ full_name: "", email: "", phone: "", pax: 4, booking_date: eventDate, booking_time: eventTime, spend: "", booker: "", notes: "" });
  const [daybedForm, setDaybedForm] = useState({ full_name: "", email: "", phone: "", guests: 2, booking_date: eventDate, booking_time: eventTime });
  const [diningForm, setDiningForm] = useState<{ service: "pranzo" | "cena"; full_name: string; email: string; phone: string; guests: number; booking_date: string; booking_time: string }>({ service: defaultService, full_name: "", email: "", phone: "", guests: 2, booking_date: eventDate, booking_time: eventTime });

  useEffect(() => { setDiningForm((f) => ({ ...f, service: defaultService })); }, [defaultService]);
  useEffect(() => {
    if (eventTime) {
      setTableForm((f) => ({ ...f, booking_time: eventTime }));
      setDaybedForm((f) => ({ ...f, booking_time: eventTime }));
      setDiningForm((f) => ({ ...f, booking_time: eventTime }));
    }
  }, [eventTime]);
  useEffect(() => {
    if (event?.date) {
      setPassForm((f) => ({ ...f, booking_date: event.date }));
      setTableForm((f) => ({ ...f, booking_date: event.date }));
      setDaybedForm((f) => ({ ...f, booking_date: event.date }));
      setDiningForm((f) => ({ ...f, booking_date: event.date }));
    }
  }, [event?.date]);

  const baseInsert = (extra: Record<string, any>) => ({
    event_id: event?.id ?? null,
    event_dj: event?.dj ?? venue.name,
    venue_name: event?.venue_name || venue.name,
    venue_slug: event?.venue_slug || venue.slug,
    ...extra,
  });

  const submit = async () => {
    setErrors({});
    if (flow === "pass") {
      const parsed = passSchema.safeParse(passForm);
      if (!parsed.success) { const e: Record<string, string> = {}; parsed.error.issues.forEach((i) => (e[i.path[0] as string] = i.message)); setErrors(e); return; }
      setSubmitting(true);
      const isInstant = parsed.data.gender === "F";
      try {
        const { data, error } = await supabase.from("event_bookings").insert(baseInsert({
          event_date: parsed.data.booking_date,
          full_name: parsed.data.full_name, email: parsed.data.email, phone: parsed.data.phone,
          guests: parsed.data.guests, gender: parsed.data.gender,
          booking_type: "accredito", status: isInstant ? "confirmed" : "pending",
        }) as any).select("ticket_code, id").single();
        if (error) throw error;
        if (isInstant) { setResult({ kind: "qr", code: data.ticket_code, data: parsed.data }); toast.success(language === "it" ? "Accredito confermato!" : "Pass confirmed!"); }
        else { setResult({ kind: "pending", data: parsed.data, flow: "pass" }); toast.success(language === "it" ? "Richiesta inviata." : "Request sent."); }
      } catch { toast.error(language === "it" ? "Errore. Riprova." : "Error. Try again."); }
      finally { setSubmitting(false); }
      return;
    }
    if (flow === "daybed") {
      const parsed = daybedSchema.safeParse(daybedForm);
      if (!parsed.success) { const e: Record<string, string> = {}; parsed.error.issues.forEach((i) => (e[i.path[0] as string] = i.message)); setErrors(e); return; }
      setSubmitting(true);
      try {
        const { error } = await supabase.from("event_bookings").insert(baseInsert({
          event_date: parsed.data.booking_date,
          full_name: parsed.data.full_name, email: parsed.data.email, phone: parsed.data.phone,
          guests: parsed.data.guests, pax: parsed.data.guests, booking_time: parsed.data.booking_time,
          booking_type: "lettini", status: "pending",
        }) as any);
        if (error) throw error;
        setResult({ kind: "pending", data: parsed.data, flow: "daybed" });
        toast.success(language === "it" ? "Richiesta lettini inviata." : "Daybed request sent.");
      } catch { toast.error(language === "it" ? "Errore. Riprova." : "Error. Try again."); }
      finally { setSubmitting(false); }
      return;
    }
    if (flow === "dining") {
      const parsed = diningSchema.safeParse(diningForm);
      if (!parsed.success) { const e: Record<string, string> = {}; parsed.error.issues.forEach((i) => (e[i.path[0] as string] = i.message)); setErrors(e); return; }
      setSubmitting(true);
      try {
        const { error } = await supabase.from("event_bookings").insert(baseInsert({
          event_date: parsed.data.booking_date,
          full_name: parsed.data.full_name, email: parsed.data.email, phone: parsed.data.phone,
          guests: parsed.data.guests, pax: parsed.data.guests, booking_time: parsed.data.booking_time,
          notes: `Servizio: ${parsed.data.service === "pranzo" ? "Pranzo" : "Cena"}`,
          booking_type: "tavolo", status: "pending",
        }) as any);
        if (error) throw error;
        setResult({ kind: "pending", data: { ...parsed.data, pax: parsed.data.guests }, flow: "dining" });
        toast.success(language === "it" ? "Richiesta tavolo inviata." : "Table request sent.");
      } catch { toast.error(language === "it" ? "Errore. Riprova." : "Error. Try again."); }
      finally { setSubmitting(false); }
      return;
    }
    const parsed = tableSchema.safeParse(tableForm);
    if (!parsed.success) { const e: Record<string, string> = {}; parsed.error.issues.forEach((i) => (e[i.path[0] as string] = i.message)); setErrors(e); return; }
    setSubmitting(true);
    try {
      const { error } = await supabase.from("event_bookings").insert(baseInsert({
        event_date: parsed.data.booking_date,
        full_name: parsed.data.full_name, email: parsed.data.email, phone: parsed.data.phone,
        guests: parsed.data.pax, pax: parsed.data.pax, booking_time: parsed.data.booking_time, spend: parsed.data.spend,
        booker: parsed.data.booker || null, notes: parsed.data.notes || null,
        booking_type: "tavolo", status: "pending",
      }) as any);
      if (error) throw error;
      setResult({ kind: "pending", data: parsed.data, flow: "table" });
      toast.success(language === "it" ? "Richiesta tavolo inviata." : "Table request sent.");
    } catch { toast.error(language === "it" ? "Errore. Riprova." : "Error. Try again."); }
    finally { setSubmitting(false); }
  };

  const downloadQR = () => {
    const svg = document.getElementById("ticket-qr") as unknown as SVGSVGElement | null;
    if (!svg || result?.kind !== "qr") return;
    const data = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    const img = new Image();
    img.onload = () => {
      canvas.width = 1024; canvas.height = 1024;
      ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, 1024, 1024);
      ctx.drawImage(img, 64, 64, 896, 896);
      const link = document.createElement("a");
      link.download = `AYN-pass-${result.code.slice(0, 8)}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(data);
  };

  const flowMeta: Record<Flow, { it: string; en: string; icon: typeof Ticket; descIt: string; descEn: string }> = {
    pass: { it: "Accredito QR", en: "QR Pass", icon: Ticket,
      descIt: "Accredito in lista con QR. Istantaneo per le donne, su richiesta per gli uomini.",
      descEn: "Guest-list pass with QR. Instant for women, on request for men." },
    table: { it: "Tavolo privé", en: "Privé table", icon: Crown,
      descIt: "Prenotazione tavolo privé con spesa minima dedicata.",
      descEn: "Privé table reservation with dedicated minimum spend." },
    daybed: { it: "Lettini spiaggia", en: "Beach daybeds", icon: Sun,
      descIt: "Lettini riservati in spiaggia per la tua giornata.",
      descEn: "Reserved daybeds on the beach for your day." },
    dining: { it: "Prenota tavolo", en: "Book a table", icon: Utensils,
      descIt: "Tavolo per pranzo o cena. Scegli il servizio e il numero di ospiti.",
      descEn: "Lunch or dinner table. Choose service and number of guests." },
  };

  const optionsHeader = (
    <div className="mb-5 md:mb-7">
      <p className="font-sans text-[9.5px] md:text-[10px] uppercase tracking-[0.4em] md:tracking-[0.5em] text-accent/80 mb-2 md:mb-2">
        {language === "it" ? "Opzioni disponibili" : "Available options"}
      </p>
      <h2 className="font-sans font-bold text-base md:text-2xl text-primary-foreground tracking-tight leading-snug">
        {title ? (language === "it" ? title.it : title.en) : (language === "it" ? "Scegli come prenotare" : "Choose how to book")}
      </h2>
    </div>
  );


  const optionsGrid = (
    <>
      {/* Mobile: airy inline pills */}
      <div className="flex flex-wrap gap-2 md:hidden">
        {availableFlows.map((f) => {
          const meta = flowMeta[f];
          const Icon = meta.icon;
          const active = flow === f;
          return (
            <button key={f} type="button" onClick={() => { setFlow(f); setResult(null); setErrors({}); }}
              className={`group inline-flex items-center gap-2 rounded-none border px-3.5 py-2 transition-all ${active
                ? "border-accent/55 bg-accent/12 text-accent"
                : "border-white/10 bg-white/[0.03] text-primary-foreground/70 hover:border-accent/30 hover:text-primary-foreground"}`}>
              <Icon className={`h-3.5 w-3.5 ${active ? "text-accent" : "text-primary-foreground/45"}`} />
              <span className="font-sans text-[11.5px] font-medium tracking-tight whitespace-nowrap">{language === "it" ? meta.it : meta.en}</span>
            </button>
          );
        })}
      </div>

      {/* Desktop: original card grid */}
      <div className={`hidden md:grid gap-3 ${availableFlows.length === 1 ? "grid-cols-1" : availableFlows.length === 2 ? "grid-cols-2" : "grid-cols-2 lg:grid-cols-3"}`}>
        {availableFlows.map((f) => {
          const meta = flowMeta[f];
          const Icon = meta.icon;
          const active = flow === f;
          return (
            <button key={f} type="button" onClick={() => { setFlow(f); setResult(null); setErrors({}); }}
              className={`text-left rounded-xl border p-4 transition-all ${active
                ? "border-accent/45 bg-accent/10 text-accent"
                : "border-white/10 bg-white/[0.02] text-primary-foreground/70 hover:border-white/20"}`}>
              <div className="flex items-center gap-2.5 mb-2">
                <Icon className={`h-5 w-5 ${active ? "text-accent" : "text-primary-foreground/45"}`} />
                <span className="font-sans font-semibold text-[13px]">{language === "it" ? meta.it : meta.en}</span>
              </div>
              <p className="text-[11px] text-primary-foreground/50 leading-relaxed">{language === "it" ? meta.descIt : meta.descEn}</p>
            </button>
          );
        })}
      </div>
    </>
  );

  const formBlock = (
    <div className="max-w-3xl">
      {!result ? (
        <>
          <div className="mb-7 md:mb-8">
            <p className="font-sans text-[9.5px] md:text-[10px] uppercase tracking-[0.4em] md:tracking-[0.5em] text-accent/80 mb-2.5 md:mb-3">{language === "it" ? "Prenota ora" : "Book now"}</p>
            <h2 className="font-serif text-[1.65rem] md:text-4xl text-primary-foreground tracking-tight leading-tight">{language === "it" ? "Completa la richiesta" : "Complete your request"}</h2>
          </div>

          <div className="mb-7 md:mb-6 inline-flex items-center gap-2 rounded-none border border-accent/25 bg-accent/[0.06] px-4 py-2 md:px-3.5 md:py-1.5 text-[10.5px] md:text-[10px] uppercase tracking-[0.3em] text-accent">
            {(() => { const Icon = flowMeta[flow].icon; return <Icon className="h-3.5 w-3.5" />; })()}
            {language === "it" ? flowMeta[flow].it : flowMeta[flow].en}
          </div>


          {flow === "pass" ? (
            <>
              {/* Mobile pass form */}
              <div className="space-y-5 md:hidden text-primary-foreground">
                <div>
                  <span className="block mb-2 text-[10px] uppercase tracking-[0.3em] text-primary-foreground/55">{language === "it" ? "Tipo di accredito" : "Pass type"}</span>
                  <div className="grid grid-cols-2 gap-3.5">
                    {(["F", "M"] as const).map((g) => {
                      const active = passForm.gender === g;
                      return (
                        <button key={g} type="button" onClick={() => setPassForm({ ...passForm, gender: g })}
                          className={`text-center rounded-none border px-3 py-2.5 md:px-5 md:py-4 transition ${active ? "border-accent/45 bg-accent/10 text-accent" : "border-white/10 bg-white/[0.02] text-primary-foreground/70 hover:border-white/20"}`}>
                          <p className="font-semibold text-[13px] md:text-[14px] leading-tight">{g === "F" ? (language === "it" ? "Donna" : "Woman") : (language === "it" ? "Uomo" : "Man")}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3.5">
                  <Field label={language === "it" ? "Nome completo" : "Full name"} error={errors.full_name}><input value={passForm.full_name} onChange={(e) => setPassForm({ ...passForm, full_name: e.target.value })} className={inputCls} placeholder="Mario Rossi" /></Field>
                  <Field label="Email" error={errors.email}><input type="email" value={passForm.email} onChange={(e) => setPassForm({ ...passForm, email: e.target.value })} className={inputCls} placeholder="email@example.com" /></Field>
                </div>
                <div className="grid grid-cols-2 gap-3.5">
                  <Field label={language === "it" ? "Telefono" : "Phone"} error={errors.phone}><input type="tel" value={passForm.phone} onChange={(e) => setPassForm({ ...passForm, phone: e.target.value })} className={inputCls} placeholder="+39 ..." /></Field>
                  <Field label={language === "it" ? "Ospiti" : "Guests"} error={errors.guests}><Stepper value={passForm.guests} onChange={(v) => setPassForm({ ...passForm, guests: v })} min={1} max={10} /></Field>
                </div>
                {!event && (
                  <Field label={language === "it" ? "Data" : "Date"} error={errors.booking_date}>
                    <div className="relative"><CalIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/30" />
                      <input type="date" value={passForm.booking_date} onChange={(e) => setPassForm({ ...passForm, booking_date: e.target.value })} className={inputCls + " pl-9"} /></div>
                  </Field>
                )}
                <div className="rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3 flex items-start gap-2.5">
                  <AlertCircle className="h-3.5 w-3.5 mt-0.5 text-accent/70 shrink-0" />
                  <p className="text-[11.5px] text-primary-foreground/60 leading-relaxed">{passForm.gender === "F" ? (language === "it" ? "Riceverai subito un QR code da mostrare all'ingresso." : "You'll instantly receive a QR code to show at the door.") : (language === "it" ? "La richiesta verrà confermata dal nostro staff. Ti contatteremo via email." : "Your request will be reviewed by our staff. We will contact you via email.")}</p>
                </div>
              </div>
              {/* Desktop pass form */}
              <div className="hidden md:block space-y-5 text-primary-foreground">
                <div>
                  <span className="block mb-2.5 text-[10px] uppercase tracking-[0.3em] text-primary-foreground/55">{language === "it" ? "Tipo di accredito" : "Pass type"}</span>
                  <div className="grid grid-cols-2 gap-3.5">
                    {(["F", "M"] as const).map((g) => {
                      const active = passForm.gender === g;
                      return (
                        <button key={g} type="button" onClick={() => setPassForm({ ...passForm, gender: g })}
                          className={`text-center rounded-xl border px-5 py-4 transition ${active ? "border-accent/45 bg-accent/10 text-accent" : "border-white/10 bg-white/[0.02] text-primary-foreground/70 hover:border-white/20"}`}>
                          <p className="font-semibold text-[14px] leading-tight">{g === "F" ? (language === "it" ? "Donna" : "Woman") : (language === "it" ? "Uomo" : "Man")}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>
                <Field label={language === "it" ? "Nome completo" : "Full name"} error={errors.full_name}><input value={passForm.full_name} onChange={(e) => setPassForm({ ...passForm, full_name: e.target.value })} className={inputCls} placeholder="Mario Rossi" /></Field>
                <div className="grid gap-4 grid-cols-2">
                  <Field label="Email" error={errors.email}><input type="email" value={passForm.email} onChange={(e) => setPassForm({ ...passForm, email: e.target.value })} className={inputCls} placeholder="email@example.com" /></Field>
                  <Field label={language === "it" ? "Telefono" : "Phone"} error={errors.phone}><input type="tel" value={passForm.phone} onChange={(e) => setPassForm({ ...passForm, phone: e.target.value })} className={inputCls} placeholder="+39 ..." /></Field>
                </div>
                <Field label={language === "it" ? "Ospiti" : "Guests"} error={errors.guests}><Stepper value={passForm.guests} onChange={(v) => setPassForm({ ...passForm, guests: v })} min={1} max={10} /></Field>
                {!event && (
                  <Field label={language === "it" ? "Data" : "Date"} error={errors.booking_date}>
                    <div className="relative"><CalIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/30" />
                      <input type="date" value={passForm.booking_date} onChange={(e) => setPassForm({ ...passForm, booking_date: e.target.value })} className={inputCls + " pl-9"} /></div>
                  </Field>
                )}
                <div className="rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3 flex items-start gap-2.5">
                  <AlertCircle className="h-3.5 w-3.5 mt-0.5 text-accent/70 shrink-0" />
                  <p className="text-[11.5px] text-primary-foreground/60 leading-relaxed">{passForm.gender === "F" ? (language === "it" ? "Riceverai subito un QR code da mostrare all'ingresso." : "You'll instantly receive a QR code to show at the door.") : (language === "it" ? "La richiesta verrà confermata dal nostro staff. Ti contatteremo via email." : "Your request will be reviewed by our staff. We will contact you via email.")}</p>
                </div>
              </div>
            </>
          ) : flow === "daybed" ? (
            <>
              {/* Mobile: compact 2-col pairs */}
              <div className="space-y-5 md:hidden text-primary-foreground">
                <div className="grid grid-cols-2 gap-3.5">
                  <Field label={language === "it" ? "Nome e cognome" : "Full name"} error={errors.full_name}><input value={daybedForm.full_name} onChange={(e) => setDaybedForm({ ...daybedForm, full_name: e.target.value })} className={inputCls} placeholder="Mario Rossi" /></Field>
                  <Field label="Email" error={errors.email}><input type="email" value={daybedForm.email} onChange={(e) => setDaybedForm({ ...daybedForm, email: e.target.value })} className={inputCls} placeholder="email@example.com" /></Field>
                </div>
                <div className="grid grid-cols-2 gap-3.5">
                  <Field label={language === "it" ? "Telefono" : "Phone"} error={errors.phone}><input type="tel" value={daybedForm.phone} onChange={(e) => setDaybedForm({ ...daybedForm, phone: e.target.value })} className={inputCls} placeholder="+39 ..." /></Field>
                  <Field label={language === "it" ? "Ospiti" : "Guests"} error={errors.guests}><Stepper value={daybedForm.guests} onChange={(v) => setDaybedForm({ ...daybedForm, guests: v })} min={1} max={20} /></Field>
                </div>
                <div className="grid grid-cols-2 gap-3.5">
                  <Field label={language === "it" ? "Data" : "Date"} error={errors.booking_date}>
                    <div className="relative"><CalIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/30" />
                      <input type="date" value={daybedForm.booking_date} onChange={(e) => setDaybedForm({ ...daybedForm, booking_date: e.target.value })} className={inputCls + " pl-9"} /></div>
                  </Field>
                  <Field label={language === "it" ? "Orario" : "Time"} error={errors.booking_time}>
                    <div className="relative"><Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/30" />
                      <input value={daybedForm.booking_time} onChange={(e) => setDaybedForm({ ...daybedForm, booking_time: e.target.value })} className={inputCls + " pl-9"} placeholder="11:00" /></div>
                  </Field>
                </div>
                <div className="rounded-xl border border-accent/20 bg-accent/[0.06] px-4 py-3 flex items-start gap-2.5">
                  <Sun className="h-3.5 w-3.5 mt-0.5 text-accent shrink-0" />
                  <p className="text-[11.5px] text-primary-foreground/70 leading-relaxed">{language === "it" ? "Ti contatteremo via email per confermare la disponibilità dei lettini." : "We will email you to confirm daybed availability."}</p>
                </div>
              </div>
              {/* Desktop: original layout */}
              <div className="hidden md:block space-y-5 text-primary-foreground">
                <Field label={language === "it" ? "Nome e cognome" : "Full name"} error={errors.full_name}><input value={daybedForm.full_name} onChange={(e) => setDaybedForm({ ...daybedForm, full_name: e.target.value })} className={inputCls} placeholder="Mario Rossi" /></Field>
                <div className="grid gap-4 grid-cols-2">
                  <Field label="Email" error={errors.email}><input type="email" value={daybedForm.email} onChange={(e) => setDaybedForm({ ...daybedForm, email: e.target.value })} className={inputCls} placeholder="email@example.com" /></Field>
                  <Field label={language === "it" ? "Numero di telefono" : "Phone number"} error={errors.phone}><input type="tel" value={daybedForm.phone} onChange={(e) => setDaybedForm({ ...daybedForm, phone: e.target.value })} className={inputCls} placeholder="+39 ..." /></Field>
                </div>
                <div className="grid gap-4 grid-cols-3">
                  <Field label={language === "it" ? "Ospiti" : "Guests"} error={errors.guests}><Stepper value={daybedForm.guests} onChange={(v) => setDaybedForm({ ...daybedForm, guests: v })} min={1} max={20} /></Field>
                  <Field label={language === "it" ? "Data" : "Date"} error={errors.booking_date}>
                    <div className="relative"><CalIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/30" />
                      <input type="date" value={daybedForm.booking_date} onChange={(e) => setDaybedForm({ ...daybedForm, booking_date: e.target.value })} className={inputCls + " pl-9"} /></div>
                  </Field>
                  <Field label={language === "it" ? "Orario" : "Time"} error={errors.booking_time}>
                    <div className="relative"><Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/30" />
                      <input value={daybedForm.booking_time} onChange={(e) => setDaybedForm({ ...daybedForm, booking_time: e.target.value })} className={inputCls + " pl-9"} placeholder="11:00" /></div>
                  </Field>
                </div>
                <div className="rounded-xl border border-accent/20 bg-accent/[0.06] px-4 py-3 flex items-start gap-2.5">
                  <Sun className="h-3.5 w-3.5 mt-0.5 text-accent shrink-0" />
                  <p className="text-[11.5px] text-primary-foreground/70 leading-relaxed">{language === "it" ? "Ti contatteremo via email per confermare la disponibilità dei lettini." : "We will email you to confirm daybed availability."}</p>
                </div>
              </div>
            </>
          ) : flow === "dining" ? (
            <>
              {/* Mobile: compact 2-col pairs */}
              <div className="space-y-5 md:hidden text-primary-foreground">
                <div>
                  <span className="block mb-2.5 text-[10px] uppercase tracking-[0.3em] text-primary-foreground/55">{language === "it" ? "Servizio" : "Service"}</span>
                  <div className="grid grid-cols-2 gap-3.5">
                    {(["pranzo", "cena"] as const).map((s) => {
                      const active = diningForm.service === s;
                      const label = s === "pranzo" ? (language === "it" ? "Pranzo" : "Lunch") : (language === "it" ? "Cena" : "Dinner");
                      return (
                        <button key={s} type="button" onClick={() => setDiningForm({ ...diningForm, service: s })}
                          className={`text-center rounded-none border px-3 py-2.5 md:px-5 md:py-4 transition ${active ? "border-accent/45 bg-accent/10 text-accent" : "border-white/10 bg-white/[0.02] text-primary-foreground/70 hover:border-white/20"}`}>
                          <p className="font-semibold text-[13px] md:text-[14px] leading-tight">{label}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3.5">
                  <Field label={language === "it" ? "Nome e cognome" : "Full name"} error={errors.full_name}><input value={diningForm.full_name} onChange={(e) => setDiningForm({ ...diningForm, full_name: e.target.value })} className={inputCls} placeholder="Mario Rossi" /></Field>
                  <Field label="Email" error={errors.email}><input type="email" value={diningForm.email} onChange={(e) => setDiningForm({ ...diningForm, email: e.target.value })} className={inputCls} placeholder="email@example.com" /></Field>
                </div>
                <div className="grid grid-cols-2 gap-3.5">
                  <Field label={language === "it" ? "Telefono" : "Phone"} error={errors.phone}><input type="tel" value={diningForm.phone} onChange={(e) => setDiningForm({ ...diningForm, phone: e.target.value })} className={inputCls} placeholder="+39 ..." /></Field>
                  <Field label={language === "it" ? "Ospiti" : "Guests"} error={errors.guests}><Stepper value={diningForm.guests} onChange={(v) => setDiningForm({ ...diningForm, guests: v })} min={1} max={30} /></Field>
                </div>
                <div className="grid grid-cols-2 gap-3.5">
                  <Field label={language === "it" ? "Data" : "Date"} error={errors.booking_date}>
                    <div className="relative"><CalIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/30" />
                      <input type="date" value={diningForm.booking_date} onChange={(e) => setDiningForm({ ...diningForm, booking_date: e.target.value })} className={inputCls + " pl-9"} /></div>
                  </Field>
                  <Field label={language === "it" ? "Orario" : "Time"} error={errors.booking_time}>
                    <div className="relative"><Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/30" />
                      <input value={diningForm.booking_time} onChange={(e) => setDiningForm({ ...diningForm, booking_time: e.target.value })} className={inputCls + " pl-9"} placeholder={diningForm.service === "pranzo" ? "13:00" : "20:30"} /></div>
                  </Field>
                </div>
                <div className="rounded-xl border border-accent/20 bg-accent/[0.06] px-4 py-3 flex items-start gap-2.5">
                  <Utensils className="h-3.5 w-3.5 mt-0.5 text-accent shrink-0" />
                  <p className="text-[11.5px] text-primary-foreground/70 leading-relaxed">{language === "it" ? "Ti contatteremo via email per confermare la disponibilità del tavolo." : "We will email you to confirm table availability."}</p>
                </div>
              </div>
              {/* Desktop: original layout */}
              <div className="hidden md:block space-y-5 text-primary-foreground">
                <div>
                  <span className="block mb-2.5 text-[10px] uppercase tracking-[0.3em] text-primary-foreground/55">{language === "it" ? "Servizio" : "Service"}</span>
                  <div className="grid grid-cols-2 gap-3.5">
                    {(["pranzo", "cena"] as const).map((s) => {
                      const active = diningForm.service === s;
                      const label = s === "pranzo" ? (language === "it" ? "Pranzo" : "Lunch") : (language === "it" ? "Cena" : "Dinner");
                      return (
                        <button key={s} type="button" onClick={() => setDiningForm({ ...diningForm, service: s })}
                          className={`text-center rounded-xl border px-5 py-4 transition ${active ? "border-accent/45 bg-accent/10 text-accent" : "border-white/10 bg-white/[0.02] text-primary-foreground/70 hover:border-white/20"}`}>
                          <p className="font-semibold text-[14px] leading-tight">{label}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>
                <Field label={language === "it" ? "Nome e cognome" : "Full name"} error={errors.full_name}><input value={diningForm.full_name} onChange={(e) => setDiningForm({ ...diningForm, full_name: e.target.value })} className={inputCls} placeholder="Mario Rossi" /></Field>
                <div className="grid gap-4 grid-cols-2">
                  <Field label="Email" error={errors.email}><input type="email" value={diningForm.email} onChange={(e) => setDiningForm({ ...diningForm, email: e.target.value })} className={inputCls} placeholder="email@example.com" /></Field>
                  <Field label={language === "it" ? "Telefono" : "Phone"} error={errors.phone}><input type="tel" value={diningForm.phone} onChange={(e) => setDiningForm({ ...diningForm, phone: e.target.value })} className={inputCls} placeholder="+39 ..." /></Field>
                </div>
                <div className="grid gap-4 grid-cols-3">
                  <Field label={language === "it" ? "Ospiti" : "Guests"} error={errors.guests}><Stepper value={diningForm.guests} onChange={(v) => setDiningForm({ ...diningForm, guests: v })} min={1} max={30} /></Field>
                  <Field label={language === "it" ? "Data" : "Date"} error={errors.booking_date}>
                    <div className="relative"><CalIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/30" />
                      <input type="date" value={diningForm.booking_date} onChange={(e) => setDiningForm({ ...diningForm, booking_date: e.target.value })} className={inputCls + " pl-9"} /></div>
                  </Field>
                  <Field label={language === "it" ? "Orario" : "Time"} error={errors.booking_time}>
                    <div className="relative"><Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/30" />
                      <input value={diningForm.booking_time} onChange={(e) => setDiningForm({ ...diningForm, booking_time: e.target.value })} className={inputCls + " pl-9"} placeholder={diningForm.service === "pranzo" ? "13:00" : "20:30"} /></div>
                  </Field>
                </div>
                <div className="rounded-xl border border-accent/20 bg-accent/[0.06] px-4 py-3 flex items-start gap-2.5">
                  <Utensils className="h-3.5 w-3.5 mt-0.5 text-accent shrink-0" />
                  <p className="text-[11.5px] text-primary-foreground/70 leading-relaxed">{language === "it" ? "Ti contatteremo via email per confermare la disponibilità del tavolo." : "We will email you to confirm table availability."}</p>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Mobile: compact 2-col pairs */}
              <div className="space-y-5 md:hidden text-primary-foreground">
                <div className="grid grid-cols-2 gap-3.5">
                  <Field label={language === "it" ? "Nome completo" : "Full name"} error={errors.full_name}><input value={tableForm.full_name} onChange={(e) => setTableForm({ ...tableForm, full_name: e.target.value })} className={inputCls} placeholder="Mario Rossi" /></Field>
                  <Field label="Email" error={errors.email}><input type="email" value={tableForm.email} onChange={(e) => setTableForm({ ...tableForm, email: e.target.value })} className={inputCls} placeholder="email@example.com" /></Field>
                </div>
                <div className="grid grid-cols-2 gap-3.5">
                  <Field label={language === "it" ? "Telefono" : "Phone"} error={errors.phone}><input type="tel" value={tableForm.phone} onChange={(e) => setTableForm({ ...tableForm, phone: e.target.value })} className={inputCls} placeholder="+39 346 ..." /></Field>
                  <Field label={language === "it" ? "Ospiti" : "Guests"} error={errors.pax}><Stepper value={tableForm.pax} onChange={(v) => setTableForm({ ...tableForm, pax: v })} min={1} max={30} /></Field>
                </div>
                <div className="grid grid-cols-2 gap-3.5">
                  <Field label={language === "it" ? "Data" : "Date"} error={errors.booking_date}>
                    <div className="relative"><CalIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/30" />
                      <input type="date" value={tableForm.booking_date} onChange={(e) => setTableForm({ ...tableForm, booking_date: e.target.value })} className={inputCls + " pl-9"} /></div>
                  </Field>
                  <Field label={language === "it" ? "Orario" : "Time"} error={errors.booking_time}>
                    <div className="relative"><Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/30" />
                      <input value={tableForm.booking_time} onChange={(e) => setTableForm({ ...tableForm, booking_time: e.target.value })} className={inputCls + " pl-9"} placeholder="18:00" /></div>
                  </Field>
                </div>
                <div className="grid grid-cols-2 gap-3.5">
                  <Field label={language === "it" ? "Spesa minima" : "Min. spend"} error={errors.spend}>
                    <div className="relative"><Wallet className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/30" />
                      <input value={tableForm.spend} onChange={(e) => setTableForm({ ...tableForm, spend: e.target.value })} className={inputCls + " pl-9"} placeholder="1k €" /></div>
                  </Field>
                  <Field label={language === "it" ? "Booker" : "Booker"}><input value={tableForm.booker} onChange={(e) => setTableForm({ ...tableForm, booker: e.target.value })} className={inputCls} placeholder={language === "it" ? "Referente" : "Reference"} /></Field>
                </div>
                <Field label={language === "it" ? "Note (opzionale)" : "Notes (optional)"}><textarea value={tableForm.notes} onChange={(e) => setTableForm({ ...tableForm, notes: e.target.value })} rows={3} className={inputCls + " resize-none"} placeholder={language === "it" ? "Occasione speciale, preferenze tavolo..." : "Special occasion, table preferences..."} /></Field>
                <div className="rounded-xl border border-accent/20 bg-accent/[0.06] px-4 py-3 flex items-start gap-2.5">
                  <Wallet className="h-3.5 w-3.5 mt-0.5 text-accent shrink-0" />
                  <p className="text-[11.5px] text-primary-foreground/70 leading-relaxed">{language === "it" ? "Riceverai via email il link per il deposito del 50% per confermare il tavolo." : "You will receive an email with the 50% deposit link to confirm the table."}</p>
                </div>
              </div>
              {/* Desktop: original layout */}
              <div className="hidden md:block space-y-5 text-primary-foreground">
                <Field label={language === "it" ? "Nome completo" : "Full name"} error={errors.full_name}><input value={tableForm.full_name} onChange={(e) => setTableForm({ ...tableForm, full_name: e.target.value })} className={inputCls} placeholder="Mario Rossi" /></Field>
                <div className="grid gap-4 grid-cols-2">
                  <Field label="Email" error={errors.email}><input type="email" value={tableForm.email} onChange={(e) => setTableForm({ ...tableForm, email: e.target.value })} className={inputCls} placeholder="email@example.com" /></Field>
                  <Field label={language === "it" ? "Telefono" : "Phone"} error={errors.phone}><input type="tel" value={tableForm.phone} onChange={(e) => setTableForm({ ...tableForm, phone: e.target.value })} className={inputCls} placeholder="+39 346 ..." /></Field>
                </div>
                <div className="grid gap-4 grid-cols-2">
                  <Field label={language === "it" ? "Ospiti (pax)" : "Guests (pax)"} error={errors.pax}><Stepper value={tableForm.pax} onChange={(v) => setTableForm({ ...tableForm, pax: v })} min={1} max={30} /></Field>
                  <Field label={language === "it" ? "Data" : "Date"} error={errors.booking_date}>
                    <div className="relative"><CalIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/30" />
                      <input type="date" value={tableForm.booking_date} onChange={(e) => setTableForm({ ...tableForm, booking_date: e.target.value })} className={inputCls + " pl-9"} /></div>
                  </Field>
                </div>
                <div className="grid gap-4 grid-cols-2">
                  <Field label={language === "it" ? "Orario" : "Time"} error={errors.booking_time}>
                    <div className="relative"><Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/30" />
                      <input value={tableForm.booking_time} onChange={(e) => setTableForm({ ...tableForm, booking_time: e.target.value })} className={inputCls + " pl-9"} placeholder="18:00" /></div>
                  </Field>
                  <Field label={language === "it" ? "Spesa minima" : "Min. spend"} error={errors.spend}>
                    <div className="relative"><Wallet className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/30" />
                      <input value={tableForm.spend} onChange={(e) => setTableForm({ ...tableForm, spend: e.target.value })} className={inputCls + " pl-9"} placeholder="1k €" /></div>
                  </Field>
                </div>
                <Field label={language === "it" ? "Booker (opzionale)" : "Booker (optional)"}><input value={tableForm.booker} onChange={(e) => setTableForm({ ...tableForm, booker: e.target.value })} className={inputCls} placeholder={language === "it" ? "Nome del referente" : "Reference name"} /></Field>
                <Field label={language === "it" ? "Note (opzionale)" : "Notes (optional)"}><textarea value={tableForm.notes} onChange={(e) => setTableForm({ ...tableForm, notes: e.target.value })} rows={3} className={inputCls + " resize-none"} placeholder={language === "it" ? "Occasione speciale, preferenze tavolo..." : "Special occasion, table preferences..."} /></Field>
                <div className="rounded-xl border border-accent/20 bg-accent/[0.06] px-4 py-3 flex items-start gap-2.5">
                  <Wallet className="h-3.5 w-3.5 mt-0.5 text-accent shrink-0" />
                  <p className="text-[11.5px] text-primary-foreground/70 leading-relaxed">{language === "it" ? "Riceverai via email il link per il deposito del 50% per confermare il tavolo." : "You will receive an email with the 50% deposit link to confirm the table."}</p>
                </div>
              </div>
            </>
          )}

          <button disabled={submitting} onClick={submit}
            className="mt-8 w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary via-primary to-accent px-8 py-4 text-[14px] font-semibold tracking-normal text-white shadow-lg shadow-accent/25 hover:shadow-accent/40 transition disabled:opacity-60">
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : flow === "pass" && passForm.gender === "F" ? <Sparkles className="h-4 w-4" /> : flow === "daybed" ? <Sun className="h-4 w-4" /> : flow === "dining" ? <Utensils className="h-4 w-4" /> : <Ticket className="h-4 w-4" />}
            {flow === "pass" ? (passForm.gender === "F" ? (language === "it" ? "Conferma e ricevi il QR" : "Confirm & get QR") : (language === "it" ? "Invia richiesta accredito" : "Submit pass request")) : flow === "daybed" ? (language === "it" ? "Richiedi lettini spiaggia" : "Request beach daybeds") : flow === "dining" ? (language === "it" ? "Richiedi tavolo" : "Request table") : (language === "it" ? "Richiedi tavolo privé" : "Request privé table")}
          </button>
        </>
      ) : result.kind === "qr" ? (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-7 text-primary-foreground">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }} className="mx-auto h-14 w-14 grid place-items-center rounded-full bg-emerald-500/15 ring-1 ring-emerald-400/30">
            <Check className="h-6 w-6 text-emerald-400" />
          </motion.div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.5em] text-accent/80 mb-2">{language === "it" ? "Conferma" : "Confirmed"}</p>
            <h3 className="font-serif text-3xl">{language === "it" ? "Il tuo pass è pronto" : "Your pass is ready"}</h3>
            <p className="mt-2 text-sm text-primary-foreground/55">{result.data.full_name} · {result.data.guests} {language === "it" ? "ospiti" : "guests"}</p>
          </div>
          <div className="mx-auto inline-block rounded-3xl bg-white p-5 shadow-2xl shadow-accent/20">
            <QRCodeSVG id="ticket-qr" value={JSON.stringify({ code: result.code, event: event?.dj || venue.name, date: result.data.booking_date || event?.date, venue: venue.name, name: result.data.full_name, guests: result.data.guests })} size={240} level="H" includeMargin={false} />
            <p className="mt-3 font-mono text-[10px] tracking-widest text-foreground/60">{result.code.slice(0, 16).toUpperCase()}</p>
          </div>
          <div className="flex gap-3 max-w-md mx-auto">
            <button onClick={downloadQR} className="flex-1 inline-flex items-center justify-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-accent hover:bg-accent/20 transition"><Download className="h-4 w-4" />{language === "it" ? "Scarica QR" : "Download QR"}</button>
            <Link to="/eventi" className="flex-1 grid place-items-center rounded-full bg-gradient-to-r from-primary to-accent px-6 py-3 text-[11px] font-bold uppercase tracking-[0.25em] text-white">{language === "it" ? "Altri eventi" : "More events"}</Link>
          </div>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-7 text-primary-foreground">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }} className="mx-auto h-14 w-14 grid place-items-center rounded-full bg-amber-400/15 ring-1 ring-amber-400/30">
            <Clock className="h-6 w-6 text-amber-300" />
          </motion.div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.5em] text-accent/80 mb-2">{language === "it" ? "Richiesta inviata" : "Request received"}</p>
            <h3 className="font-serif text-3xl">{result.flow === "table" ? (language === "it" ? "Tavolo in richiesta" : "Table requested") : result.flow === "daybed" ? (language === "it" ? "Lettini in richiesta" : "Daybeds requested") : result.flow === "dining" ? (language === "it" ? "Tavolo in richiesta" : "Table requested") : (language === "it" ? "Accredito in revisione" : "Pass under review")}</h3>
            <p className="mt-2 text-sm text-primary-foreground/55 max-w-md mx-auto">{result.flow === "table" ? (language === "it" ? "Riceverai a breve via email il link per il deposito del 50% e la conferma del tavolo." : "You will shortly receive an email with the 50% deposit link and table confirmation.") : result.flow === "daybed" ? (language === "it" ? "Ti contatteremo via email per confermare la disponibilità." : "We will email you to confirm availability.") : result.flow === "dining" ? (language === "it" ? "Ti contatteremo via email per confermare il tavolo." : "We will email you to confirm the table.") : (language === "it" ? "Il nostro staff valuterà la richiesta e ti contatterà via email." : "Our staff will review your request and contact you via email.")}</p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-white/[0.03] px-5 py-4 text-left max-w-md mx-auto">
            <p className="text-xs uppercase tracking-[0.3em] text-accent/70 mb-2">{venue.name}</p>
            {event && <p className="font-sans font-bold text-lg leading-tight">{event.dj}</p>}
            <p className="mt-1 text-xs text-primary-foreground/55">{result.data.booking_date || event?.date}</p>
            <div className="mt-3 pt-3 border-t border-white/[0.05] grid grid-cols-2 gap-2 text-[11px] text-primary-foreground/60">
              <span className="flex items-center gap-1.5"><Users className="h-3 w-3 text-accent/70" /> {result.data.pax || result.data.guests} pax</span>
              {result.data.booking_time && <span className="flex items-center gap-1.5"><Clock className="h-3 w-3 text-accent/70" /> {result.data.booking_time}</span>}
              {result.data.spend && <span className="flex items-center gap-1.5"><Wallet className="h-3 w-3 text-accent/70" /> {result.data.spend}</span>}
            </div>
          </div>
          <Link to="/eventi" className="inline-block rounded-full bg-gradient-to-r from-primary to-accent px-8 py-3 text-[11px] font-bold uppercase tracking-[0.25em] text-white">{language === "it" ? "Altri eventi" : "More events"}</Link>
        </motion.div>
      )}
    </div>
  );

  if (variant === "compact") {
    return (
      <div className="space-y-8">
        <div>{optionsHeader}{optionsGrid}</div>
        <div>{formBlock}</div>
      </div>
    );
  }

  return (
    <>
      <section className="bg-gradient-to-b from-foreground via-[hsl(225_50%_9%)] to-foreground py-12 md:py-20 border-t border-primary-foreground/[0.05]">
        <div className="container mx-auto px-5 sm:px-6 lg:px-10">
          {optionsHeader}
          {optionsGrid}
        </div>
      </section>
      <section className="bg-foreground py-12 md:py-20 border-t border-primary-foreground/[0.05]">
        <div className="container mx-auto px-5 sm:px-6 lg:px-10">{formBlock}</div>
      </section>
    </>
  );

};

export default VenueBookingFlow;
