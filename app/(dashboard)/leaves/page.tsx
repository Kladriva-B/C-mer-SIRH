import type { Metadata } from "next";
import { Ban, CalendarDays, CircleCheck, CircleX, Clock3, TreePalm } from "lucide-react";
import { ModuleHero } from "@/components/shared/module-hero";
import { StatCard } from "@/components/shared/stat-card";
import { LeaveCards } from "@/components/leaves/cards";
import { listLeaves } from "@/lib/services/hr-modules.service";
import { requirePermission } from "@/lib/auth/guards";
import { contextHasPermission } from "@/lib/auth/access";

export const metadata: Metadata = { title: "Gestion des congés" };

export default async function LeavesPage() {
  const user = await requirePermission("employees.read");
  const leaves = await listLeaves();
  const stats = {
    total: leaves.length,
    pending: leaves.filter((item) => item.status === "PENDING").length,
    approved: leaves.filter((item) => item.status === "APPROVED").length,
    rejected: leaves.filter((item) => item.status === "REJECTED").length,
    cancelled: leaves.filter((item) => item.status === "CANCELLED").length,
  };

  return (
    <div className="space-y-6">
      <ModuleHero
        icon={CalendarDays}
        tone="info"
        title="Gestion des congés"
        description="Suivi et validation des demandes de congé."
      />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard icon={TreePalm} title="Total" value={stats.total} tone="info" />
        <StatCard icon={Clock3} title="En attente" value={stats.pending} tone="warning" />
        <StatCard icon={CircleCheck} title="Approuvés" value={stats.approved} tone="success" />
        <StatCard icon={CircleX} title="Rejetés" value={stats.rejected} tone="destructive" />
        <StatCard icon={Ban} title="Annulés" value={stats.cancelled} />
      </div>
      <p className="text-sm text-muted-foreground">{leaves.length} demande(s) trouvée(s)</p>
      <LeaveCards items={leaves} canApprove={contextHasPermission(user, "leaves.approve")} />
    </div>
  );
}
