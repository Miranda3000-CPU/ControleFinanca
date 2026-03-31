import { EntryType } from "@prisma/client";
import Link from "next/link";

import {
  categoryLabels,
  entryTypeLabels,
  paymentLabels,
} from "@/components/dashboard/constants";
import type { FilterParams, PurchaseListItem } from "@/components/dashboard/types";
import {
  formatCurrencyFromCents,
  formatDate,
} from "@/components/dashboard/utils";

type PurchasesHistoryProps = {
  purchases: PurchaseListItem[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
  filterParams: FilterParams;
  deletePurchaseAction: (formData: FormData) => Promise<void>;
  buildUrl: (params: {
    q?: string;
    category?: string;
    paymentType?: string;
    page?: string;
    edit?: string;
  }) => string;
};

export function PurchasesHistory({
  purchases,
  totalItems,
  currentPage,
  totalPages,
  filterParams,
  deletePurchaseAction,
  buildUrl,
}: PurchasesHistoryProps) {
  return (
    <article className="rounded-3xl border border-emerald-300 bg-white p-4 shadow-[0_10px_30px_rgba(0,255,136,0.08)] sm:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold text-emerald-950">Histórico de compras</h2>
        <p className="text-xs uppercase tracking-[0.15em] text-emerald-700">
          {purchases.length} de {totalItems}
        </p>
      </div>

      {purchases.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-emerald-300 bg-emerald-50 p-6 text-center text-sm text-emerald-800">
          Nenhum registro encontrado para os filtros atuais.
        </div>
      ) : (
        <>
          <div className="mt-4 hidden overflow-x-auto md:block">
            <table className="w-full border-separate border-spacing-y-2 text-sm text-emerald-950">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-emerald-800">
                  <th className="rounded-l-xl bg-emerald-100 px-4 py-3">Data</th>
                  <th className="bg-emerald-100 px-4 py-3">Produto</th>
                  <th className="bg-emerald-100 px-4 py-3">Categoria</th>
                  <th className="bg-emerald-100 px-4 py-3">Pagamento</th>
                  <th className="bg-emerald-100 px-4 py-3">Tipo</th>
                  <th className="bg-emerald-100 px-4 py-3">Valor</th>
                  <th className="bg-emerald-100 px-4 py-3">Comprovante</th>
                  <th className="rounded-r-xl bg-emerald-100 px-4 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {purchases.map((purchase) => {
                  const receiptDataUrl =
                    purchase.receiptBase64 && purchase.receiptMimeType
                      ? `data:${purchase.receiptMimeType};base64,${purchase.receiptBase64}`
                      : null;

                  return (
                    <tr
                      key={purchase.id}
                      className="overflow-hidden rounded-xl bg-white shadow-[0_6px_20px_rgba(0,255,136,0.08)]"
                    >
                      <td className="rounded-l-xl border border-emerald-200 px-4 py-3 align-top">
                        {formatDate(purchase.purchaseDate)}
                      </td>
                      <td className="border-y border-emerald-200 px-4 py-3 font-semibold">
                        {purchase.product}
                      </td>
                      <td className="border-y border-emerald-200 px-4 py-3">
                        {categoryLabels[purchase.category]}
                      </td>
                      <td className="border-y border-emerald-200 px-4 py-3">
                        {paymentLabels[purchase.paymentType]}
                      </td>
                      <td className="border-y border-emerald-200 px-4 py-3">
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-semibold ${
                            purchase.entryType === EntryType.GASTO
                              ? "bg-rose-100 text-rose-700"
                              : "bg-emerald-100 text-emerald-700"
                          }`}
                        >
                          {entryTypeLabels[purchase.entryType]}
                        </span>
                      </td>
                      <td className="border-y border-emerald-200 px-4 py-3 font-semibold">
                        {formatCurrencyFromCents(purchase.amountInCents)}
                      </td>
                      <td className="border-y border-emerald-200 px-4 py-3">
                        {receiptDataUrl ? (
                          <a
                            href={receiptDataUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-lg bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-800"
                          >
                            {purchase.receiptMimeType?.startsWith("image/")
                              ? "Ver imagem"
                              : "Abrir PDF"}
                          </a>
                        ) : (
                          <span className="text-xs text-emerald-700">Sem comprovante</span>
                        )}
                      </td>
                      <td className="rounded-r-xl border border-emerald-200 px-4 py-3 text-right align-top">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={buildUrl({
                              ...filterParams,
                              page: String(currentPage),
                              edit: purchase.id,
                            })}
                            className="rounded-lg border border-emerald-300 px-3 py-1 text-xs font-semibold text-emerald-900 hover:bg-emerald-100"
                          >
                            Editar
                          </Link>

                          <details className="group relative inline-block text-left">
                            <summary className="list-none cursor-pointer rounded-lg border border-rose-300 px-3 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-50">
                              Excluir
                            </summary>
                            <div className="absolute right-0 top-8 z-10 w-44 rounded-lg border border-rose-300 bg-white p-2 shadow-lg">
                              <p className="text-[11px] text-rose-700">Confirmar exclusão?</p>
                              <form action={deletePurchaseAction} className="mt-2">
                                <input type="hidden" name="purchaseId" value={purchase.id} />
                                <button
                                  type="submit"
                                  className="w-full rounded-md bg-rose-600 px-2 py-1 text-xs font-semibold text-white hover:bg-rose-700"
                                >
                                  Confirmar
                                </button>
                              </form>
                            </div>
                          </details>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-4 grid gap-3 md:hidden">
            {purchases.map((purchase) => {
              const receiptDataUrl =
                purchase.receiptBase64 && purchase.receiptMimeType
                  ? `data:${purchase.receiptMimeType};base64,${purchase.receiptBase64}`
                  : null;

              return (
                <article
                  key={purchase.id}
                  className="rounded-2xl border border-emerald-200 bg-white p-4 shadow-[0_6px_20px_rgba(0,255,136,0.08)]"
                >
                  <p className="text-xs text-emerald-700">{formatDate(purchase.purchaseDate)}</p>
                  <h3 className="mt-1 text-sm font-semibold text-emerald-950">{purchase.product}</h3>
                  <p className="text-xs text-emerald-800">{categoryLabels[purchase.category]}</p>
                  <p className="text-xs text-emerald-800">{paymentLabels[purchase.paymentType]}</p>
                  <p className="text-xs text-emerald-800">
                    {entryTypeLabels[purchase.entryType]} - {formatCurrencyFromCents(purchase.amountInCents)}
                  </p>

                  <div className="mt-2">
                    {receiptDataUrl ? (
                      <a
                        href={receiptDataUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex rounded-lg bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-800"
                      >
                        {purchase.receiptMimeType?.startsWith("image/")
                          ? "Ver imagem"
                          : "Abrir PDF"}
                      </a>
                    ) : (
                      <span className="text-xs text-emerald-700">Sem comprovante</span>
                    )}
                  </div>

                  <div className="mt-3 flex gap-2">
                    <Link
                      href={buildUrl({
                        ...filterParams,
                        page: String(currentPage),
                        edit: purchase.id,
                      })}
                      className="rounded-lg border border-emerald-300 px-3 py-1 text-xs font-semibold text-emerald-900"
                    >
                      Editar
                    </Link>

                    <form action={deletePurchaseAction}>
                      <input type="hidden" name="purchaseId" value={purchase.id} />
                      <button
                        type="submit"
                        className="rounded-lg border border-rose-300 px-3 py-1 text-xs font-semibold text-rose-700"
                      >
                        Excluir
                      </button>
                    </form>
                  </div>
                </article>
              );
            })}
          </div>
        </>
      )}

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-emerald-200 pt-4 text-sm">
        <span className="text-emerald-800">
          Página {currentPage} de {totalPages}
        </span>

        <div className="flex gap-2">
          <Link
            href={buildUrl({
              ...filterParams,
              page: String(Math.max(1, currentPage - 1)),
            })}
            className={`rounded-lg px-3 py-1 font-semibold ${
              currentPage === 1
                ? "pointer-events-none bg-emerald-100 text-emerald-400"
                : "bg-emerald-500 text-white hover:bg-emerald-600"
            }`}
          >
            Anterior
          </Link>
          <Link
            href={buildUrl({
              ...filterParams,
              page: String(Math.min(totalPages, currentPage + 1)),
            })}
            className={`rounded-lg px-3 py-1 font-semibold ${
              currentPage >= totalPages
                ? "pointer-events-none bg-emerald-100 text-emerald-400"
                : "bg-emerald-500 text-white hover:bg-emerald-600"
            }`}
          >
            Próxima
          </Link>
        </div>
      </div>
    </article>
  );
}
