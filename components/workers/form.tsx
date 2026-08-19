"use client";

import { useActionState } from "react";
import { CONTRACT_TYPE_LABELS, GENDER_LABELS, WORKER_STATUS_LABELS } from "@/lib/constants/labels";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createWorkerAction, updateWorkerAction } from "@/app/(dashboard)/workers/actions";
import { toDateInputValue } from "@/lib/format/date";

type Option = { id: string; name: string };

export function WorkerForm({
  sites,
  positions,
  worker,
}: {
  sites: Option[];
  positions: Option[];
  worker?: {
    id: string;
    firstName: string;
    lastName: string;
    email?: string | null;
    phone?: string | null;
    dateOfBirth?: Date | null;
    gender?: keyof typeof GENDER_LABELS | null;
    address?: string | null;
    matricule: string;
    positionId: string;
    siteId: string;
    assignment?: string | null;
    contractType: keyof typeof CONTRACT_TYPE_LABELS;
    hiredAt: Date;
    dailyRate: number;
    status: keyof typeof WORKER_STATUS_LABELS;
  };
}) {
  const action = worker ? updateWorkerAction.bind(null, worker.id) : createWorkerAction;
  const [state, formAction, pending] = useActionState(
    async (_prev: { error?: string } | undefined, formData: FormData) => action(formData),
    undefined,
  );

  return (
    <form action={formAction} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Identité et affectation</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Field label="Prénom" name="firstName" defaultValue={worker?.firstName} required />
          <Field label="Nom" name="lastName" defaultValue={worker?.lastName} required />
          <Field label="E-mail" name="email" type="email" defaultValue={worker?.email ?? ""} />
          <Field label="Téléphone" name="phone" defaultValue={worker?.phone ?? ""} />
          <Field label="Matricule" name="matricule" defaultValue={worker?.matricule} required />
          <SelectField label="Poste" name="positionId" options={positions} defaultValue={worker?.positionId} />
          <SelectField label="Site" name="siteId" options={sites} defaultValue={worker?.siteId} />
          <Field label="Affectation" name="assignment" defaultValue={worker?.assignment ?? ""} />
          <SelectField
            label="Contrat"
            name="contractType"
            options={Object.entries(CONTRACT_TYPE_LABELS).map(([id, name]) => ({ id, name }))}
            defaultValue={worker?.contractType}
          />
          <Field label="Date d'embauche" name="hiredAt" type="date" defaultValue={worker ? toDateInputValue(worker.hiredAt) : ""} required />
          <Field label="Taux journalier (FCFA)" name="dailyRate" type="number" defaultValue={worker?.dailyRate ?? ""} required />
          <SelectField
            label="Statut"
            name="status"
            options={Object.entries(WORKER_STATUS_LABELS).map(([id, name]) => ({ id, name }))}
            defaultValue={worker?.status ?? "ACTIVE"}
          />
        </CardContent>
      </Card>
      {state?.error ? <p className="text-sm text-destructive">{state.error}</p> : null}
      <div className="flex justify-end">
        <Button type="submit" disabled={pending}>{pending ? "Enregistrement..." : "Enregistrer"}</Button>
      </div>
    </form>
  );
}

function Field(props: { label: string; name: string; type?: string; defaultValue?: string | number; required?: boolean }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={props.name}>{props.label}</Label>
      <Input id={props.name} name={props.name} type={props.type ?? "text"} defaultValue={props.defaultValue} required={props.required} />
    </div>
  );
}

function SelectField({ label, name, options, defaultValue }: { label: string; name: string; options: Option[]; defaultValue?: string }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <select id={name} name={name} defaultValue={defaultValue} required className="ui-control">
        {options.map((option) => (
          <option key={option.id} value={option.id}>{option.name}</option>
        ))}
      </select>
    </div>
  );
}
