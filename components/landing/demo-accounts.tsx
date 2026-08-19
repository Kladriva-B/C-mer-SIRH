import { DEMO_ACCOUNTS, DEMO_PASSWORD } from "@/lib/constants/demo-accounts";

export function DemoAccounts({ inverted = false }: { inverted?: boolean }) {
  const muted = inverted ? "text-white/55" : "text-muted-foreground";
  const strong = inverted ? "text-white" : "text-foreground";
  const row = inverted ? "bg-white/10" : "bg-muted/80";

  return (
    <div>
      <p className={`text-sm ${muted}`}>
        Mot de passe commun : <span className={`font-medium ${strong}`}>{DEMO_PASSWORD}</span>
      </p>
      <ul className="mt-3 space-y-2">
        {DEMO_ACCOUNTS.map((account) => (
          <li
            key={account.email}
            className={`flex flex-col gap-0.5 rounded-2xl px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between ${row}`}
          >
            <span className={`text-sm font-medium ${strong}`}>{account.role}</span>
            <code className={`text-xs ${muted}`}>{account.email}</code>
          </li>
        ))}
      </ul>
    </div>
  );
}
