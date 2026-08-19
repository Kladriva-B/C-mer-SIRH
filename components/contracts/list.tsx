"use client";

import { useState } from "react";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { StatusBadge } from "@/components/shared/status-badge";
import { CONTRACT_STATUS_LABELS, CONTRACT_TYPE_LABELS } from "@/lib/constants/labels";
import { formatDate } from "@/lib/format/date";
import { formatFcfa } from "@/lib/format/money";
import type { ContractStatus, ContractType } from "@prisma/client";

type ContractItem = {
  id: string;
  type: ContractType;
  status: ContractStatus;
  startDate: Date | string;
  endDate: Date | string | null;
  salaryAmount: number | null;
  netAmount: number | null;
  hourlyRate: number | null;
  weeklyHours: number | null;
  employee: { firstName: string; lastName: string; matricule: string } | null;
  worker: { firstName: string; lastName: string } | null;
};

export function ContractList({ contracts }: { contracts: ContractItem[] }) {
  const [selected, setSelected] = useState<ContractItem | null>(null);

  return (
    <>
      <div className="space-y-3">
        {contracts.map((contract) => {
          const person = contract.employee
            ? `${contract.employee.firstName} ${contract.employee.lastName}`
            : contract.worker
              ? `${contract.worker.firstName} ${contract.worker.lastName}`
              : "Inconnu";
          return (
            <Card key={contract.id}>
              <CardContent className="grid gap-3 p-5 sm:grid-cols-[1fr_1fr_auto_auto]">
                <div>
                  <p className="font-medium">{person}</p>
                  <p className="text-xs text-muted-foreground">{contract.employee?.matricule ?? "—"}</p>
                </div>
                <p className="text-sm">{CONTRACT_TYPE_LABELS[contract.type]}</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(contract.startDate)} → {contract.endDate ? formatDate(contract.endDate) : "Sans fin"}
                </p>
                <div className="flex items-center gap-2">
                  <StatusBadge value={contract.status} label={CONTRACT_STATUS_LABELS[contract.status]} />
                  <Button size="icon-sm" variant="outline" onClick={() => setSelected(contract)} aria-label="Voir">
                    <Eye className="size-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      <Dialog open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Détails du contrat</DialogTitle>
          </DialogHeader>
          {selected ? (
            <div className="space-y-4 text-sm">
              <Section title="Informations générales">
                <Row label="Type" value={CONTRACT_TYPE_LABELS[selected.type]} />
                <Row label="Statut" value={CONTRACT_STATUS_LABELS[selected.status]} />
                <Row label="Date de début" value={formatDate(selected.startDate)} />
                <Row label="Date de fin" value={selected.endDate ? formatDate(selected.endDate) : "Sans fin"} />
              </Section>
              <Section title="Employé">
                <Row
                  label="Nom"
                  value={
                    selected.employee
                      ? `${selected.employee.firstName} ${selected.employee.lastName}`
                      : selected.worker
                        ? `${selected.worker.firstName} ${selected.worker.lastName}`
                        : "—"
                  }
                />
                <Row label="Matricule" value={selected.employee?.matricule ?? "—"} />
              </Section>
              <Section title="Rémunération">
                {selected.salaryAmount != null || selected.netAmount != null ? (
                  <>
                    <Row label="Salaire brut" value={formatFcfa(selected.salaryAmount ?? 0)} />
                    <Row label="Salaire net" value={formatFcfa(selected.netAmount ?? 0)} />
                    <Row label="Taux horaire" value={formatFcfa(selected.hourlyRate ?? 0)} />
                    <Row label="Heures / semaine" value={String(selected.weeklyHours ?? 40)} />
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">Rémunération masquée.</p>
                )}
              </Section>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-muted/70 p-4">
      <p className="mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">{title}</p>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
