"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { createSession, getAdminCredentials } from "@/lib/auth";

const loginSchema = z.object({
  userName: z.string().trim().min(1),
  password: z.string().min(6),
});

function readField(formData: FormData, key: string) {
  const rawValue = formData.get(key);
  return typeof rawValue === "string" ? rawValue.trim() : "";
}

function redirectWithError(errorCode: string): never {
  redirect(`/login?erro=${errorCode}`);
}

export async function loginAction(formData: FormData) {
  const parsed = loginSchema.safeParse({
    userName: readField(formData, "userName"),
    password: readField(formData, "password"),
  });

  if (!parsed.success) {
    redirectWithError("dados_invalidos");
  }

  const admin = getAdminCredentials();

  if (
    parsed.data.userName !== admin.userName ||
    parsed.data.password !== admin.password
  ) {
    redirectWithError("credenciais_invalidas");
  }

  await createSession(admin.userName);
  redirect("/dashboard");
}
