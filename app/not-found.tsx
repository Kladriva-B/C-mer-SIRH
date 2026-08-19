import Link from "next/link";
import { FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background p-6 text-center">
      <Logo withSubtitle />
      <div className="ui-surface max-w-md p-8">
        <span className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <FileQuestion className="size-6" />
        </span>
        <h1 className="text-lg font-semibold">Page introuvable</h1>
        <p className="mt-2 text-sm text-muted-foreground">Cette ressource n&apos;existe pas ou a été déplacée.</p>
        <Button className="mt-5" render={<Link href="/dashboard" />}>
          Retour au tableau de bord
        </Button>
      </div>
    </div>
  );
}
