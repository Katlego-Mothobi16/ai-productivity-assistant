import { AlertTriangle } from "lucide-react";

export function AiDisclaimer({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900 ${className}`}
    >
      <AlertTriangle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
      <p>
        <strong>Responsible AI:</strong> AI-generated content may be inaccurate. Review it before
        use. Do not enter confidential or sensitive information.
      </p>
    </div>
  );
}
