import { PurchaseForm } from "@/components/dashboard/purchase-form";

type NewPurchasePanelProps = {
  createPurchaseAction: (formData: FormData) => Promise<void>;
};

export function NewPurchasePanel({ createPurchaseAction }: NewPurchasePanelProps) {
  return (
    <article className="rounded-3xl border border-emerald-300 bg-white p-6 shadow-[0_10px_30px_rgba(0,255,136,0.08)]">
      <h2 className="text-lg font-semibold text-emerald-950">Nova compra</h2>
      <p className="mt-1 text-sm text-emerald-800">Cadastre despesas com categoria, pagamento e comprovante.</p>
      <div className="mt-4">
        <PurchaseForm action={createPurchaseAction} submitLabel="Salvar compra" />
      </div>
    </article>
  );
}
