import type { Metadata } from "next";
import { Briefcase } from "lucide-react";
import { ModuleHero } from "@/components/shared/module-hero";
import { StatCard } from "@/components/shared/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getOrganizationOverview } from "@/lib/services/hr-modules.service";

export const metadata: Metadata = { title: "Postes" };

export default async function PositionsPage() {
  const { positions } = await getOrganizationOverview();

  return (
    <div className="space-y-6">
      <ModuleHero
        icon={Briefcase}
        title="Gestion des postes"
        description="Postes rattachés aux départements."
      />
      <StatCard icon={Briefcase} title="Total postes" value={positions.length} />
      <Card>
        <CardHeader>
          <CardTitle>Liste des postes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {positions.map((position) => (
            <div key={position.id} className="ui-row flex items-center justify-between text-sm">
              <div>
                <p className="font-medium">{position.name}</p>
                <p className="text-muted-foreground">{position.department?.name ?? "—"} · {position.code}</p>
              </div>
              <span className="text-muted-foreground">{position._count.employees} employé(s)</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
