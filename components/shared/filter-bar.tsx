import { cn } from "@/lib/utils";

export function FilterBar({
  children,
  columns = 3,
}: {
  children: React.ReactNode;
  columns?: 3 | 4;
}) {
  return (
    <form
      className={cn(
        "ui-surface grid gap-3 p-4",
        columns === 4 ? "sm:grid-cols-4" : "sm:grid-cols-3",
      )}
    >
      {children}
    </form>
  );
}
