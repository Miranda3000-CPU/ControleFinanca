import Link from "next/link";
import { EntryType, PaymentType, PurchaseCategory } from "@prisma/client";

import { PurchaseForm } from "@/components/dashboard/purchase-form";

type EditPurchaseModalProps = {
  closeModalUrl: string;
  purchaseToEdit: {
    id: string;
    purchaseDate: Date;
    product: string;
    category: PurchaseCategory;
    paymentType: PaymentType;
    entryType: EntryType;
    amountInCents: number;
    receiptFileName: string | null;
    receiptMimeType: string | null;
  };
  updatePurchaseAction: (formData: FormData) => Promise<void>;
};

export function EditPurchaseModal({
  closeModalUrl,
  purchaseToEdit,
  updatePurchaseAction,
}: EditPurchaseModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-emerald-950/50 p-4">
      <div className="w-full max-w-xl rounded-3xl border border-emerald-300 bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-emerald-950">Editar compra</h2>
            <p className="text-sm text-emerald-800">Atualize os dados e o comprovante.</p>
          </div>
          <Link
            href={closeModalUrl}
            className="rounded-lg border border-emerald-300 px-3 py-1 text-sm font-semibold text-emerald-900 hover:bg-emerald-100"
          >
            Fechar
          </Link>
        </div>

        <PurchaseForm
          action={updatePurchaseAction}
          submitLabel="Salvar alterações"
          defaultValues={{
            purchaseId: purchaseToEdit.id,
            purchaseDate: purchaseToEdit.purchaseDate.toISOString().slice(0, 10),
            product: purchaseToEdit.product,
            category: purchaseToEdit.category,
            paymentType: purchaseToEdit.paymentType,
            entryType: purchaseToEdit.entryType,
            amount: (purchaseToEdit.amountInCents / 100).toFixed(2),
            receiptFileName: purchaseToEdit.receiptFileName,
            receiptMimeType: purchaseToEdit.receiptMimeType,
          }}
        />
      </div>
    </div>
  );
}
