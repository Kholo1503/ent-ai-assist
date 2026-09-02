import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { AiOutput, Card, Field, GhostButton, PrimaryButton, inputClass } from "@/components/AiPanel";
import { aiComplete } from "@/lib/ai.functions";

export const Route = createFileRoute("/research-assistant")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — Easy Note Taker (ENT)" },
      {
        name: "description",
        content:
          "Research any topic with AI: overview, key findings, concepts, pros and cons, recommendations and next steps.",
      },
      { property: "og:title", content: "AI Research Assistant — ENT" },
      {
        property: "og:description",
        content: "Structured topic research at brief, standard or detailed length.",
      },
    ],
  }),
  component: ResearchAssistant,
});

const LENGTHS = ["Brief", "Standard", "Detailed"];

function ResearchAssistant() {
  const run = useServerFn(aiComplete);
  const [topic, setTopic] = useState("");
  const [length, setLength] = useState(LENGTHS[1]);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!topic.trim()) {
      toast.error("Enter a research topic or question.");
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
                "You are ENT's research assistant. Answer in plain text with these clearly labelled sections in capitals: TOPIC OVERVIEW, KEY FINDINGS, IMPORTANT CONCEPTS, ADVANTAGES, DISADVANTAGES, RECOMMENDATIONS, SUGGESTED AREAS FOR FURTHER RESEARCH. Use simple dashes for bullet points, no markdown symbols.",
            },
            { role: "user", content: `Topic/question: ${topic}\nResponse length: ${length}` },
          ],
        },
      });
      setOutput(res.text.trim());
      toast.success("Research ready");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Research failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell title="AI Research Assistant" subtitle="Structured overviews of any topic">
      <div className="space-y-6">
        <div className="flex items-start gap-3 rounded-2xl border border-accent/60 bg-accent/20 p-4 text-sm text-accent-foreground shadow-[var(--shadow-card)]">
          <AlertTriangle className="mt-0.5 h-4.5 w-4.5 shrink-0" />
          <p>
            AI-generated research must be verified against reliable sources before being used
            academically or professionally. Always cite original sources, not ENT.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card title="Input" description="Ask a question or name a topic.">
            <div className="space-y-4">
              <Field label="Research topic or question">
                <textarea
                  rows={5}
                  className={`${inputClass} resize-y`}
                  placeholder="e.g. What are the benefits of artificial intelligence in business?"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
              </Field>
              <Field label="Response length">
                <select
                  className={inputClass}
                  value={length}
                  onChange={(e) => setLength(e.target.value)}
                >
                  {LENGTHS.map((l) => (
                    <option key={l}>{l}</option>
                  ))}
                </select>
              </Field>
              <div className="flex flex-wrap gap-2">
                <PrimaryButton onClick={() => void generate()} loading={loading}>
                  Research Topic
                </PrimaryButton>
                <GhostButton
                  onClick={() => {
                    setTopic("");
                    toast.success("Input cleared");
                  }}
                >
                  Clear input
                </GhostButton>
              </div>
            </div>
          </Card>

          <AiOutput
            title="Research Output"
            value={output}
            onChange={setOutput}
            loading={loading}
            onRegenerate={() => void generate()}
            onClear={() => setOutput("")}
            emptyHint="Your structured research briefing will appear here, ready to edit and copy."
          />
        </div>
      </div>
    </AppShell>
  );
}
