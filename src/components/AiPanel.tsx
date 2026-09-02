import { useState, type ReactNode } from "react";
import { Copy, RefreshCw, Eraser, Loader2, Check, Sparkle } from "lucide-react";
import { toast } from "sonner";

export function Card({
  title,
  description,
  children,
  className = "",
  footer,
}: {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
  footer?: ReactNode;
}) {
  return (
    <section
      className={`rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)] ${className}`}
    >
      {title && (
        <header className="mb-4">
          <h2 className="text-base font-semibold tracking-tight">{title}</h2>
          {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
        </header>
      )}
      {children}
      {footer && <div className="mt-4">{footer}</div>}
    </section>
  );
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-muted-foreground">{hint}</span>}
    </label>
  );
}

export const inputClass =
  "w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/30";

export function PrimaryButton({
  children,
  loading,
  className = "",
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }) {
  return (
    <button
      {...rest}
      disabled={rest.disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkle className="h-4 w-4" />}
      {children}
    </button>
  );
}

export function GhostButton({
  children,
  className = "",
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      className={`inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-sm font-medium text-foreground transition hover:bg-secondary disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
}

export function copyText(text: string) {
  navigator.clipboard
    .writeText(text)
    .then(() => toast.success("Copied to clipboard"))
    .catch(() => toast.error("Could not copy"));
}

/** Editable AI output panel with copy / edit / regenerate / clear. */
export function AiOutput({
  value,
  onChange,
  onRegenerate,
  onClear,
  loading,
  emptyHint,
  title = "AI Output",
  rows = 16,
}: {
  value: string;
  onChange: (v: string) => void;
  onRegenerate: () => void;
  onClear: () => void;
  loading?: boolean;
  emptyHint: string;
  title?: string;
  rows?: number;
}) {
  const [editing, setEditing] = useState(false);

  return (
    <Card className="flex h-full flex-col">
      <div className="mb-3 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 sm:flex sm:justify-between">
        <div className="min-w-0">
          <h2 className="truncate text-base font-semibold tracking-tight">{title}</h2>
          <p className="truncate text-xs text-muted-foreground">
            Review and edit before you use it.
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <GhostButton onClick={() => setEditing((e) => !e)} disabled={!value}>
            {editing ? <Check className="h-4 w-4" /> : null}
            {editing ? "Done" : "Edit"}
          </GhostButton>
          <GhostButton onClick={() => copyText(value)} disabled={!value}>
            <Copy className="h-4 w-4" /> Copy
          </GhostButton>
          <GhostButton onClick={onRegenerate} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Regenerate
          </GhostButton>
          <GhostButton onClick={onClear}>
            <Eraser className="h-4 w-4" /> Clear
          </GhostButton>
        </div>
      </div>

      {loading && !value ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border py-16 text-sm text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          Generating with AI…
        </div>
      ) : value ? (
        editing ? (
          <textarea
            value={value}
            rows={rows}
            onChange={(e) => onChange(e.target.value)}
            className={`${inputClass} flex-1 resize-y font-mono text-[13px] leading-relaxed`}
          />
        ) : (
          <div className="flex-1 overflow-auto whitespace-pre-wrap rounded-xl bg-secondary/60 p-4 text-sm leading-relaxed">
            {value}
          </div>
        )
      ) : (
        <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-border px-6 py-16 text-center text-sm text-muted-foreground">
          {emptyHint}
        </div>
      )}

      <p className="mt-3 text-xs text-muted-foreground">
        AI-generated content may contain errors. Verify before relying on it.
      </p>
    </Card>
  );
}
