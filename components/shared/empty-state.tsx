import Link from "next/link";
import { FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: { href: string; label: string };
}) {
  return (
    <div className="ui-surface flex flex-col items-center justify-center px-6 py-16 text-center">
      <span className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <FileQuestion className="size-6" />
      </span>
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mt-1 max-w-md text-sm text-muted-foreground">{description}</p>
      {action ? (
        <Button className="mt-4" render={<Link href={action.href} />}>
          {action.label}
        </Button>
      ) : null}
    </div>
  );
}
