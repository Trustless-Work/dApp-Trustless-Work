import { GetEscrowsFromIndexerResponse as Escrow } from "@trustless-work/escrow/types";

export const useLongestPendingDisputes = (escrows: Escrow[]) => {
  const getTimeInfo = (timestamp?: { _seconds: number }) => {
    if (!timestamp) return "N/A";
    const now = new Date();
    const updated = new Date(timestamp._seconds * 1000);
    const diffTime = Math.abs(now.getTime() - updated.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} ${diffDays === 1 ? "day" : "days"}`;
  };

  const pendingDisputes = escrows
    .filter((e) => e.flags?.disputed && !e.flags?.resolved)
    .sort((a, b) => {
      const aTime = a.updatedAt?._seconds || 0;
      const bTime = b.updatedAt?._seconds || 0;
      return aTime - bTime;
    })
    .slice(0, 5);

  return {
    pendingDisputes,
    getTimeInfo,
  };
};
