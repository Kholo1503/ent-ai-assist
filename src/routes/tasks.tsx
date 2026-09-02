import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { Card, GhostButton, inputClass } from "@/components/AiPanel";
import { TaskCard } from "@/components/TaskCard";
import { TaskForm } from "@/components/TaskForm";
import { resetTasks, useTasks, type Status, type Task } from "@/lib/tasks";

export const Route = createFileRoute("/tasks")({
  head: () => ({
    meta: [
      { title: "My Tasks — Easy Note Taker (ENT)" },
      {
        name: "description",
        content: "Add, edit, complete and delete your work and study tasks in one organised list.",
      },
      { property: "og:title", content: "My Tasks — ENT" },
      {
        property: "og:description",
        content: "A clean task list with priorities, deadlines, durations and statuses.",
      },
    ],
  }),
  component: TasksPage,
});

const FILTERS: Array<Status | "All"> = ["All", "Not Started", "In Progress", "Completed"];

function TasksPage() {
  const tasks = useTasks();
  const [editing, setEditing] = useState<Task | null>(null);
  const [filter, setFilter] = useState<Status | "All">("All");
  const [query, setQuery] = useState("");

  const visible = tasks.filter(
    (t) =>
      (filter === "All" || t.status === filter) &&
      (t.name.toLowerCase().includes(query.toLowerCase()) ||
        t.category.toLowerCase().includes(query.toLowerCase())),
  );

  return (
    <AppShell
      title="My Tasks"
      subtitle={`${tasks.length} task${tasks.length === 1 ? "" : "s"} in your list`}
      actions={
        <GhostButton
          onClick={() => {
            resetTasks();
            toast.success("Sample tasks restored");
          }}
        >
          Reset to sample data
        </GhostButton>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[22rem_minmax(0,1fr)]">
        <Card
          title={editing ? "Edit task" : "Add task"}
          description={editing ? "Update the details and save." : "Capture something new."}
        >
          <TaskForm editing={editing} onDone={() => setEditing(null)} />
        </Card>

        <div className="space-y-4">
          <div className="grid grid-cols-[minmax(0,1fr)] gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
            <input
              className={inputClass}
              placeholder="Search tasks or categories…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <div className="flex flex-wrap gap-2">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                    filter === f
                      ? "bg-primary text-primary-foreground"
                      : "border border-border bg-card text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {visible.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-card py-20 text-center text-sm text-muted-foreground">
              No tasks match this view. Try another filter or add a new task.
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {visible.map((t) => (
                <TaskCard key={t.id} task={t} onEdit={setEditing} />
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
