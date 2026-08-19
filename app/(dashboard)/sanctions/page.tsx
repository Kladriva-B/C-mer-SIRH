import { getSanctionStats, listSanctions } from "@/lib/services/sanction.service";
import { ModuleHero } from "@/components/shared/module-hero";
import { StatCard } from "@/components/shared/stat-card";
import { FilterBar } from "@/components/shared/filter-bar";
import { Pagination } from "@/components/shared/pagination";
import { SanctionsTable } from "@/components/sanctions/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SANCTION_STATUS_LABELS } from "@/lib/constants/labels";
import { Ban, CircleCheck, CircleX, Gavel } from "lucide-react";

export default async function SanctionsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>;
}) {
  const params = await searchParams;
  const [{ items, total, page, pageSize }, stats] = await Promise.all([
    listSanctions({ query: params.q, status: params.status, page: Number(params.page ?? 1) }),
    getSanctionStats(),
  ]);
  const query = new URLSearchParams();
  if (params.q) query.set("q", params.q);
  if (params.status) query.set("status", params.status);
  const href = `/sanctions${query.toString() ? `?${query.toString()}` : ""}`;

  return (
    <div className="space-y-6">
      <ModuleHero
        icon={Gavel}
        title="Gestion des sanctions"
        description="Suivi et gestion des sanctions disciplinaires."
        action={{ href: "/sanctions/new", label: "+ Nouvelle sanction" }}
        tone="danger"
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Gavel} title="Sanctions actives" value={stats.active} tone="destructive" />
        <StatCard icon={CircleCheck} title="Sanctions terminées" value={stats.closed} tone="success" />
        <StatCard icon={Ban} title="Sanctions annulées" value={stats.cancelled} />
        <StatCard icon={CircleX} title="Total sanctions" value={stats.total} tone="info" />
      </div>
      <FilterBar>
        <Input name="q" placeholder="Rechercher par numéro, employé, motif..." defaultValue={params.q} />
        <select name="status" defaultValue={params.status} className="ui-control">
          <option value="">Tous les statuts</option>
          {Object.entries(SANCTION_STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
        <Button type="submit">Filtrer</Button>
      </FilterBar>
      <p className="text-sm text-muted-foreground">{total} sanction(s)</p>
      <SanctionsTable data={items} />
      <Pagination page={page} total={total} pageSize={pageSize} href={href} />
    </div>
  );
}
