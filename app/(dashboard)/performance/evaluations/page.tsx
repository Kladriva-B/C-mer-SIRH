import type { Metadata } from "next";
import { ClipboardCheck, Gauge, Trophy } from "lucide-react";
import { ModuleHero } from "@/components/shared/module-hero";
import { StatCard } from "@/components/shared/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { listEvaluations, mentionFromScore } from "@/lib/services/hr-modules.service";
import { EVALUATION_MENTION_LABELS } from "@/lib/constants/labels";
import { formatDate } from "@/lib/format/date";

export const metadata: Metadata = { title: "Évaluations" };

export default async function EvaluationsPage() {
  const evaluations = await listEvaluations();
  const average = evaluations.length
    ? evaluations.reduce((sum, item) => sum + item.score, 0) / evaluations.length
    : 0;
  const best = evaluations.reduce((current, item) => Math.max(current, item.score), 0);

  return (
    <div className="space-y-6">
      <ModuleHero icon={ClipboardCheck} tone="violet" title="Registre des évaluations" description="Suivi des évaluations des collaborateurs." />
      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard icon={ClipboardCheck} title="Total évaluations" value={evaluations.length} />
        <StatCard icon={Gauge} title="Moyenne générale" value={`${average.toFixed(1)} %`} />
        <StatCard icon={Trophy} title="Meilleure mention" value={best ? EVALUATION_MENTION_LABELS[mentionFromScore(best)] : "—"} />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Évaluations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {evaluations.map((evaluation) => {
            const mention = mentionFromScore(evaluation.score);
            return (
              <div key={evaluation.id} className="ui-row grid gap-2 sm:grid-cols-5">
                <p className="font-medium">
                  {evaluation.employee.firstName} {evaluation.employee.lastName}
                </p>
                <p className="text-sm text-muted-foreground">{evaluation.title}</p>
                <p className="text-sm">{evaluation.score} %</p>
                <Badge variant={mention === "INSUFFICIENT" ? "destructive" : "secondary"}>
                  {EVALUATION_MENTION_LABELS[mention]}
                </Badge>
                <p className="text-sm">{formatDate(evaluation.evaluatedAt)}</p>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
