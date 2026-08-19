import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CalendarDays,
  HardHat,
  Hash,
  MapPin,
  Pencil,
  Phone,
  Wallet,
} from "lucide-react";
import { getWorker } from "@/lib/services/worker.service";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { CONTRACT_TYPE_LABELS, WORKER_STATUS_LABELS } from "@/lib/constants/labels";
import { formatDate } from "@/lib/format/date";
import { formatFcfa } from "@/lib/format/money";
import { getInitials } from "@/lib/utils";
import { deleteWorkerAction } from "@/app/(dashboard)/workers/actions";

export default async function WorkerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const worker = await getWorker(id).catch(() => null);
  if (!worker) notFound();
  const fullName = `${worker.firstName} ${worker.lastName}`;

  return (
    <div className="space-y-5">
      <section className="ui-surface p-6 md:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex shrink-0 flex-col items-center gap-2">
              <Avatar className="size-24 after:hidden">
                <AvatarFallback className="bg-warning text-2xl font-semibold text-warning-foreground">
                  {getInitials(fullName)}
                </AvatarFallback>
              </Avatar>
              <StatusBadge value={worker.status} label={WORKER_STATUS_LABELS[worker.status]} />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-3xl font-bold tracking-tight">{fullName}</h1>
                <Badge variant="secondary" className="h-6 rounded-full px-2.5 text-[11px] font-medium">
                  Ouvrier
                </Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{worker.position.name}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="ui-chip">
                  <Hash className="size-3.5 text-warning" />
                  {worker.matricule}
                </span>
                <span className="ui-chip">
                  <HardHat className="size-3.5 text-warning" />
                  {CONTRACT_TYPE_LABELS[worker.contractType]}
                </span>
                <span className="ui-chip">
                  <MapPin className="size-3.5 text-warning" />
                  {worker.site.name}
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button render={<Link href={`/workers/${worker.id}/edit`} />}>
              <Pencil className="size-3.5" />
              Modifier
            </Button>
            <ConfirmDialog
              title="Supprimer cet ouvrier ?"
              description="Cette action est irréversible."
              triggerLabel="Supprimer"
              onConfirm={() => deleteWorkerAction(worker.id)}
            />
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { icon: Hash, label: "Matricule", value: worker.matricule },
          { icon: MapPin, label: "Site", value: worker.site.name },
          { icon: CalendarDays, label: "Entrée", value: formatDate(worker.hiredAt) },
          { icon: Wallet, label: "Taux journalier", value: formatFcfa(Number(worker.dailyRate)) },
        ].map((item) => (
          <article key={item.label} className="ui-surface flex items-start gap-3 p-4">
            <span className="flex size-10 items-center justify-center rounded-xl bg-warning/10 text-warning">
              <item.icon className="size-4" />
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">{item.label}</p>
              <p className="mt-1 truncate text-base font-semibold">{item.value}</p>
            </div>
          </article>
        ))}
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Informations de chantier</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          {[
            ["Affectation", worker.assignment ?? "—"],
            ["Contrat", CONTRACT_TYPE_LABELS[worker.contractType]],
            ["Téléphone", worker.phone ?? "—"],
            ["Poste", worker.position.name],
          ].map(([label, value]) => (
            <div key={label} className="space-y-1.5">
              <p className="text-sm font-medium">{label}</p>
              <div className="ui-well flex items-center gap-2">
                {label === "Téléphone" ? <Phone className="size-3.5 text-muted-foreground" /> : null}
                {value}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
