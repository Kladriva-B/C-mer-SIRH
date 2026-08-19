"use client";

import { useActionState, useTransition } from "react";
import { BadgeCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { changePasswordAction, toggleTwoFactorAction } from "@/app/(dashboard)/me/actions";

export function SecurityPanel({
  email,
  verified,
  twoFactorEnabled,
  roleLabel,
}: {
  email: string;
  verified: boolean;
  twoFactorEnabled: boolean;
  roleLabel: string;
}) {
  const [state, formAction, pending] = useActionState(changePasswordAction, undefined);
  const [toggling, startToggle] = useTransition();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Identifiants de connexion</h2>
        <p className="mt-1 text-sm text-muted-foreground">E-mail, mot de passe et vérification du compte.</p>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-muted/80 p-4">
        <div>
          <p className="text-xs text-muted-foreground">Adresse e-mail</p>
          <p className="mt-1 text-sm font-medium">{email}</p>
        </div>
        {verified ? (
          <Badge className="bg-success/10 text-success">
            <BadgeCheck className="size-3.5" />
            Vérifié
          </Badge>
        ) : (
          <Badge variant="outline">Non vérifié</Badge>
        )}
      </div>
      <form action={formAction} className="space-y-3 rounded-xl bg-muted/80 p-4">
        <p className="text-sm font-medium">Changer le mot de passe</p>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Actuel</Label>
            <Input id="currentPassword" name="currentPassword" type="password" required className="bg-surface" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPassword">Nouveau</Label>
            <Input id="newPassword" name="newPassword" type="password" required className="bg-surface" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmation</Label>
            <Input id="confirmPassword" name="confirmPassword" type="password" required className="bg-surface" />
          </div>
        </div>
        {state?.error ? <p className="text-sm text-destructive">{state.error}</p> : null}
        {state?.ok ? <p className="text-sm text-success">Mot de passe mis à jour.</p> : null}
        <Button type="submit" disabled={pending}>
          {pending ? "Enregistrement..." : "Changer"}
        </Button>
      </form>

      <div className="flex flex-col gap-3 rounded-xl bg-muted/80 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium">Authentification à deux facteurs</p>
          <p className="mt-1 max-w-xl text-sm text-muted-foreground">
            Protégez votre compte avec une validation supplémentaire à la connexion.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className={twoFactorEnabled ? "bg-success/10 text-success" : undefined} variant={twoFactorEnabled ? "default" : "outline"}>
            {twoFactorEnabled ? "Activé" : "Désactivé"}
          </Badge>
          <Switch
            checked={twoFactorEnabled}
            disabled={toggling}
            onCheckedChange={(checked) => {
              startToggle(async () => {
                const result = await toggleTwoFactorAction(checked);
                if (result?.error) toast.error(result.error);
              });
            }}
          />
        </div>
      </div>

      <div className="rounded-xl bg-muted/80 p-4">
        <p className="text-xs text-muted-foreground">Rôle</p>
        <p className="mt-1 text-sm font-medium">{roleLabel}</p>
      </div>
    </div>
  );
}
