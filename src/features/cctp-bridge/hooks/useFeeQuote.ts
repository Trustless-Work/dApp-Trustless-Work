"use client";

import { useQuery } from "@tanstack/react-query";
import { cctpBridgeService } from "@/features/cctp-bridge/services/cctp-bridge.service";
import type { CctpDestinationDomain } from "@/features/cctp-bridge/types/cctp-bridge.types";

/**
 * Live estimate of the CCTP forwarding fee for a destination, so the
 * receiver sees roughly what they'll pay as soon as they pick a chain — not
 * only after building the sign step. It's a snapshot (gas-driven,
 * especially for L1 destinations like Ethereum), so a short `staleTime`
 * keeps it reasonably fresh without refetching on every render.
 *
 * Takes a plain `number` (not the narrower `CctpDestinationDomain` union)
 * because the caller is typically a form field mid-selection — this is a
 * preview only, the backend re-validates the domain for real.
 */
export function useFeeQuote(destinationDomain: number | undefined) {
  return useQuery({
    queryKey: ["cctp", "fee-quote", destinationDomain],
    queryFn: () =>
      cctpBridgeService.getFeeQuote(
        destinationDomain as CctpDestinationDomain,
      ),
    enabled: destinationDomain !== undefined,
    staleTime: 15_000,
  });
}
