export type DashboardStat = {
  label: string;
  value: string;
  delta: number;
  hint: string;
};

export type DashboardVolumePoint = {
  date: string;
  volume: number;
};

export type DashboardCreatedPoint = {
  date: string;
  orders: number;
  isPeak: boolean;
};

export type DashboardBudgetSegment = {
  pct: number;
  label: string;
  color: string;
};

export type DashboardAttentionItem = {
  id: string;
  title: string;
  href: string;
  count: number;
  icon: "dispute" | "pending" | "unfunded" | "active" | "released";
};

export type DashboardNextRelease = {
  dateIso: string | null;
  amount: number;
  contractId: string | null;
  milestoneIndex: number | null;
  statusLabel: string;
};

export type DashboardMetrics = {
  stats: readonly DashboardStat[];
  volumeSeries: readonly DashboardVolumePoint[];
  volumeLatest: number;
  volumeDeltaPct: number;
  insightPendingReleasePct: number;
  budgetTotal: number;
  budgetSegments: readonly DashboardBudgetSegment[];
  createdSeries: readonly DashboardCreatedPoint[];
  createdTotal: number;
  createdDeltaPct: number;
  createdPeakDate: string | null;
  totalDeposited: number;
  releasedShare: number;
  typeMix: {
    total: number;
    singleRelease: number;
    multiRelease: number;
  };
  nextRelease: DashboardNextRelease;
  platformFeesTotal: number;
  attention: readonly DashboardAttentionItem[];
};
