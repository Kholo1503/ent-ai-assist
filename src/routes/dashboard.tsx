import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  Bot,
  CalendarClock,
  CheckCircle2,
  Clock,
  FileText,
  Flame,
  Lightbulb,
  Loader2,
  ListTodo,
  Mail,
  Search,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Card, GhostButton } from "@/components/AiPanel";
import { TaskCard } from "@/components/TaskCard";
import { isToday, tasksAsText, useTasks } from "@/lib/tasks";
import { aiComplete } from "@/lib/ai.functions";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Easy Note Taker (ENT)" },
      {
        name: "description",
        content:
          "Your ENT productivity dashboard: task overview, quick AI tools, today's tasks and AI insights.",
      },
      { property: "og:title", content: "ENT Dashboard — Capture It. Plan It. Get It Done." },
      {
        property: "og:description",
        content: "Track tasks, launch AI tools and get a daily productivity insight.",
      },
    ],
  }),
  component: Dashboard,
});

const QUICK = [
  { to: "/email-generator", label: "Generate Email", icon: Mail },
  { to: "/meeting-summarizer", label: "Summarise Meeting", icon: FileText },
  { to: "/task-planner", label: "Plan My Day", icon: CalendarClock },
  { to: "/research-assistant", label: "Research Topic", icon: Search },
  { to: "/assistant", label: "Ask ENT Assistant", icon: Bot },
] as const;

function Stat({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  value: number;
  icon: typeof Mail;
  tone: "primary" | "accent" | "muted" | "dark";
}) {
  const tones = {
    primary: "bg-primary/10 text-primary",
    accent: "bg-accent/25 text-accent-foreground",
    muted: "bg-secondary text-muted-foreground",
    dark: "bg-sidebar text-sidebar-primary",
  } as const;
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
      <div className="flex items-center justify-between gap-3">
        <span className="min-w-0 truncate text-xs font-medium text-muted-foreground">{label}</span>
        <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${tones[tone]}`}>
          <Icon className="h-4.5 w-4.5" />
        </span>
      </div>
      <div className="mt-3 text-3xl font-black tracking-tight">{value}</div>
    </div>
  );
}

function Dashboard() {
  const tasks = useTasks();
  const run = useServerFn(aiComplete);
  const [insight, setInsight] = useState("");
  const [loading, setLoading] = useState(false);

  const today = tasks.filter((t) => isToday(t.deadline));
  const completed = tasks.filter((t) => t.status === "Completed");
  const pending = tasks.filter((t) => t.status !== "Completed");
  const high = tasks.filter((t) => t.priority === "High" && t.status !== "Completed");

  const generateInsight = async () => {
    setLoading(true);
    try {
      const res = await run({
        data: {
          messages: [
            {
              role: "system",
              content:
                "You are ENT, a concise productivity coach. Reply with 2-3 short sentences of practical advice. No markdown headings, no lists.",
            },
            {
              role: "user",
              content: `Today is ${new Date().toDateString()}. Here are my tasks:\n${tasksAsText(tasks)}\n\nGive me one focused productivity insight for today.`,
            },
          ],
        },
      });
      setInsight(res.text.trim());
    } catch (e) {
      setInsight(e instanceof Error ? e.message : "Could not generate an insight right now.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void generateInsight();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AppShell title="Dashboard" subtitle="Capture It. Plan It. Get It Done.">
      <div className="space-y-6">
        <section
          className="rounded-2xl p-6 text-sidebar-foreground shadow-[var(--shadow-card)]"
          style={{ backgroundImage: "var(--gradient-night)" }}
        >
          <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
            Welcome back to Easy Note Taker
          </h2>
          <p
            className="mt-2 bg-clip-text text-sm font-bold text-transparent sm:text-base"
            style={{ backgroundImage: "var(--gradient-brand)" }}
          >
            Capture It. Plan It. Get It Done.
          </p>
          <p className="mt-3 max-w-2xl text-sm text-sidebar-foreground/70">
            You have {pending.length} pending task{pending.length === 1 ? "" : "s"} and{" "}
            {high.length} high-priority item{high.length === 1 ? "" : "s"} needing attention.
          </p>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Stat label="Tasks Today" value={today.length} icon={ListTodo} tone="dark" />
          <Stat label="Completed Tasks" value={completed.length} icon={CheckCircle2} tone="primary" />
          <Stat label="Pending Tasks" value={pending.length} icon={Clock} tone="muted" />
          <Stat label="High Priority" value={high.length} icon={Flame} tone="accent" />
        </section>

        <Card title="Quick Actions" description="Jump straight into an AI tool.">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            {QUICK.map((q) => (
              <Link
                key={q.to}
                to={q.to}
                className="group flex items-center gap-3 rounded-xl border border-border bg-background p-3 transition hover:border-primary hover:bg-primary/5"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                  <q.icon className="h-4.5 w-4.5" />
                </span>
                <span className="min-w-0 truncate text-sm font-medium">{q.label}</span>
              </Link>
            ))}
          </div>
        </Card>

        <Card
          title="Today's Tasks"
          description="What's due today across work and study."
          footer={
            <Link to="/tasks" className="text-sm font-semibold text-primary hover:underline">
              View all tasks →
            </Link>
          }
        >
          {today.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border py-12 text-center text-sm text-muted-foreground">
              Nothing due today. Add a task from My Tasks to get started.
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {today.map((t) => (
                <TaskCard key={t.id} task={t} compact />
              ))}
            </div>
          )}
        </Card>

        <Card>
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 sm:flex sm:justify-between">
            <div className="flex min-w-0 items-start gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-accent/30 text-accent-foreground">
                <Lightbulb className="h-4.5 w-4.5" />
              </span>
              <div className="min-w-0">
                <h2 className="text-base font-semibold tracking-tight">AI Productivity Insight</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {loading && !insight ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-primary" /> Analysing your
                      tasks…
                    </span>
                  ) : (
                    insight
                  )}
                </p>
              </div>
            </div>
            <GhostButton onClick={() => void generateInsight()} disabled={loading}>
              Refresh
            </GhostButton>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
