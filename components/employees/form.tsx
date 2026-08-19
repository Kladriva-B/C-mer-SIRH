"use client";

import { useActionState } from "react";
import { CONTRACT_TYPE_LABELS, EMPLOYEE_STATUS_LABELS, GENDER_LABELS } from "@/lib/constants/labels";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createEmployeeAction, updateEmployeeAction } from "@/app/(dashboard)/employees/actions";
import { toDateInputValue } from "@/lib/format/date";

type Option = { id: string; name: string };

type EmployeeValues = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  dateOfBirth?: Date | null;
  gender?: keyof typeof GENDER_LABELS | null;
  address?: string | null;
  matricule: string;
  departmentId: string;
  positionId: string;
  contractType: keyof typeof CONTRACT_TYPE_LABELS;
  hiredAt: Date;
  salaryAmount: number;
  cnps?: string | null;
  status: keyof typeof EMPLOYEE_STATUS_LABELS;
};

export function EmployeeForm({
  departments,
  positions,
  employee,
}: {
  departments: Option[];
  positions: Option[];
  employee?: EmployeeValues & { id: string };
}) {
  const action = employee
    ? updateEmployeeAction.bind(null, employee.id)
    : createEmployeeAction;
  const [state, formAction, pending] = useActionState(
    async (_prev: { error?: string } | undefined, formData: FormData) => action(formData),
    undefined,
  );

  return (
    <form action={formAction} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informations personnelles</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Field label="Prénom" name="firstName" defaultValue={employee?.firstName} required />
          <Field label="Nom" name="lastName" defaultValue={employee?.lastName} required />
          <Field label="E-mail" name="email" type="email" defaultValue={employee?.email} required />
          <Field label="Téléphone" name="phone" defaultValue={employee?.phone ?? ""} />
          <Field
            label="Date de naissance"
            name="dateOfBirth"
            type="date"
            defaultValue={employee?.dateOfBirth ? toDateInputValue(employee.dateOfBirth) : ""}
          />
          <div className="space-y-2">
            <Label htmlFor="gender">Sexe</Label>
            <select id="gender" name="gender" defaultValue={employee?.gender ?? ""} className="ui-control">
              <option value="">Non renseigné</option>
              {Object.entries(GENDER_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2 space-y-2">
            <Label htmlFor="address">Adresse</Label>
            <Textarea id="address" name="address" defaultValue={employee?.address ?? ""} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Informations professionnelles</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Field label="Matricule" name="matricule" defaultValue={employee?.matricule} required />
          <SelectField label="Département" name="departmentId" options={departments} defaultValue={employee?.departmentId} />
          <SelectField label="Poste" name="positionId" options={positions} defaultValue={employee?.positionId} />
          <SelectField
            label="Type de contrat"
            name="contractType"
            options={Object.entries(CONTRACT_TYPE_LABELS).map(([id, name]) => ({ id, name }))}
            defaultValue={employee?.contractType}
          />
          <Field label="Date d'embauche" name="hiredAt" type="date" defaultValue={employee ? toDateInputValue(employee.hiredAt) : ""} required />
          <Field label="Salaire (FCFA)" name="salaryAmount" type="number" defaultValue={employee?.salaryAmount ?? ""} required />
          <Field label="CNPS" name="cnps" defaultValue={employee?.cnps ?? ""} />
          <SelectField
            label="Statut"
            name="status"
            options={Object.entries(EMPLOYEE_STATUS_LABELS).map(([id, name]) => ({ id, name }))}
            defaultValue={employee?.status ?? "ACTIVE"}
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Documents</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Field label="Pièce d'identité" name="identityDocument" type="file" />
          <Field label="Contrat" name="contractDocument" type="file" />
          <Field label="Photo" name="photo" type="file" />
          <Field label="Justificatifs" name="attachments" type="file" />
        </CardContent>
      </Card>
      {state?.error ? <p className="text-sm text-destructive">{state.error}</p> : null}
      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  defaultValue,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string | number;
  required?: boolean;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} type={type} defaultValue={defaultValue} required={required} />
    </div>
  );
}

function SelectField({
  label,
  name,
  options,
  defaultValue,
}: {
  label: string;
  name: string;
  options: Option[];
  defaultValue?: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <select id={name} name={name} defaultValue={defaultValue} required className="ui-control">
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
  );
}
