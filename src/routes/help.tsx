import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: "Help & Guides — Easy Note Taker (ENT)" },
      {
        name: "description",
        content:
          "Learn how to use ENT's email generator, meeting summarizer, task planner, research assistant and chatbot.",
      },
      { property: "og:title", content: "Help & Guides — Easy Note Taker (ENT)" },
      {
        property: "og:description",
        content: "Quick guides and FAQs for getting the most out of ENT's AI productivity tools.",
      },
    ],
  }),
  component: Help,
});

const GUIDES = [
  {
    to: "/email-generator" as const,
    title: "Smart Email Generator",
    text: "Add the recipient, purpose and key points, pick a tone and length, then edit the draft before sending.",
  },
  {
    to: "/meeting-summarizer" as const,
    title: "Meeting Summarizer",
    text: "Paste raw meeting notes and get a summary, decisions, action items with owners, and follow-ups.",
  },
  {
    to: "/task-planner" as const,
    title: "AI Task Planner",
    text: "Choose daily or weekly view to turn your task list into a prioritised, time-blocked schedule.",
  },
  {
    to: "/research-assistant" as const,
    title: "Research Assistant",
    text: "Enter a topic or question and choose a response length for a structured overview. Always verify sources.",
  },
  {
    to: "/assistant" as const,
    title: "ENT Assistant",
    text: "Ask workplace or study questions in chat. Your current tasks are used as context.",
  },
];

const FAQ = [
  {
    q: "Where is my data stored?",
    a: "Tasks are saved in your browser's local storage. Clearing browser data will remove them.",
  },
  {
    q: "Can I edit AI output?",
    a: "Yes. Every AI result supports Copy, Edit, Regenerate and Clear.",
  },
  {
    q: "Why did generation fail?",
    a: "Usually a temporary rate limit or connection issue. Wait a moment and press Regenerate.",
  },
];

function Help() {
  return (
    <AppShell title="Help" subtitle="Guides and answers for using ENT">
      <div className="grid gap-4 sm:grid-cols-2">
        {GUIDES.map((g) => (
          <Link
            key={g.to}
            to={g.to}
            className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)] transition hover:-translate-y-0.5"
          >
            <h2 className="text-sm font-semibold text-card-foreground">{g.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{g.text}</p>
          </Link>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-card p-5">
        <h2 className="text-sm font-semibold">Frequently asked questions</h2>
        <dl className="mt-3 space-y-3">
          {FAQ.map((f) => (
            <div key={f.q}>
              <dt className="text-sm font-medium">{f.q}</dt>
              <dd className="text-sm text-muted-foreground">{f.a}</dd>
            </div>
          ))}
        </dl>
      </div>
    </AppShell>
  );
}
