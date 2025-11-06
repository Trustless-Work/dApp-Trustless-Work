import { GetEscrowsFromIndexerResponse as Escrow } from "@trustless-work/escrow/types";
import { BadgeProps } from "@/ui/badge";

export function getStatus(escrow: Escrow): string {
  if (escrow.flags?.released) return "Released";
  if (escrow.flags?.disputed) return "Disputed";
  if (escrow.flags?.resolved) return "Resolved";
  return "Pending";
}

export function getStatusVariant(status: string): BadgeProps["variant"] {
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

export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case "released":
    case "approved":
      return "hsl(var(--chart-1))";
    case "disputed":
    case "completed":
      return "hsl(var(--chart-2))";
    case "resolved":
    case "pending":
    default:
      return "hsl(var(--chart-4))";
  }
}
