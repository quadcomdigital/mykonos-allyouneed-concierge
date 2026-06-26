import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import {
  Loader2,
  Check,
  X,
  Download,
  Calendar as CalIcon,
  MapPin,
  Sparkles,
  Ticket,
  Crown,
  AlertCircle,
  Clock,
  Users,
  Wallet,
} from "lucide-react";
import { z } from "zod";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLanguage } from "@/i18n/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { getBookingMode, type BookingMode } from "@/lib/bookingModes";

// ──────────────────────────────────────────────────────────────────────────────
// Types

interface EventLite {
  id: string;
  date: string;
  dj: string;
  venue: string;
  venueSlug: string;
  time?: string;
  bookingMode?: string | null;
}

interface Props {
  event: EventLite | null;
  onClose: () => void;
}

type Flow = "pass" | "table";

// ──────────────────────────────────────────────────────────────────────────────
// Validation

const passSchema = z.object({
  full_name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(6).max(30),
  gender: z.enum(["F", "M"]),
  guests: z.number().int().min(1).max(20),
});

const tableSchema = z.object({
  full_name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(6).max(30),
  pax: z.number().int().min(1).max(50),
  booking_time: z.string().trim().min(1).max(20),
  spend: z.string().trim().min(1).max(50),
  booker: z.string().trim().max(100).optional(),
  notes: z.string().trim().max(500).optional(),
});

// ──────────────────────────────────────────────────────────────────────────────
// Component

