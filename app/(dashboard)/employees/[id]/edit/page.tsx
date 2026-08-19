import { notFound } from "next/navigation";
import { Pencil } from "lucide-react";
import { fetchEmployee, getEmployeeFormOptions } from "@/lib/services/employee.service";
import { EmployeeForm } from "@/components/employees/form";
import { PageHeader } from "@/components/shared/page-header";

export default async function EditEmployeePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [employee, options] = await Promise.all([
    fetchEmployee(id).catch(() => null),
    getEmployeeFormOptions(),
  ]);
  if (!employee) notFound();

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Pencil}
        title="Modifier l'employé"
        description={`${employee.firstName} ${employee.lastName} · ${employee.matricule}`}
      />
      <EmployeeForm departments={options.departments} positions={options.positions} employee={employee} />
    </div>
  );
}
