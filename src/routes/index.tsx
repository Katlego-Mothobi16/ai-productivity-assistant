import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, CalendarCheck, MessageSquare, ArrowRight, Sparkles } from "lucide-react";
import { AiDisclaimer } from "@/components/AiDisclaimer";

export const Route = createFileRoute("/")({
  component: Dashboard,
});

const features = [
  {
    to: "/email" as const,
    icon: Mail,
    title: "Smart Email Generator",
    desc: "Draft professional emails in Formal, Friendly, or Persuasive tones. Edit, copy, regenerate.",
  },
  {
    to: "/planner" as const,
    icon: CalendarCheck,
    title: "AI Task Planner",
    desc: "Generate prioritized daily or weekly plans with time blocks and productivity tips.",
  },
  {
    to: "/chat" as const,
    icon: MessageSquare,
    title: "AI Chat Assistant",
    desc: "Ask workplace questions and get professional, workplace-focused answers instantly.",
  },
];

function Dashboard() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-3">
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-secondary/60 px-3 py-1 text-xs font-medium text-secondary-foreground">
          <Sparkles className="h-3 w-3" />
          AI Workplace Productivity Assistant
        </div>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Work smarter, without the setup.
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
          Draft emails, plan your day, and get instant workplace help — all in one clean workspace.
          No sign-up, no accounts, nothing saved.
        </p>
      </div>

      <div className="mb-8">
        <AiDisclaimer />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <Link
            key={f.to}
            to={f.to}
            className="group relative flex flex-col gap-3 rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <f.icon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-card-foreground">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
            </div>
            <div className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-primary">
              Open
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
