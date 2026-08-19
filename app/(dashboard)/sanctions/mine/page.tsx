import type { Metadata } from "next";
import { Ban, CircleCheck, CircleX, Gavel } from "lucide-react";
import { ModuleHero } from "@/components/shared/module-hero";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { listMySanctions } from "@/lib/services/sanction.service";
import { SANCTION_STATUS_LABELS } from "@/lib/constants/labels";
import { formatDate } from "@/lib/format/date";

export const metadata: Metadata = { title: "Mes sanctions" };

export default async function MySanctionsPage() {
  const items = await listMySanctions();
  const stats = {
    active: items.filter((item) => item.status === "ACTIVE").length,
    closed: items.filter((item) => item.status === "CLOSED").length,
    cancelled: items.filter((item) => item.status === "CANCELLED").length,
    total: items.length,
  };

  return (
    <div className="space-y-6">
      <ModuleHero
        icon={Gavel}
        title="Mes sanctions"
        description="Consultez l'historique de vos sanctions disciplinaires."
        tone="danger"
      />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Gavel} title="Sanctions actives" value={stats.active} tone="destructive" />
        <StatCard icon={CircleCheck} title="Sanctions terminées" value={stats.closed} tone="success" />
        <StatCard icon={Ban} title="Sanctions annulées" value={stats.cancelled} />
        <StatCard icon={CircleX} title="Total sanctions" value={stats.total} tone="info" />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Liste de mes sanctions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {items.length ? (
            items.map((item) => (
              <div key={item.id} className="ui-row grid gap-2 sm:grid-cols-5">
                <p className="font-medium">{item.reference}</p>
                <p className="text-sm">{item.type.name}</p>
                <StatusBadge value={item.status} label={SANCTION_STATUS_LABELS[item.status]} />
                <p className="text-sm text-muted-foreground">{item.reason}</p>
                <p className="text-sm">{formatDate(item.date)}</p>
              </div>
            ))
          ) : (
            <p className="py-8 text-center text-sm text-muted-foreground">Aucune sanction trouvée</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
