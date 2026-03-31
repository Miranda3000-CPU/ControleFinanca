import { EntryType, PaymentType, Prisma, PurchaseCategory } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { AlertMessage } from "@/components/alert-message";
import {
  MAX_UPLOAD_BYTES,
  PAGE_SIZE,
  categoryOptions,
  dashboardErrors,
  dashboardMessages,
  paymentOptions,
} from "@/components/dashboard/constants";
import { DashboardFilterForm } from "@/components/dashboard/dashboard-filter-form";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardSummaryCards } from "@/components/dashboard/dashboard-summary-cards";
import { EditPurchaseModal } from "@/components/dashboard/edit-purchase-modal";
import { MonthlyOverviewChart } from "@/components/dashboard/monthly-overview-chart";
import { NewPurchasePanel } from "@/components/dashboard/new-purchase-panel";
import { PurchasesHistory } from "@/components/dashboard/purchases-history";
import type { ChartRow } from "@/components/dashboard/types";
import {
  buildDashboardUrl,
  getOptionalStringField,
  getStringField,
  parseCurrencyToCents,
  parsePositiveInt,
} from "@/components/dashboard/utils";
import { clearSession, getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const purchaseSchema = z.object({
  purchaseDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  product: z.string().trim().min(2).max(120),
  category: z.nativeEnum(PurchaseCategory),
  paymentType: z.nativeEnum(PaymentType),
  entryType: z.nativeEnum(EntryType),
  amount: z.string().trim().min(1).max(24),
});

function toCategory(value: string | undefined) {
  if (!value) {
    return null;
  }

  return categoryOptions.includes(value as PurchaseCategory)
    ? (value as PurchaseCategory)
    : null;
}

function toPayment(value: string | undefined) {
  if (!value) {
    return null;
  }

  return paymentOptions.includes(value as PaymentType)
    ? (value as PaymentType)
    : null;
}

function isAllowedMimeType(value: string) {
  return value.startsWith("image/") || value === "application/pdf";
}

function parseReceiptPayload(formData: FormData) {
  const receiptBase64 = getOptionalStringField(formData, "receiptBase64");
  const receiptMimeType = getOptionalStringField(formData, "receiptMimeType");
  const receiptFileName = getOptionalStringField(formData, "receiptFileName");
  const receiptSizeRaw = getOptionalStringField(formData, "receiptSize");
  const removeReceipt = getStringField(formData, "removeReceipt") === "true";

  if (!receiptBase64) {
    return { removeReceipt, file: null, error: null };
  }

  if (!receiptMimeType || !receiptFileName || !receiptSizeRaw) {
    return { removeReceipt, file: null, error: "comprovante_invalido" };
  }

  const receiptSize = Number.parseInt(receiptSizeRaw, 10);

  if (
    Number.isNaN(receiptSize) ||
    receiptSize <= 0 ||
    receiptSize > MAX_UPLOAD_BYTES ||
    !isAllowedMimeType(receiptMimeType)
  ) {
    return { removeReceipt, file: null, error: "comprovante_invalido" };
  }

  const realSize = Buffer.byteLength(receiptBase64, "base64");

  if (realSize > MAX_UPLOAD_BYTES) {
    return { removeReceipt, file: null, error: "comprovante_invalido" };
  }

  return {
    removeReceipt,
    error: null,
    file: {
      receiptBase64,
      receiptMimeType,
      receiptFileName,
      receiptSize,
    },
  };
}

function buildChartRows(summaryRows: { entryType: EntryType; amountInCents: number; purchaseDate: Date }[]) {
  const now = new Date();
  const monthKeys = Array.from({ length: 6 }, (_, index) => {
    const monthDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - (5 - index), 1));
    return `${monthDate.getUTCFullYear()}-${String(monthDate.getUTCMonth() + 1).padStart(2, "0")}`;
  });

  const monthlyMap = new Map<string, ChartRow>();

  for (const key of monthKeys) {
    const [yearRaw, monthRaw] = key.split("-");
    const year = Number(yearRaw);
    const month = Number(monthRaw) - 1;
    const date = new Date(Date.UTC(year, month, 1));
    const label = new Intl.DateTimeFormat("pt-BR", { month: "short", timeZone: "UTC" }).format(date);

    monthlyMap.set(key, { label, spent: 0, earned: 0 });
  }

  for (const row of summaryRows) {
    const key = `${row.purchaseDate.getUTCFullYear()}-${String(row.purchaseDate.getUTCMonth() + 1).padStart(2, "0")}`;
    const bucket = monthlyMap.get(key);

    if (!bucket) {
      continue;
    }

    if (row.entryType === EntryType.GASTO) {
      bucket.spent += row.amountInCents;
    } else {
      bucket.earned += row.amountInCents;
    }
  }

  return Array.from(monthlyMap.values());
}

