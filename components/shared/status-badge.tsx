import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const TONES: Record<string, string> = {
  ACTIVE: "bg-success/10 text-success",
  GENERATED: "bg-success/10 text-success",
  PAID: "bg-success/10 text-success",
  VALID: "bg-success/10 text-success",
  PENDING: "bg-warning/10 text-warning",
  DRAFT: "bg-warning/10 text-warning",
  ON_LEAVE: "bg-info/10 text-info",
  CLOSED: "bg-muted text-muted-foreground",
  CANCELLED: "bg-muted text-muted-foreground",
  APPROVED: "bg-success/10 text-success",
  REJECTED: "bg-destructive/10 text-destructive",
  ARCHIVED: "bg-muted text-muted-foreground",
  INACTIVE: "bg-muted text-muted-foreground",
  SUSPENDED: "bg-destructive/10 text-destructive",
  TERMINATED: "bg-destructive/10 text-destructive",
  ERROR: "bg-destructive/10 text-destructive",
  INVALID: "bg-destructive/10 text-destructive",
  EXPIRED: "bg-destructive/10 text-destructive",
  NOT_FOUND: "bg-destructive/10 text-destructive",
};

export function StatusBadge({ value, label }: { value: string; label: string }) {
  return (
    <Badge variant="outline" className={cn("h-6 rounded-full border-transparent px-2.5", TONES[value] ?? "bg-muted")}>
      {label}
    </Badge>
  );
}
