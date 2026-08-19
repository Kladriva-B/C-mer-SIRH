import { CalendarDays } from "lucide-react";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LEAVE_KIND_LABELS, LEAVE_STATUS_LABELS } from "@/lib/constants/labels";
import { formatDate } from "@/lib/format/date";
import { decideLeaveAction } from "@/app/(dashboard)/leaves/actions";
import type { LeaveKind, LeaveStatus } from "@prisma/client";

type LeaveCardItem = {
  id: string;
  kind: LeaveKind;
  status: LeaveStatus;
  days: number;
  startDate: Date;
  endDate: Date;
  reason: string | null;
  employee?: { firstName: string; lastName: string };
};

export function LeaveCards({ items, canApprove = false }: { items: LeaveCardItem[]; canApprove?: boolean }) {
  if (!items.length) {
    return <p className="ui-surface p-8 text-center text-sm text-muted-foreground">Aucune demande de congé.</p>;
  }

  return (
    <div className="grid gap-3 md:grid-cols-2">
      {items.map((leave) => (
        <Card key={leave.id}>
          <CardContent className="space-y-4 p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <span className="flex size-10 items-center justify-center rounded-xl bg-info/10 text-info">
                  <CalendarDays className="size-4" />
                </span>
                <div>
                  <p className="font-semibold">{LEAVE_KIND_LABELS[leave.kind]}</p>
                  {leave.employee ? (
                    <p className="text-sm text-muted-foreground">
                      {leave.employee.firstName} {leave.employee.lastName}
                    </p>
                  ) : null}
                </div>
              </div>
              <StatusBadge value={leave.status} label={LEAVE_STATUS_LABELS[leave.status]} />
            </div>
            <p className="text-sm font-medium">{leave.days} jour(s)</p>
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold tracking-wide">
              <div className="rounded-2xl bg-muted/80 px-3 py-2.5">DU {formatDate(leave.startDate)}</div>
              <div className="rounded-2xl bg-muted/80 px-3 py-2.5">AU {formatDate(leave.endDate)}</div>
            </div>
            {leave.reason ? <p className="text-sm text-muted-foreground">{leave.reason}</p> : null}
            {canApprove && leave.status === "PENDING" ? (
              <div className="flex gap-2">
                <form action={decideLeaveAction.bind(null, leave.id, "APPROVED")}>
                  <Button type="submit" size="sm">
                    Approuver
                  </Button>
                </form>
                <form action={decideLeaveAction.bind(null, leave.id, "REJECTED")}>
                  <Button type="submit" size="sm" variant="outline">
                    Refuser
                  </Button>
                </form>
              </div>
            ) : null}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
