import type { Metadata } from "next";
import { Building2, MapPin, Pause } from "lucide-react";
import { ModuleHero } from "@/components/shared/module-hero";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getOrganizationOverview } from "@/lib/services/hr-modules.service";

export const metadata: Metadata = { title: "Entreprises" };

export default async function CompaniesPage() {
  const { organization, sites } = await getOrganizationOverview();
  const companies = [
    {
      id: organization?.id ?? "org",
      name: organization?.name ?? "Camer SIRH",
      city: organization?.city ?? "Douala",
      country: organization?.country ?? "Cameroun",
      email: organization?.email,
      phone: organization?.phone,
      active: true,
    },
    ...sites.map((site) => ({
      id: site.id,
      name: site.name,
      city: site.city ?? "—",
      country: "Cameroun",
      email: site.email,
      phone: site.phone,
      active: site.isActive,
    })),
  ];
  const active = companies.filter((item) => item.active).length;

  return (
    <div className="space-y-6">
      <ModuleHero
        icon={Building2}
        title="Gestion des entreprises"
        description="Administrez les structures, agences et filiales de votre organisation."
      />
      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard icon={Building2} title="Total entreprises" value={companies.length} />
        <StatCard icon={MapPin} title="Actives" value={active} tone="success" />
        <StatCard icon={Pause} title="Suspendues" value={companies.length - active} tone="destructive" />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Liste des structures</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {companies.map((company) => (
            <div key={company.id} className="ui-row grid gap-2 sm:grid-cols-4">
              <div>
                <p className="font-medium">{company.name}</p>
                <p className="text-xs text-muted-foreground">{company.id.slice(0, 8)}</p>
              </div>
              <p className="text-sm text-muted-foreground">
                {company.city}, {company.country}
              </p>
              <p className="text-sm text-muted-foreground">
                {company.email ?? "—"}
                <br />
                {company.phone ?? "—"}
              </p>
              <div>
                <StatusBadge value={company.active ? "ACTIVE" : "SUSPENDED"} label={company.active ? "Actif" : "Suspendu"} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
