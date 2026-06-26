import { useEffect, useMemo, useState } from "react";
import { Clock } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const pad = (n: number) => n.toString().padStart(2, "0");

/**
 * Resolves the deadline timestamp.
 * Priority:
 *  1. explicit `deadline`
 *  2. derived from `eventDate` (+ optional `eventTime` like "23:00")
 *     defaulting to 2h before event start.
 */
const resolveDeadline = (
  deadline?: string | null,
  eventDate?: string | null,
  eventTime?: string | null,
  hoursBefore = 2,
): Date | null => {
  if (deadline) {
    const d = new Date(deadline);
    if (!isNaN(d.getTime())) return d;
  }
  if (eventDate) {
    const t = (eventTime || "23:00").match(/\d{1,2}:\d{2}/)?.[0] || "23:00";
    const iso = `${eventDate}T${t.length === 4 ? "0" + t : t}:00`;
    const start = new Date(iso);
    if (!isNaN(start.getTime())) {
      return new Date(start.getTime() - hoursBefore * 3_600_000);
    }
  }
  return null;
};

export const AccreditoCountdown = ({
  deadline,
  eventDate,
  eventTime,
  hoursBefore = 2,
  className = "",
}: {
  deadline?: string | null;
  eventDate?: string | null;
  eventTime?: string | null;
  hoursBefore?: number;
  className?: string;
}) => {
  const { language } = useLanguage();
  const [now, setNow] = useState(() => new Date());

  const end = useMemo(
    () => resolveDeadline(deadline, eventDate, eventTime, hoursBefore),
    [deadline, eventDate, eventTime, hoursBefore],
  );

  useEffect(() => {
    if (!end) return;
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, [end]);

  if (!end) return null;

  const diff = end.getTime() - now.getTime();
  const closed = diff <= 0;

  const days = Math.max(0, Math.floor(diff / 86_400_000));
  const hours = Math.max(0, Math.floor((diff % 86_400_000) / 3_600_000));
  const minutes = Math.max(0, Math.floor((diff % 3_600_000) / 60_000));
  const seconds = Math.max(0, Math.floor((diff % 60_000) / 1_000));

  return (
    <div
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-accent/25 bg-accent/[0.06] px-2.5 py-1 ${className}`}
    >
      <Clock className="h-3 w-3 text-accent" />
      <span className="text-[10px] md:text-[11px] font-medium tracking-wide text-primary-foreground/80">
        {closed
          ? language === "it"
            ? "Accrediti chiusi"
            : "Guest list closed"
          : `${language === "it" ? "Chiusura accrediti" : "Closes in"} ${days > 0 ? `${days}g ` : ""}${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`}
      </span>
    </div>
  );
};
