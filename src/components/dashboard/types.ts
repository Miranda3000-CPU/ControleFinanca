import { Purchase } from "@prisma/client";

export type FilterParams = {
  q?: string;
  category?: string;
  paymentType?: string;
};

export type ChartRow = {
  label: string;
  spent: number;
  earned: number;
};

export type PurchaseListItem = Purchase;
