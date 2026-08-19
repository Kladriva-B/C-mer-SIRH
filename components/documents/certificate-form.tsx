"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatDate } from "@/lib/format/date";

const TYPES = [
  { id: "work", label: "Certificat de travail" },
  { id: "attestation", label: "Attestation de travail" },
  { id: "internship", label: "Attestation de stage" },
] as const;

export function CertificateForm({
  employee,
}: {
  employee: {
    fullName: string;
    department: string;
    position: string;
    hiredAt: string;
    matricule: string;
  } | null;
}) {
  const [type, setType] = useState<(typeof TYPES)[number]["id"]>("work");
  const [signer, setSigner] = useState("");
  const [reason, setReason] = useState("");
  const [endDate, setEndDate] = useState("");
  const preview = useMemo(() => {
    if (!employee) return "";
    const end = endDate ? formatDate(endDate) : "à ce jour";
    return `${employee.fullName}, matricule ${employee.matricule}, a occupé le poste de ${employee.position} au sein du département ${employee.department} depuis le ${formatDate(employee.hiredAt)} jusqu'${endDate ? "au " + end : "à ce jour"}.`;
  }, [employee, endDate]);

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
      <Card>
        <CardHeader>
          <CardTitle>Générer un document</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!employee ? (
            <p className="text-sm text-muted-foreground">Aucun dossier employé n&apos;est lié à ce compte.</p>
          ) : (
            <>
              <div className="grid gap-3 sm:grid-cols-3">
                {TYPES.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setType(item.id)}
                    className={`rounded-2xl p-3 text-left text-sm ${
                      type === item.id ? "bg-primary text-primary-foreground" : "bg-muted/80 hover:bg-muted"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <div className="space-y-2">
                <Label htmlFor="signer">Responsable RH signataire</Label>
                <Input id="signer" value={signer} onChange={(event) => setSigner(event.target.value)} placeholder="Nom du responsable RH" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reason">Motif de la demande (optionnel)</Label>
                <Textarea id="reason" value={reason} onChange={(event) => setReason(event.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">Date de fin de contrat</Label>
                <Input id="endDate" type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} />
              </div>
              <p className="rounded-2xl bg-success/10 p-3 text-sm font-medium text-success">
                Le document sera généré en PDF via l&apos;impression du navigateur.
              </p>
              <Button
                type="button"
                disabled={!signer}
                onClick={() => window.print()}
              >
                Générer / imprimer
              </Button>
            </>
          )}
        </CardContent>
      </Card>
      <Card className="print:shadow-none">
        <CardHeader>
          <CardTitle>Prévisualisation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-7">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Camer SIRH</p>
          <h2 className="text-lg font-semibold">{TYPES.find((item) => item.id === type)?.label}</h2>
          <p>{preview || "Les informations de votre dossier apparaîtront ici."}</p>
          {reason ? <p>Motif : {reason}</p> : null}
          <p>Fait à Douala, le {formatDate(new Date())}.</p>
          <p className="pt-8">{signer || "________________"}</p>
          <p className="text-muted-foreground">Responsable RH</p>
        </CardContent>
      </Card>
    </div>
  );
}
