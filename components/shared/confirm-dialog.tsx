"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toUserMessage } from "@/lib/errors";

export function ConfirmDialog({
  title,
  description,
  triggerLabel,
  confirmLabel = "Supprimer",
  confirmAction,
  id,
}: {
  title: string;
  description: string;
  triggerLabel: string;
  confirmLabel?: string;
  confirmAction: (id: string) => Promise<void>;
  id: string;
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="destructive" size="sm" />}>
        {triggerLabel}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Annuler
          </Button>
          <Button
            variant="destructive"
            disabled={pending}
            onClick={() => {
              startTransition(async () => {
                try {
                  await confirmAction(id);
                  toast.success("Action effectuée");
                  setOpen(false);
                } catch (error) {
                  toast.error(toUserMessage(error));
                }
              });
            }}
          >
            {pending ? "Suppression..." : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
