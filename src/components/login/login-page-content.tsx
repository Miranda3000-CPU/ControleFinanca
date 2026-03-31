import { loginAction } from "@/app/login/actions";
import { AlertMessage } from "@/components/alert-message";

type LoginPageContentProps = {
  errorMessage: string | null;
};

export function LoginPageContent({ errorMessage }: LoginPageContentProps) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[linear-gradient(145deg,#f7fff8_0%,#ffffff_40%,#d7ffe6_100%)] p-6 text-emerald-950">
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" aria-hidden="true" />

      <section className="relative z-10 grid w-full max-w-4xl gap-6 lg:grid-cols-2">
        <article className="rounded-3xl border border-emerald-300 bg-white/90 p-8 shadow-[0_0_40px_rgba(0,255,136,0.12)]">
          <span className="inline-flex rounded-full border border-emerald-300 bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-emerald-800">
            Uso Pessoal
          </span>
          <h1 className="mt-4 text-3xl font-bold leading-tight text-emerald-950 sm:text-4xl">
            Painel privado de controle financeiro.
          </h1>
          <p className="mt-4 text-sm leading-7 text-emerald-900 sm:text-base">
            Este projeto usa login único definido no{" "}
            <code className="rounded bg-emerald-100 px-1 py-0.5 font-mono text-emerald-800">.env</code>, ideal para uso individual e sem cadastro de outros
            usuários.
          </p>
        </article>

        <article className="space-y-4 rounded-3xl border border-emerald-300 bg-white/90 p-6 shadow-[0_0_40px_rgba(0,255,136,0.12)]">
          {errorMessage ? <AlertMessage variant="error">{errorMessage}</AlertMessage> : null}

          <div className="rounded-2xl border border-emerald-300 bg-white p-5">
            <h2 className="text-lg font-semibold text-emerald-950">Entrar</h2>
            <form action={loginAction} className="mt-4 space-y-3">
              <label className="block text-sm text-emerald-900">
                Usuário
                <input
                  type="text"
                  name="userName"
                  placeholder="admin"
                  required
                  className="mt-1 w-full rounded-lg border border-emerald-300 bg-white px-3 py-2 text-sm text-emerald-950 outline-none transition focus:border-emerald-500"
                />
              </label>
              <label className="block text-sm text-emerald-900">
                Senha
                <input
                  type="password"
                  name="password"
                  minLength={6}
                  required
                  className="mt-1 w-full rounded-lg border border-emerald-300 bg-white px-3 py-2 text-sm text-emerald-950 outline-none transition focus:border-emerald-500"
                />
              </label>
              <button
                type="submit"
                className="w-full rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600"
              >
                Entrar no dashboard
              </button>
            </form>
          </div>
        </article>
      </section>
    </main>
  );
}
