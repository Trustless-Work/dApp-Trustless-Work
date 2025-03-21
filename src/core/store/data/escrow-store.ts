import { create } from "zustand";
import type {
  Escrow,
  EscrowStatusCount,
  EscrowTrend,
} from "@/@types/escrow-section.entity";

export interface EscrowStore {
  // Data
  escrows: Escrow[];
  statusCounts: EscrowStatusCount[];
  topEscrows: Escrow[];
  totalEscrowValue: number;
  activeEscrowCount: number;
  releaseTrends: EscrowTrend[];
  volumeTrends: EscrowTrend[];

  // Loading states
  isLoading: boolean;
  trendsLoading: boolean;

  // Error states
  error: string | null;
  trendsError: string | null;

  // Setters
  setEscrows: (escrows: Escrow[]) => void;
  setStatusCounts: (statusCounts: EscrowStatusCount[]) => void;
  setTopEscrows: (topEscrows: Escrow[]) => void;
  setTotalEscrowValue: (value: number) => void;
  setActiveEscrowCount: (count: number) => void;
  setReleaseTrends: (trends: EscrowTrend[]) => void;
  setVolumeTrends: (trends: EscrowTrend[]) => void;
  setIsLoading: (isLoading: boolean) => void;
  setTrendsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setTrendsError: (error: string | null) => void;
}

// Create the store
export const useEscrowStore = create<EscrowStore>((set) => ({
  // Initial data
  escrows: [],
  statusCounts: [],
  topEscrows: [],
  totalEscrowValue: 0,
  activeEscrowCount: 0,
  releaseTrends: [],
  volumeTrends: [],

  // Initial loading states
  isLoading: false,
  trendsLoading: false,

  // Initial error states
  error: null,
  trendsError: null,

  // Setters
  setEscrows: (escrows) => set({ escrows }),
  setStatusCounts: (statusCounts) => set({ statusCounts }),
  setTopEscrows: (topEscrows) => set({ topEscrows }),
  setTotalEscrowValue: (totalEscrowValue) => set({ totalEscrowValue }),
  setActiveEscrowCount: (activeEscrowCount) => set({ activeEscrowCount }),
  setReleaseTrends: (releaseTrends) => set({ releaseTrends }),
  setVolumeTrends: (volumeTrends) => set({ volumeTrends }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setTrendsLoading: (trendsLoading) => set({ trendsLoading }),
  setError: (error) => set({ error }),
  setTrendsError: (trendsError) => set({ trendsError }),
}));
