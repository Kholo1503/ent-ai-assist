import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { AiOutput, Card, PrimaryButton } from "@/components/AiPanel";
import { TaskCard } from "@/components/TaskCard";
import { TaskForm } from "@/components/TaskForm";
import { tasksAsText, useTasks } from "@/lib/tasks";
import { aiComplete } from "@/lib/ai.functions";

export const Route = createFileRoute("/task-planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — Easy Note Taker (ENT)" },
      {
        name: "description",
        content:
          "Let AI prioritise your tasks and build realistic daily and weekly schedules with time allocations.",
      },
      { property: "og:title", content: "AI Task Planner — ENT" },
      {
        property: "og:description",
        content: "Daily and weekly planners generated from your real task list.",
      },
    ],
  }),
  component: TaskPlanner,
});

type View = "daily" | "weekly";

function TaskPlanner() {
  const tasks = useTasks();
  const run = useServerFn(aiComplete);
  const [view, setView] = useState<View>("daily");
  const [plan, setPlan] = useState<Record<View, string>>({ daily: "", weekly: "" });
  const [loading, setLoading] = useState(false);

  const generate = async (target: View = view) => {
    if (tasks.length === 0) {
      toast.error("Add at least one task first.");
      return;
    }
    setLoading(true);
    try {
      const res = await run({
        data: {
          messages: [
            {
              role: "system",
              content:
                "You are ENT's planner. Produce clear plain-text schedules with time blocks, priority order and short reasoning. No markdown symbols like ** or #. Keep it scannable.",
            },
            {
              role: "user",
              content: `Today is ${new Date().toDateString()}. My tasks:\n${tasksAsText(tasks)}\n\nBuild a realistic ${
                target === "daily" ? "DAILY schedule for today" : "WEEKLY schedule for the next 7 days"
              }. Start with an URGENT FOCUS section listing what to do first, then the schedule with time slots and estimated durations, then a short note on realistic time allocation and breaks.`,
            },
          ],
        },
      });
      setPlan((p) => ({ ...p, [target]: res.text.trim() }));
      toast.success(`${target === "daily" ? "Daily" : "Weekly"} plan ready`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Planning failed");
    } finally {
      setLoading(false);
    }
  };

  const sorted = [...tasks].sort((a, b) => {
    const rank = { High: 0, Medium: 1, Low: 2 } as const;
    return rank[a.priority] - rank[b.priority] || a.deadline.localeCompare(b.deadline);
  });

  return (
    <AppShell
      title="AI Task Planner"
      subtitle="Prioritise, schedule and get realistic time allocations"
      actions={
        <PrimaryButton onClick={() => void generate()} loading={loading}>
          Generate {view === "daily" ? "Daily" : "Weekly"} Plan
        </PrimaryButton>
      }
    >
      <div className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <Card title="Add a task" description="Tasks feed straight into the AI planner.">
            <TaskForm />
          </Card>

          <Card title="Task pool" description="Sorted by priority, then deadline.">
            {sorted.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border py-16 text-center text-sm text-muted-foreground">
                No tasks yet — add one on the left.
              </div>
            ) : (
              <div className="grid max-h-[28rem] gap-3 overflow-y-auto pr-1">
                {sorted.map((t) => (
                  <TaskCard key={t.id} task={t} compact />
                ))}
              </div>
            )}
          </Card>
        </div>

        <div className="inline-flex rounded-xl border border-border bg-card p-1 shadow-[var(--shadow-card)]">
          {(["daily", "weekly"] as View[]).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                view === v ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              }`}
            >
              {v === "daily" ? "Daily Planner" : "Weekly Planner"}
            </button>
          ))}
        </div>

        <AiOutput
          title={view === "daily" ? "Daily Schedule" : "Weekly Schedule"}
          value={plan[view]}
          onChange={(v) => setPlan((p) => ({ ...p, [view]: v }))}
          loading={loading}
          onRegenerate={() => void generate()}
          onClear={() => setPlan((p) => ({ ...p, [view]: "" }))}
          emptyHint={`Generate a ${view} plan and ENT will order your tasks, flag urgent work and block out your time.`}
        />
      </div>
    </AppShell>
  );
}
