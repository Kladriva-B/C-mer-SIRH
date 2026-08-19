import { BarChart3, FileText, Files, UserCheck, Wallet } from "lucide-react";
import { getDashboardData } from "@/lib/services/dashboard.service";
import { getPayrollStats } from "@/lib/services/payroll.service";
import { getEmployeeStats } from "@/lib/repositories/employee.repository";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatFcfa } from "@/lib/format/money";
import { requirePermission } from "@/lib/auth/guards";

export default async function ReportsPage() {
  await requirePermission("reports.read");
  const [dashboard, payroll, employees] = await Promise.all([
    getDashboardData(),
    getPayrollStats(),
    getEmployeeStats(),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader icon={BarChart3} title="Rapports" description="Indicateurs consolidés pour le pilotage RH." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={UserCheck} title="Employés actifs" value={employees.active} />
        <StatCard icon={FileText} title="Bulletins générés" value={payroll.generated} />
        <StatCard icon={Wallet} title="Masse salariale" value={formatFcfa(payroll.mass)} />
        <StatCard icon={Files} title="Documents" value={dashboard.cards.documents} />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Répartition par département</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {dashboard.charts.departments.map((department) => (
            <div key={department.name} className="ui-row flex items-center justify-between text-sm">
              <span>{department.name}</span>
              <strong>{department.value}</strong>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
