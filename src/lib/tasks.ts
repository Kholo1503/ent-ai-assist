import { useSyncExternalStore } from "react";

export type Priority = "High" | "Medium" | "Low";
export type Status = "Not Started" | "In Progress" | "Completed";

export type Task = {
  id: string;
  name: string;
  description: string;
  deadline: string; // yyyy-mm-dd
  duration: number; // minutes
  priority: Priority;
  category: string;
  status: Status;
};

const KEY = "ent.tasks.v1";

function iso(offsetDays: number) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

export function sampleTasks(): Task[] {
  return [
    {
      id: "t1",
      name: "Complete project proposal",
      description: "Finish the draft proposal for the Q3 client project and share for review.",
      deadline: iso(0),
      duration: 90,
      priority: "High",
      category: "Work",
      status: "In Progress",
    },
    {
      id: "t2",
      name: "Attend team meeting",
      description: "Weekly sync with the product and delivery team.",
      deadline: iso(0),
      duration: 45,
      priority: "Medium",
      category: "Work",
      status: "Not Started",
    },
    {
      id: "t3",
      name: "Submit research assignment",
      description: "Final formatting, referencing and submission on the portal.",
      deadline: iso(1),
      duration: 120,
      priority: "High",
      category: "Study",
      status: "Not Started",
    },
    {
      id: "t4",
      name: "Respond to emails",
      description: "Clear the inbox and reply to outstanding supplier queries.",
      deadline: iso(0),
      duration: 30,
      priority: "Low",
      category: "Admin",
      status: "Completed",
    },
    {
      id: "t5",
      name: "Prepare presentation",
      description: "Build slides for the stakeholder update on Friday.",
      deadline: iso(3),
      duration: 75,
      priority: "Medium",
      category: "Work",
      status: "Not Started",
    },
  ];
}

let tasks: Task[] = sampleTasks();
let hydrated = false;
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify(tasks));
  } catch {
    /* ignore */
  }
}

function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) tasks = JSON.parse(raw) as Task[];
    else persist();
  } catch {
    /* ignore */
  }
  emit();
}

function subscribe(cb: () => void) {
  hydrate();
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function useTasks(): Task[] {
  return useSyncExternalStore(
    subscribe,
    () => tasks,
    () => tasks,
  );
}

export function addTask(task: Omit<Task, "id">) {
  tasks = [{ ...task, id: crypto.randomUUID() }, ...tasks];
  persist();
  emit();
}

export function updateTask(id: string, patch: Partial<Task>) {
  tasks = tasks.map((t) => (t.id === id ? { ...t, ...patch } : t));
  persist();
  emit();
}

export function deleteTask(id: string) {
  tasks = tasks.filter((t) => t.id !== id);
  persist();
  emit();
}

export function resetTasks() {
  tasks = sampleTasks();
  persist();
  emit();
}

export function tasksAsText(list: Task[]) {
  return list
    .map(
      (t) =>
        `- ${t.name} | priority: ${t.priority} | deadline: ${t.deadline} | est: ${t.duration} min | status: ${t.status} | category: ${t.category}${t.description ? ` | notes: ${t.description}` : ""}`,
    )
    .join("\n");
}

export function isToday(dateStr: string) {
  return dateStr === new Date().toISOString().slice(0, 10);
}
