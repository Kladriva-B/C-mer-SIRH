"use client";

import type { LegacyColumnDef } from "@tanstack/react-table/legacy";
import { DataTable } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { SANCTION_STATUS_LABELS } from "@/lib/constants/labels";
import { formatDate } from "@/lib/format/date";
import { deleteSanctionAction } from "@/app/(dashboard)/sanctions/actions";

export type SanctionRow = {
  id: string;
  reference: string;
  reason: string;
  date: Date;
  status: keyof typeof SANCTION_STATUS_LABELS;
  employee: { firstName: string; lastName: string };
  type: { name: string };
  issuer: { name: string } | null;
};

const columns: LegacyColumnDef<SanctionRow, unknown>[] = [
  { header: "Numéro", accessorKey: "reference" },
  { header: "Employé", accessorFn: (row) => `${row.employee.firstName} ${row.employee.lastName}` },
  { header: "Type", accessorFn: (row) => row.type.name },
  { header: "Motif", accessorKey: "reason" },
  { header: "Date", accessorFn: (row) => formatDate(row.date) },
  { header: "Responsable", accessorFn: (row) => row.issuer?.name ?? "—" },
  {
    header: "Statut",
    cell: ({ row }) => (
      <StatusBadge value={row.original.status} label={SANCTION_STATUS_LABELS[row.original.status]} />
    ),
  },
  {
    header: "Actions",
    cell: ({ row }) => (
      <ConfirmDialog
        title="Supprimer cette sanction ?"
        description="Cette action est irréversible."
        triggerLabel="Supprimer"
        confirmAction={deleteSanctionAction}
        id={row.original.id}
      />
    ),
  },
];

export function SanctionsTable({ data }: { data: SanctionRow[] }) {
  return (
    <DataTable
      columns={columns}
      data={data}
      emptyTitle="Aucune sanction"
      emptyDescription="Aucune sanction n'a encore été enregistrée."
      emptyAction={{ href: "/sanctions/new", label: "Créer une sanction" }}
    />
  );
}
