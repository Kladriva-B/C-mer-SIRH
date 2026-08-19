"use client";

import Link from "next/link";
import type { LegacyColumnDef } from "@tanstack/react-table/legacy";
import { DataTable } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Button } from "@/components/ui/button";
import { WORKER_STATUS_LABELS } from "@/lib/constants/labels";
import { deleteWorkerAction } from "@/app/(dashboard)/workers/actions";

export type WorkerRow = {
  id: string;
  firstName: string;
  lastName: string;
  matricule: string;
  assignment: string | null;
  status: keyof typeof WORKER_STATUS_LABELS;
  position: { name: string };
  site: { name: string };
};

function buildColumns(canDelete: boolean): LegacyColumnDef<WorkerRow, unknown>[] {
  return [
    {
      header: "Ouvrier",
      cell: ({ row }) => (
        <Link href={`/workers/${row.original.id}`} className="font-medium">
          {row.original.firstName} {row.original.lastName}
        </Link>
      ),
    },
    { header: "Matricule", accessorKey: "matricule" },
    { header: "Poste", accessorFn: (row) => row.position.name },
    { header: "Site", accessorFn: (row) => row.site.name },
    { header: "Affectation", accessorFn: (row) => row.assignment ?? "—" },
    {
      header: "Statut",
      cell: ({ row }) => (
        <StatusBadge value={row.original.status} label={WORKER_STATUS_LABELS[row.original.status]} />
      ),
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button size="sm" variant="outline" render={<Link href={`/workers/${row.original.id}`} />}>
            Voir
          </Button>
          {canDelete ? (
            <ConfirmDialog
              title="Supprimer cet ouvrier ?"
              description="Cette action est irréversible."
              triggerLabel="Supprimer"
              confirmAction={deleteWorkerAction}
              id={row.original.id}
            />
          ) : null}
        </div>
      ),
    },
  ];
}

export function WorkersTable({
  data,
  canDelete = false,
  canCreate = false,
}: {
  data: WorkerRow[];
  canDelete?: boolean;
  canCreate?: boolean;
}) {
  return (
    <DataTable
      columns={buildColumns(canDelete)}
      data={data}
      emptyTitle="Aucun ouvrier"
      emptyDescription="Vous n'avez encore enregistré aucun ouvrier."
      emptyAction={canCreate ? { href: "/workers/new", label: "Ajouter un ouvrier" } : undefined}
    />
  );
}