const EventBookingModal = ({ event, onClose }: Props) => {
  const isMobile = useIsMobile();
  const { language } = useLanguage();
  const mode = getBookingMode(event?.bookingMode);

  const availableFlows: Flow[] = useMemo(() => {
    if (!event) return [];
    if (mode.kind === "pass") return ["pass"];
    if (mode.kind === "table") return ["table"];
    return ["pass", "table"];
  }, [event, mode.kind]);

  const [flow, setFlow] = useState<Flow>("table");
  useEffect(() => {
    if (availableFlows.length > 0) setFlow(availableFlows[0]);
  }, [availableFlows]);

  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<
    | { kind: "qr"; code: string; data: any }
    | { kind: "pending"; data: any; flow: Flow }
    | null
  >(null);

  const [passForm, setPassForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    gender: "F" as "F" | "M",
    guests: 1,
  });
  const [tableForm, setTableForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    pax: 4,
    booking_time: event?.time || "",
    spend: "",
    booker: "",
    notes: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!event) return null;

  const reset = () => {
    setResult(null);
    setErrors({});
    setPassForm({ full_name: "", email: "", phone: "", gender: "F", guests: 1 });
    setTableForm({
      full_name: "",
      email: "",
      phone: "",
      pax: 4,
      booking_time: event?.time || "",
      spend: "",
      booker: "",
      notes: "",
    });
    onClose();
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const submit = async () => {
    setErrors({});

    if (flow === "pass") {
      const parsed = passSchema.safeParse(passForm);
      if (!parsed.success) {
        const e: Record<string, string> = {};
        parsed.error.issues.forEach((i) => (e[i.path[0] as string] = i.message));
        setErrors(e);
        return;
      }
      setSubmitting(true);
      const isInstant = parsed.data.gender === "F";
      try {
        const { data, error } = await supabase
          .from("event_bookings")
          .insert({
            event_id: event.id,
            event_date: event.date,
            event_dj: event.dj,
            venue_name: event.venue,
            venue_slug: event.venueSlug,
            full_name: parsed.data.full_name,
            email: parsed.data.email,
            phone: parsed.data.phone,
            guests: parsed.data.guests,
            gender: parsed.data.gender,
            booking_type: "accredito",
            status: isInstant ? "confirmed" : "pending",
          } as any)
          .select("ticket_code, id")
          .single();
        if (error) throw error;
        if (isInstant) {
          setResult({ kind: "qr", code: data.ticket_code, data: parsed.data });
          toast.success(language === "it" ? "Accredito confermato!" : "Pass confirmed!");
        } else {
          setResult({ kind: "pending", data: parsed.data, flow: "pass" });
          toast.success(
            language === "it"
              ? "Richiesta inviata. Ti contatteremo a breve."
              : "Request sent. We will contact you shortly.",
          );
        }
      } catch (e: any) {
        toast.error(language === "it" ? "Errore. Riprova." : "Error. Try again.");
      } finally {
        setSubmitting(false);
      }
      return;
    }

    // Table flow
    const parsed = tableSchema.safeParse(tableForm);
    if (!parsed.success) {
      const e: Record<string, string> = {};
      parsed.error.issues.forEach((i) => (e[i.path[0] as string] = i.message));
      setErrors(e);
      return;
    }
    setSubmitting(true);
    try {
      const { error } = await supabase
        .from("event_bookings")
        .insert({
          event_id: event.id,
          event_date: event.date,
          event_dj: event.dj,
          venue_name: event.venue,
          venue_slug: event.venueSlug,
          full_name: parsed.data.full_name,
          email: parsed.data.email,
          phone: parsed.data.phone,
          guests: parsed.data.pax,
          pax: parsed.data.pax,
          booking_time: parsed.data.booking_time,
          spend: parsed.data.spend,
          booker: parsed.data.booker || null,
          notes: parsed.data.notes || null,
          booking_type: "tavolo",
          status: "pending",
        } as any);
      if (error) throw error;
      setResult({ kind: "pending", data: parsed.data, flow: "table" });
      toast.success(
        language === "it"
          ? "Richiesta tavolo inviata. Riceverai il link per il deposito 50%."
          : "Table request sent. You'll receive the 50% deposit link shortly.",
      );
    } catch (e: any) {
      toast.error(language === "it" ? "Errore. Riprova." : "Error. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── QR download ───────────────────────────────────────────────────────────
  const downloadQR = () => {
    const svg = document.getElementById("ticket-qr") as unknown as SVGSVGElement | null;
    if (!svg || result?.kind !== "qr") return;
    const data = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    const img = new Image();
    img.onload = () => {
      canvas.width = 1024;
      canvas.height = 1024;
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, 1024, 1024);
      ctx.drawImage(img, 64, 64, 896, 896);
      const link = document.createElement("a");
      link.download = `AYN-pass-${result.code.slice(0, 8)}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(data);
  };

  // ── Derived ───────────────────────────────────────────────────────────────
  const d = new Date(event.date + "T00:00:00");
  const fmtDate = d.toLocaleDateString(language === "it" ? "it-IT" : "en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const ModeIcon = mode.icon;

  // ── Render ────────────────────────────────────────────────────────────────
  const Content = (
    <div className="relative max-h-[88svh] overflow-y-auto bg-gradient-to-b from-[hsl(222_47%_8%)] via-[hsl(225_50%_11%)] to-[hsl(222_47%_8%)] text-primary-foreground font-sans">
      <button
        onClick={reset}
        className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full bg-white/5 backdrop-blur hover:bg-white/10 transition"
      >
        <X className="h-4 w-4" />
      </button>

      {/* Header */}
      <div className="px-6 pt-8 pb-5 md:px-10 md:pt-10 border-b border-white/[0.05]">
        <h2 className="font-serif text-2xl md:text-3xl leading-tight">{event.dj}</h2>
        <div className="mt-2.5 flex flex-wrap gap-x-5 gap-y-1 text-[12.5px] text-primary-foreground/60">
          <span className="flex items-center gap-1.5">
            <CalIcon className="h-3.5 w-3.5 text-accent/80" /> {fmtDate}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-accent/80" /> {event.venue}
          </span>
          {event.time && (
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-accent/80" /> {event.time}
            </span>
          )}
        </div>

        {/* Tipo di prenotazione — the 3 categories, with applicable highlighted */}
        <div className="mt-5">
          <p className="mb-2 font-sans text-[9.5px] uppercase tracking-[0.32em] text-primary-foreground/45">
            {language === "it" ? "Tipo di prenotazione" : "Booking type"}
          </p>
          <div className="grid grid-cols-3 gap-1.5">
            {([
              { key: "club_accredito_table", it: "Accredito + Tavolo", en: "Pass + Table", icon: Ticket },
              { key: "club_table_only", it: "Tavolo privé", en: "Privé table", icon: Crown },
              { key: "beach_daybed", it: "Tavolo + Lettini", en: "Table + Daybeds", icon: Sparkles },
            ] as const).map((c) => {
              const active = mode.kind === "pass-and-table" ? c.key === "club_accredito_table"
                : (event.bookingMode as string) === c.key;
              const CI = c.icon;
              return (
                <div key={c.key}
                  className={`relative rounded-xl border px-2.5 py-2 text-center transition-all ${active
                    ? "border-accent/55 bg-accent/10 text-primary-foreground shadow-[0_0_25px_-10px_hsl(var(--accent)/0.6)]"
                    : "border-white/[0.06] bg-white/[0.015] text-primary-foreground/30"}`}>
                  <CI className={`mx-auto h-3.5 w-3.5 mb-1 ${active ? "text-accent" : "text-primary-foreground/25"}`} />
                  <p className="font-sans text-[9.5px] leading-tight font-medium">{language === "it" ? c.it : c.en}</p>
                  {!active && <p className="mt-0.5 font-sans text-[8px] uppercase tracking-[0.2em] text-primary-foreground/25">{language === "it" ? "n/d" : "n/a"}</p>}
                </div>
              );
            })}
          </div>
          <p className="mt-3 text-[11.5px] text-primary-foreground/55 leading-relaxed">
            {mode.hint[language as "it" | "en"]}
          </p>
        </div>
      </div>

      {/* Body */}
      {!result ? (
        <div className="px-6 py-7 md:px-10 md:py-8 space-y-6">
          {/* Tabs for dual mode */}
          {availableFlows.length > 1 && (
            <div className="grid grid-cols-2 gap-2 rounded-full border border-white/10 bg-white/[0.03] p-1">
              <FlowTab
                active={flow === "pass"}
                onClick={() => setFlow("pass")}
                icon={Ticket}
                label={language === "it" ? "Accredito QR" : "Guest pass"}
              />
              <FlowTab
                active={flow === "table"}
                onClick={() => setFlow("table")}
                icon={Crown}
                label={language === "it" ? "Tavolo privé" : "Privé table"}
              />
            </div>
          )}

          {flow === "pass" ? (
            <div className="space-y-5">
              {/* Gender selector — drives QR vs request */}
              <div>
                <span className="block mb-2 text-[10px] uppercase tracking-[0.3em] text-primary-foreground/55">
                  {language === "it" ? "Tipo di accredito" : "Pass type"}
                </span>
                <div className="grid grid-cols-2 gap-2.5">
                  <GenderCard
                    active={passForm.gender === "F"}
                    onClick={() => setPassForm({ ...passForm, gender: "F" })}
                    title={language === "it" ? "Donna" : "Woman"}
                    desc={language === "it" ? "QR istantaneo" : "Instant QR"}
                    tone="emerald"
                  />
                  <GenderCard
                    active={passForm.gender === "M"}
                    onClick={() => setPassForm({ ...passForm, gender: "M" })}
                    title={language === "it" ? "Uomo" : "Man"}
                    desc={language === "it" ? "Su richiesta" : "On request"}
                    tone="amber"
                  />
                </div>
              </div>

              <Field label={language === "it" ? "Nome completo" : "Full name"} error={errors.full_name}>
                <input
                  value={passForm.full_name}
                  onChange={(e) => setPassForm({ ...passForm, full_name: e.target.value })}
                  className={input}
                  placeholder="Mario Rossi"
                />
              </Field>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Email" error={errors.email}>
                  <input
                    type="email"
                    value={passForm.email}
                    onChange={(e) => setPassForm({ ...passForm, email: e.target.value })}
                    className={input}
                    placeholder="email@example.com"
                  />
                </Field>
                <Field label={language === "it" ? "Telefono" : "Phone"} error={errors.phone}>
                  <input
                    type="tel"
                    value={passForm.phone}
                    onChange={(e) => setPassForm({ ...passForm, phone: e.target.value })}
                    className={input}
                    placeholder="+39 ..."
                  />
                </Field>
              </div>
              <Field label={language === "it" ? "Ospiti" : "Guests"} error={errors.guests}>
                <Stepper
                  value={passForm.guests}
                  onChange={(v) => setPassForm({ ...passForm, guests: v })}
                  min={1}
                  max={10}
                />
              </Field>

              <div className="rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3 flex items-start gap-2.5">
                <AlertCircle className="h-3.5 w-3.5 mt-0.5 text-accent/70 shrink-0" />
                <p className="text-[11px] text-primary-foreground/55 leading-relaxed">
                  {passForm.gender === "F"
                    ? language === "it"
                      ? "Riceverai subito un QR code da mostrare all'ingresso."
                      : "You'll instantly receive a QR code to show at the door."
                    : language === "it"
                      ? "La richiesta verrà confermata dal nostro staff. Ti contatteremo via email."
                      : "Your request will be reviewed by our staff. We will contact you via email."}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <Field label={language === "it" ? "Nome completo" : "Full name"} error={errors.full_name}>
                <input
                  value={tableForm.full_name}
                  onChange={(e) => setTableForm({ ...tableForm, full_name: e.target.value })}
                  className={input}
                  placeholder="Mario Rossi"
                />
              </Field>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Email" error={errors.email}>
                  <input
                    type="email"
                    value={tableForm.email}
                    onChange={(e) => setTableForm({ ...tableForm, email: e.target.value })}
                    className={input}
                    placeholder="email@example.com"
                  />
                </Field>
                <Field label={language === "it" ? "Telefono" : "Phone"} error={errors.phone}>
                  <input
                    type="tel"
                    value={tableForm.phone}
                    onChange={(e) => setTableForm({ ...tableForm, phone: e.target.value })}
                    className={input}
                    placeholder="+39 346 ..."
                  />
                </Field>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <Field label={language === "it" ? "Ospiti (pax)" : "Guests (pax)"} error={errors.pax}>
                  <Stepper
                    value={tableForm.pax}
                    onChange={(v) => setTableForm({ ...tableForm, pax: v })}
                    min={1}
                    max={30}
                  />
                </Field>
                <Field label={language === "it" ? "Orario" : "Time"} error={errors.booking_time}>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/30" />
                    <input
                      value={tableForm.booking_time}
                      onChange={(e) => setTableForm({ ...tableForm, booking_time: e.target.value })}
                      className={input + " pl-9"}
                      placeholder="18:00"
                    />
                  </div>
                </Field>
                <Field
                  label={language === "it" ? "Spesa minima" : "Min. spend"}
                  error={errors.spend}
                >
                  <div className="relative">
                    <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/30" />
                    <input
                      value={tableForm.spend}
                      onChange={(e) => setTableForm({ ...tableForm, spend: e.target.value })}
                      className={input + " pl-9"}
                      placeholder="1k €"
                    />
                  </div>
                </Field>
              </div>

              <Field label={language === "it" ? "Booker (opzionale)" : "Booker (optional)"}>
                <input
                  value={tableForm.booker}
                  onChange={(e) => setTableForm({ ...tableForm, booker: e.target.value })}
                  className={input}
                  placeholder={language === "it" ? "Nome del referente" : "Reference name"}
                />
              </Field>
              <Field label={language === "it" ? "Note (opzionale)" : "Notes (optional)"}>
                <textarea
                  value={tableForm.notes}
                  onChange={(e) => setTableForm({ ...tableForm, notes: e.target.value })}
                  rows={2}
                  className={input + " resize-none"}
                  placeholder={
                    language === "it"
                      ? "Occasione speciale, preferenze tavolo..."
                      : "Special occasion, table preferences..."
                  }
                />
              </Field>

              <div className="rounded-xl border border-accent/20 bg-accent/[0.06] px-4 py-3 flex items-start gap-2.5">
                <Wallet className="h-3.5 w-3.5 mt-0.5 text-accent shrink-0" />
                <p className="text-[11px] text-primary-foreground/70 leading-relaxed">
                  {language === "it"
                    ? "Riceverai via email il link per il deposito del 50% per confermare il tavolo."
                    : "You will receive an email with the 50% deposit link to confirm the table."}
                </p>
              </div>
            </div>
          )}

          <button
            disabled={submitting}
            onClick={submit}
            className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary via-primary to-accent px-8 py-4 text-[11px] font-bold uppercase tracking-[0.3em] text-white shadow-lg shadow-accent/25 hover:shadow-accent/40 transition disabled:opacity-60"
          >
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : flow === "pass" && passForm.gender === "F" ? (
              <Sparkles className="h-4 w-4" />
            ) : (
              <Ticket className="h-4 w-4" />
            )}
            {flow === "pass"
              ? passForm.gender === "F"
                ? language === "it"
                  ? "Conferma e ricevi il QR"
                  : "Confirm & get QR"
                : language === "it"
                  ? "Invia richiesta accredito"
                  : "Submit pass request"
              : language === "it"
                ? "Richiedi tavolo privé"
                : "Request privé table"}
          </button>
        </div>
      ) : result.kind === "qr" ? (
        <SuccessQR
          result={result}
          event={event}
          fmtDate={fmtDate}
          onDownload={downloadQR}
          onClose={reset}
        />
      ) : (
        <SuccessPending
          result={result}
          event={event}
          fmtDate={fmtDate}
          mode={mode}
          onClose={reset}
        />
      )}
    </div>
  );

  return isMobile ? (
    <Drawer open={!!event} onOpenChange={(o) => !o && reset()}>
      <DrawerContent className="border-none bg-transparent p-0">{Content}</DrawerContent>
    </Drawer>
  ) : (
    <Dialog open={!!event} onOpenChange={(o) => !o && reset()}>
      <DialogContent className="max-w-xl border-none bg-transparent p-0 overflow-hidden">
        {Content}
      </DialogContent>
    </Dialog>
  );
};

// ──────────────────────────────────────────────────────────────────────────────
// Subcomponents

const input =
  "w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-accent/50 transition";

const Field = ({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) => (
  <label className="block">
    <span className="block mb-1.5 text-[10px] uppercase tracking-[0.3em] text-primary-foreground/55">
      {label}
    </span>
    {children}
    {error && <span className="mt-1 block text-[10px] text-red-400">{error}</span>}
  </label>
);

const FlowTab = ({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: any;
  label: string;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`relative inline-flex items-center justify-center gap-1.5 rounded-full px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.25em] transition ${
      active
        ? "bg-gradient-to-r from-primary to-accent text-white shadow-md shadow-accent/20"
        : "text-primary-foreground/55 hover:text-primary-foreground"
    }`}
  >
    <Icon className="h-3 w-3" />
    {label}
  </button>
);

const GenderCard = ({
  active,
  onClick,
  title,
  desc,
  tone,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  desc: string;
  tone: "emerald" | "amber";
}) => {
  const tones = {
    emerald: "border-emerald-400/40 bg-emerald-400/10 text-emerald-300",
    amber: "border-amber-400/40 bg-amber-400/10 text-amber-300",
  } as const;
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-left rounded-xl border px-4 py-3 transition ${
        active
          ? tones[tone]
          : "border-white/10 bg-white/[0.02] text-primary-foreground/70 hover:border-white/20"
      }`}
    >
      <p className="font-semibold text-[13px] leading-tight">{title}</p>
      <p className="text-[10.5px] mt-0.5 opacity-80">{desc}</p>
    </button>
  );
};

const Stepper = ({
  value,
  onChange,
  min,
  max,
}: {
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
}) => (
  <div className="flex items-center gap-3">
    <button
      type="button"
      onClick={() => onChange(Math.max(min, value - 1))}
      className="h-10 w-10 rounded-full border border-white/10 hover:bg-white/5"
    >
      −
    </button>
    <span className="font-sans font-bold text-xl w-10 text-center">{value}</span>
    <button
      type="button"
      onClick={() => onChange(Math.min(max, value + 1))}
      className="h-10 w-10 rounded-full border border-white/10 hover:bg-white/5"
    >
      +
    </button>
  </div>
);

const SuccessQR = ({
  result,
  event,
  fmtDate,
  onDownload,
  onClose,
}: {
  result: { kind: "qr"; code: string; data: any };
  event: EventLite;
  fmtDate: string;
  onDownload: () => void;
  onClose: () => void;
}) => {
  const { language } = useLanguage();
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="px-6 py-8 md:px-10 md:py-10 text-center space-y-6"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="mx-auto h-14 w-14 grid place-items-center rounded-full bg-emerald-500/15 ring-1 ring-emerald-400/30"
      >
        <Check className="h-6 w-6 text-emerald-400" />
      </motion.div>
      <div>
        <p className="text-[10px] uppercase tracking-[0.5em] text-accent/80 mb-2">
          {language === "it" ? "Conferma" : "Confirmed"}
        </p>
        <h3 className="font-sans font-bold text-2xl">
          {language === "it" ? "Il tuo pass è pronto" : "Your pass is ready"}
        </h3>
        <p className="mt-2 text-sm text-primary-foreground/55">
          {result.data.full_name} · {result.data.guests}{" "}
          {language === "it" ? "ospiti" : "guests"}
        </p>
      </div>

      <div className="mx-auto inline-block rounded-3xl bg-white p-5 shadow-2xl shadow-accent/20">
        <QRCodeSVG
          id="ticket-qr"
          value={JSON.stringify({
            code: result.code,
            event: event.dj,
            date: event.date,
            venue: event.venue,
            name: result.data.full_name,
            guests: result.data.guests,
          })}
          size={220}
          level="H"
          includeMargin={false}
        />
        <p className="mt-3 font-mono text-[10px] tracking-widest text-foreground/60">
          {result.code.slice(0, 16).toUpperCase()}
        </p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onDownload}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-accent hover:bg-accent/20 transition"
        >
          <Download className="h-4 w-4" />{" "}
          {language === "it" ? "Scarica QR" : "Download QR"}
        </button>
        <button
          onClick={onClose}
          className="flex-1 rounded-full bg-gradient-to-r from-primary to-accent px-6 py-3 text-[11px] font-bold uppercase tracking-[0.25em] text-white"
        >
          {language === "it" ? "Chiudi" : "Close"}
        </button>
      </div>
    </motion.div>
  );
};

