import type { MemberResponse } from "@/features/organizations/types/organization.types";
import { formatAddress } from "@/helpers/format.helper";

export function getMemberDisplayLabel(member: MemberResponse): string {
  return member.label?.trim() || member.externalId?.trim() || "Unnamed member";
}

export function getMemberWallet(member: MemberResponse): string {
  const wallet = member.walletAddress?.trim();
  if (!wallet) {
    return "-";
  }
  return formatAddress(wallet, 6);
}