type DashboardPageProps = {
  searchParams: Promise<{
    erro?: string;
    sucesso?: string;
    q?: string;
    category?: string;
    paymentType?: string;
    page?: string;
    edit?: string;
  }>;
};

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login");
  }

  const params = await searchParams;
  const successMessage = params.sucesso ? dashboardMessages[params.sucesso] : null;
  const errorMessage = params.erro ? dashboardErrors[params.erro] : null;

  const query = params.q?.trim() ?? "";
  const categoryFilter = toCategory(params.category);
  const paymentFilter = toPayment(params.paymentType);

  const where: Prisma.PurchaseWhereInput = {
    ...(query
      ? {
          product: {
            contains: query,
            mode: "insensitive",
          },
        }
      : {}),
    ...(categoryFilter ? { category: categoryFilter } : {}),
    ...(paymentFilter ? { paymentType: paymentFilter } : {}),
  };

  const totalItems = await prisma.purchase.count({ where });
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  const currentPage = Math.min(parsePositiveInt(params.page), totalPages);

  const [purchases, summaryRows] = await Promise.all([
    prisma.purchase.findMany({
      where,
      orderBy: [{ purchaseDate: "desc" }, { createdAt: "desc" }],
      skip: (currentPage - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.purchase.findMany({
      where,
      select: {
        entryType: true,
        amountInCents: true,
        purchaseDate: true,
      },
    }),
  ]);

  const totals = summaryRows.reduce(
    (acc, row) => {
      if (row.entryType === EntryType.GASTO) {
        acc.spent += row.amountInCents;
      } else {
        acc.earned += row.amountInCents;
      }

      return acc;
    },
    { spent: 0, earned: 0 },
  );

  const balance = totals.earned - totals.spent;
  const chartRows = buildChartRows(summaryRows);

  const editId = params.edit?.trim();
  const purchaseToEdit = editId
    ? await prisma.purchase.findUnique({ where: { id: editId } })
    : null;

  const filterParams = {
    q: query || undefined,
    category: categoryFilter || undefined,
    paymentType: paymentFilter || undefined,
  };

  const closeModalUrl = buildDashboardUrl({
    ...filterParams,
    page: String(currentPage),
  });

  async function logoutAction() {
    "use server";

    await clearSession();
    redirect("/login");
  }

  async function createPurchaseAction(formData: FormData) {
    "use server";

    const sessionUser = await getSessionUser();

    if (!sessionUser) {
      redirect("/login");
    }

    const parsed = purchaseSchema.safeParse({
      purchaseDate: getStringField(formData, "purchaseDate"),
      product: getStringField(formData, "product"),
      category: getStringField(formData, "category"),
      paymentType: getStringField(formData, "paymentType"),
      entryType: getStringField(formData, "entryType"),
      amount: getStringField(formData, "amount"),
    });

    if (!parsed.success) {
      redirect("/dashboard?erro=dados_invalidos");
    }

    const purchaseDate = new Date(`${parsed.data.purchaseDate}T12:00:00.000Z`);

    if (Number.isNaN(purchaseDate.getTime())) {
      redirect("/dashboard?erro=data_invalida");
    }

    const amountInCents = parseCurrencyToCents(parsed.data.amount);

    if (amountInCents === null) {
      redirect("/dashboard?erro=valor_invalido");
    }

    const receiptPayload = parseReceiptPayload(formData);

    if (receiptPayload.error) {
      redirect("/dashboard?erro=comprovante_invalido");
    }

    await prisma.purchase.create({
      data: {
        purchaseDate,
        product: parsed.data.product,
        category: parsed.data.category,
        paymentType: parsed.data.paymentType,
        entryType: parsed.data.entryType,
        amountInCents,
        ...(receiptPayload.file
          ? {
              receiptBase64: receiptPayload.file.receiptBase64,
              receiptMimeType: receiptPayload.file.receiptMimeType,
              receiptFileName: receiptPayload.file.receiptFileName,
              receiptSize: receiptPayload.file.receiptSize,
            }
          : {}),
      },
    });

    revalidatePath("/dashboard");
    redirect("/dashboard?sucesso=compra_criada");
  }

  async function updatePurchaseAction(formData: FormData) {
    "use server";

    const sessionUser = await getSessionUser();

    if (!sessionUser) {
      redirect("/login");
    }

    const purchaseId = getStringField(formData, "purchaseId");

    if (!purchaseId) {
      redirect("/dashboard?erro=compra_nao_encontrada");
    }

    const parsed = purchaseSchema.safeParse({
      purchaseDate: getStringField(formData, "purchaseDate"),
      product: getStringField(formData, "product"),
      category: getStringField(formData, "category"),
      paymentType: getStringField(formData, "paymentType"),
      entryType: getStringField(formData, "entryType"),
      amount: getStringField(formData, "amount"),
    });

    if (!parsed.success) {
      redirect("/dashboard?erro=dados_invalidos");
    }

    const purchaseDate = new Date(`${parsed.data.purchaseDate}T12:00:00.000Z`);

    if (Number.isNaN(purchaseDate.getTime())) {
      redirect("/dashboard?erro=data_invalida");
    }

    const amountInCents = parseCurrencyToCents(parsed.data.amount);

    if (amountInCents === null) {
      redirect("/dashboard?erro=valor_invalido");
    }

    const receiptPayload = parseReceiptPayload(formData);

    if (receiptPayload.error) {
      redirect("/dashboard?erro=comprovante_invalido");
    }

    const existing = await prisma.purchase.findUnique({ where: { id: purchaseId } });

    if (!existing) {
      redirect("/dashboard?erro=compra_nao_encontrada");
    }

    const updateData: Prisma.PurchaseUpdateInput = {
      purchaseDate,
      product: parsed.data.product,
      category: parsed.data.category,
      paymentType: parsed.data.paymentType,
      entryType: parsed.data.entryType,
      amountInCents,
    };

    if (receiptPayload.file) {
      updateData.receiptBase64 = receiptPayload.file.receiptBase64;
      updateData.receiptMimeType = receiptPayload.file.receiptMimeType;
      updateData.receiptFileName = receiptPayload.file.receiptFileName;
      updateData.receiptSize = receiptPayload.file.receiptSize;
    } else if (receiptPayload.removeReceipt) {
      updateData.receiptBase64 = null;
      updateData.receiptMimeType = null;
      updateData.receiptFileName = null;
      updateData.receiptSize = null;
    }

    await prisma.purchase.update({
      where: { id: purchaseId },
      data: updateData,
    });

    revalidatePath("/dashboard");
    redirect("/dashboard?sucesso=compra_atualizada");
  }

  async function deletePurchaseAction(formData: FormData) {
    "use server";

    const sessionUser = await getSessionUser();

    if (!sessionUser) {
      redirect("/login");
    }

    const purchaseId = getStringField(formData, "purchaseId");

    if (!purchaseId) {
      redirect("/dashboard?erro=compra_nao_encontrada");
    }

    const result = await prisma.purchase.deleteMany({
      where: {
        id: purchaseId,
      },
    });

    if (result.count === 0) {
      redirect("/dashboard?erro=compra_nao_encontrada");
    }

    revalidatePath("/dashboard");
    redirect("/dashboard?sucesso=compra_removida");
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(145deg,#f7fff8_0%,#ffffff_38%,#d7ffe6_100%)] p-4 sm:p-8">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <DashboardHeader userName={user.userName} logoutAction={logoutAction} />

        {successMessage ? <AlertMessage variant="success">{successMessage}</AlertMessage> : null}
        {errorMessage ? <AlertMessage variant="error">{errorMessage}</AlertMessage> : null}

        <DashboardSummaryCards
          totalItems={totalItems}
          spent={totals.spent}
          earned={totals.earned}
          balance={balance}
        />

        <MonthlyOverviewChart rows={chartRows} />

        <DashboardFilterForm
          query={query}
          categoryFilter={categoryFilter}
          paymentFilter={paymentFilter}
        />

        <section className="grid gap-6 lg:grid-cols-[380px_1fr]">
          <NewPurchasePanel createPurchaseAction={createPurchaseAction} />
          <PurchasesHistory
            purchases={purchases}
            totalItems={totalItems}
            currentPage={currentPage}
            totalPages={totalPages}
            filterParams={filterParams}
            deletePurchaseAction={deletePurchaseAction}
            buildUrl={buildDashboardUrl}
          />
        </section>
      </div>

      {purchaseToEdit ? (
        <EditPurchaseModal
          closeModalUrl={closeModalUrl}
          purchaseToEdit={purchaseToEdit}
          updatePurchaseAction={updatePurchaseAction}
        />
      ) : null}
    </main>
  );
}
