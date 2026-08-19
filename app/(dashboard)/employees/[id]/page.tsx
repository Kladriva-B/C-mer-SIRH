import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchEmployee } from "@/lib/services/employee.service";
import { EmployeeSpace } from "@/components/profile/employee-space";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { deleteEmployeeAction } from "@/app/(dashboard)/employees/actions";
import { requireUser } from "@/lib/auth/guards";
import { contextHasPermission, canViewCompensation } from "@/lib/auth/access";

export const metadata: Metadata = {
  title: "Profil employé",
};

export default async function EmployeeProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireUser();
  const { id } = await params;
  const employee = await fetchEmployee(id).catch(() => null);
  if (!employee) notFound();

  return (
    <div className="space-y-4">
      {contextHasPermission(user, "employees.delete") ? (
        <div className="flex justify-end">
          <ConfirmDialog
            title="Supprimer cet employé ?"
            description="Cette action est irréversible."
            triggerLabel="Supprimer"
            onConfirm={() => deleteEmployeeAction(employee.id)}
          />
        </div>
      ) : null}
      <EmployeeSpace
        employee={employee}
        showSecurity={employee.userId === user.id}
        canViewCompensation={canViewCompensation(user, employee.id)}
        editableHref={contextHasPermission(user, "employees.write") ? `/employees/${employee.id}/edit` : undefined}
      />
    </div>
  );
}
