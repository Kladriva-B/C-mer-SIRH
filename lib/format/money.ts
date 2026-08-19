const formatter = new Intl.NumberFormat("fr-FR", {
  maximumFractionDigits: 0,
});

export function formatFcfa(amount: number) {
  return `${formatter.format(amount)} FCFA`;
}
