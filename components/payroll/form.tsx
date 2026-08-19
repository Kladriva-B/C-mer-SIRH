"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { generatePayrollAction } from "@/app/(dashboard)/payroll/actions";

export function PayrollForm({
  employees,
}: {
  employees: Array<{ id: string; firstName: string; lastName: string; matricule: string; salaryAmount: number }>;
}) {
  const now = new Date();
  const [state, formAction, pending] = useActionState(
    async (_prev: { error?: string } | undefined, formData: FormData) => generatePayrollAction(formData),
    undefined,
  );

  return (
    <form action={formAction} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Générer un bulletin</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="employeeId">Employé</Label>
            <select id="employeeId" name="employeeId" required className="ui-control">
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.firstName} {employee.lastName} · {formatSalary(employee.salaryAmount)}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="periodMonth">Mois</Label>
            <Input id="periodMonth" name="periodMonth" type="number" min={1} max={12} defaultValue={now.getMonth() + 1} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="periodYear">Année</Label>
            <Input id="periodYear" name="periodYear" type="number" defaultValue={now.getFullYear()} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="grossAmount">Salaire de base (FCFA)</Label>
            <Input id="grossAmount" name="grossAmount" type="number" defaultValue={employees[0]?.salaryAmount ?? 0} required />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" name="notes" />
          </div>
        </CardContent>
      </Card>
      {state?.error ? <p className="text-sm text-destructive">{state.error}</p> : null}
      <div className="flex justify-end">
        <Button type="submit" disabled={pending}>{pending ? "Génération..." : "Générer"}</Button>
      </div>
    </form>
  );
}

function formatSalary(value: number) {
  return `${value.toLocaleString("fr-FR")} FCFA`;
}
