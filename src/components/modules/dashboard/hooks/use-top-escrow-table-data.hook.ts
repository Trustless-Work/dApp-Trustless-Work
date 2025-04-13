import { format } from "date-fns";
import { BadgeProps } from "@/components/ui/badge";

type Escrow = {
  id: string;
  title: string;
  amount: string;
  createdAt: {
    seconds: number;
  };
  releaseFlag: boolean;
  disputeFlag: boolean;
  resolvedFlag: boolean;
};

type TableRow = {
  id: string;
  title: string;
  amount: string;
  status: string;
  badgeVariant: BadgeProps["variant"];
  created: string;
};

function getStatus(escrow: Escrow): string {
  if (escrow.releaseFlag) return "Released";
  if (escrow.disputeFlag) return "Disputed";
  if (escrow.resolvedFlag) return "Resolved";
  return "Pending";
}

function getStatusVariant(status: string): BadgeProps["variant"] {
  switch (status) {
    case "Released":
      return "default";
    case "Disputed":
      return "destructive";
    case "Resolved":
      return "secondary";
    default:
      return "outline";
  }
}

export function useTopEscrowTableData(data: Escrow[]): TableRow[] {
  return data.map((escrow) => {
    const status = getStatus(escrow);
    const amount = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(parseFloat(escrow.amount));

    const created = format(
      new Date(escrow.createdAt.seconds * 1000),
      "dd MMM yyyy",
    );

    return {
      id: escrow.id,
      title: escrow.title,
      amount,
      status,
      badgeVariant: getStatusVariant(status),
      created,
    };
  });
}
