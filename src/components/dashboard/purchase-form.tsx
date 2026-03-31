import { EntryType, PaymentType, PurchaseCategory } from "@prisma/client";

import {
  categoryLabels,
  categoryOptions,
  entryTypeLabels,
  entryTypeOptions,
  paymentLabels,
  paymentOptions,
} from "@/components/dashboard/constants";
import { ReceiptFileInput } from "@/components/receipt-file-input";

type PurchaseFormProps = {
  action: (formData: FormData) => Promise<void>;
  submitLabel: string;
  defaultValues?: {
    purchaseId?: string;
    purchaseDate?: string;
    product?: string;
    category?: PurchaseCategory;
    paymentType?: PaymentType;
    entryType?: EntryType;
    amount?: string;
    receiptFileName?: string | null;
    receiptMimeType?: string | null;
  };
};

export function PurchaseForm({
  action,
  submitLabel,
  defaultValues,
}: PurchaseFormProps) {
  return (
    <form action={action} className="space-y-3">
      {defaultValues?.purchaseId ? (
        <input type="hidden" name="purchaseId" value={defaultValues.purchaseId} />
      ) : null}

      <label className="block text-sm text-emerald-950">
        Data da compra
        <input
          type="date"
          name="purchaseDate"
          defaultValue={defaultValues?.purchaseDate ?? new Date().toISOString().slice(0, 10)}
          required
          className="mt-1 w-full rounded-xl border border-emerald-300 bg-white px-3 py-2 text-sm text-emerald-950 outline-none focus:border-emerald-500"
        />
      </label>

      <label className="block text-sm text-emerald-950">
        Produto
        <input
          type="text"
          name="product"
          defaultValue={defaultValues?.product ?? ""}
          placeholder="Ex: Mercado mensal"
          required
          minLength={2}
          maxLength={120}
          className="mt-1 w-full rounded-xl border border-emerald-300 bg-white px-3 py-2 text-sm text-emerald-950 outline-none focus:border-emerald-500"
        />
      </label>

      <label className="block text-sm text-emerald-950">
        Categoria
        <select
          name="category"
          required
          defaultValue={defaultValues?.category ?? PurchaseCategory.OUTROS}
          className="mt-1 w-full rounded-xl border border-emerald-300 bg-white px-3 py-2 text-sm text-emerald-950 outline-none focus:border-emerald-500"
        >
          {categoryOptions.map((value) => (
            <option key={value} value={value}>
              {categoryLabels[value]}
            </option>
          ))}
        </select>
      </label>

      <label className="block text-sm text-emerald-950">
        Tipo de pagamento
        <select
          name="paymentType"
          required
          defaultValue={defaultValues?.paymentType ?? PaymentType.PIX}
          className="mt-1 w-full rounded-xl border border-emerald-300 bg-white px-3 py-2 text-sm text-emerald-950 outline-none focus:border-emerald-500"
        >
          {paymentOptions.map((value) => (
            <option key={value} value={value}>
              {paymentLabels[value]}
            </option>
          ))}
        </select>
      </label>

      <label className="block text-sm text-emerald-950">
        Tipo de lançamento
        <select
          name="entryType"
          required
          defaultValue={defaultValues?.entryType ?? EntryType.GASTO}
          className="mt-1 w-full rounded-xl border border-emerald-300 bg-white px-3 py-2 text-sm text-emerald-950 outline-none focus:border-emerald-500"
        >
          {entryTypeOptions.map((value) => (
            <option key={value} value={value}>
              {entryTypeLabels[value]}
            </option>
          ))}
        </select>
      </label>

      <label className="block text-sm text-emerald-950">
        Valor (R$)
        <input
          type="text"
          name="amount"
          required
          inputMode="decimal"
          defaultValue={defaultValues?.amount ?? ""}
          placeholder="Ex: 49,90"
          className="mt-1 w-full rounded-xl border border-emerald-300 bg-white px-3 py-2 text-sm text-emerald-950 outline-none focus:border-emerald-500"
        />
      </label>

      <ReceiptFileInput
        existingFileName={defaultValues?.receiptFileName}
        existingMimeType={defaultValues?.receiptMimeType}
      />

      <button
        type="submit"
        className="w-full rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600"
      >
        {submitLabel}
      </button>
    </form>
  );
}
