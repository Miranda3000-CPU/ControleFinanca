import { formatCurrencyFromCents } from "@/components/dashboard/utils";

type DashboardSummaryCardsProps = {
  totalItems: number;
  spent: number;
  earned: number;
  balance: number;
};

export function DashboardSummaryCards({
  totalItems,
  spent,
  earned,
  balance,
}: DashboardSummaryCardsProps) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <article className="rounded-2xl border border-emerald-300 bg-white p-4 shadow-[0_10px_30px_rgba(0,255,136,0.08)]">
        <p className="text-xs uppercase tracking-wide text-emerald-700">Resultados</p>
        <p className="text-2xl font-bold text-emerald-950">{totalItems}</p>
      </article>
      <article className="rounded-2xl border border-emerald-300 bg-white p-4 shadow-[0_10px_30px_rgba(0,255,136,0.08)]">
        <p className="text-xs uppercase tracking-wide text-emerald-700">Total gasto</p>
        <p className="text-2xl font-bold text-rose-700">{formatCurrencyFromCents(spent)}</p>
      </article>
      <article className="rounded-2xl border border-emerald-300 bg-white p-4 shadow-[0_10px_30px_rgba(0,255,136,0.08)]">
        <p className="text-xs uppercase tracking-wide text-emerald-700">Total ganho</p>
        <p className="text-2xl font-bold text-emerald-700">{formatCurrencyFromCents(earned)}</p>
      </article>
      <article className="rounded-2xl border border-emerald-300 bg-white p-4 shadow-[0_10px_30px_rgba(0,255,136,0.08)]">
        <p className="text-xs uppercase tracking-wide text-emerald-700">Saldo</p>
        <p className={`text-2xl font-bold ${balance >= 0 ? "text-emerald-700" : "text-rose-700"}`}>
          {formatCurrencyFromCents(balance)}
        </p>
      </article>
    </section>
  );
}
