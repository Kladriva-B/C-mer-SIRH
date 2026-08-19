import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const TONE_ICON: Record<string, string> = {
  default: "bg-primary/10 text-primary",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  destructive: "bg-destructive/10 text-destructive",
  info: "bg-info/10 text-info",
};

export function StatCard({
  title,
  value,
  hint,
  href,
  tone = "default",
  icon: Icon,
}: {
  title: string;
  value: string | number;
  hint?: string;
  href?: string;
  tone?: "default" | "success" | "warning" | "destructive" | "info";
  icon?: LucideIcon;
}) {
  const content = (
    <article className="ui-surface flex items-start gap-3 p-4 transition-transform hover:-translate-y-0.5">
      {Icon ? (
        <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl", TONE_ICON[tone])}>
          <Icon className="size-4" />
        </span>
      ) : null}
      <div className="min-w-0">
        <p className="text-[11px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">{title}</p>
        <p
          className={cn(
            "mt-1 truncate text-xl font-bold tracking-tight",
            tone === "success" && "text-success",
            tone === "warning" && "text-warning",
            tone === "destructive" && "text-destructive",
            tone === "info" && "text-info",
          )}
        >
          {value}
        </p>
        {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
      </div>
    </article>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {content}
      </Link>
    );
  }

  return content;
}
