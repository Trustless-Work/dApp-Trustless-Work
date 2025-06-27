import { Escrow } from "@/@types/escrow.entity";

export interface HistoryItem extends Escrow {
  // Additional history-specific properties
  lastActivity?: string;
  activityType?:
    | "created"
    | "funded"
    | "milestone_completed"
    | "milestone_approved"
    | "disputed"
    | "resolved"
    | "released";
  activityDescription?: string;
}

export interface HistoryFilters {
  search?: string;
  status?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  activityType?: string;
  amountRange?: {
    min: number;
    max: number;
  };
}

export interface HistoryTableColumn {
  id: string;
  header: string;
  accessorKey: keyof HistoryItem;
  cell?: (value: unknown, row: HistoryItem) => React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
}
