import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck, Eye, Lock, AlertTriangle } from "lucide-react";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/responsible-ai")({
  head: () => ({
    meta: [
      { title: "Responsible AI — Easy Note Taker (ENT)" },
      {
        name: "description",
        content:
          "How ENT uses AI responsibly: human oversight, privacy, transparency and limitations of AI-generated productivity content.",
      },
      { property: "og:title", content: "Responsible AI — Easy Note Taker (ENT)" },
      {
        property: "og:description",
        content: "Human oversight, privacy and transparency principles behind ENT's AI features.",
      },
    ],
  }),
  component: ResponsibleAI,
});

const PRINCIPLES = [
  {
    icon: Eye,
    title: "Human oversight",
    text: "Every AI output in ENT is a draft. Review, edit and approve content before you send, submit or act on it.",
  },
  {
    icon: AlertTriangle,
    title: "Accuracy limitations",
    text: "AI can be confidently wrong. Research summaries and meeting notes should be verified against reliable sources and the original material.",
  },
  {
    icon: Lock,
    title: "Privacy first",
    text: "Your tasks stay in your browser. Prompts are sent securely to the AI service from the server — your API keys are never exposed to the browser.",
  },
  {
    icon: ShieldCheck,
    title: "Transparency",
    text: "ENT clearly labels AI-generated content and lets you regenerate, edit or clear any output at any time.",
  },
];

function ResponsibleAI() {
  return (
    <AppShell
      title="Responsible AI"
      subtitle="How ENT uses AI safely and transparently"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {PRINCIPLES.map((p) => (
          <div
            key={p.title}
            className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]"
          >
            <p.icon className="h-5 w-5 text-primary" />
            <h2 className="mt-3 text-sm font-semibold text-card-foreground">{p.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{p.text}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-muted/40 p-5">
        <h2 className="text-sm font-semibold">Appropriate use</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
          <li>Do not paste confidential, personal or regulated information into AI inputs.</li>
          <li>Do not use AI output as a substitute for professional, legal or medical advice.</li>
          <li>Follow your school or employer policy on AI-assisted work and cite it where required.</li>
        </ul>
      </div>
    </AppShell>
  );
}
