"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SANCTION_STATUS_LABELS } from "@/lib/constants/labels";
import { createSanctionAction } from "@/app/(dashboard)/sanctions/actions";

export function SanctionForm({
  employees,
  types,
}: {
  employees: Array<{ id: string; firstName: string; lastName: string; matricule: string }>;
  types: Array<{ id: string; name: string }>;
}) {
  const [state, formAction, pending] = useActionState(
    async (_prev: { error?: string } | undefined, formData: FormData) => createSanctionAction(formData),
    undefined,
  );

  return (
    <form action={formAction} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Nouvelle sanction</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="employeeId">Employé</Label>
            <select id="employeeId" name="employeeId" required className="ui-control">
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.firstName} {employee.lastName} · {employee.matricule}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="typeId">Type</Label>
            <select id="typeId" name="typeId" required className="ui-control">
              {types.map((type) => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input id="date" name="date" type="date" required />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="reason">Motif</Label>
            <Input id="reason" name="reason" required />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="durationDays">Durée (jours)</Label>
            <Input id="durationDays" name="durationDays" type="number" min={0} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Statut</Label>
            <select id="status" name="status" className="ui-control">
              {Object.entries(SANCTION_STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="comment">Commentaire</Label>
            <Textarea id="comment" name="comment" />
          </div>
        </CardContent>
      </Card>
      {state?.error ? <p className="text-sm text-destructive">{state.error}</p> : null}
      <div className="flex justify-end">
        <Button type="submit" disabled={pending}>{pending ? "Enregistrement..." : "Enregistrer"}</Button>
      </div>
    </form>
  );
}
