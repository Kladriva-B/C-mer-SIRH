"use client";

import { CircleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 p-6 text-center">
      <div className="ui-surface max-w-md p-8">
        <span className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
          <CircleAlert className="size-6" />
        </span>
        <h1 className="text-lg font-semibold">Une erreur est survenue</h1>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          Le détail technique a été enregistré. Vous pouvez réessayer.
        </p>
        <Button className="mt-5" onClick={reset}>
          Réessayer
        </Button>
      </div>
    </div>
  );
}
