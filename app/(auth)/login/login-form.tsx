"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { toast } from "sonner";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", remember: true },
  });

  return (
    <form
      className="space-y-4"
      onSubmit={form.handleSubmit((values) => {
        setError(null);
        startTransition(async () => {
          const result = await signIn("credentials", {
            email: values.email,
            password: values.password,
            remember: String(Boolean(values.remember)),
            redirect: false,
          });
          if (result?.error) {
            setError("E-mail ou mot de passe incorrect.");
            toast.error("Connexion impossible");
            return;
          }
          toast.success("Connexion réussie");
          router.push(searchParams.get("callbackUrl") || "/dashboard");
          router.refresh();
        });
      })}
    >
      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input id="email" type="email" autoComplete="email" {...form.register("email")} />
        {form.formState.errors.email ? (
          <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
        ) : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Mot de passe</Label>
        <Input id="password" type="password" autoComplete="current-password" {...form.register("password")} />
        {form.formState.errors.password ? (
          <p className="text-xs text-destructive">{form.formState.errors.password.message}</p>
        ) : null}
      </div>
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm">
          <Checkbox
            defaultChecked
            onCheckedChange={(checked) => form.setValue("remember", Boolean(checked))}
          />
          Se souvenir de moi
        </label>
        <Link href="/forgot-password" className="text-sm text-primary hover:underline">
          Mot de passe oublié
        </Link>
      </div>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Connexion..." : "Se connecter"}
      </Button>
    </form>
  );
}
