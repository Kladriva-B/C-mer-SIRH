import { format, formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

const TIME_ZONE = "Africa/Douala";

function toZonedDate(value: Date | string) {
  const date = typeof value === "string" ? new Date(value) : value;
  return new Date(date.toLocaleString("en-US", { timeZone: TIME_ZONE }));
}

export function formatDate(value: Date | string) {
  return format(toZonedDate(value), "d MMMM yyyy", { locale: fr });
}

export function formatDateTime(value: Date | string) {
  return format(toZonedDate(value), "d MMMM yyyy 'à' HH:mm", { locale: fr });
}

export function formatMonthYear(year: number, month: number) {
  return format(new Date(year, month - 1, 1), "MMMM yyyy", { locale: fr });
}

export function formatRelative(value: Date | string) {
  return formatDistanceToNow(toZonedDate(value), {
    addSuffix: true,
    locale: fr,
  });
}

export function formatSeniority(hiredAt: Date | string) {
  const start = toZonedDate(hiredAt);
  const now = toZonedDate(new Date());
  const months =
    (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
  const safeMonths = Math.max(0, months);
  if (safeMonths < 12) {
    return `${safeMonths} mois`;
  }
  const years = Math.floor(safeMonths / 12);
  const rest = safeMonths % 12;
  const yearLabel = years > 1 ? "ans" : "an";
  return rest ? `${years} ${yearLabel} ${rest} mois` : `${years} ${yearLabel}`;
}

export function toDateInputValue(value: Date | string) {
  const date = toZonedDate(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
