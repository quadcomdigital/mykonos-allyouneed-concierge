interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
  theme?: "light" | "dark";
  align?: "left" | "center";
  className?: string;
}

const SectionHeader = ({
  eyebrow,
  title,
  description,
  theme = "light",
  align = "left",
  className = "",
}: SectionHeaderProps) => {
  const dark = theme === "dark";
  const centered = align === "center";

  return (
    <div className={`${centered ? "mx-auto text-center" : ""} ${className}`.trim()}>
      <div className={`mb-4 flex items-center gap-3 ${centered ? "justify-center" : ""}`}>
        <span className={`h-px w-10 ${dark ? "bg-accent/45" : "bg-accent/55"}`} />
        <p className={`text-[10px] uppercase tracking-[0.45em] ${dark ? "text-accent/75" : "text-accent/65"}`}>
          {eyebrow}
        </p>
      </div>

      <h2 className={`${dark ? "text-primary-foreground" : "text-foreground"} font-serif text-3xl leading-[0.98] md:text-5xl`}>
        {title}
      </h2>

      {description && (
        <p
          className={`mt-4 max-w-2xl text-sm leading-7 md:text-base ${
            dark
              ? centered
                ? "mx-auto text-primary-foreground/60"
                : "text-primary-foreground/60"
              : centered
                ? "mx-auto text-muted-foreground/70"
                : "text-muted-foreground/70"
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
};

export default SectionHeader;
