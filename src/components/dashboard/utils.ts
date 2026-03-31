export function getStringField(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export function getOptionalStringField(formData: FormData, key: string) {
  const value = getStringField(formData, key);
  return value || null;
}

export function parsePositiveInt(value: string | undefined) {
  if (!value) {
    return 1;
  }

  const parsed = Number.parseInt(value, 10);

  if (Number.isNaN(parsed) || parsed < 1) {
    return 1;
  }

  return parsed;
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" }).format(date);
}

export function formatCurrencyFromCents(cents: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100);
}

export function parseCurrencyToCents(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return null;
  }

  const withoutCurrency = trimmed.replace(/R\$/gi, "").replace(/\s/g, "");
  const hasComma = withoutCurrency.includes(",");
  const hasDot = withoutCurrency.includes(".");

  let normalized = withoutCurrency;

  if (hasComma && hasDot) {
    normalized =
      withoutCurrency.lastIndexOf(",") > withoutCurrency.lastIndexOf(".")
        ? withoutCurrency.replace(/\./g, "").replace(",", ".")
        : withoutCurrency.replace(/,/g, "");
  } else if (hasComma) {
    normalized = withoutCurrency.replace(",", ".");
  }

  if (!/^\d+(\.\d{1,2})?$/.test(normalized)) {
    return null;
  }

  const amount = Number(normalized);

  if (!Number.isFinite(amount) || amount <= 0) {
    return null;
  }

  return Math.round(amount * 100);
}

export function buildDashboardUrl(params: {
  q?: string;
  category?: string;
  paymentType?: string;
  page?: string;
  edit?: string;
}) {
  const search = new URLSearchParams();

  if (params.q) {
    search.set("q", params.q);
  }

  if (params.category) {
    search.set("category", params.category);
  }

  if (params.paymentType) {
    search.set("paymentType", params.paymentType);
  }

  if (params.page) {
    search.set("page", params.page);
  }

  if (params.edit) {
    search.set("edit", params.edit);
  }

  const query = search.toString();
  return query ? `/dashboard?${query}` : "/dashboard";
}
