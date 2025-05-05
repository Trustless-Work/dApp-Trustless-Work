import { Escrow } from "@/@types/escrow.entity";

interface LongestPendingDisputesListProps {
  escrows: Escrow[];
}

export function LongestPendingDisputesList({
  escrows,
}: LongestPendingDisputesListProps) {
  const getTimeInfo = (timestamp?: { seconds: number }) => {
    if (!timestamp) return "N/A";
    const now = new Date();
    const updated = new Date(timestamp.seconds * 1000);
    const diffTime = Math.abs(now.getTime() - updated.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} ${diffDays === 1 ? "day" : "days"}`;
  };

  return (
    <div className="space-y-4 mb-4">
      <h2 className="text-lg font-semibold">Longest Pending Disputes</h2>
      <div className="space-y-2">
        {escrows
          .filter((e) => e.disputeFlag && !e.resolvedFlag)
          .sort((a, b) => {
            const aTime = a.updatedAt?.seconds || 0;
            const bTime = b.updatedAt?.seconds || 0;
            return aTime - bTime;
          })
          .slice(0, 5)
          .map((escrow) => (
            <div
              key={escrow.id}
              className="p-4 rounded-lg border bg-card text-card-foreground"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-medium">{escrow.title}</h3>
                <span className="text-sm text-muted-foreground">
                  {getTimeInfo(escrow.updatedAt)}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {escrow.description}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
}
