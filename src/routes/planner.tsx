import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import { Sparkles, RefreshCw, Loader2, Pencil, Eye } from "lucide-react";
import { generatePlan } from "@/lib/ai.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AiDisclaimer } from "@/components/AiDisclaimer";

export const Route = createFileRoute("/planner")({
  component: PlannerPage,
  head: () => ({
    meta: [{ title: "AI Task Planner — Workplace AI" }],
  }),
});

function PlannerPage() {
  const call = useServerFn(generatePlan);
  const [goals, setGoals] = useState("");
  const [hours, setHours] = useState("");
  const [range, setRange] = useState<"Daily" | "Weekly">("Daily");
  const [plan, setPlan] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  async function run() {
    if (!goals.trim()) {
      toast.error("List a few tasks or goals first.");
      return;
    }
    setLoading(true);
    try {
      const { content } = await call({
        data: { goals, hoursAvailable: hours, range },
      });
      setPlan(content);
      setEditMode(false);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to generate plan");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">AI Task Planner</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Turn your goals into a prioritized, time-blocked plan.
        </p>
      </div>

      <AiDisclaimer className="mb-6" />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="space-y-4">
            <div>
              <Label>Plan range</Label>
              <div className="mt-1.5 grid grid-cols-2 gap-2">
                {(["Daily", "Weekly"] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRange(r)}
                    className={`rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
                      range === r
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background hover:bg-accent"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="goals">Tasks & goals</Label>
              <Textarea
                id="goals"
                className="mt-1.5 min-h-40"
                placeholder="e.g.&#10;- Finish Q3 report draft&#10;- Prep for client call Thursday&#10;- Review 3 pull requests&#10;- Follow up with design team"
                value={goals}
                onChange={(e) => setGoals(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="hours">Available hours (optional)</Label>
              <Input
                id="hours"
                className="mt-1.5"
                placeholder="e.g. 6 focused hours per day"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
              />
            </div>
            <Button onClick={run} disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Building plan...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" /> Generate plan
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold">Your plan</h2>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditMode((v) => !v)}
                disabled={!plan}
              >
                {editMode ? (
                  <>
                    <Eye className="mr-1.5 h-3.5 w-3.5" /> Preview
                  </>
                ) : (
                  <>
                    <Pencil className="mr-1.5 h-3.5 w-3.5" /> Edit
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={run}
                disabled={loading || !plan}
                title="Regenerate"
              >
                <RefreshCw className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
          {plan ? (
            editMode ? (
              <Textarea
                value={plan}
                onChange={(e) => setPlan(e.target.value)}
                className="min-h-[500px] resize-y font-mono text-sm"
              />
            ) : (
              <div className="prose prose-sm max-w-none rounded-md border border-border bg-background p-4 prose-headings:mt-4 prose-headings:mb-2 prose-p:my-2 prose-ul:my-2 prose-li:my-0.5">
                <ReactMarkdown>{plan}</ReactMarkdown>
              </div>
            )
          ) : (
            <div className="flex min-h-[400px] items-center justify-center rounded-md border border-dashed border-border text-sm text-muted-foreground">
              Your generated plan will appear here.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
