import { createFileRoute } from "@tanstack/react-router";
import { ListChecks } from "lucide-react";

import { ToolWorkspace, type Field } from "@/components/ToolWorkspace";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner | Aria Workplace" },
      {
        name: "description",
        content:
          "Turn a messy task list into a prioritized, time-blocked plan that fits the hours you actually have.",
      },
      { property: "og:title", content: "AI Task Planner | Aria Workplace" },
      {
        property: "og:description",
        content: "Prioritized priorities, a time-blocked schedule and what to defer or delegate.",
      },
    ],
  }),
  component: PlannerPage,
});

const fields: Field[] = [
  {
    name: "tasks",
    label: "Tasks & deadlines",
    type: "textarea",
    rows: 8,
    required: true,
    placeholder: "One task per line, with deadlines or estimates where you know them…",
  },
  {
    name: "availableTime",
    label: "Time available",
    type: "input",
    placeholder: "6 focused hours today, 09:00–17:00 with a 12:30 lunch",
  },
  {
    name: "role",
    label: "Your role / context",
    type: "input",
    placeholder: "Marketing manager, 2 direct reports",
  },
  {
    name: "horizon",
    label: "Planning horizon",
    type: "select",
    options: ["Today", "Tomorrow", "This week", "Next two weeks", "This month"],
    placeholder: "Today",
  },
  {
    name: "strategy",
    label: "Prioritization style",
    type: "select",
    options: ["Impact first", "Deadline first", "Quick wins first", "Deep work protected", "Eisenhower matrix"],
    placeholder: "Impact first",
  },
];

function PlannerPage() {
  return (
    <ToolWorkspace
      tool="planner"
      title="AI Task Planner"
      description="Get a realistic, prioritized plan with time blocks and clear trade-offs."
      icon={ListChecks}
      fields={fields}
      cta="Build my plan"
    />
  );
}
