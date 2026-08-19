"use client";

import { flexRender } from "@tanstack/react-table";
import {
  getCoreRowModel,
  getSortedRowModel,
  useLegacyTable,
} from "@tanstack/react-table/legacy";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/components/shared/empty-state";
import { Skeleton } from "@/components/ui/skeleton";

export function DataTable<TData>({
  columns,
  data,
  loading,
  emptyTitle,
  emptyDescription,
  emptyAction,
}: {
  columns: unknown[];
  data: TData[];
  loading?: boolean;
  emptyTitle: string;
  emptyDescription: string;
  emptyAction?: { href: string; label: string };
}) {
  const table = useLegacyTable({
    data: data as never,
    columns: columns as never,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-10 w-full" />
        ))}
      </div>
    );
  }

  if (!data.length) {
    return <EmptyState title={emptyTitle} description={emptyDescription} action={emptyAction} />;
  }

  return (
    <div className="overflow-hidden rounded-3xl bg-surface shadow-sm ring-1 ring-foreground/5">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
