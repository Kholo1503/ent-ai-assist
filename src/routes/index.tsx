import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Bot, CalendarClock, FileText, Mail, Search, ShieldCheck } from "lucide-react";
import { EntLogo } from "@/components/EntLogo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Easy Note Taker (ENT) — Capture It. Plan It. Get It Done." },
      {
        name: "description",
        content:
          "ENT is an AI productivity assistant for emails, meeting summaries, task planning, research and workplace support.",
      },
      { property: "og:title", content: "Easy Note Taker (ENT) — AI Productivity Assistant" },
      {
        property: "og:description",
        content:
          "Smarter notes, better planning and faster work with five AI-powered productivity tools.",
      },
    ],
  }),
  component: Landing,
});

const FEATURES = [
  { icon: Mail, title: "Smart Email Generator", text: "Professional emails in any tone, instantly." },
  { icon: FileText, title: "Meeting Summarizer", text: "Turn messy notes into decisions and actions." },
  { icon: CalendarClock, title: "AI Task Planner", text: "Daily and weekly schedules built for you." },
  { icon: Search, title: "Research Assistant", text: "Structured overviews of any topic." },
  { icon: Bot, title: "ENT Assistant", text: "A workplace and study chatbot on standby." },
  { icon: ShieldCheck, title: "Responsible AI", text: "Human oversight built into every output." },
];

function Landing() {
  return (
    <div className="min-h-screen bg-sidebar text-sidebar-foreground">
      <div className="mx-auto flex w-full max-w-6xl flex-col px-5 py-6 sm:px-8">
        <header className="flex items-center justify-between">
          <EntLogo />
          <Link
            to="/dashboard"
            className="rounded-xl border border-sidebar-border px-4 py-2 text-sm font-medium hover:bg-sidebar-accent"
          >
            Open app
          </Link>
        </header>

        <section className="grid flex-1 items-center gap-10 py-14 lg:grid-cols-2 lg:py-24">
          <div className="min-w-0">
            <span className="inline-flex items-center gap-2 rounded-full bg-sidebar-accent px-3 py-1 text-xs font-medium text-accent">
              AI productivity for students & professionals
            </span>
            <h1 className="mt-5 text-4xl font-black leading-[1.05] tracking-tight sm:text-6xl">
              Easy Note Taker
            </h1>
            <p
              className="mt-3 bg-clip-text text-xl font-bold text-transparent sm:text-2xl"
              style={{ backgroundImage: "var(--gradient-brand)" }}
            >
              Capture It. Plan It. Get It Done.
            </p>
            <p className="mt-5 max-w-lg text-base text-sidebar-foreground/70">
              Your AI-powered productivity assistant for smarter notes, better planning and faster
              work.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 rounded-xl bg-sidebar-primary px-6 py-3 text-sm font-semibold text-sidebar-primary-foreground transition hover:brightness-95"
              >
                Get Started <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/responsible-ai"
                className="inline-flex items-center gap-2 rounded-xl border border-sidebar-border px-6 py-3 text-sm font-semibold hover:bg-sidebar-accent"
              >
                Responsible AI
              </Link>
            </div>
            <p className="mt-4 text-xs text-sidebar-foreground/50">
              No sign-up needed for this prototype. Your tasks stay in your browser.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-sidebar-border bg-sidebar-accent/50 p-4 shadow-[var(--shadow-card)]"
              >
                <f.icon className="h-5 w-5 text-sidebar-primary" />
                <h3 className="mt-3 text-sm font-semibold">{f.title}</h3>
                <p className="mt-1 text-xs text-sidebar-foreground/60">{f.text}</p>
              </div>
            ))}
          </div>
        </section>

        <footer className="border-t border-sidebar-border py-6 text-xs text-sidebar-foreground/50">
          © {new Date().getFullYear()} Easy Note Taker (ENT). AI outputs should always be reviewed
          by a human.
        </footer>
      </div>
    </div>
  );
}
