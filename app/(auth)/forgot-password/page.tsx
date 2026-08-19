"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema } from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const form = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mot de passe oublié</CardTitle>
        <CardDescription>
          Saisissez votre e-mail. Un administrateur pourra réinitialiser votre accès.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {sent ? (
          <p className="text-sm text-success">
            Si un compte existe pour cet e-mail, la demande a été enregistrée.
          </p>
        ) : (
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit(() => setSent(true))}
          >
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" {...form.register("email")} />
            </div>
            <Button type="submit" className="w-full">
              Envoyer la demande
            </Button>
          </form>
        )}
        <Button variant="link" className="mt-4 px-0" render={<Link href="/login" />}>
          Retour à la connexion
        </Button>
      </CardContent>
    </Card>
  );
}
