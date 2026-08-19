import { HardHat, UserCheck, UserMinus } from "lucide-react";
import { getWorkerStats, getWorkerFormOptions, listWorkers } from "@/lib/services/worker.service";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { Pagination } from "@/components/shared/pagination";
import { FilterBar } from "@/components/shared/filter-bar";
import { WorkersTable } from "@/components/workers/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { WORKER_STATUS_LABELS } from "@/lib/constants/labels";
import { requireUser } from "@/lib/auth/guards";
import { contextHasPermission } from "@/lib/auth/access";

export default async function WorkersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; siteId?: string; page?: string }>;
}) {
  const params = await searchParams;
  const ctx = await requireUser();
  const canCreate = contextHasPermission(ctx, "workers.write");
  const canDelete = contextHasPermission(ctx, "workers.delete");
  const [{ items, total, page, pageSize }, stats, options] = await Promise.all([
    listWorkers({
      query: params.q,
      status: params.status,
      siteId: params.siteId,
      page: Number(params.page ?? 1),
    }),
    getWorkerStats(),
    getWorkerFormOptions(),
  ]);
  const query = new URLSearchParams();
  if (params.q) query.set("q", params.q);
  if (params.status) query.set("status", params.status);
  if (params.siteId) query.set("siteId", params.siteId);
  const href = `/workers${query.toString() ? `?${query.toString()}` : ""}`;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={HardHat}
        tone="warning"
        title="Ouvriers"
        description="Suivi des ouvriers, affectations et sites."
        action={canCreate ? { href: "/workers/new", label: "Ajouter un ouvrier" } : undefined}
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard icon={HardHat} title="Total" value={stats.total} tone="warning" />
        <StatCard icon={UserCheck} title="Actifs" value={stats.active} tone="success" />
        <StatCard icon={UserMinus} title="Inactifs" value={stats.inactive} />
      </div>
      <FilterBar columns={4}>
        <Input name="q" placeholder="Rechercher" defaultValue={params.q} />
        <select name="status" defaultValue={params.status} className="ui-control">
          <option value="">Tous les statuts</option>
          {Object.entries(WORKER_STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
        <select name="siteId" defaultValue={params.siteId} className="ui-control">
          <option value="">Tous les sites</option>
          {options.sites.map((site) => (
            <option key={site.id} value={site.id}>{site.name}</option>
          ))}
        </select>
        <Button type="submit">Filtrer</Button>
      </FilterBar>
      <WorkersTable data={items} canCreate={canCreate} canDelete={canDelete} />
      <Pagination page={page} total={total} pageSize={pageSize} href={href} />
    </div>
  );
}
