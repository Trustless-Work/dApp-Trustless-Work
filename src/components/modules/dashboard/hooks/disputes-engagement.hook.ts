import { Escrow } from "@/@types/escrow.entity";

interface EngagementData {
  name: string;
  count: number;
  fill: string;
}

export const useDisputesEngagement = (escrows: Escrow[]) => {
  const getChartColor = (index: number): string => {
    const baseColorIndex = (index % 5) + 1;
    const variation = Math.floor(index / 5);

    if (variation === 0) {
      return `hsl(var(--chart-${baseColorIndex}))`;
    }

    const lightnessAdjustment = variation * 0.1;
    return `hsl(var(--chart-${baseColorIndex}) / ${1 - lightnessAdjustment})`;
  };

  const generateColorPalette = (n: number): string[] => {
    return Array.from({ length: n }, (_, i) => getChartColor(i));
  };

  const engagementData = escrows
    .filter((escrow) => escrow.disputeFlag)
    .reduce(
      (acc, escrow) => {
        const engagementId = escrow.engagementId;
        if (!acc[engagementId]) {
          acc[engagementId] = 0;
        }
        acc[engagementId]++;
        return acc;
      },
      {} as Record<string, number>,
    );

  const colorPalette = generateColorPalette(Object.keys(engagementData).length);

  const formattedData: EngagementData[] = Object.entries(engagementData).map(
    ([name, count], index) => ({
      name,
      count,
      fill: colorPalette[index],
    }),
  );

  const total = formattedData.reduce((sum, entry) => sum + entry.count, 0);
  const hasData = formattedData.length > 0;

  const chartConfig = Object.entries(engagementData).reduce(
    (acc, [engagementId], index) => {
      acc[engagementId] = {
        label: `${engagementId}  `,
        color: colorPalette[index],
      };
      return acc;
    },
    {} as Record<string, { label: string; color: string }>,
  );

  return {
    formattedData,
    total,
    hasData,
    chartConfig,
  };
};
