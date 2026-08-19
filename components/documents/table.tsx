"use client";

import type { LegacyColumnDef } from "@tanstack/react-table/legacy";
import { DataTable } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Button } from "@/components/ui/button";
import { DOCUMENT_STATUS_LABELS } from "@/lib/constants/labels";
import { formatDate } from "@/lib/format/date";
import { deleteDocumentAction } from "@/app/(dashboard)/documents/actions";

export type DocumentRow = {
  id: string;
  name: string;
  sizeBytes: number;
  createdAt: Date;
  status: keyof typeof DOCUMENT_STATUS_LABELS;
  type: { name: string };
  employee: { firstName: string; lastName: string } | null;
  worker: { firstName: string; lastName: string } | null;
  storageKey: string;
};

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

const columns: LegacyColumnDef<DocumentRow, unknown>[] = [
  { header: "Nom", accessorKey: "name" },
  { header: "Type", accessorFn: (row) => row.type.name },
  {
    header: "Propriétaire",
    accessorFn: (row) =>
      row.employee
        ? `${row.employee.firstName} ${row.employee.lastName}`
        : row.worker
          ? `${row.worker.firstName} ${row.worker.lastName}`
          : "—",
  },
  { header: "Taille", accessorFn: (row) => formatSize(row.sizeBytes) },
  { header: "Date", accessorFn: (row) => formatDate(row.createdAt) },
  {
    header: "Statut",
    cell: ({ row }) => (
      <StatusBadge value={row.original.status} label={DOCUMENT_STATUS_LABELS[row.original.status]} />
    ),
  },
  {
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex gap-2">
        <Button size="sm" variant="outline" render={<a href={`/api/files/${row.original.storageKey}`} />}>
          Télécharger
        </Button>
        <ConfirmDialog
          title="Supprimer ce document ?"
          description="Cette action est irréversible."
          triggerLabel="Supprimer"
          confirmAction={deleteDocumentAction}
          id={row.original.id}
        />
      </div>
    ),
  },
];

export function DocumentsTable({ data }: { data: DocumentRow[] }) {
  return (
    <DataTable
      columns={columns}
      data={data}
      emptyTitle="Aucun document"
      emptyDescription="Aucun document n'a encore été téléversé."
    />
  );
}
