import type { LucideIcon } from "lucide-react";

interface DetailSpecCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  dark?: boolean;
}

const DetailSpecCard = ({ icon: Icon, label, value, dark = false }: DetailSpecCardProps) => {
  return (
    <div
      className={`rounded-[1.5rem] border px-4 py-4 md:px-5 md:py-5 ${
        dark
          ? "border-primary-foreground/10 bg-primary-foreground/[0.05] text-primary-foreground"
          : "border-border/10 bg-card/80 text-foreground"
      }`}
    >
      <div className="mb-3 flex items-center gap-2">
        <div className={`flex h-9 w-9 items-center justify-center rounded-full ${dark ? "bg-primary-foreground/[0.08]" : "bg-secondary/70"}`}>
          <Icon className="h-4 w-4 text-accent" />
        </div>
        <p className={`text-[10px] uppercase tracking-[0.32em] ${dark ? "text-primary-foreground/55" : "text-muted-foreground/70"}`}>
          {label}
        </p>
      </div>
      <p className={`text-sm leading-6 md:text-[15px] ${dark ? "text-primary-foreground/85" : "text-foreground/80"}`}>{value}</p>
    </div>
  );
};

export default DetailSpecCard;
