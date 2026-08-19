import { cn } from "@/lib/utils";

export function Logo({
  className,
  compact = false,
  inverted = false,
  withSubtitle = false,
}: {
  className?: string;
  compact?: boolean;
  inverted?: boolean;
  withSubtitle?: boolean;
}) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <span
        className={cn(
          "flex size-9 items-center justify-center rounded-xl text-sm font-bold shadow-sm",
          inverted
            ? "bg-white text-primary"
            : "bg-primary text-primary-foreground",
        )}
      >
        CS
      </span>
      {!compact ? (
        <span className="min-w-0">
          <span
            className={cn(
              "block text-[15px] leading-tight font-bold tracking-tight",
              inverted ? "text-white" : "text-foreground",
            )}
          >
            Camer SIRH
          </span>
          {withSubtitle ? (
            <span
              className={cn(
                "mt-0.5 block text-[10px] font-semibold tracking-[0.12em] uppercase",
                inverted ? "text-white/70" : "text-muted-foreground",
              )}
            >
              Gestion des ressources humaines
            </span>
          ) : null}
        </span>
      ) : null}
    </div>
  );
}
