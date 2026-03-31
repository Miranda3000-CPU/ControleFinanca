import { categoryLabels, categoryOptions, paymentLabels, paymentOptions } from "@/components/dashboard/constants";

type DashboardFilterFormProps = {
  query: string;
  categoryFilter: string | null;
  paymentFilter: string | null;
};

export function DashboardFilterForm({
  query,
  categoryFilter,
  paymentFilter,
}: DashboardFilterFormProps) {
  return (
    <section className="rounded-3xl border border-emerald-300 bg-white p-4 shadow-[0_10px_30px_rgba(0,255,136,0.08)] sm:p-6">
      <form className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_220px_220px_auto]">
        <input
          type="text"
          name="q"
          defaultValue={query}
          placeholder="Buscar por produto"
          className="rounded-xl border border-emerald-300 bg-white px-3 py-2 text-sm text-emerald-950 outline-none focus:border-emerald-500"
        />

        <select
          name="category"
          defaultValue={categoryFilter ?? ""}
          className="rounded-xl border border-emerald-300 bg-white px-3 py-2 text-sm text-emerald-950 outline-none focus:border-emerald-500"
        >
          <option value="">Todas categorias</option>
          {categoryOptions.map((value) => (
            <option key={value} value={value}>
              {categoryLabels[value]}
            </option>
          ))}
        </select>

        <select
          name="paymentType"
          defaultValue={paymentFilter ?? ""}
          className="rounded-xl border border-emerald-300 bg-white px-3 py-2 text-sm text-emerald-950 outline-none focus:border-emerald-500"
        >
          <option value="">Todos pagamentos</option>
          {paymentOptions.map((value) => (
            <option key={value} value={value}>
              {paymentLabels[value]}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600"
        >
          Buscar
        </button>
      </form>
    </section>
  );
}
