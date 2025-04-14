import { format } from "date-fns";
import type { Escrow } from "@/@types/escrow.entity";
import { BadgeProps } from "@/components/ui/badge";
import { getStatus, getStatusVariant } from "../utils/escrow-status.util";

type TableRow = {
  id: string;
  title: string;
  amount: string;
  status: string;
  badgeVariant: BadgeProps["variant"];
  created: string;
};

export function useTopEscrowTableData(data: Escrow[]): TableRow[] {
  return data.map((escrow) => {
    const status = getStatus(escrow);
    const amount = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(parseFloat(escrow.amount ?? "0"));

    const created = format(
      new Date((escrow.createdAt?.seconds ?? 0) * 1000),
      "dd MMM yyyy",
    );

    return {
      id: escrow.id,
      title: escrow.title ?? "—",
      amount,
      status,
      badgeVariant: getStatusVariant(status),
      created,
    };
  });
}
