"use client";

import Link from "next/link";
import type { LegacyColumnDef } from "@tanstack/react-table/legacy";
import { DataTable } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Button } from "@/components/ui/button";
import { PAYROLL_STATUS_LABELS } from "@/lib/constants/labels";
import { formatFcfa } from "@/lib/format/money";
import { formatMonthYear } from "@/lib/format/date";
import { deletePayrollAction } from "@/app/(dashboard)/payroll/actions";

export type PayrollRow = {
  id: string;
  periodYear: number;
  periodMonth: number;
  grossAmount: number;
  deductions: number;
  netAmount: number;
  status: keyof typeof PAYROLL_STATUS_LABELS;
  employee: { firstName: string; lastName: string };
};

const columns: LegacyColumnDef<PayrollRow, unknown>[] = [
  { header: "Employé", accessorFn: (row) => `${row.employee.firstName} ${row.employee.lastName}` },
  { header: "Période", accessorFn: (row) => formatMonthYear(row.periodYear, row.periodMonth) },
  { header: "Brut", accessorFn: (row) => formatFcfa(row.grossAmount) },
  { header: "Retenues", accessorFn: (row) => formatFcfa(row.deductions) },
  { header: "Net", accessorFn: (row) => formatFcfa(row.netAmount) },
  {
    header: "Statut",
    cell: ({ row }) => (
      <StatusBadge value={row.original.status} label={PAYROLL_STATUS_LABELS[row.original.status]} />
    ),
  },
  {
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex gap-2">
        <Button size="sm" variant="outline" render={<Link href={`/payroll/${row.original.id}`} />}>
          Consulter
        </Button>
        <ConfirmDialog
          title="Supprimer ce bulletin ?"
          description="Cette action est irréversible."
          triggerLabel="Supprimer"
          onConfirm={() => deletePayrollAction(row.original.id)}
        />
      </div>
    ),
  },
];

export function PayrollTable({ data }: { data: PayrollRow[] }) {
  return (
    <DataTable
      columns={columns}
      data={data}
      emptyTitle="Aucun bulletin"
      emptyDescription="Aucun bulletin de paie n'a encore été généré."
      emptyAction={{ href: "/payroll/new", label: "Générer un bulletin" }}
    />
  );
}
