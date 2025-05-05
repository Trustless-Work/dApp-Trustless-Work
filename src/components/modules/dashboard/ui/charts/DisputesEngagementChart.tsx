import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { PieChart, Pie, Label } from "recharts";
import { Escrow } from "@/@types/escrow.entity";
import NoData from "@/components/utils/ui/NoData";

interface DisputesEngagementChartProps {
  escrows: Escrow[];
}

interface EngagementData {
  name: string;
  count: number;
  fill: string;
}

// Base blue colors for the palette
const BASE_BLUES = [
  "#1E88E5", // Blue 600
  "#42A5F5", // Blue 400
  "#64B5F6", // Blue 300
  "#90CAF9", // Blue 200
  "#BBDEFB", // Blue 100
  "#1565C0", // Blue 800
  "#0D47A1", // Blue 900
  "#2196F3", // Blue 500
  "#1976D2", // Blue 700
  "#82B1FF", // Blue A100
];

// Function to generate a color palette with n colors
const generateColorPalette = (n: number): string[] => {
  if (n <= BASE_BLUES.length) {
    return BASE_BLUES.slice(0, n);
  }

  const palette: string[] = [...BASE_BLUES];
  const baseColors = BASE_BLUES.length;

  // Generate additional colors by adjusting the base colors
  for (let i = baseColors; i < n; i++) {
    const baseColor = BASE_BLUES[i % baseColors];
    const adjustment = Math.floor(i / baseColors) * 0.2; // Adjust brightness for each cycle

    // Convert hex to RGB
    const r = parseInt(baseColor.slice(1, 3), 16);
    const g = parseInt(baseColor.slice(3, 5), 16);
    const b = parseInt(baseColor.slice(5, 7), 16);

    // Adjust brightness
    const adjustedR = Math.max(
      0,
      Math.min(255, Math.round(r * (1 - adjustment))),
    );
    const adjustedG = Math.max(
      0,
      Math.min(255, Math.round(g * (1 - adjustment))),
    );
    const adjustedB = Math.max(
      0,
      Math.min(255, Math.round(b * (1 - adjustment))),
    );

    // Convert back to hex
    const adjustedColor = `#${adjustedR.toString(16).padStart(2, "0")}${adjustedG.toString(16).padStart(2, "0")}${adjustedB.toString(16).padStart(2, "0")}`;
    palette.push(adjustedColor);
  }

  return palette;
};

export function DisputesEngagementChart({
  escrows,
}: DisputesEngagementChartProps) {
  // Generate engagement data from escrows
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

  // Generate color palette based on number of engagements
  const colorPalette = generateColorPalette(Object.keys(engagementData).length);

  // Format data with dynamic colors from the generated palette
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

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Disputes by Engagement</CardTitle>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square h-[250px]"
        >
          {hasData ? (
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={formattedData}
                dataKey="count"
                nameKey="name"
                innerRadius={60}
                strokeWidth={5}
              >
                <Label
                  content={({ viewBox }) => {
                    if (!viewBox) return null;
                    const { cx, cy } = viewBox as { cx: number; cy: number };
                    return (
                      <text
                        x={cx}
                        y={cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={cx}
                          y={cy}
                          className="fill-foreground text-2xl font-bold"
                        >
                          {total}
                        </tspan>
                        <tspan
                          x={cx}
                          y={cy + 20}
                          className="fill-muted-foreground text-sm"
                        >
                          Total
                        </tspan>
                      </text>
                    );
                  }}
                />
              </Pie>
            </PieChart>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
              <NoData />
            </div>
          )}
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex flex-wrap justify-center gap-4 w-full">
          {formattedData.map((entry, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: entry.fill }}
              ></div>
              <span className="text-sm font-medium">{entry.name}</span>
              <span className="text-sm text-muted-foreground">
                {entry.count}
              </span>
            </div>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
}
