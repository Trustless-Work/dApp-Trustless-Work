import { describe, expect, it, vi } from "vitest";
import {
  ESCROW_INDEXER_CATCH_UP_DELAYS_MS,
  refreshEscrowQueries,
  scheduleEscrowIndexerCatchUp,
} from "@/features/escrows/utils/escrow-query.helper";

describe("refreshEscrowQueries", () => {
  it("refetches list and detail active queries", async () => {
    const refetchQueries = vi.fn().mockResolvedValue(undefined);
    const queryClient = { refetchQueries } as never;

    await refreshEscrowQueries(queryClient, "C123");

    expect(refetchQueries).toHaveBeenCalledTimes(2);
    expect(refetchQueries).toHaveBeenNthCalledWith(1, {
      queryKey: ["escrows", "list"],
      type: "active",
    });
    expect(refetchQueries).toHaveBeenNthCalledWith(2, {
      queryKey: ["escrow", "detail", "C123"],
      type: "active",
    });
  });
});

describe("scheduleEscrowIndexerCatchUp", () => {
  it("schedules delayed detail and list refetches", () => {
    vi.useFakeTimers();
    const refetchQueries = vi.fn().mockResolvedValue(undefined);
    const queryClient = { refetchQueries } as never;

    scheduleEscrowIndexerCatchUp(queryClient, "C123");

    expect(refetchQueries).not.toHaveBeenCalled();

    for (const delayMs of ESCROW_INDEXER_CATCH_UP_DELAYS_MS) {
      vi.advanceTimersByTime(delayMs);
      expect(refetchQueries).toHaveBeenCalledWith({
        queryKey: ["escrow", "detail", "C123"],
        type: "active",
      });
      expect(refetchQueries).toHaveBeenCalledWith({
        queryKey: ["escrows", "list"],
        type: "active",
      });
    }

    vi.useRealTimers();
  });
});
