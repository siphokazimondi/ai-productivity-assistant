import { createFileRoute } from "@tanstack/react-router";
import { NotebookPen } from "lucide-react";

import { ToolWorkspace, type Field } from "@/components/ToolWorkspace";

export const Route = createFileRoute("/notes")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer | Aria Workplace" },
      {
        name: "description",
        content:
          "Turn messy meeting transcripts into structured summaries, decisions and action items with AI.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer | Aria Workplace" },
      {
        property: "og:description",
        content: "Summaries, decisions and owner-assigned action items from any meeting transcript.",
      },
    ],
  }),
  component: NotesPage,
});

const fields: Field[] = [
  {
    name: "meetingTitle",
    label: "Meeting title",
    type: "input",
    placeholder: "Q3 roadmap review",
  },
  {
    name: "participants",
    label: "Participants",
    type: "input",
    placeholder: "Sarah (PM), Dev (Eng), Lindiwe (Design)",
  },
  {
    name: "transcript",
    label: "Notes or transcript",
    type: "textarea",
    rows: 12,
    required: true,
    placeholder: "Paste raw notes, bullet points or a full transcript…",
  },
  {
    name: "focus",
    label: "Summary focus",
    type: "select",
    options: ["Balanced", "Decisions only", "Action items only", "Executive brief", "Risks & blockers"],
    placeholder: "Balanced",
  },
];

function NotesPage() {
  return (
    <ToolWorkspace
      tool="notes"
      title="Meeting Notes Summarizer"
      description="Extract the summary, decisions, owners and open questions from any meeting."
      icon={NotebookPen}
      fields={fields}
      cta="Summarize meeting"
    />
  );
}
