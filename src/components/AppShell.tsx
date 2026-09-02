import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import {
  LayoutDashboard,
  Mail,
  FileText,
  CalendarClock,
  Search,
  Bot,
  ListChecks,
  Settings,
  LifeBuoy,
  ShieldCheck,
  Menu,
  X,
} from "lucide-react";
import { EntLogo } from "./EntLogo";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/email-generator", label: "Email Generator", icon: Mail },
  { to: "/meeting-summarizer", label: "Meeting Summarizer", icon: FileText },
  { to: "/task-planner", label: "Task Planner", icon: CalendarClock },
  { to: "/research-assistant", label: "Research Assistant", icon: Search },
  { to: "/assistant", label: "ENT Assistant", icon: Bot },
  { to: "/tasks", label: "My Tasks", icon: ListChecks },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

const BOTTOM_NAV = [
  { to: "/help", label: "Help", icon: LifeBuoy },
  { to: "/responsible-ai", label: "Responsible AI", icon: ShieldCheck },
] as const;

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const item = (to: string, label: string, Icon: typeof Mail) => {
    const active = pathname === to;
    return (
      <Link
        key={to}
        to={to}
        onClick={onNavigate}
        className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
          active
            ? "bg-sidebar-primary text-sidebar-primary-foreground"
            : "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        }`}
      >
        <Icon className="h-4.5 w-4.5 shrink-0" />
        <span className="truncate">{label}</span>
      </Link>
    );
  };

  return (
    <div className="flex h-full flex-col">
      <nav className="flex flex-1 flex-col gap-1">
        {NAV.map((n) => item(n.to, n.label, n.icon))}
      </nav>
      <div className="mt-6 flex flex-col gap-1 border-t border-sidebar-border pt-4">
        {BOTTOM_NAV.map((n) => item(n.to, n.label, n.icon))}
      </div>
    </div>
  );
}

export function AppShell({
  title,
  subtitle,
  actions,
  children,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col bg-sidebar p-4 lg:flex">
        <div className="px-2 py-3">
          <EntLogo />
        </div>
        <div className="mt-4 flex-1 overflow-y-auto">
          <NavList />
        </div>
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Close navigation"
            className="absolute inset-0 bg-foreground/50"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col bg-sidebar p-4">
            <div className="flex items-center justify-between px-2 py-2">
              <EntLogo />
              <button
                onClick={() => setOpen(false)}
                aria-label="Close navigation"
                className="rounded-lg p-2 text-sidebar-foreground/70 hover:bg-sidebar-accent"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-4 flex-1 overflow-y-auto">
              <NavList onNavigate={() => setOpen(false)} />
            </div>
          </aside>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur-md">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 sm:flex sm:justify-between sm:px-6 sm:py-4">
            <div className="flex min-w-0 items-center gap-3">
              <button
                onClick={() => setOpen(true)}
                aria-label="Open navigation"
                className="shrink-0 rounded-lg border border-border p-2 text-foreground lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div className="min-w-0">
                <h1 className="truncate text-lg font-bold tracking-tight sm:text-xl">{title}</h1>
                {subtitle && (
                  <p className="truncate text-xs text-muted-foreground sm:text-sm">{subtitle}</p>
                )}
              </div>
            </div>
            {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
          </div>
        </header>
        <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">{children}</main>
      </div>
    </div>
  );
}
