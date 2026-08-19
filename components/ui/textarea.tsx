import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-24 w-full rounded-xl border-0 bg-muted/80 px-3 py-3 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:ring-2 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/40",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
