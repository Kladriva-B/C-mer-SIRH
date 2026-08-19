import type { Metadata } from "next";
import { Send } from "lucide-react";
import { ModuleHero } from "@/components/shared/module-hero";
import { MissingEmployeeState } from "@/components/shared/missing-employee";
import { LeaveRequestForm } from "@/components/leaves/request-form";
import { getMyLeaveContext } from "@/lib/services/hr-modules.service";

export const metadata: Metadata = { title: "Nouvelle demande" };

export default async function NewLeavePage() {
  const employee = await getMyLeaveContext();
  if (!employee) {
    return <MissingEmployeeState />;
  }
  return (
    <div className="space-y-6">
      <ModuleHero
        icon={Send}
        tone="info"
        title="Nouvelle demande"
        description="Remplissez le formulaire pour envoyer une demande de congé."
      />
      <LeaveRequestForm balance={employee.leaveBalance} />
    </div>
  );
}
