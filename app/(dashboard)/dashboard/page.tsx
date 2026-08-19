import Link from "next/link";
import {
  Briefcase,
  Building2,
  CalendarDays,
  FileSignature,
  Gauge,
  LayoutDashboard,
  AlertTriangle,
  Users,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { DashboardCharts } from "@/components/dashboard/charts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardData } from "@/lib/services/dashboard.service";
import { formatRelative } from "@/lib/format/date";

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <div className="space-y-4">
      <PageHeader
        icon={LayoutDashboard}
        title={`Bonjour, ${data.greetingName}`}
        description="Tableau de bord Ressources Humaines"
      />
      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-7">
        <StatCard icon={Users} title="Employés" value={data.cards.employees} href="/employees" />
        <StatCard icon={Building2} title="Départements" value={data.cards.departments} href="/organization" />
        <StatCard icon={Briefcase} title="Postes" value={data.cards.positions} href="/organization" />
        <StatCard icon={FileSignature} title="Contrats actifs" value={data.cards.activeContracts} href="/contracts" />
        <StatCard icon={CalendarDays} title="En congé aujourd'hui" value={data.cards.onLeaveToday} href="/leaves" tone="info" />
        <StatCard icon={AlertTriangle} title="Demandes d'explication" value={data.cards.explanations} href="/performance" tone="warning" />
        <StatCard icon={Gauge} title="Évaluations effectuées" value={data.cards.evaluations} href="/performance" />
      </div>
      <DashboardCharts {...data.charts} />
      <div className="grid gap-3 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Actions à effectuer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.actions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="flex items-center justify-between rounded-xl bg-muted/70 px-3 py-2 text-sm transition-colors hover:bg-primary/10"
              >
                <span>{action.label}</span>
                <strong className="text-primary">{action.count}</strong>
              </Link>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Derniers employés</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.recentEmployees.map((employee) => (
              <Link key={employee.id} href={`/employees/${employee.id}`} className="block rounded-xl bg-muted/60 px-3 py-2 text-sm transition-colors hover:bg-muted">
                <div className="font-medium">
                  {employee.firstName} {employee.lastName}
                </div>
                <div className="text-muted-foreground">
                  {employee.position.name} · {employee.department.name}
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Activité récente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.recentActivity.map((log) => (
              <div key={log.id} className="rounded-xl bg-muted/60 px-3 py-2 text-sm">
                <div className="font-medium">{log.action.replaceAll("_", " ")}</div>
                <div className="text-muted-foreground">
                  {log.user?.name ?? "Système"} · {formatRelative(log.createdAt)}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
