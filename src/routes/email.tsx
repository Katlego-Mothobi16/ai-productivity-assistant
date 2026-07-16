import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { Copy, RefreshCw, Sparkles, Loader2 } from "lucide-react";
import { generateEmail } from "@/lib/ai.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AiDisclaimer } from "@/components/AiDisclaimer";

export const Route = createFileRoute("/email")({
  component: EmailPage,
  head: () => ({
    meta: [{ title: "Smart Email Generator — Workplace AI" }],
  }),
});

const tones = ["Formal", "Friendly", "Persuasive"] as const;
type Tone = (typeof tones)[number];

function EmailPage() {
  const call = useServerFn(generateEmail);
  const [purpose, setPurpose] = useState("");
  const [recipient, setRecipient] = useState("");
  const [keyPoints, setKeyPoints] = useState("");
  const [tone, setTone] = useState<Tone>("Formal");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  async function run() {
    if (!purpose.trim()) {
      toast.error("Please describe the purpose of the email.");
      return;
    }
    setLoading(true);
    try {
      const { content } = await call({
        data: { purpose, recipient, keyPoints, tone },
      });
      setOutput(content);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to generate email");
    } finally {
      setLoading(false);
    }
  }

  async function copy() {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    toast.success("Email copied to clipboard");
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Smart Email Generator</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Draft polished emails in seconds. Pick a tone and refine the result.
        </p>
      </div>

      <AiDisclaimer className="mb-6" />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="space-y-4">
            <div>
              <Label htmlFor="purpose">Purpose</Label>
              <Textarea
                id="purpose"
                className="mt-1.5 min-h-20"
                placeholder="e.g. Ask my manager to approve a 3-day training course next month"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="recipient">Recipient (optional)</Label>
              <Input
                id="recipient"
                className="mt-1.5"
                placeholder="e.g. My manager Sarah"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="keypoints">Key points (optional)</Label>
              <Textarea
                id="keypoints"
                className="mt-1.5 min-h-20"
                placeholder="Any specific details to include"
                value={keyPoints}
                onChange={(e) => setKeyPoints(e.target.value)}
              />
            </div>
            <div>
              <Label>Tone</Label>
              <div className="mt-1.5 grid grid-cols-3 gap-2">
                {tones.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTone(t)}
                    className={`rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
                      tone === t
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background hover:bg-accent"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <Button onClick={run} disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" /> Generate email
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold">Generated email</h2>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={run}
                disabled={loading || !output}
                title="Regenerate"
              >
                <RefreshCw className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={copy}
                disabled={!output}
                title="Copy"
              >
                <Copy className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
          <Textarea
            value={output}
            onChange={(e) => setOutput(e.target.value)}
            placeholder="Your generated email will appear here. You can edit it freely."
            className="min-h-[420px] resize-y font-mono text-sm leading-relaxed"
          />
        </div>
      </div>
    </div>
  );
}
