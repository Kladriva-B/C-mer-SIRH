"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Dialog, DialogContent } from "@/components/ui/dialog";

type SearchResult = {
  employees: Array<{ id: string; firstName: string; lastName: string; matricule: string }>;
  workers: Array<{ id: string; firstName: string; lastName: string; matricule: string }>;
  documents: Array<{ id: string; name: string }>;
  sanctions: Array<{ id: string; reason: string }>;
  payrolls: Array<{ id: string; employee: { firstName: string; lastName: string } }>;
};

export function CommandPalette({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult | null>(null);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        onOpenChange(true);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onOpenChange]);

  useEffect(() => {
    if (!open || query.trim().length < 2) {
      return;
    }
    const timeout = window.setTimeout(async () => {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      if (response.ok) {
        setResults((await response.json()) as SearchResult);
      }
    }, 200);
    return () => window.clearTimeout(timeout);
  }, [open, query]);

  function go(href: string) {
    onOpenChange(false);
    router.push(href);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 sm:max-w-lg" showCloseButton={false}>
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Rechercher un employé, un document, une sanction..."
            value={query}
            onValueChange={setQuery}
          />
          <CommandList>
            <CommandEmpty>Aucun résultat.</CommandEmpty>
            <CommandGroup heading="Navigation">
              <CommandItem onSelect={() => go("/me")}>Mon espace</CommandItem>
              <CommandItem onSelect={() => go("/dashboard")}>Tableau de bord</CommandItem>
            </CommandGroup>
            {results?.employees.length ? (
              <CommandGroup heading="Employés">
                {results.employees.map((item) => (
                  <CommandItem key={item.id} onSelect={() => go(`/employees/${item.id}`)}>
                    {item.firstName} {item.lastName} · {item.matricule}
                  </CommandItem>
                ))}
              </CommandGroup>
            ) : null}
            {results?.workers.length ? (
              <CommandGroup heading="Ouvriers">
                {results.workers.map((item) => (
                  <CommandItem key={item.id} onSelect={() => go(`/workers/${item.id}`)}>
                    {item.firstName} {item.lastName} · {item.matricule}
                  </CommandItem>
                ))}
              </CommandGroup>
            ) : null}
            {results?.documents.length ? (
              <CommandGroup heading="Documents">
                {results.documents.map((item) => (
                  <CommandItem key={item.id} onSelect={() => go("/documents")}>
                    {item.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            ) : null}
            {results?.sanctions.length ? (
              <CommandGroup heading="Sanctions">
                {results.sanctions.map((item) => (
                  <CommandItem key={item.id} onSelect={() => go("/sanctions")}>
                    {item.reason}
                  </CommandItem>
                ))}
              </CommandGroup>
            ) : null}
            {results?.payrolls.length ? (
              <CommandGroup heading="Bulletins">
                {results.payrolls.map((item) => (
                  <CommandItem key={item.id} onSelect={() => go(`/payroll/${item.id}`)}>
                    {item.employee.firstName} {item.employee.lastName}
                  </CommandItem>
                ))}
              </CommandGroup>
            ) : null}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
