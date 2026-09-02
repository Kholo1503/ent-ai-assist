type Props = {
  size?: number;
  withWordmark?: boolean;
  tone?: "light" | "dark";
};

export function EntLogo({ size = 36, withWordmark = true, tone = "dark" }: Props) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        role="img"
        aria-label="Easy Note Taker logo"
        className="shrink-0"
      >
        <rect x="1" y="1" width="46" height="46" rx="13" fill="oklch(0.19 0.014 155)" />
        <rect x="10" y="12" width="19" height="3.2" rx="1.6" fill="oklch(0.68 0.17 152)" />
        <rect x="10" y="19" width="24" height="3.2" rx="1.6" fill="oklch(0.9 0.16 96)" />
        <rect x="10" y="26" width="14" height="3.2" rx="1.6" fill="oklch(0.98 0 0)" />
        <circle cx="33" cy="32" r="7" fill="oklch(0.68 0.17 152)" />
        <path
          d="M30 32.2l2.2 2.2 4.1-4.6"
          stroke="oklch(0.15 0.01 150)"
          strokeWidth="2.1"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
      {withWordmark && (
        <div className="min-w-0 leading-tight">
          <div
            className={`truncate text-sm font-black tracking-[0.18em] ${
              tone === "dark" ? "text-sidebar-foreground" : "text-foreground"
            }`}
          >
            ENT
          </div>
          <div
            className={`truncate text-xs ${
              tone === "dark" ? "text-sidebar-foreground/60" : "text-muted-foreground"
            }`}
          >
            Easy Note Taker
          </div>
        </div>
      )}
    </div>
  );
}
