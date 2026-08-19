import { Pause, TreePalm, UserCheck, Users } from "lucide-react";
import { fetchEmployeeStats, fetchEmployees, getEmployeeFormOptions } from "@/lib/services/employee.service";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { EmployeesTable } from "@/components/employees/table";
import { Pagination } from "@/components/shared/pagination";
import { FilterBar } from "@/components/shared/filter-bar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EMPLOYEE_STATUS_LABELS } from "@/lib/constants/labels";
import { requireUser } from "@/lib/auth/guards";
import { contextHasPermission } from "@/lib/auth/access";

export default async function EmployeesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; departmentId?: string; page?: string }>;
}) {
  const params = await searchParams;
  const ctx = await requireUser();
  const canCreate = contextHasPermission(ctx, "employees.write");
  const canDelete = contextHasPermission(ctx, "employees.delete");
  const [{ items, total, page, pageSize }, stats, options] = await Promise.all([
    fetchEmployees({
      query: params.q,
      status: params.status,
      departmentId: params.departmentId,
      page: Number(params.page ?? 1),
    }),
    fetchEmployeeStats(),
    getEmployeeFormOptions(),
  ]);

  const query = new URLSearchParams();
  if (params.q) query.set("q", params.q);
  if (params.status) query.set("status", params.status);
  if (params.departmentId) query.set("departmentId", params.departmentId);
  const href = `/employees${query.toString() ? `?${query.toString()}` : ""}`;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Users}
        title="Employés"
        description="Gérez les collaborateurs, leurs contrats et leurs dossiers."
        action={canCreate ? { href: "/employees/new", label: "Ajouter un employé" } : undefined}
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Users} title="Total" value={stats.total} />
        <StatCard icon={UserCheck} title="Actifs" value={stats.active} tone="success" />
        <StatCard icon={TreePalm} title="En congé" value={stats.onLeave} tone="info" />
        <StatCard icon={Pause} title="Suspendus" value={stats.suspended} tone="warning" />
      </div>
      <FilterBar columns={4}>
        <Input name="q" placeholder="Rechercher" defaultValue={params.q} />
        <select name="status" defaultValue={params.status} className="ui-control">
          <option value="">Tous les statuts</option>
          {Object.entries(EMPLOYEE_STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <select name="departmentId" defaultValue={params.departmentId} className="ui-control">
          <option value="">Tous les départements</option>
          {options.departments.map((department) => (
            <option key={department.id} value={department.id}>
              {department.name}
            </option>
          ))}
        </select>
        <Button type="submit">Filtrer</Button>
      </FilterBar>
      <EmployeesTable data={items} canCreate={canCreate} canDelete={canDelete} />
      <Pagination page={page} total={total} pageSize={pageSize} href={href} />
    </div>
  );
}
