import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import NoData from "@/components/utils/ui/NoData";
import { useLongestPendingDisputes } from "@/components/modules/dashboard/hooks/longest-pending-disputes.hook";
import { Escrow } from "@/@types/escrows/escrow.entity";

interface LongestPendingDisputesListProps {
  escrows: Escrow[];
}

export const LongestPendingDisputesList = ({
  escrows,
}: LongestPendingDisputesListProps) => {
  const { pendingDisputes, getTimeInfo } = useLongestPendingDisputes(escrows);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Longest Pending Disputes</CardTitle>
      </CardHeader>
      <CardContent className="pb-0">
        {pendingDisputes.length > 0 ? (
          <div className="space-y-2">
            {pendingDisputes.map((escrow) => (
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
        ) : (
          <div className="flex flex-col items-center justify-center h-[200px] text-center p-6">
            <NoData />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
