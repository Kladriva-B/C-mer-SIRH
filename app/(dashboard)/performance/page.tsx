import type { Metadata } from "next";
import { Award, Building2, Gauge, Trophy } from "lucide-react";
import { ModuleHero } from "@/components/shared/module-hero";
import { StatCard } from "@/components/shared/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getPerformanceDashboard } from "@/lib/services/hr-modules.service";
import { EVALUATION_MENTION_LABELS } from "@/lib/constants/labels";
import { MentionChart } from "@/components/performance/mention-chart";

export const metadata: Metadata = { title: "Tableau de bord Performance" };

export default async function PerformanceDashboardPage() {
  const data = await getPerformanceDashboard();
  const mentionSlices = Object.entries(data.mentions).map(([name, value]) => ({
    name: EVALUATION_MENTION_LABELS[name as keyof typeof EVALUATION_MENTION_LABELS] ?? name,
    value,
  }));

  return (
    <div className="space-y-6">
      <ModuleHero
        icon={Gauge}
        tone="violet"
        title="Tableau de bord Performance"
        description="Analyse et suivi des performances des collaborateurs."
      />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Gauge} title="Évaluations" value={data.total} hint="Total cette année" tone="info" />
        <StatCard icon={Trophy} title="Moyenne générale" value={`${data.average.toFixed(1)} %`} hint="Score moyen" tone="success" />
        <StatCard
          icon={Award}
          title="Meilleur employé"
          value={data.top ? `${data.top.employee.firstName} ${data.top.employee.lastName}` : "—"}
          hint={data.top ? `Score : ${data.top.score}` : undefined}
        />
        <StatCard
          icon={Building2}
          title="Meilleur département"
          value={data.topDepartment?.name ?? "—"}
          hint={data.topDepartment ? `${data.topDepartment.average.toFixed(1)} %` : undefined}
        />
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Répartition des mentions</CardTitle>
          </CardHeader>
          <CardContent>
            <MentionChart data={mentionSlices} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Classement des meilleurs employés</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {data.ranking.slice(0, 5).map((item) => (
              <div key={item.rank} className="ui-row flex items-center justify-between text-sm">
                <span>
                  {item.rank}. {item.employee.firstName} {item.employee.lastName}
                </span>
                <Badge variant={item.mention === "EXCELLENT" ? "default" : "secondary"}>
                  {EVALUATION_MENTION_LABELS[item.mention]} · {item.score}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
