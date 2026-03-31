import { EntryType, PaymentType, PurchaseCategory } from "@prisma/client";

export const PAGE_SIZE = 20;
export const MAX_UPLOAD_BYTES = 2 * 1024 * 1024;

export const categoryLabels: Record<PurchaseCategory, string> = {
  ALIMENTACAO: "Alimentação",
  MORADIA: "Moradia",
  TRANSPORTE: "Transporte",
  SAUDE: "Saúde",
  EDUCACAO: "Educação",
  LAZER: "Lazer",
  ASSINATURAS: "Assinaturas",
  OUTROS: "Outros",
};

export const paymentLabels: Record<PaymentType, string> = {
  CARTAO_CREDITO: "Cartão de crédito",
  CARTAO_DEBITO: "Cartão de débito",
  PIX: "Pix",
  DINHEIRO: "Dinheiro",
  TRANSFERENCIA: "Transferência",
  BOLETO: "Boleto",
};

export const entryTypeLabels: Record<EntryType, string> = {
  GASTO: "Gasto",
  GANHO: "Ganho",
};

export const categoryOptions = Object.values(PurchaseCategory);
export const paymentOptions = Object.values(PaymentType);
export const entryTypeOptions = Object.values(EntryType);

export const dashboardMessages: Record<string, string> = {
  compra_criada: "Compra salva com sucesso.",
  compra_atualizada: "Compra atualizada com sucesso.",
  compra_removida: "Compra removida com sucesso.",
};

export const dashboardErrors: Record<string, string> = {
  dados_invalidos: "Preencha os campos obrigatórios corretamente.",
  data_invalida: "Data da compra inválida.",
  valor_invalido: "Informe um valor em R$ válido (ex: 49,90).",
  compra_nao_encontrada: "Compra não encontrada.",
  comprovante_invalido: "Comprovante inválido. Aceito: imagem/PDF até 2MB.",
};
