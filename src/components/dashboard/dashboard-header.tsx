type DashboardHeaderProps = {
  userName: string;
  logoutAction: () => Promise<void>;
};

export function DashboardHeader({ userName, logoutAction }: DashboardHeaderProps) {
  return (
    <header className="rounded-3xl border border-emerald-300 bg-white/90 p-6 shadow-[0_0_40px_rgba(0,255,136,0.12)]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Dashboard Financeiro v2</p>
          <h1 className="text-2xl font-bold text-emerald-950 sm:text-3xl">Controle de Finanças</h1>
          <p className="text-sm text-emerald-800">Conectado como {userName}</p>
        </div>
        <form action={logoutAction}>
          <button
            type="submit"
            className="rounded-xl border border-emerald-400 bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-900 transition hover:bg-emerald-200"
          >
            Sair
          </button>
        </form>
      </div>
    </header>
  );
}
