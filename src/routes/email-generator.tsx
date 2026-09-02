import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { AiOutput, Card, Field, GhostButton, PrimaryButton, inputClass } from "@/components/AiPanel";
import { aiComplete } from "@/lib/ai.functions";

export const Route = createFileRoute("/email-generator")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — Easy Note Taker (ENT)" },
      {
        name: "description",
        content:
          "Generate professional emails with AI: choose recipient, topic, key points, tone and length.",
      },
      { property: "og:title", content: "Smart Email Generator — ENT" },
      {
        property: "og:description",
        content: "Write professional, friendly, formal, apologetic or persuasive emails in seconds.",
      },
    ],
  }),
  component: EmailGenerator,
});

const TONES = ["Professional", "Friendly", "Formal", "Apologetic", "Persuasive"];
const LENGTHS = ["Short", "Medium", "Detailed"];

function EmailGenerator() {
  const run = useServerFn(aiComplete);
  const [recipient, setRecipient] = useState("");
  const [topic, setTopic] = useState("");
  const [points, setPoints] = useState("");
  const [tone, setTone] = useState(TONES[0]);
  const [length, setLength] = useState(LENGTHS[1]);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!topic.trim()) {
      toast.error("Add an email topic first.");
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
                "You are ENT's email writer. Write complete, ready-to-send emails in plain text with a subject line, greeting, body and sign-off. Never use markdown formatting.",
            },
            {
              role: "user",
              content: `Recipient / purpose: ${recipient || "Not specified"}\nTopic: ${topic}\nKey points:\n${points || "Not specified"}\nTone: ${tone}\nLength: ${length}`,
            },
          ],
        },
      });
      setOutput(res.text.trim());
      toast.success("Email generated");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Generation failed");
    } finally {
      setLoading(false);
    }
  };

  const clearInput = () => {
    setRecipient("");
    setTopic("");
    setPoints("");
    toast.success("Input cleared");
  };

  return (
    <AppShell title="Smart Email Generator" subtitle="Draft professional emails with AI">
      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Input" description="Tell ENT what the email needs to say.">
          <div className="space-y-4">
            <Field label="Recipient / purpose">
              <input
                className={inputClass}
                placeholder="e.g. My lecturer — request an extension"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
              />
            </Field>
            <Field label="Email topic">
              <input
                className={inputClass}
                placeholder="e.g. Follow-up on the project proposal"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </Field>
            <Field label="Key points" hint="One point per line works best.">
              <textarea
                rows={6}
                className={`${inputClass} resize-y`}
                placeholder={"Deadline moved to Friday\nNeed feedback on section 2\nAttach the budget sheet"}
                value={points}
                onChange={(e) => setPoints(e.target.value)}
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Tone">
                <select className={inputClass} value={tone} onChange={(e) => setTone(e.target.value)}>
                  {TONES.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </Field>
              <Field label="Length">
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
            </div>
            <div className="flex flex-wrap gap-2">
              <PrimaryButton onClick={() => void generate()} loading={loading}>
                Generate Email
              </PrimaryButton>
              <GhostButton onClick={clearInput}>Clear input</GhostButton>
            </div>
          </div>
        </Card>

        <AiOutput
          title="Generated Email"
          value={output}
          onChange={setOutput}
          loading={loading}
          onRegenerate={() => void generate()}
          onClear={() => setOutput("")}
          emptyHint="Your generated email will appear here, ready to edit and copy."
        />
      </div>
    </AppShell>
  );
}
