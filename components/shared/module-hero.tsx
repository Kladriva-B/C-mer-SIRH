import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SECTOR_TONE, type SectorTone } from "@/components/shared/sector";

export function ModuleHero({
  icon: Icon,
  title,
  description,
  action,
  tone = "primary",
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: { href: string; label: string };
  tone?: SectorTone;
}) {
  return (
    <section className="ui-surface flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <span className={cn("flex size-9 items-center justify-center rounded-xl", SECTOR_TONE[tone])}>
          <Icon className="size-4" />
        </span>
        <div>
          <h1 className="text-lg font-bold tracking-tight">{title}</h1>
          <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      {action ? (
        <Button className="shrink-0" render={<Link href={action.href} />}>
          {action.label}
        </Button>
      ) : null}
    </section>
  );
}
