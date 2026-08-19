import { notFound } from "next/navigation";
import { Pencil } from "lucide-react";
import { getWorker, getWorkerFormOptions } from "@/lib/services/worker.service";
import { WorkerForm } from "@/components/workers/form";
import { PageHeader } from "@/components/shared/page-header";

export default async function EditWorkerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [worker, options] = await Promise.all([
    getWorker(id).catch(() => null),
    getWorkerFormOptions(),
  ]);
  if (!worker) notFound();
  return (
    <div className="space-y-6">
      <PageHeader
        icon={Pencil}
        tone="warning"
        title="Modifier l'ouvrier"
        description={`${worker.firstName} ${worker.lastName} · ${worker.matricule}`}
      />
      <WorkerForm sites={options.sites} positions={options.positions} worker={worker} />
    </div>
  );
}
