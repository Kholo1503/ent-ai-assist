import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Field, GhostButton, inputClass } from "./AiPanel";
import { addTask, updateTask, type Priority, type Status, type Task } from "@/lib/tasks";

const PRIORITIES: Priority[] = ["High", "Medium", "Low"];
const STATUSES: Status[] = ["Not Started", "In Progress", "Completed"];

const blank = () => ({
  name: "",
  description: "",
  deadline: new Date().toISOString().slice(0, 10),
  duration: 30,
  priority: "Medium" as Priority,
  category: "Work",
  status: "Not Started" as Status,
});

export function TaskForm({
  editing,
  onDone,
}: {
  editing?: Task | null;
  onDone?: () => void;
}) {
  const [form, setForm] = useState(blank());

  useEffect(() => {
    if (editing) {
      const { id: _id, ...rest } = editing;
      setForm(rest);
    } else {
      setForm(blank());
    }
  }, [editing]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Give the task a name.");
      return;
    }
    if (editing) {
      updateTask(editing.id, form);
      toast.success("Task updated");
    } else {
      addTask(form);
      toast.success("Task added");
    }
    setForm(blank());
    onDone?.();
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <Field label="Task name">
        <input
          className={inputClass}
          placeholder="e.g. Prepare stakeholder presentation"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
      </Field>
      <Field label="Description">
        <textarea
          rows={3}
          className={`${inputClass} resize-y`}
          placeholder="What exactly needs to happen?"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Deadline">
          <input
            type="date"
            className={inputClass}
            value={form.deadline}
            onChange={(e) => setForm({ ...form, deadline: e.target.value })}
          />
        </Field>
        <Field label="Estimated duration (minutes)">
          <input
            type="number"
            min={5}
            step={5}
            className={inputClass}
            value={form.duration}
            onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })}
          />
        </Field>
        <Field label="Priority">
          <select
            className={inputClass}
            value={form.priority}
            onChange={(e) => setForm({ ...form, priority: e.target.value as Priority })}
          >
            {PRIORITIES.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </Field>
        <Field label="Category">
          <input
            className={inputClass}
            placeholder="Work, Study, Admin…"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />
        </Field>
        <Field label="Status">
          <select
            className={inputClass}
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value as Status })}
          >
            {STATUSES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </Field>
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:brightness-95"
        >
          {editing ? "Save changes" : "Add task"}
        </button>
        {editing && (
          <GhostButton type="button" onClick={() => onDone?.()}>
            Cancel
          </GhostButton>
        )}
      </div>
    </form>
  );
}
