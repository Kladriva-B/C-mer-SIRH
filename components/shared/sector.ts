export const SECTOR_TONE = {
  primary: "bg-primary/10 text-primary",
  warning: "bg-warning/10 text-warning",
  success: "bg-success/10 text-success",
  info: "bg-info/10 text-info",
  danger: "bg-destructive/10 text-destructive",
  violet: "bg-brand-secondary/10 text-brand-secondary",
} as const;

export type SectorTone = keyof typeof SECTOR_TONE;
