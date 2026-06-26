import { useState } from "react";
import { motion } from "framer-motion";
import { Send, CalendarIcon, Users, X, Minus, Plus } from "lucide-react";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ServiceRequestFormProps {
  serviceType: string;
  serviceName: string;
  showDates?: boolean;
  showGuests?: boolean;
  maxGuests?: number;
  onSuccess?: () => void;
  className?: string;
}

const ServiceRequestForm = ({
  serviceType,
  serviceName,
  showDates = true,
  showGuests = true,
  maxGuests = 20,
  onSuccess,
  className,
}: ServiceRequestFormProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [guests, setGuests] = useState(1);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast.error("Compila nome ed email.");
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from("bookings").insert({
      service_type: serviceType,
      service_name: serviceName,
      customer_name: name.trim(),
      customer_email: email.trim(),
      customer_phone: phone.trim() || null,
      check_in: checkIn ? format(checkIn, "yyyy-MM-dd") : null,
      check_out: checkOut ? format(checkOut, "yyyy-MM-dd") : null,
      guests: showGuests ? guests : null,
      message: message.trim() || null,
      source: "website",
    } as any);

    setSubmitting(false);

    if (error) {
      toast.error("Errore nell'invio. Riprova.");
      return;
    }

    toast.success("Richiesta inviata! Ti risponderemo al più presto.");
    setName("");
    setEmail("");
    setPhone("");
    setCheckIn(undefined);
    setCheckOut(undefined);
    setGuests(1);
    setMessage("");
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-5", className)}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">Nome e cognome *</label>
          <input
            type="text" required value={name} onChange={(e) => setName(e.target.value)}
            placeholder="Mario Rossi" maxLength={100}
            className="w-full px-4 py-3.5 rounded-xl border border-border/60 bg-transparent text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-accent/40 transition-colors"
          />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">Email *</label>
          <input
            type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="mario@email.com" maxLength={255}
            className="w-full px-4 py-3.5 rounded-xl border border-border/60 bg-transparent text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-accent/40 transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">Telefono / WhatsApp</label>
        <input
          type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
          placeholder="+39 333 1234567" maxLength={20}
          className="w-full px-4 py-3.5 rounded-xl border border-border/60 bg-transparent text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-accent/40 transition-colors"
        />
      </div>

      {showDates && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">Check-in</label>
            <Popover>
              <PopoverTrigger asChild>
                <button type="button" className={cn(
                  "w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border border-border/60 text-left hover:border-accent/30 transition-colors text-sm",
                  !checkIn && "text-muted-foreground"
                )}>
                  <CalendarIcon className="h-4 w-4 text-accent shrink-0" />
                  {checkIn ? format(checkIn, "d MMMM yyyy", { locale: it }) : "Seleziona data"}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={checkIn} onSelect={setCheckIn} disabled={(d) => d < new Date()} initialFocus className="p-3 pointer-events-auto" />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">Check-out</label>
            <Popover>
              <PopoverTrigger asChild>
                <button type="button" className={cn(
                  "w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border border-border/60 text-left hover:border-accent/30 transition-colors text-sm",
                  !checkOut && "text-muted-foreground"
                )}>
                  <CalendarIcon className="h-4 w-4 text-accent shrink-0" />
                  {checkOut ? format(checkOut, "d MMMM yyyy", { locale: it }) : "Seleziona data"}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={checkOut} onSelect={setCheckOut} disabled={(d) => d < (checkIn || new Date())} initialFocus className="p-3 pointer-events-auto" />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      )}

      {showGuests && (
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">Ospiti</label>
          <div className="flex items-center gap-4 px-4 py-3 rounded-xl border border-border/60">
            <Users className="h-4 w-4 text-accent shrink-0" />
            <button type="button" onClick={() => setGuests(Math.max(1, guests - 1))} className="w-8 h-8 rounded-full border border-border/60 flex items-center justify-center hover:bg-muted/50 transition-colors">
              <Minus className="h-3 w-3" />
            </button>
            <span className="text-lg font-bold min-w-[2rem] text-center">{guests}</span>
            <button type="button" onClick={() => setGuests(Math.min(maxGuests, guests + 1))} className="w-8 h-8 rounded-full border border-border/60 flex items-center justify-center hover:bg-muted/50 transition-colors">
              <Plus className="h-3 w-3" />
            </button>
            <span className="text-xs text-muted-foreground ml-auto">max {maxGuests}</span>
          </div>
        </div>
      )}

      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">Note / Messaggio</label>
        <textarea
          value={message} onChange={(e) => setMessage(e.target.value)}
          placeholder="Richieste speciali, dettagli aggiuntivi..."
          rows={3} maxLength={1000}
          className="w-full px-4 py-3.5 rounded-xl border border-border/60 bg-transparent text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-accent/40 transition-colors resize-none"
        />
      </div>

      <button
        type="submit" disabled={submitting}
        className="w-full flex items-center justify-center gap-2 py-4 rounded-full bg-accent text-accent-foreground font-bold text-sm tracking-wide hover:bg-accent/90 transition-colors disabled:opacity-50"
      >
        <Send className="h-4 w-4" />
        {submitting ? "Invio in corso..." : "Invia richiesta"}
      </button>
      <p className="text-[11px] text-muted-foreground text-center">
        Ti risponderemo entro 24 ore con disponibilità e preventivo personalizzato.
      </p>
    </form>
  );
};

export default ServiceRequestForm;
