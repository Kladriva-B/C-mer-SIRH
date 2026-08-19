import type { Metadata } from "next";
import { FileCheck } from "lucide-react";
import { ModuleHero } from "@/components/shared/module-hero";
import { CertificateForm } from "@/components/documents/certificate-form";
import { findEmployeeForUser } from "@/lib/auth/employee";
import { requirePermission } from "@/lib/auth/guards";
import { prisma } from "@/lib/db/prisma";

export const metadata: Metadata = { title: "Certificat de travail" };

export default async function CertificatesPage() {
  const user = await requirePermission("employees.write");
  const linked = await findEmployeeForUser(user);
  const employee = linked
    ? await prisma.employee.findUnique({
        where: { id: linked.id },
        include: { department: true, position: true },
      })
    : null;

  return (
    <div className="space-y-6">
      <ModuleHero
        icon={FileCheck}
        tone="info"
        title="Certificat de travail"
        description="Générez vos certificats et attestations en quelques clics."
      />
      <CertificateForm
        employee={
          employee
            ? {
                fullName: `${employee.firstName} ${employee.lastName}`,
                department: employee.department.name,
                position: employee.position.name,
                hiredAt: employee.hiredAt.toISOString(),
                matricule: employee.matricule,
              }
            : null
        }
      />
    </div>
  );
}
