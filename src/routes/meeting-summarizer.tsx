import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Copy, Eraser, Loader2, RefreshCw } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Card, Field, GhostButton, PrimaryButton, copyText, inputClass } from "@/components/AiPanel";
import { aiComplete } from "@/lib/ai.functions";

export const Route = createFileRoute("/meeting-summarizer")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — Easy Note Taker (ENT)" },
      {
        name: "description",
        content:
          "Turn unstructured meeting notes into a summary, decisions, action items, owners and deadlines.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer — ENT" },
      {
        property: "og:description",
        content: "Structured meeting summaries with decisions, action items and follow-ups.",
      },
    ],
  }),
  component: MeetingSummarizer,
});

type ActionItem = { task: string; owner: string; deadline: string };
type Summary = {
  summary: string;
  keyPoints: string[];
  decisions: string[];
  actionItems: ActionItem[];
  followUps: string[];
};

const EMPTY: Summary = {
  summary: "",
  keyPoints: [],
  decisions: [],
  actionItems: [],
  followUps: [],
};

function summaryToText(s: Summary) {
  return [
    "MEETING SUMMARY",
    s.summary,
    "",
    "KEY DISCUSSION POINTS",
    ...s.keyPoints.map((p) => `- ${p}`),
    "",
    "DECISIONS MADE",
    ...s.decisions.map((p) => `- ${p}`),
    "",
    "ACTION ITEMS",
    ...s.actionItems.map((a) => `- ${a.task} | Owner: ${a.owner} | Deadline: ${a.deadline}`),
    "",
    "IMPORTANT FOLLOW-UPS",
    ...s.followUps.map((p) => `- ${p}`),
  ].join("\n");
}

