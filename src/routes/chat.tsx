import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { Bot, Loader2, Send, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Disclaimer } from "@/components/Disclaimer";
import { chatWithAssistant } from "@/lib/ai.functions";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Chatbot | Aria Workplace" },
      {
        name: "description",
        content:
          "Chat with Aria, your AI workplace assistant, for quick answers, rewrites and thinking-partner support.",
      },
      { property: "og:title", content: "AI Chatbot | Aria Workplace" },
      {
        property: "og:description",
        content: "A conversational AI assistant for everyday workplace tasks.",
      },
    ],
  }),
  component: ChatPage,
});

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "Rewrite this message to sound more confident",
  "Help me prepare for a performance review",
  "Turn these notes into a status update",
  "What should I ask in a vendor demo?",
];

function ChatPage() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  const send = useServerFn(chatWithAssistant);
  const mutation = useMutation({
    mutationFn: (history: Msg[]) => send({ data: { messages: history } }),
    onSuccess: (res) => setMessages((m) => [...m, { role: "assistant", content: res.text }]),
    onError: (error: Error) => toast.error(error.message || "The assistant could not reply."),
  });

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, mutation.isPending]);

  function submit(text: string) {
    const trimmed = text.trim();
    if (!trimmed || mutation.isPending) return;
    const next: Msg[] = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setInput("");
    mutation.mutate(next);
  }

  return (
    <div className="space-y-6">
      <header className="flex items-start gap-4">
        <span className="bg-gradient-brand flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl shadow-glow">
          <Bot className="h-5 w-5 text-brand-foreground" />
        </span>
        <div>
          <h1 className="text-2xl font-semibold sm:text-3xl">AI Chatbot</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Ask Aria anything about your work — drafts, planning, prep or quick explanations.
          </p>
        </div>
      </header>

      <div className="flex h-[62vh] min-h-[26rem] flex-col rounded-2xl border border-border bg-card shadow-soft">
        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <span className="bg-gradient-warm flex h-12 w-12 items-center justify-center rounded-2xl">
                <Bot className="h-6 w-6 text-highlight-foreground" />
              </span>
              <p className="text-sm font-medium">How can I help you get ahead today?</p>
              <div className="flex flex-wrap justify-center gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => submit(s)}
                    className="rounded-full border border-border bg-muted/60 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-brand-soft hover:text-foreground"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((m, i) => (
              <div
                key={i}
                className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.role === "assistant" ? (
                  <span className="bg-gradient-brand mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl">
                    <Bot className="h-4 w-4 text-brand-foreground" />
                  </span>
                ) : null}
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                    m.role === "user"
                      ? "bg-gradient-brand text-brand-foreground"
                      : "border border-border bg-muted/50 text-foreground"
                  }`}
                >
                  {m.role === "assistant" ? (
                    <div className="prose-ai">
                      <ReactMarkdown>{m.content}</ReactMarkdown>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap">{m.content}</p>
                  )}
                </div>
                {m.role === "user" ? (
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-border bg-card">
                    <User className="h-4 w-4 text-muted-foreground" />
                  </span>
                ) : null}
              </div>
            ))
          )}
          {mutation.isPending ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Aria is thinking…
            </div>
          ) : null}
          <div ref={endRef} />
        </div>

        <div className="border-t border-border p-4">
          <div className="flex items-end gap-2">
            <Textarea
              rows={1}
              value={input}
              placeholder="Message Aria…"
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  submit(input);
                }
              }}
              className="max-h-32 min-h-11 resize-none"
            />
            <Button
              onClick={() => submit(input)}
              disabled={mutation.isPending || !input.trim()}
              className="bg-gradient-brand h-11 text-brand-foreground shadow-glow hover:opacity-90"
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <Disclaimer />
    </div>
  );
}
