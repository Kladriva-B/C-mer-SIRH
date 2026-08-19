import { Wallet } from "lucide-react";
import { getPayrollFormOptions } from "@/lib/services/payroll.service";
import { PayrollForm } from "@/components/payroll/form";
import { PageHeader } from "@/components/shared/page-header";

export default async function NewPayrollPage() {
  const options = await getPayrollFormOptions();
  return (
    <div className="space-y-6">
      <PageHeader
        icon={Wallet}
        tone="success"
        title="Nouveau bulletin"
        description="Générez un bulletin de paie pour un collaborateur."
      />
      <PayrollForm employees={options.employees} />
    </div>
  );
}
