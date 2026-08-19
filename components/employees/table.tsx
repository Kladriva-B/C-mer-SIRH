"use client";

import type { LegacyColumnDef } from "@tanstack/react-table/legacy";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { EMPLOYEE_STATUS_LABELS } from "@/lib/constants/labels";
import { formatDate } from "@/lib/format/date";
import { getInitials } from "@/lib/utils";
import { deleteEmployeeAction } from "@/app/(dashboard)/employees/actions";

type EmployeeRow = {
  id: string;
  firstName: string;
  lastName: string;
  matricule: string;
  phone: string | null;
  hiredAt: Date;
  status: keyof typeof EMPLOYEE_STATUS_LABELS;
  position: { name: string };
  department: { name: string };
};

function buildColumns(canDelete: boolean): LegacyColumnDef<EmployeeRow, unknown>[] {
  return [
    {
      header: "Employé",
      accessorFn: (row) => `${row.firstName} ${row.lastName}`,
      cell: ({ row }) => (
        <Link href={`/employees/${row.original.id}`} className="flex items-center gap-2 font-medium">
          <Avatar size="sm">
            <AvatarFallback>{getInitials(`${row.original.firstName} ${row.original.lastName}`)}</AvatarFallback>
          </Avatar>
          {row.original.firstName} {row.original.lastName}
        </Link>
      ),
    },
    { header: "Matricule", accessorKey: "matricule" },
    { header: "Poste", accessorFn: (row) => row.position.name },
    { header: "Département", accessorFn: (row) => row.department.name },
    { header: "Téléphone", accessorFn: (row) => row.phone ?? "—" },
    {
      header: "Statut",
      cell: ({ row }) => (
        <StatusBadge value={row.original.status} label={EMPLOYEE_STATUS_LABELS[row.original.status]} />
      ),
    },
    { header: "Entrée", accessorFn: (row) => formatDate(row.hiredAt) },
    {
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button size="sm" variant="outline" render={<Link href={`/employees/${row.original.id}`} />}>
            Voir
          </Button>
          {canDelete ? (
            <ConfirmDialog
              title="Supprimer cet employé ?"
              description="Cette action est irréversible."
              triggerLabel="Supprimer"
              confirmAction={deleteEmployeeAction}
              id={row.original.id}
            />
          ) : null}
        </div>
      ),
    },
  ];
}

export function EmployeesTable({
  data,
  canDelete = false,
  canCreate = false,
}: {
  data: EmployeeRow[];
  canDelete?: boolean;
  canCreate?: boolean;
}) {
  return (
    <DataTable
      columns={buildColumns(canDelete)}
      data={data}
      emptyTitle="Aucun employé"
      emptyDescription="Vous n'avez encore enregistré aucun employé."
      emptyAction={canCreate ? { href: "/employees/new", label: "Ajouter un employé" } : undefined}
    />
  );
}
