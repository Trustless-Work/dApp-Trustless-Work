"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/core/config/firebase/firebase";
import { useEscrowStore } from "@/core/store/data/escrow-store";
import type {
  Escrow,
  EscrowStatus,
  EscrowTrend,
} from "@/@types/escrow-section.entity";
import {
  mockEscrows,
  mockReleaseTrends,
  mockVolumeTrends,
} from "@/core/store/data/escrow-mock-data";

interface UseEscrowDashboardOptions {
  useMockData?: boolean;
}

export function useEscrowDashboardSection({
  useMockData = false,
}: UseEscrowDashboardOptions = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get individual state values using separate selectors
  const escrows = useEscrowStore((state) => state.escrows);
  const statusCounts = useEscrowStore((state) => state.statusCounts);
  const topEscrows = useEscrowStore((state) => state.topEscrows);
  const totalEscrowValue = useEscrowStore((state) => state.totalEscrowValue);
  const activeEscrowCount = useEscrowStore((state) => state.activeEscrowCount);
  const releaseTrends = useEscrowStore((state) => state.releaseTrends);
  const volumeTrends = useEscrowStore((state) => state.volumeTrends);

  // Get state setter functions using separate selectors
  const setEscrows = useEscrowStore((state) => state.setEscrows);
  const setStatusCounts = useEscrowStore((state) => state.setStatusCounts);
  const setTopEscrows = useEscrowStore((state) => state.setTopEscrows);
  const setTotalEscrowValue = useEscrowStore(
    (state) => state.setTotalEscrowValue,
  );
  const setActiveEscrowCount = useEscrowStore(
    (state) => state.setActiveEscrowCount,
  );
  const setReleaseTrends = useEscrowStore((state) => state.setReleaseTrends);
  const setVolumeTrends = useEscrowStore((state) => state.setVolumeTrends);
  // Process escrow data to calculate derived values
  const processEscrowData = (escrows: Escrow[]) => {
    // Process status counts
    const statusMap = new Map<EscrowStatus, number>();
    escrows.forEach((escrow) => {
      const current = statusMap.get(escrow.status) || 0;
      statusMap.set(escrow.status, current + 1);
    });

    const statusCounts = Array.from(statusMap.entries()).map(
      ([status, count]) => ({
        status,
        count,
      }),
    );

    // Calculate top escrows by value
    const topEscrows = [...escrows]
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    // Calculate total escrow value
    const totalEscrowValue = escrows.reduce(
      (sum, escrow) => sum + escrow.value,
      0,
    );

    // Calculate active escrow count (all except completed/released)
    const activeEscrowCount = escrows.filter(
      (escrow) => escrow.status !== "Released",
    ).length;

    return {
      statusCounts,
      topEscrows,
      totalEscrowValue,
      activeEscrowCount,
    };
  };

  // Fetch escrow data from Firebase
  const fetchFirebaseEscrows = async () => {
    try {
      const escrowsCollection = collection(db, "escrows");
      const escrowsQuery = query(
        escrowsCollection,
        orderBy("createdAt", "desc"),
      );
      const escrowsSnapshot = await getDocs(escrowsQuery);

      const escrows: Escrow[] = escrowsSnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title,
          value: data.value,
          status: data.status,
          createdAt: data.createdAt.toDate().toISOString(),
          updatedAt: data.updatedAt.toDate().toISOString(),
          parties: {
            sender: {
              id: data.sender.id,
              name: data.sender.name,
            },
            receiver: {
              id: data.receiver.id,
              name: data.receiver.name,
            },
          },
          milestones: data.milestones || [],
        };
      });

      return escrows;
    } catch (error) {
      console.error("Error fetching escrows from Firebase:", error);
      throw new Error("Failed to fetch escrow data from Firebase");
    }
  };

  const fetchFirebaseTrends = async () => {
    try {
      const releaseTrendsCollection = collection(db, "escrowReleaseTrends");
      const releaseTrendsQuery = query(
        releaseTrendsCollection,
        orderBy("date", "asc"),
      );
      const releaseTrendsSnapshot = await getDocs(releaseTrendsQuery);

      const releaseTrends: EscrowTrend[] = releaseTrendsSnapshot.docs.map(
        (doc) => {
          const data = doc.data();
          return {
            date: data.date,
            value: data.value,
          };
        },
      );

      const volumeTrendsCollection = collection(db, "escrowVolumeTrends");
      const volumeTrendsQuery = query(
        volumeTrendsCollection,
        orderBy("date", "asc"),
      );
      const volumeTrendsSnapshot = await getDocs(volumeTrendsQuery);

      const volumeTrends: EscrowTrend[] = volumeTrendsSnapshot.docs.map(
        (doc) => {
          const data = doc.data();
          return {
            date: data.date,
            value: data.value,
          };
        },
      );

      return { releaseTrends, volumeTrends };
    } catch (error) {
      console.error("Error fetching trends from Firebase:", error);
      throw new Error("Failed to fetch trend data from Firebase");
    }
  };

  // Main fetch function that decides between mock and real data
  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      let escrowsData: Escrow[];
      let trendsData: {
        releaseTrends: EscrowTrend[];
        volumeTrends: EscrowTrend[];
      };

      if (useMockData) {
        // Use mock data
        escrowsData = mockEscrows;
        trendsData = {
          releaseTrends: mockReleaseTrends,
          volumeTrends: mockVolumeTrends,
        };

        // Add a small delay to simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } else {
        // Fetch real data from Firebase
        escrowsData = await fetchFirebaseEscrows();
        trendsData = await fetchFirebaseTrends();
      }

      // Process the data
      const processedData = processEscrowData(escrowsData);

      // Update the store
      setEscrows(escrowsData);
      setStatusCounts(processedData.statusCounts);
      setTopEscrows(processedData.topEscrows);
      setTotalEscrowValue(processedData.totalEscrowValue);
      setActiveEscrowCount(processedData.activeEscrowCount);
      setReleaseTrends(trendsData.releaseTrends);
      setVolumeTrends(trendsData.volumeTrends);

      setIsLoading(false);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "An unknown error occurred",
      );
      setIsLoading(false);
    }
  };

  // Fetch data on mount or when useMockData changes
  useEffect(() => {
    fetchData();
  }, [useMockData]);

  return {
    isLoading,
    error,
    escrows,
    statusCounts,
    topEscrows,
    totalEscrowValue,
    activeEscrowCount,
    releaseTrends,
    volumeTrends,
    refreshData: fetchData,
    useMockData,
  };
}
