"use client";

import { useActionState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { uploadDocumentAction } from "@/app/(dashboard)/documents/actions";

export function DocumentUploadForm({
  types,
}: {
  types: Array<{ id: string; name: string }>;
}) {
  const [state, formAction, pending] = useActionState(
    async (_prev: { error?: string; ok?: boolean } | undefined, formData: FormData) => {
      const result = await uploadDocumentAction(formData);
      if (result.ok) toast.success("Document téléversé");
      return result;
    },
    undefined,
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Téléverser un document</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Nom</Label>
            <Input id="name" name="name" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="typeId">Type</Label>
            <select id="typeId" name="typeId" required className="ui-control">
              {types.map((type) => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="file">Fichier</Label>
            <Input id="file" name="file" type="file" required />
          </div>
          {state?.error ? <p className="text-sm text-destructive sm:col-span-2">{state.error}</p> : null}
          <div className="sm:col-span-2 flex justify-end">
            <Button type="submit" disabled={pending}>{pending ? "Téléversement..." : "Téléverser"}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
