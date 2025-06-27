import { useQuery } from "@tanstack/react-query";
import { useGlobalAuthenticationStore } from "@/core/store/data";
import { getAllEscrowsByUser } from "@/components/modules/escrow/server/escrow.firebase";
import { HistoryItem } from "../@types/history.entity";
import { Escrow } from "@/@types/escrow.entity";

interface UseHistoryQueryProps {
  type?: string;
  limit?: number;
}

export const useHistoryQuery = ({
  type = "approver",
  limit = 50,
}: UseHistoryQueryProps = {}) => {
  const { address } = useGlobalAuthenticationStore();

  return useQuery({
    queryKey: ["history", address, type, limit],
    queryFn: async (): Promise<HistoryItem[]> => {
      if (!address) {
        throw new Error("Wallet not connected");
      }

      const { success, data, message } = await getAllEscrowsByUser({
        address,
        type,
      });

      if (!success) {
        throw new Error(message || "Failed to fetch history");
      }

      // Transform escrow data to history items
      const historyItems: HistoryItem[] = (data || []).map(
        (escrow: Escrow) => ({
          ...escrow,
          lastActivity: escrow.updatedAt?.seconds || escrow.createdAt?.seconds,
          activityType: determineActivityType(escrow),
          activityDescription: generateActivityDescription(escrow),
        }),
      );

      return historyItems;
    },
    enabled: !!address,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  });
};

// Helper function to determine activity type based on escrow flags
const determineActivityType = (escrow: Escrow): HistoryItem["activityType"] => {
  if (escrow.flags?.released) return "released";
  if (escrow.flags?.resolved) return "resolved";
  if (escrow.flags?.disputed) return "disputed";

  // Check if any milestones are completed
  const hasCompletedMilestones = escrow.milestones?.some(
    (milestone) => milestone.status === "completed",
  );
  if (hasCompletedMilestones) return "milestone_completed";

  // Check if any milestones are approved
  const hasApprovedMilestones = escrow.milestones?.some(
    (milestone) => "flags" in milestone && milestone.flags?.approved,
  );
  if (hasApprovedMilestones) return "milestone_approved";

  // Check if escrow is funded
  if (escrow.balance && escrow.balance > 0) return "funded";

  return "created";
};

// Helper function to generate activity description
const generateActivityDescription = (escrow: Escrow): string => {
  const activityType = determineActivityType(escrow);

  switch (activityType) {
    case "released":
      return "Escrow funds released";
    case "resolved":
      return "Dispute resolved";
    case "disputed":
      return "Dispute started";
    case "milestone_completed":
      return "Milestone completed";
    case "milestone_approved":
      return "Milestone approved";
    case "funded":
      return "Escrow funded";
    case "created":
    default:
      return "Escrow created";
  }
};