const SuccessPending = ({
  result,
  event,
  fmtDate,
  mode,
  onClose,
}: {
  result: { kind: "pending"; data: any; flow: Flow };
  event: EventLite;
  fmtDate: string;
  mode: ReturnType<typeof getBookingMode>;
  onClose: () => void;
}) => {
  const { language } = useLanguage();
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="px-6 py-8 md:px-10 md:py-10 text-center space-y-6"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="mx-auto h-14 w-14 grid place-items-center rounded-full bg-amber-400/15 ring-1 ring-amber-400/30"
      >
        <Clock className="h-6 w-6 text-amber-300" />
      </motion.div>
      <div>
        <p className="text-[10px] uppercase tracking-[0.5em] text-accent/80 mb-2">
          {language === "it" ? "Richiesta inviata" : "Request received"}
        </p>
        <h3 className="font-sans font-bold text-2xl">
          {result.flow === "table"
            ? language === "it"
              ? "Tavolo in richiesta"
              : "Table requested"
            : language === "it"
              ? "Accredito in revisione"
              : "Pass under review"}
        </h3>
        <p className="mt-2 text-sm text-primary-foreground/55 max-w-sm mx-auto">
          {result.flow === "table"
            ? language === "it"
              ? "Riceverai a breve via email il link per il deposito del 50% e la conferma del tavolo."
              : "You will shortly receive an email with the 50% deposit link and table confirmation."
            : language === "it"
              ? "Il nostro staff valuterà la richiesta e ti contatterà via email."
              : "Our staff will review your request and contact you via email."}
        </p>
      </div>

      <div className="rounded-2xl border border-white/5 bg-white/[0.03] px-5 py-4 text-left">
        <p className="text-xs uppercase tracking-[0.3em] text-accent/70 mb-2">{event.venue}</p>
        <p className="font-sans font-bold text-lg leading-tight">{event.dj}</p>
        <p className="mt-1 text-xs text-primary-foreground/55">{fmtDate}</p>
        <div className="mt-3 pt-3 border-t border-white/[0.05] grid grid-cols-2 gap-2 text-[11px] text-primary-foreground/60">
          <span className="flex items-center gap-1.5"><Users className="h-3 w-3 text-accent/70" /> {result.data.pax || result.data.guests} pax</span>
          {result.data.booking_time && <span className="flex items-center gap-1.5"><Clock className="h-3 w-3 text-accent/70" /> {result.data.booking_time}</span>}
          {result.data.spend && <span className="flex items-center gap-1.5"><Wallet className="h-3 w-3 text-accent/70" /> {result.data.spend}</span>}
        </div>
      </div>

      <button
        onClick={onClose}
        className="w-full rounded-full bg-gradient-to-r from-primary to-accent px-6 py-3 text-[11px] font-bold uppercase tracking-[0.25em] text-white"
      >
        {language === "it" ? "Chiudi" : "Close"}
      </button>
    </motion.div>
  );
};

export default EventBookingModal;
