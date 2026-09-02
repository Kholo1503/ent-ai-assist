import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Loader2, Send, Trash2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { GhostButton, inputClass } from "@/components/AiPanel";
import { EntLogo } from "@/components/EntLogo";
import { aiComplete, type AiMessage } from "@/lib/ai.functions";
import { tasksAsText, useTasks } from "@/lib/tasks";

export const Route = createFileRoute("/assistant")({
  head: () => ({
    meta: [
      { title: "ENT Assistant — Easy Note Taker (ENT)" },
      {
        name: "description",
        content:
          "Chat with ENT Assistant, your AI workplace and study helper for planning, writing and explaining.",
      },
      { property: "og:title", content: "ENT Assistant — AI Productivity Chatbot" },
      {
        property: "og:description",
        content: "Ask ENT to organise tasks, summarise information or prepare you for a meeting.",
      },
    ],
  }),
  component: Assistant,
});

const SUGGESTIONS = [
  "Help me organise my tasks for today.",
  "What should I prioritise first?",
  "Help me write a professional message.",
  "Help me prepare for my meeting.",
];

function Assistant() {
  const run = useServerFn(aiComplete);
  const tasks = useTasks();
  const [messages, setMessages] = useState<AiMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text: string) => {
    const content = text.trim();
    if (!content || loading) return;
    const next: AiMessage[] = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await run({
        data: {
          messages: [
            {
              role: "system",
              content: `You are ENT Assistant, a professional workplace and study productivity assistant. Be helpful, concise and practical. Prefer short paragraphs and simple dashed lists. The user's current tasks:\n${tasksAsText(tasks)}`,
            },
            ...next,
          ],
        },
      });
      setMessages([...next, { role: "assistant", content: res.text.trim() }]);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "The assistant could not respond");
      setMessages(next);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell
      title="ENT Assistant"
      subtitle="Your AI workplace and study assistant"
      actions={
        <GhostButton
          onClick={() => {
            setMessages([]);
            toast.success("Conversation cleared");
          }}
          disabled={messages.length === 0}
        >
          <Trash2 className="h-4 w-4" /> Clear
        </GhostButton>
      }
    >
      <div className="flex h-[calc(100vh-11rem)] flex-col rounded-2xl border border-border bg-card shadow-[var(--shadow-card)]">
        <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">
          {messages.length === 0 && !loading ? (
            <div className="flex h-full flex-col items-center justify-center gap-5 text-center">
              <EntLogo size={52} withWordmark={false} />
              <div>
                <h2 className="text-lg font-semibold">How can I help you today?</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Ask about your tasks, writing, planning or study topics.
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => void send(s)}
                    className="rounded-full border border-border px-3.5 py-2 text-xs font-medium text-muted-foreground transition hover:border-primary hover:text-foreground"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((m, i) => (
              <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                <div
                  className={
                    m.role === "user"
                      ? "max-w-[85%] whitespace-pre-wrap rounded-2xl bg-primary px-4 py-2.5 text-sm text-primary-foreground"
                      : "max-w-[90%] whitespace-pre-wrap text-sm leading-relaxed text-foreground"
                  }
                >
                  {m.content}
                </div>
              </div>
            ))
          )}
          {loading && (
            <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin text-primary" /> ENT is thinking…
            </div>
          )}
          <div ref={endRef} />
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            void send(input);
          }}
          className="border-t border-border p-3 sm:p-4"
        >
          <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2">
            <input
              className={inputClass}
              placeholder="Ask ENT anything about your work or studies…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              aria-label="Send message"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground transition hover:brightness-95 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">
            ENT can make mistakes. Avoid sharing confidential information and verify important
            details.
          </p>
        </form>
      </div>
    </AppShell>
  );
}
