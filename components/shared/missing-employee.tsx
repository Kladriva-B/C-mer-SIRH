import Link from "next/link";
import { UserRoundX } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MissingEmployeeState({
  title = "Dossier employé introuvable",
  description = "Ce compte n'est pas encore lié à une fiche employé. Déconnectez-vous puis reconnectez-vous avec un compte de démonstration.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="ui-surface flex flex-col items-center p-8 text-center">
      <span className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-warning/10 text-warning">
        <UserRoundX className="size-6" />
      </span>
      <h1 className="text-lg font-semibold">{title}</h1>
      <p className="mx-auto mt-2 max-w-lg text-sm text-muted-foreground">{description}</p>
      <div className="mt-4">
        <Button render={<Link href="/login" />}>Aller à la connexion</Button>
      </div>
    </div>
  );
}
