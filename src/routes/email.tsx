import { createFileRoute } from "@tanstack/react-router";
import { Mail } from "lucide-react";

import { ToolWorkspace, type Field } from "@/components/ToolWorkspace";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator | Aria Workplace" },
      {
        name: "description",
        content:
          "Draft clear, professional workplace emails in seconds with structured AI prompts and fully editable output.",
      },
      { property: "og:title", content: "Smart Email Generator | Aria Workplace" },
      {
        property: "og:description",
        content: "Generate professional business emails with AI and edit them before sending.",
      },
    ],
  }),
  component: EmailPage,
});

const fields: Field[] = [
  {
    name: "recipient",
    label: "Recipient & relationship",
    type: "input",
    placeholder: "e.g. Client procurement lead",
  },
  {
    name: "goal",
    label: "What should this email achieve?",
    type: "textarea",
    rows: 4,
    required: true,
    placeholder: "Follow up on the pricing proposal and request a decision by Friday.",
  },
  {
    name: "keyPoints",
    label: "Key points to include",
    type: "textarea",
    rows: 4,
    placeholder: "One point per line — facts, dates, attachments…",
  },
  {
    name: "tone",
    label: "Tone",
    type: "select",
    options: ["Professional", "Friendly", "Direct", "Persuasive", "Apologetic", "Formal"],
    placeholder: "Professional",
  },
  {
    name: "length",
    label: "Length",
    type: "select",
    options: ["Very short", "Short", "Medium", "Detailed"],
    placeholder: "Short",
  },
];

function EmailPage() {
  return (
    <ToolWorkspace
      tool="email"
      title="Smart Email Generator"
      description="Turn a few bullet points into a polished, on-tone business email."
      icon={Mail}
      fields={fields}
      cta="Generate email"
    />
  );
}
