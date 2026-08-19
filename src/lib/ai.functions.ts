import { createServerFn } from "@tanstack/react-start";
import { streamText } from "ai";
import { z } from "zod";

const ToolInput = z.object({
  tool: z.enum(["email", "notes", "planner", "research"]),
  fields: z.record(z.string()),
});

const ChatInput = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      }),
    )
    .min(1),
});

const SYSTEM_PROMPTS: Record<string, string> = {
  email:
    "You are a professional workplace writing assistant. Write clear, well-structured business emails. Output markdown with a **Subject:** line, then the body. Keep it concise and never invent facts, names, numbers or commitments that were not given to you.",
  notes:
    "You are a meeting notes summarizer. Return markdown with these sections: ## Summary, ## Key Decisions, ## Action Items (with owner and due date when stated), ## Open Questions. Only use information present in the transcript; write 'Not specified' where information is missing.",
  planner:
    "You are a pragmatic productivity planner. Return markdown with a prioritized plan: ## Priorities (ranked, with rationale), ## Time-blocked Schedule (table of time | task | focus level), ## Deferred / Delegate. Be realistic about effort and never overfill the available time.",
  research:
    "You are a research assistant for professionals. Return markdown with ## Overview, ## Key Findings (bulleted), ## Considerations & Trade-offs, ## Suggested Next Steps, ## Where to Verify (types of sources to check). State uncertainty explicitly and never fabricate citations, URLs or statistics.",
};

function buildPrompt(tool: string, fields: Record<string, string>) {
  const lines = Object.entries(fields)
    .filter(([, v]) => v && v.trim().length > 0)
    .map(([k, v]) => `${k.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase())}: ${v}`);
  return `Task: ${tool}\n\n${lines.join("\n")}`;
}

export const generateWithAssistant = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ToolInput.parse(input))
  .handler(async ({ data }) => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) throw new Error("AI is not configured (missing API key).");

    const { createLovableAiGatewayProvider, DEFAULT_MODEL } = await import("./ai-gateway.server");
    const gateway = createLovableAiGatewayProvider(apiKey);

    const result = streamText({
      model: gateway(DEFAULT_MODEL),
      system: SYSTEM_PROMPTS[data.tool],
      prompt: buildPrompt(data.tool, data.fields),
    });

    return { text: await result.text };
  });

export const chatWithAssistant = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ChatInput.parse(input))
  .handler(async ({ data }) => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) throw new Error("AI is not configured (missing API key).");

    const { createLovableAiGatewayProvider, DEFAULT_MODEL } = await import("./ai-gateway.server");
    const gateway = createLovableAiGatewayProvider(apiKey);

    const result = streamText({
      model: gateway(DEFAULT_MODEL),
      messages: [
        {
          role: "system" as const,
          content:
            "You are Aria, an AI workplace productivity assistant. Be concise, practical and professional. Use markdown. Ask a clarifying question when the request is ambiguous. Never invent facts, people, numbers or sources.",
        },
        ...data.messages,
      ],
    });

    return { text: await result.text };
  });
