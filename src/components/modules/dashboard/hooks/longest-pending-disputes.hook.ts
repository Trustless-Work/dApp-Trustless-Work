import { Escrow } from "@/@types/escrow.entity";

export const useLongestPendingDisputes = (escrows: Escrow[]) => {
  const getTimeInfo = (timestamp?: { seconds: number }) => {
    if (!timestamp) return "N/A";
    const now = new Date();
    const updated = new Date(timestamp.seconds * 1000);
    const diffTime = Math.abs(now.getTime() - updated.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} ${diffDays === 1 ? "day" : "days"}`;
  };

  const pendingDisputes = escrows
    .filter((e) => e.disputeFlag && !e.resolvedFlag)
    .sort((a, b) => {
      const aTime = a.updatedAt?.seconds || 0;
      const bTime = b.updatedAt?.seconds || 0;
      return aTime - bTime;
    })
    .slice(0, 5);

  return {
    pendingDisputes,
    getTimeInfo,
  };
};
