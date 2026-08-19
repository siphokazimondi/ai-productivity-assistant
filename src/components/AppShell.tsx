import { Link, useRouterState } from "@tanstack/react-router";
import {
  Bot,
  LayoutDashboard,
  Mail,
  NotebookPen,
  ListChecks,
  Search,
  Menu,
  Sparkles,
  ShieldAlert,
} from "lucide-react";
import { useState, type ReactNode } from "react";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/email", label: "Email Generator", icon: Mail },
  { to: "/notes", label: "Meeting Notes", icon: NotebookPen },
  { to: "/planner", label: "Task Planner", icon: ListChecks },
  { to: "/research", label: "Research", icon: Search },
  { to: "/chat", label: "AI Chatbot", icon: Bot },
] as const;

function NavLinks({ onNavigate }: { onNavigate?: (() => void) | undefined }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="flex flex-col gap-1">
      {NAV.map(({ to, label, icon: Icon }) => {
        const active = pathname === to;
        return (
          <Link
            key={to}
            to={to}
            onClick={onNavigate}
            className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
              active
                ? "bg-gradient-brand text-brand-foreground shadow-glow"
                : "text-muted-foreground hover:bg-brand-soft hover:text-foreground"
            }`}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarBody({ onNavigate }: { onNavigate?: (() => void) | undefined }) {
  return (
    <div className="flex h-full flex-col gap-6 p-4">
      <Link to="/" onClick={onNavigate} className="flex items-center gap-3 px-2 pt-2">
        <span className="bg-gradient-brand flex h-9 w-9 items-center justify-center rounded-xl">
          <Sparkles className="h-5 w-5 text-brand-foreground" />
        </span>
        <span className="leading-tight">
          <span className="block font-display text-sm font-semibold">Aria Workplace</span>
          <span className="block text-[11px] text-muted-foreground">Productivity Assistant</span>
        </span>
      </Link>

      <NavLinks onNavigate={onNavigate} />

      <div className="mt-auto rounded-xl border border-border bg-muted/60 p-3">
        <p className="flex items-center gap-2 text-xs font-semibold text-foreground">
          <ShieldAlert className="h-3.5 w-3.5 text-highlight" />
          Responsible AI
        </p>
        <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">
          Outputs are AI-generated drafts. Review for accuracy, bias and confidentiality before
          sharing or acting on them.
        </p>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-border bg-card lg:block">
        <SidebarBody />
      </aside>

      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-card/85 px-4 py-3 backdrop-blur lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Open navigation">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <SidebarBody onNavigate={() => setOpen(false)} />
          </SheetContent>
        </Sheet>
        <span className="bg-gradient-brand flex h-8 w-8 items-center justify-center rounded-lg">
          <Sparkles className="h-4 w-4 text-brand-foreground" />
        </span>
        <span className="font-display text-sm font-semibold">Aria Workplace</span>
      </header>

      <main className="lg:pl-64">
        <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:py-10">{children}</div>
      </main>
    </div>
  );
}
