import type { ChartRow } from "@/components/dashboard/types";
import { formatCurrencyFromCents } from "@/components/dashboard/utils";

type MonthlyOverviewChartProps = {
  rows: ChartRow[];
};

export function MonthlyOverviewChart({ rows }: MonthlyOverviewChartProps) {
  const maxChartValue = Math.max(1, ...rows.flatMap((row) => [row.spent, row.earned]));

  return (
    <section className="rounded-3xl border border-emerald-300 bg-white p-4 shadow-[0_10px_30px_rgba(0,255,136,0.08)] sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-semibold text-emerald-950">Gráfico mensal (últimos 6 meses)</h2>
        <p className="text-xs text-emerald-700">Barras verdes: ganhos | barras vermelhas: gastos</p>
      </div>

      <div className="space-y-3">
        {rows.map((row) => {
          const spentWidth = `${Math.max(3, Math.round((row.spent / maxChartValue) * 100))}%`;
          const earnedWidth = `${Math.max(3, Math.round((row.earned / maxChartValue) * 100))}%`;

          return (
            <div key={row.label} className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-3">
              <div className="mb-2 flex items-center justify-between text-xs">
                <span className="font-semibold uppercase text-emerald-800">{row.label}</span>
                <span className="text-emerald-700">{formatCurrencyFromCents(row.earned - row.spent)}</span>
              </div>

              <div className="space-y-2">
                <div>
                  <div className="mb-1 flex items-center justify-between text-[11px] text-emerald-800">
                    <span>Ganhos</span>
                    <span>{formatCurrencyFromCents(row.earned)}</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-emerald-100">
                    <div className="h-full rounded-full bg-emerald-500" style={{ width: row.earned > 0 ? earnedWidth : "0%" }} />
                  </div>
                </div>
                <div>
                  <div className="mb-1 flex items-center justify-between text-[11px] text-emerald-800">
                    <span>Gastos</span>
                    <span>{formatCurrencyFromCents(row.spent)}</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-rose-100">
                    <div className="h-full rounded-full bg-rose-500" style={{ width: row.spent > 0 ? spentWidth : "0%" }} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
