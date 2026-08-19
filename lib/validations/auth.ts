import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Adresse e-mail invalide"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
  remember: z.boolean().optional(),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Adresse e-mail invalide"),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(8, "Le mot de passe actuel est requis"),
    newPassword: z.string().min(8, "Le nouveau mot de passe doit contenir au moins 8 caractères"),
    confirmPassword: z.string().min(8, "Confirmez le mot de passe"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
