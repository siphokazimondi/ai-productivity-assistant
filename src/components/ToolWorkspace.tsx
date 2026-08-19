import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { Copy, Loader2, RefreshCw, Sparkles, Pencil, Eye } from "lucide-react";
import { useState, type ComponentType } from "react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Disclaimer } from "@/components/Disclaimer";
import { generateWithAssistant } from "@/lib/ai.functions";

export type Field = {
  name: string;
  label: string;
  type: "input" | "textarea" | "select";
  placeholder?: string;
  options?: string[];
  rows?: number;
  required?: boolean;
};

type Props = {
  tool: "email" | "notes" | "planner" | "research";
  title: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
  fields: Field[];
  cta: string;
};

export function ToolWorkspace({
  tool,
  title,
  description,
  icon: Icon,
  fields,
  cta,
}: Props) {
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(fields.map((f) => [f.name, ""])),
  );
  const [output, setOutput] = useState("");
  const [editing, setEditing] = useState(false);

  const generate = useServerFn(generateWithAssistant);
  const mutation = useMutation({
    mutationFn: () => generate({ data: { tool, fields: values } }),
    onSuccess: (res) => {
      setOutput(res.text);
      setEditing(false);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Generation failed. Please try again.");
    },
  });

  const missing = fields.filter((f) => f.required && !values[f.name]?.trim());

  function run() {
    if (missing.length > 0) {
      toast.error(`Please fill in: ${missing.map((f) => f.label).join(", ")}`);
      return;
    }
    mutation.mutate();
  }

  return (
    <div className="space-y-6">
      <header className="flex items-start gap-4">
        <span className="bg-gradient-brand flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl shadow-glow">
          <Icon className="h-5 w-5 text-brand-foreground" />
        </span>
        <div>
          <h1 className="text-2xl font-semibold sm:text-3xl">{title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <section className="rounded-2xl border border-border bg-card p-5 shadow-soft">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Prompt details
          </h2>
          <div className="mt-4 space-y-4">
            {fields.map((field) => (
              <div key={field.name} className="space-y-1.5">
                <Label htmlFor={field.name} className="text-xs font-medium">
                  {field.label}
                  {field.required ? <span className="text-highlight"> *</span> : null}
                </Label>
                {field.type === "textarea" ? (
                  <Textarea
                    id={field.name}
                    rows={field.rows ?? 5}
                    placeholder={field.placeholder}
                    value={values[field.name] ?? ""}
                    onChange={(e) => setValues((v) => ({ ...v, [field.name]: e.target.value }))}
                  />
                ) : field.type === "select" ? (
                  <Select
                    value={values[field.name] ?? ""}
                    onValueChange={(val) => setValues((v) => ({ ...v, [field.name]: val }))}
                  >
                    <SelectTrigger id={field.name}>
                      <SelectValue placeholder={field.placeholder ?? "Select"} />
                    </SelectTrigger>
                    <SelectContent>
                      {(field.options ?? []).map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    id={field.name}
                    placeholder={field.placeholder}
                    value={values[field.name] ?? ""}
                    onChange={(e) => setValues((v) => ({ ...v, [field.name]: e.target.value }))}
                  />
                )}
              </div>
            ))}
          </div>

          <Button
            className="mt-5 w-full bg-gradient-brand text-brand-foreground shadow-glow hover:opacity-90"
            onClick={run}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            {mutation.isPending ? "Generating…" : cta}
          </Button>
        </section>

        <section className="flex min-h-[22rem] flex-col rounded-2xl border border-border bg-card p-5 shadow-soft">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              AI draft
            </h2>
            {output ? (
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditing((e) => !e)}
                  aria-label={editing ? "Preview draft" : "Edit draft"}
                >
                  {editing ? <Eye className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
                  {editing ? "Preview" : "Edit"}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    void navigator.clipboard.writeText(output);
                    toast.success("Copied to clipboard");
                  }}
                >
                  <Copy className="h-4 w-4" />
                  Copy
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={run}
                  disabled={mutation.isPending}
                  aria-label="Regenerate"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            ) : null}
          </div>

          <div className="mt-4 flex-1">
            {mutation.isPending && !output ? (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Drafting with AI…
              </div>
            ) : !output ? (
              <div className="flex h-full flex-col items-center justify-center rounded-xl border border-dashed border-border p-6 text-center">
                <Sparkles className="h-6 w-6 text-primary" />
                <p className="mt-3 text-sm font-medium">Your draft will appear here</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Fill in the prompt details, then generate — every output stays fully editable.
                </p>
              </div>
            ) : editing ? (
              <Textarea
                value={output}
                onChange={(e) => setOutput(e.target.value)}
                className="h-full min-h-[18rem] font-mono text-xs"
              />
            ) : (
              <div className="prose-ai text-sm text-foreground">
                <ReactMarkdown>{output}</ReactMarkdown>
              </div>
            )}
          </div>

          <Disclaimer className="mt-4" />
        </section>
      </div>
    </div>
  );
}
