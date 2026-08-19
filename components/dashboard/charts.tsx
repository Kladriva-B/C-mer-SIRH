"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Bar,
  BarChart,
  Line,
  LineChart,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatFcfa } from "@/lib/format/money";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CONTRACT_TYPE_LABELS } from "@/lib/constants/labels";

const COLORS = ["var(--primary)", "var(--brand-secondary)", "var(--accent)", "var(--success)", "var(--warning)"];
const SANCTION_COLORS = ["#c2410c", "#dc2626", "#7f1d1d", "#f97316"];

function withMonth<T extends { label: string }>(items: T[]) {
  return items.map((item) => ({
    ...item,
    month: format(new Date(item.label), "MMM", { locale: fr }),
  }));
}

export function DashboardCharts({
  employeeTrend,
  leaveTrend,
  explanationTrend,
  performanceTrend,
  payrollTrend,
  departments,
  contracts,
  sanctions,
}: {
  employeeTrend: Array<{ label: string; count: number }>;
  leaveTrend: Array<{ label: string; count: number }>;
  explanationTrend: Array<{ label: string; count: number }>;
  performanceTrend: Array<{ label: string; count: number }>;
  payrollTrend: Array<{ label: string; amount: number }>;
  departments: Array<{ name: string; value: number }>;
  contracts: Array<{ name: string; value: number }>;
  sanctions: Array<{ name: string; value: number }>;
}) {
  const employees = withMonth(employeeTrend);
  const leaves = withMonth(leaveTrend);
  const explanations = withMonth(explanationTrend);
  const performance = withMonth(performanceTrend);
  const payrolls = withMonth(payrollTrend);
  const contractSlices = contracts.map((item) => ({
    ...item,
    name: CONTRACT_TYPE_LABELS[item.name as keyof typeof CONTRACT_TYPE_LABELS] ?? item.name,
  }));

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <ChartCard title="Évolution des recrutements">
        <LineChart data={employees}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="month" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Line type="monotone" dataKey="count" stroke="var(--primary)" strokeWidth={2} />
        </LineChart>
      </ChartCard>
      <ChartCard title="Évolution des congés">
        <LineChart data={leaves}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="month" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Line type="monotone" dataKey="count" stroke="var(--brand-secondary)" strokeWidth={2} />
        </LineChart>
      </ChartCard>
      <ChartCard title="Répartition des contrats">
        <PieChart>
          <Pie data={contractSlices} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80}>
            {contractSlices.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ChartCard>
      <ChartCard title="Employés par département">
        <BarChart data={departments}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="value" fill="var(--primary)" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ChartCard>
      <ChartCard title="Demandes d'explication">
        <LineChart data={explanations}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="month" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Line type="monotone" dataKey="count" stroke="var(--warning)" strokeWidth={2} />
        </LineChart>
      </ChartCard>
      <ChartCard title="Répartition des sanctions">
        <PieChart>
          <Pie data={sanctions} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80}>
            {sanctions.map((_, index) => (
              <Cell key={index} fill={SANCTION_COLORS[index % SANCTION_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ChartCard>
      <ChartCard title="Évolution des performances">
        <LineChart data={performance}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="month" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Line type="monotone" dataKey="count" stroke="var(--accent)" strokeWidth={2} />
        </LineChart>
      </ChartCard>
      <ChartCard title="Masse salariale">
        <AreaChart data={payrolls}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="month" />
          <YAxis tickFormatter={(value: number) => `${Math.round(value / 1000)}k`} />
          <Tooltip formatter={(value) => formatFcfa(Number(value))} />
          <Area type="monotone" dataKey="amount" stroke="var(--accent)" fill="color-mix(in srgb, var(--accent) 18%, white)" />
        </AreaChart>
      </ChartCard>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactElement }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
