import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Bot, ListChecks, Mail, NotebookPen, Search, Sparkles, Zap } from "lucide-react";

import { Disclaimer } from "@/components/Disclaimer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Aria — AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "Automate everyday workplace tasks: generate emails, summarize meetings, plan your day and research faster with AI — every output editable.",
      },
      { property: "og:title", content: "Aria — AI Workplace Productivity Assistant" },
      {
        property: "og:description",
        content:
          "Five AI workspaces for professionals: email drafting, meeting summaries, task planning, research briefs and chat.",
      },
    ],
  }),
  component: Dashboard,
});

const TOOLS = [
  {
    to: "/email" as const,
    label: "Smart Email Generator",
    blurb: "Bullet points in, polished on-tone email out.",
    icon: Mail,
  },
  {
    to: "/notes" as const,
    label: "Meeting Notes Summarizer",
    blurb: "Summary, decisions, owners and open questions.",
    icon: NotebookPen,
  },
  {
    to: "/planner" as const,
    label: "AI Task Planner",
    blurb: "A prioritized, time-blocked plan that actually fits.",
    icon: ListChecks,
  },
  {
    to: "/research" as const,
    label: "AI Research Assistant",
    blurb: "Structured briefs with trade-offs and next steps.",
    icon: Search,
  },
  {
    to: "/chat" as const,
    label: "AI Chatbot",
    blurb: "A thinking partner for anything else on your desk.",
    icon: Bot,
  },
];

const STATS = [
  { label: "Workspaces", value: "5" },
  { label: "Structured prompts", value: "20+" },
  { label: "Outputs editable", value: "100%" },
];

function Dashboard() {
  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-soft sm:p-10">
        <div className="bg-gradient-brand pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full opacity-15 blur-3xl" />
        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-3 py-1 text-xs font-medium text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            Powered by Lovable AI
          </span>
          <h1 className="mt-4 max-w-2xl text-3xl font-semibold leading-tight sm:text-4xl">
            Your <span className="text-gradient-brand">AI workplace</span> productivity assistant
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Automate the writing, summarizing, planning and research that eats your day. Structured
            prompts guide the AI — you keep full control of every draft.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/email"
              className="bg-gradient-brand inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-brand-foreground shadow-glow transition-opacity hover:opacity-90"
            >
              Start with an email <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/chat"
              className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
            >
              <Bot className="h-4 w-4" /> Open the chatbot
            </Link>
          </div>

          <dl className="mt-8 grid max-w-md grid-cols-3 gap-4">
            {STATS.map((s) => (
              <div key={s.label} className="rounded-xl border border-border bg-muted/50 p-3">
                <dt className="text-[11px] uppercase tracking-wide text-muted-foreground">
                  {s.label}
                </dt>
                <dd className="mt-1 font-display text-xl font-semibold">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section>
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <Zap className="h-4 w-4 text-highlight" /> Workspaces
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {TOOLS.map(({ to, label, blurb, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="group rounded-2xl border border-border bg-card p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-glow"
            >
              <span className="bg-gradient-brand flex h-10 w-10 items-center justify-center rounded-xl">
                <Icon className="h-5 w-5 text-brand-foreground" />
              </span>
              <h3 className="mt-4 text-base font-semibold">{label}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{blurb}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary">
                Open workspace
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <Disclaimer />
    </div>
  );
}
