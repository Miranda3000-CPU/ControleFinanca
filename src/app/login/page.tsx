import { redirect } from "next/navigation";

import { LoginPageContent } from "@/components/login/login-page-content";
import { getSessionUser } from "@/lib/auth";

const loginErrorMessages: Record<string, string> = {
  dados_invalidos: "Preencha usuário e senha corretamente.",
  credenciais_invalidas: "Usuário ou senha inválidos.",
};

type LoginPageProps = {
  searchParams: Promise<{
    erro?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const user = await getSessionUser();

  if (user) {
    redirect("/dashboard");
  }

  const params = await searchParams;
  const errorMessage = params.erro ? loginErrorMessages[params.erro] : null;

  return <LoginPageContent errorMessage={errorMessage ?? null} />;
}
