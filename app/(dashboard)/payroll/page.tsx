import { CircleAlert, Clock3, FileCheck, Wallet } from "lucide-react";
import { getPayrollStats, listPayrolls } from "@/lib/services/payroll.service";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { Pagination } from "@/components/shared/pagination";
import { FilterBar } from "@/components/shared/filter-bar";
import { PayrollTable } from "@/components/payroll/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatFcfa } from "@/lib/format/money";
import { PAYROLL_STATUS_LABELS } from "@/lib/constants/labels";

export default async function PayrollPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>;
}) {
  const params = await searchParams;
  const [{ items, total, page, pageSize }, stats] = await Promise.all([
    listPayrolls({ query: params.q, status: params.status, page: Number(params.page ?? 1) }),
    getPayrollStats(),
  ]);
  const query = new URLSearchParams();
  if (params.q) query.set("q", params.q);
  if (params.status) query.set("status", params.status);
  const href = `/payroll${query.toString() ? `?${query.toString()}` : ""}`;

  return (
    <div className="space-y-6">
      <PageHeader icon={Wallet} tone="success" title="Paie" description="Bulletins, masse salariale et génération." action={{ href: "/payroll/new", label: "Générer un bulletin" }} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={FileCheck} title="Bulletins générés" value={stats.generated} tone="success" />
        <StatCard icon={Clock3} title="En attente" value={stats.pending} tone="warning" />
        <StatCard icon={CircleAlert} title="Erreurs" value={stats.errors} tone="destructive" />
        <StatCard icon={Wallet} title="Masse salariale" value={formatFcfa(stats.mass)} />
      </div>
      <FilterBar>
        <Input name="q" placeholder="Rechercher" defaultValue={params.q} />
        <select name="status" defaultValue={params.status} className="ui-control">
          <option value="">Tous les statuts</option>
          {Object.entries(PAYROLL_STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
        <Button type="submit">Filtrer</Button>
      </FilterBar>
      <PayrollTable data={items} />
      <Pagination page={page} total={total} pageSize={pageSize} href={href} />
    </div>
  );
}
