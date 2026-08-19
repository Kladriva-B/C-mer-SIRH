import { getEmployeeFormOptions } from "@/lib/services/employee.service";
import { EmployeeForm } from "@/components/employees/form";
import { PageHeader } from "@/components/shared/page-header";
import { Users } from "lucide-react";

export default async function NewEmployeePage() {
  const options = await getEmployeeFormOptions();
  return (
    <div className="space-y-6">
      <PageHeader
        icon={Users}
        title="Nouvel employé"
        description="Renseignez les informations personnelles, professionnelles et les documents."
      />
      <EmployeeForm departments={options.departments} positions={options.positions} />
    </div>
  );
}
