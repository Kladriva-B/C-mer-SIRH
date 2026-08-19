import type { Metadata } from "next";
import { Building2, Pause, Users } from "lucide-react";
import { ModuleHero } from "@/components/shared/module-hero";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getOrganizationOverview } from "@/lib/services/hr-modules.service";

export const metadata: Metadata = { title: "Départements" };

export default async function DepartmentsPage() {
  const { organization, departments } = await getOrganizationOverview();
  const active = departments.filter((item) => item.isActive).length;

  return (
    <div className="space-y-6">
      <ModuleHero
        icon={Building2}
        title="Gestion des départements"
        description="Créez et administrez les départements liés à vos entreprises."
      />
      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard icon={Building2} title="Total départements" value={departments.length} />
        <StatCard icon={Users} title="Actifs" value={active} tone="success" />
        <StatCard icon={Pause} title="Suspendus" value={departments.length - active} tone="destructive" />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Liste des départements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {departments.map((department) => (
            <div key={department.id} className="ui-row flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium">{department.name}</p>
                <p className="text-xs text-muted-foreground">{department.code} · {organization?.name ?? "Camer SIRH"}</p>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className="text-muted-foreground">{department._count.employees} employé(s)</span>
                <StatusBadge value={department.isActive ? "ACTIVE" : "SUSPENDED"} label={department.isActive ? "Actif" : "Suspendu"} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
