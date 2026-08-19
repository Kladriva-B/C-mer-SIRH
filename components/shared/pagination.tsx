import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Pagination({
  page,
  total,
  pageSize,
  href,
}: {
  page: number;
  total: number;
  pageSize: number;
  href: string;
}) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  if (pages <= 1) return null;
  const previous = Math.max(1, page - 1);
  const next = Math.min(pages, page + 1);
  const separator = href.includes("?") ? "&" : "?";

  return (
    <div className="ui-surface mt-4 flex items-center justify-between px-4 py-3 text-sm text-muted-foreground">
      <span>
        Page {page} sur {pages}
      </span>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" disabled={page <= 1} render={<Link href={`${href}${separator}page=${previous}`} />}>
          Précédent
        </Button>
        <Button variant="outline" size="sm" disabled={page >= pages} render={<Link href={`${href}${separator}page=${next}`} />}>
          Suivant
        </Button>
      </div>
    </div>
  );
}
