"use client";

import { useActionState, useMemo, useState } from "react";
import Link from "next/link";
import { differenceInCalendarDays } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LEAVE_KIND_LABELS } from "@/lib/constants/labels";
import { createLeaveAction } from "@/app/(dashboard)/leaves/actions";

export function LeaveRequestForm({ balance }: { balance: number }) {
  const [state, formAction, pending] = useActionState(createLeaveAction, undefined);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const days = useMemo(() => {
    if (!startDate || !endDate) return 0;
    return Math.max(0, differenceInCalendarDays(new Date(endDate), new Date(startDate)) + 1);
  }, [startDate, endDate]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Faire une demande</CardTitle>
        <p className="text-sm text-muted-foreground">
          Remplissez le formulaire ci-dessous pour effectuer votre demande de congé.
        </p>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <div className="rounded-2xl bg-success/10 px-4 py-3 text-sm font-medium text-success">
            Solde disponible : {balance} jour(s)
          </div>
          <div className="space-y-2">
            <Label htmlFor="kind">Type de demande</Label>
            <select id="kind" name="kind" defaultValue="ANNUAL" className="ui-control">
              {Object.entries(LEAVE_KIND_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="startDate">Date de début</Label>
              <Input id="startDate" name="startDate" type="date" required value={startDate} onChange={(event) => setStartDate(event.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">Date de fin</Label>
              <Input id="endDate" name="endDate" type="date" required value={endDate} onChange={(event) => setEndDate(event.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Nombre de jours</Label>
            <Input readOnly value={days} />
            <p className="text-xs text-muted-foreground">Calculé automatiquement</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="reason">Motif / commentaire</Label>
            <Textarea id="reason" name="reason" />
          </div>
          {state?.error ? <p className="text-sm text-destructive">{state.error}</p> : null}
          <div className="flex justify-between">
            <Button variant="outline" render={<Link href="/leaves/mine" />}>Annuler</Button>
            <Button type="submit" disabled={pending || days < 1}>
              {pending ? "Envoi..." : "Envoyer la demande de congé"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
