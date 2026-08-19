import { Suspense } from "react";
import type { Metadata } from "next";
import { LoginForm } from "@/app/(auth)/login/login-form";
import { DemoAccounts } from "@/components/landing/demo-accounts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/logo";

export const metadata: Metadata = {
  title: "Connexion",
};

export default function LoginPage() {
  return (
    <Card>
      <CardHeader>
        <div className="mb-3 lg:hidden">
          <Logo withSubtitle />
        </div>
        <CardTitle className="text-xl font-bold">Connexion</CardTitle>
        <CardDescription>Accédez à votre espace de gestion RH.</CardDescription>
      </CardHeader>
      <CardContent>
        <Suspense>
          <LoginForm />
        </Suspense>
        <div className="mt-6 rounded-2xl bg-muted/70 p-4">
          <p className="mb-3 text-sm font-semibold">Identifiants de démonstration</p>
          <DemoAccounts />
        </div>
      </CardContent>
    </Card>
  );
}
