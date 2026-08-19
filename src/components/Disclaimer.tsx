import { ShieldAlert } from "lucide-react";

export function Disclaimer({ className = "" }: { className?: string }) {
  return (
    <p
      className={`flex items-start gap-2 rounded-xl bg-muted/70 p-3 text-[11px] leading-relaxed text-muted-foreground ${className}`}
    >
      <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0 text-highlight" />
      <span>
        <strong className="font-semibold text-foreground">Responsible AI:</strong> This content is an
        AI-generated draft and may be inaccurate or incomplete. Review facts, tone and bias, and
        never paste confidential or personal data you are not permitted to share.
      </span>
    </p>
  );
}
