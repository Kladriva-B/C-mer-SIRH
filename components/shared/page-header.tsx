import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SECTOR_TONE, type SectorTone } from "@/components/shared/sector";

export function PageHeader({
  title,
  description,
  action,
  icon: Icon,
  tone = "primary",
}: {
  title: string;
  description?: string;
  action?: { href: string; label: string };
  icon?: LucideIcon;
  tone?: SectorTone;
}) {
  return (
    <section className="ui-surface flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between md:p-7">
      <div className="flex items-start gap-4">
        {Icon ? (
          <span className={cn("flex size-12 items-center justify-center rounded-2xl", SECTOR_TONE[tone])}>
            <Icon className="size-5" />
          </span>
        ) : null}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
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