function List({
  title,
  items,
  editing,
  onChange,
}: {
  title: string;
  items: string[];
  editing: boolean;
  onChange: (items: string[]) => void;
}) {
  return (
    <div className="rounded-xl border border-border bg-secondary/40 p-4">
      <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{title}</h3>
      {editing ? (
        <textarea
          rows={Math.max(3, items.length + 1)}
          className={`${inputClass} mt-2 resize-y bg-card text-sm`}
          value={items.join("\n")}
          onChange={(e) => onChange(e.target.value.split("\n").filter((l) => l.trim() !== ""))}
        />
      ) : items.length ? (
        <ul className="mt-2 space-y-1.5 text-sm">
          {items.map((i, idx) => (
            <li key={idx} className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              <span className="min-w-0">{i}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-sm text-muted-foreground">None captured.</p>
      )}
    </div>
  );
}

function MeetingSummarizer() {
  const run = useServerFn(aiComplete);
  const [notes, setNotes] = useState("");
  const [result, setResult] = useState<Summary | null>(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!notes.trim()) {
      toast.error("Paste your meeting notes first.");
      return;
    }
    setLoading(true);
    try {
      const res = await run({
        data: {
          temperature: 0.3,
          messages: [
            {
              role: "system",
              content:
                'You structure meeting notes. Respond with ONLY valid JSON, no markdown fences, matching: {"summary":string,"keyPoints":string[],"decisions":string[],"actionItems":[{"task":string,"owner":string,"deadline":string}],"followUps":string[]}. Use "Unassigned" or "Not specified" when unknown.',
            },
            { role: "user", content: notes },
          ],
        },
      });
      const clean = res.text
        .trim()
        .replace(/^```(?:json)?/i, "")
        .replace(/```$/, "")
        .trim();
      setResult({ ...EMPTY, ...(JSON.parse(clean) as Summary) });
      toast.success("Meeting summarised");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not summarise these notes");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell title="Meeting Notes Summarizer" subtitle="Structure raw notes into decisions and actions">
      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Input" description="Paste your raw meeting notes or transcript.">
          <Field label="Meeting notes">
            <textarea
              rows={18}
              className={`${inputClass} resize-y`}
              placeholder="Paste notes here — bullet points, transcript fragments or messy typing all work."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </Field>
          <div className="mt-4 flex flex-wrap gap-2">
            <PrimaryButton onClick={() => void generate()} loading={loading}>
              Summarise Meeting
            </PrimaryButton>
            <GhostButton
              onClick={() => {
                setNotes("");
                toast.success("Input cleared");
              }}
            >
              <Eraser className="h-4 w-4" /> Clear input
            </GhostButton>
          </div>
        </Card>

        <Card>
          <div className="mb-4 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 sm:flex sm:justify-between">
            <div className="min-w-0">
              <h2 className="truncate text-base font-semibold tracking-tight">Structured Summary</h2>
              <p className="truncate text-xs text-muted-foreground">Review and edit before sharing.</p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2">
              <GhostButton onClick={() => setEditing((e) => !e)} disabled={!result}>
                {editing ? "Done" : "Edit"}
              </GhostButton>
              <GhostButton onClick={() => result && copyText(summaryToText(result))} disabled={!result}>
                <Copy className="h-4 w-4" /> Copy
              </GhostButton>
              <GhostButton onClick={() => void generate()} disabled={loading}>
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Regenerate
              </GhostButton>
              <GhostButton onClick={() => setResult(null)}>
                <Eraser className="h-4 w-4" /> Clear
              </GhostButton>
            </div>
          </div>

          {loading && !result ? (
            <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border py-20 text-sm text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin text-primary" /> Structuring your notes…
            </div>
          ) : !result ? (
            <div className="rounded-xl border border-dashed border-border px-6 py-20 text-center text-sm text-muted-foreground">
              Your structured meeting summary will appear here with key points, decisions and action
              items.
            </div>
          ) : (
            <div className="space-y-3">
              <div className="rounded-xl border border-border bg-secondary/40 p-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Meeting summary
                </h3>
                {editing ? (
                  <textarea
                    rows={4}
                    className={`${inputClass} mt-2 resize-y bg-card text-sm`}
                    value={result.summary}
                    onChange={(e) => setResult({ ...result, summary: e.target.value })}
                  />
                ) : (
                  <p className="mt-2 text-sm leading-relaxed">{result.summary}</p>
                )}
              </div>

              <List
                title="Key discussion points"
                items={result.keyPoints}
                editing={editing}
                onChange={(keyPoints) => setResult({ ...result, keyPoints })}
              />
              <List
                title="Decisions made"
                items={result.decisions}
                editing={editing}
                onChange={(decisions) => setResult({ ...result, decisions })}
              />

              <div className="rounded-xl border border-border bg-secondary/40 p-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Action items
                </h3>
                {result.actionItems.length === 0 ? (
                  <p className="mt-2 text-sm text-muted-foreground">No action items captured.</p>
                ) : (
                  <div className="mt-3 space-y-2">
                    {result.actionItems.map((a, idx) => (
                      <div
                        key={idx}
                        className="rounded-lg border border-border bg-card p-3 shadow-[var(--shadow-card)]"
                      >
                        {editing ? (
                          <div className="grid gap-2 sm:grid-cols-3">
                            {(["task", "owner", "deadline"] as const).map((k) => (
                              <input
                                key={k}
                                className={inputClass}
                                value={a[k]}
                                placeholder={k}
                                onChange={(e) => {
                                  const next = [...result.actionItems];
                                  next[idx] = { ...a, [k]: e.target.value };
                                  setResult({ ...result, actionItems: next });
                                }}
                              />
                            ))}
                          </div>
                        ) : (
                          <>
                            <p className="text-sm font-medium">{a.task}</p>
                            <div className="mt-1.5 flex flex-wrap gap-2 text-xs">
                              <span className="rounded-md bg-primary/10 px-2 py-0.5 text-primary">
                                {a.owner}
                              </span>
                              <span className="rounded-md bg-accent/30 px-2 py-0.5 text-accent-foreground">
                                Due: {a.deadline}
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <List
                title="Important follow-ups"
                items={result.followUps}
                editing={editing}
                onChange={(followUps) => setResult({ ...result, followUps })}
              />
              <p className="text-xs text-muted-foreground">
                AI-generated content may contain errors. Verify before relying on it.
              </p>
            </div>
          )}
        </Card>
      </div>
    </AppShell>
  );
}
