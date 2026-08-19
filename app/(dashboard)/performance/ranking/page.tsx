import type { Metadata } from "next";
import { Award } from "lucide-react";
import { ModuleHero } from "@/components/shared/module-hero";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getPerformanceDashboard } from "@/lib/services/hr-modules.service";
import { EVALUATION_MENTION_LABELS } from "@/lib/constants/labels";

export const metadata: Metadata = { title: "Classement" };

export default async function RankingPage() {
  const data = await getPerformanceDashboard();

  return (
    <div className="space-y-6">
      <ModuleHero icon={Award} tone="violet" title="Classement" description="Top performers de l'organisation." />
      <Card>
        <CardContent className="space-y-2 p-4">
          {data.ranking.map((item) => (
            <div
              key={item.rank}
              className={`ui-row flex items-center justify-between ${item.rank === 1 ? "bg-primary/10" : ""}`}
            >
              <div>
                <p className="font-medium">
                  {item.rank}. {item.employee.firstName} {item.employee.lastName}
                </p>
                <p className="text-sm text-muted-foreground">{item.employee.department.name}</p>
              </div>
              <Badge>{EVALUATION_MENTION_LABELS[item.mention]} · {item.score} pts</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
