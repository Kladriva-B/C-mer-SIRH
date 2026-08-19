import { Files } from "lucide-react";
import { getDocumentTypes, listDocuments } from "@/lib/services/document.service";
import { PageHeader } from "@/components/shared/page-header";
import { Pagination } from "@/components/shared/pagination";
import { FilterBar } from "@/components/shared/filter-bar";
import { DocumentsTable } from "@/components/documents/table";
import { DocumentUploadForm } from "@/components/documents/upload-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default async function DocumentsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; typeId?: string; page?: string }>;
}) {
  const params = await searchParams;
  const [{ items, total, page, pageSize }, types] = await Promise.all([
    listDocuments({ query: params.q, typeId: params.typeId, page: Number(params.page ?? 1) }),
    getDocumentTypes(),
  ]);
  const query = new URLSearchParams();
  if (params.q) query.set("q", params.q);
  if (params.typeId) query.set("typeId", params.typeId);
  const href = `/documents${query.toString() ? `?${query.toString()}` : ""}`;

  return (
    <div className="space-y-6">
      <PageHeader icon={Files} tone="info" title="Documents" description="Catégories, téléversement, aperçu et vérification." />
      <DocumentUploadForm types={types} />
      <FilterBar>
        <Input name="q" placeholder="Rechercher" defaultValue={params.q} />
        <select name="typeId" defaultValue={params.typeId} className="ui-control">
          <option value="">Toutes les catégories</option>
          {types.map((type) => (
            <option key={type.id} value={type.id}>{type.name}</option>
          ))}
        </select>
        <Button type="submit">Filtrer</Button>
      </FilterBar>
      <DocumentsTable data={items} />
      <Pagination page={page} total={total} pageSize={pageSize} href={href} />
    </div>
  );
}
