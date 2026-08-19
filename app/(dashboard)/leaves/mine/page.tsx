import type { Metadata } from "next";
import { CalendarDays, CircleCheck, CircleX, Clock3 } from "lucide-react";
import { ModuleHero } from "@/components/shared/module-hero";
import { StatCard } from "@/components/shared/stat-card";
import { LeaveCards } from "@/components/leaves/cards";
import { listMyLeaves } from "@/lib/services/hr-modules.service";

export const metadata: Metadata = { title: "Mes demandes" };

export default async function MyLeavesPage() {
  const leaves = await listMyLeaves();
  const stats = {
    total: leaves.length,
    pending: leaves.filter((item) => item.status === "PENDING").length,
    approved: leaves.filter((item) => item.status === "APPROVED").length,
    rejected: leaves.filter((item) => item.status === "REJECTED").length,
  };

  return (
    <div className="space-y-6">
      <ModuleHero
        icon={CalendarDays}
        tone="info"
        title="Mes demandes"
        description="Consultez et gérez toutes vos demandes de congé en un seul endroit."
        action={{ href: "/leaves/new", label: "Nouvelle demande" }}
      />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={CalendarDays} title="Total" value={stats.total} tone="info" />
        <StatCard icon={Clock3} title="En attente" value={stats.pending} tone="warning" />
        <StatCard icon={CircleCheck} title="Approuvés" value={stats.approved} tone="success" />
        <StatCard icon={CircleX} title="Rejetés" value={stats.rejected} tone="destructive" />
      </div>
      <LeaveCards items={leaves} />
    </div>
  );
}
