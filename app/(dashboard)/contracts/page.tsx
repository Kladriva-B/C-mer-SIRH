import type { Metadata } from "next";
import { FileClock, FileSignature, Files } from "lucide-react";
import { ModuleHero } from "@/components/shared/module-hero";
import { StatCard } from "@/components/shared/stat-card";
import { ContractList } from "@/components/contracts/list";
import { listContracts } from "@/lib/services/hr-modules.service";
import { differenceInCalendarDays } from "date-fns";

export const metadata: Metadata = { title: "Contrats" };

export default async function ContractsPage() {
  const contracts = await listContracts();
  const now = new Date();
  const active = contracts.filter((item) => item.status === "ACTIVE").length;
  const expiring = contracts.filter((item) => {
    if (!item.endDate || item.status !== "ACTIVE") return false;
    const days = differenceInCalendarDays(item.endDate, now);
    return days >= 0 && days <= 14;
  }).length;

  return (
    <div className="space-y-6">
      <ModuleHero
        icon={FileSignature}
        title="Gestion des contrats"
        description="Gérez les contrats des employés, suivez les échéances et renouvellements."
      />
      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard icon={Files} title="Total contrats" value={contracts.length} />
        <StatCard icon={FileSignature} title="Actifs" value={active} tone="success" />
        <StatCard icon={FileClock} title="Expirant (14j)" value={expiring} tone="warning" />
      </div>
      <p className="text-sm text-muted-foreground">{contracts.length} contrat(s)</p>
      <ContractList contracts={contracts} />
    </div>
  );
}
