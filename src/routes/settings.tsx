import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { resetTasks, useTasks } from "@/lib/tasks";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Easy Note Taker (ENT)" },
      {
        name: "description",
        content:
          "Manage your ENT profile name, default AI tone, working hours and local task data.",
      },
      { property: "og:title", content: "Settings — Easy Note Taker (ENT)" },
      {
        property: "og:description",
        content: "Personalise ENT: display name, default tone, working hours and data controls.",
      },
    ],
  }),
  component: SettingsPage,
});

const PREFS_KEY = "ent.prefs.v1";

type Prefs = { name: string; tone: string; startHour: string; endHour: string };

const DEFAULTS: Prefs = { name: "", tone: "Professional", startHour: "09:00", endHour: "17:00" };

function SettingsPage() {
  const tasks = useTasks();
  const [prefs, setPrefs] = useState<Prefs>(DEFAULTS);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(PREFS_KEY);
      if (raw) setPrefs({ ...DEFAULTS, ...JSON.parse(raw) });
    } catch {
      /* ignore */
    }
  }, []);

  const save = () => {
    try {
      localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
      toast.success("Settings saved");
    } catch {
      toast.error("Could not save settings");
    }
  };

  const field = "mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm";

  return (
    <AppShell title="Settings" subtitle="Personalise ENT to how you work">
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
          <h2 className="text-sm font-semibold">Profile & defaults</h2>
          <div className="mt-4 space-y-4">
            <label className="block text-sm">
              Display name
              <input
                className={field}
                value={prefs.name}
                onChange={(e) => setPrefs({ ...prefs, name: e.target.value })}
                placeholder="Your name"
              />
            </label>
            <label className="block text-sm">
              Default email tone
              <select
                className={field}
                value={prefs.tone}
                onChange={(e) => setPrefs({ ...prefs, tone: e.target.value })}
              >
                {["Professional", "Friendly", "Formal", "Concise", "Persuasive"].map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block text-sm">
                Work start
                <input
                  type="time"
                  className={field}
                  value={prefs.startHour}
                  onChange={(e) => setPrefs({ ...prefs, startHour: e.target.value })}
                />
              </label>
              <label className="block text-sm">
                Work end
                <input
                  type="time"
                  className={field}
                  value={prefs.endHour}
                  onChange={(e) => setPrefs({ ...prefs, endHour: e.target.value })}
                />
              </label>
            </div>
            <button
              onClick={save}
              className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:brightness-95"
            >
              Save settings
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
          <h2 className="text-sm font-semibold">Data</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            You currently have {tasks.length} task{tasks.length === 1 ? "" : "s"} stored locally in
            this browser. Nothing is uploaded to a server.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={() => {
                resetTasks();
                toast.success("Sample tasks restored");
              }}
              className="rounded-xl border border-border px-4 py-2 text-sm font-medium hover:bg-accent"
            >
              Restore sample tasks
            </button>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            AI outputs are drafts. Always review them before sending or submitting.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
