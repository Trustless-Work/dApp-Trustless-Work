import type { EscrowStatus } from "@/@types/escrow-section.entity";

/**
 * Maps escrow statuses to consistent colors for visualization
 * @param status - The escrow status
 * @returns Color hex code
 */
export function getStatusColor(status: EscrowStatus): string {
  const colorMap: Record<EscrowStatus, string> = {
    "Pending Funding": "#FFC107",
    Funded: "#4CAF50",
    "Milestone Completed": "#2196F3",
    Approved: "#9C27B0",
    Released: "#00BCD4",
    Disputed: "#F44336",
  };

  return colorMap[status] || "#9E9E9E"; // Default to gray
}

/**
 * Gets an array of colors for chart visualization
 * @returns Array of color hex codes
 */
export function getChartColors(): string[] {
  return [
    "#4CAF50",
    "#2196F3",
    "#FFC107",
    "#9C27B0",
    "#00BCD4",
    "#F44336",
    "#FF9800",
    "#607D8B",
  ];
}
