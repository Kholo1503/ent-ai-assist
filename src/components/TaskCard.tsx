import { CalendarDays, Clock, Pencil, Trash2 } from "lucide-react";
import { deleteTask, updateTask, type Status, type Task } from "@/lib/tasks";

const PRIORITY_STYLES: Record<Task["priority"], string> = {
  High: "bg-accent/40 text-accent-foreground",
  Medium: "bg-primary/12 text-primary",
  Low: "bg-secondary text-muted-foreground",
};

const STATUS_STYLES: Record<Status, string> = {
  "Not Started": "bg-secondary text-muted-foreground",
  "In Progress": "bg-primary/12 text-primary",
  Completed: "bg-primary text-primary-foreground",
};

const STATUSES: Status[] = ["Not Started", "In Progress", "Completed"];

export function TaskCard({
  task,
  compact,
  onEdit,
}: {
  task: Task;
  compact?: boolean;
  onEdit?: (task: Task) => void;
}) {
  return (
    <article className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)] transition hover:shadow-[0_2px_4px_oklch(0.2_0.01_150/8%),0_18px_40px_-20px_oklch(0.2_0.01_150/45%)]">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
        <div className="min-w-0">
          <h3
            className={`truncate text-sm font-semibold ${
              task.status === "Completed" ? "text-muted-foreground line-through" : ""
            }`}
          >
            {task.name}
          </h3>
          {!compact && task.description && (
            <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{task.description}</p>
          )}
        </div>
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${PRIORITY_STYLES[task.priority]}`}
        >
          {task.priority}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <CalendarDays className="h-3.5 w-3.5" /> {task.deadline}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5" /> {task.duration} min
        </span>
        <span className="rounded-md bg-secondary px-2 py-0.5">{task.category}</span>
      </div>

      <div className="mt-4 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
        <select
          aria-label={`Status for ${task.name}`}
          value={task.status}
          onChange={(e) => updateTask(task.id, { status: e.target.value as Status })}
          className={`w-full max-w-[10.5rem] rounded-lg border border-transparent px-2.5 py-1.5 text-xs font-semibold outline-none ${STATUS_STYLES[task.status]}`}
        >
          {STATUSES.map((s) => (
            <option key={s} value={s} className="bg-card text-foreground">
              {s}
            </option>
          ))}
        </select>
        <div className="flex shrink-0 items-center gap-1">
          {onEdit && (
            <button
              onClick={() => onEdit(task)}
              aria-label={`Edit ${task.name}`}
              className="rounded-lg p-2 text-muted-foreground transition hover:bg-secondary hover:text-foreground"
            >
              <Pencil className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={() => deleteTask(task.id)}
            aria-label={`Delete ${task.name}`}
            className="rounded-lg p-2 text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );
}
