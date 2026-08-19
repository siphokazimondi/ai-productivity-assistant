import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";

import { ToolWorkspace, type Field } from "@/components/ToolWorkspace";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant | Aria Workplace" },
      {
        name: "description",
        content:
          "Brief yourself fast: AI-structured overviews, key findings, trade-offs and what to verify before you decide.",
      },
      { property: "og:title", content: "AI Research Assistant | Aria Workplace" },
      {
        property: "og:description",
        content: "Structured research briefs with findings, trade-offs and verification pointers.",
      },
    ],
  }),
  component: ResearchPage,
});

const fields: Field[] = [
  {
    name: "topic",
    label: "Research question or topic",
    type: "textarea",
    rows: 4,
    required: true,
    placeholder: "How are mid-size firms handling AI usage policies for employees?",
  },
  {
    name: "audience",
    label: "Who is this for?",
    type: "input",
    placeholder: "Exec team, non-technical",
  },
  {
    name: "depth",
    label: "Depth",
    type: "select",
    options: ["Quick brief", "Standard brief", "Deep dive"],
    placeholder: "Standard brief",
  },
  {
    name: "angle",
    label: "Angle",
    type: "select",
    options: [
      "Market landscape",
      "Competitor comparison",
      "Risks & compliance",
      "Implementation guidance",
      "Cost & ROI",
    ],
    placeholder: "Market landscape",
  },
  {
    name: "constraints",
    label: "Constraints or exclusions",
    type: "textarea",
    rows: 3,
    placeholder: "Focus on South Africa; exclude enterprise-only vendors…",
  },
];

function ResearchPage() {
  return (
    <ToolWorkspace
      tool="research"
      title="AI Research Assistant"
      description="Structured briefs with findings, trade-offs and honest uncertainty — no invented sources."
      icon={Search}
      fields={fields}
      cta="Create research brief"
    />
  );
}
