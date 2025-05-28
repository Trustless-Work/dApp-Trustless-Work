import { useGlobalBoundedStore } from "@/core/store/data";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState, useCallback } from "react";

export const useEscrowFilter = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const escrows = useGlobalBoundedStore((state) => state.escrows);

  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [status] = useState(searchParams.get("status") || "");
  const [amountRange] = useState(searchParams.get("amount") || "");
  const [engagement] = useState(searchParams.get("engagement") || "");
  const active = searchParams.get("active") || "active";

  const updateQuery = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.replace(`${pathname}?${params.toString()}`);
    },
    [searchParams, pathname, router],
  );

  const deleteParams = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("q");
    params.delete("status");
    params.delete("amount");
    params.delete("engagement");
    params.delete("dateRange");
    params.delete("active");
    router.replace(`${pathname}?${params.toString()}`);
  }, [searchParams, pathname, router]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      updateQuery("q", search);
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [search, updateQuery]);

  const uniqueEngagements = useMemo(() => {
    const engagementsSet = new Set<string>();
    escrows.forEach((escrow) => {
      if (escrow.engagementId) {
        engagementsSet.add(escrow.engagementId);
      }
    });
    return Array.from(engagementsSet).map((engagement) => ({
      value: engagement,
      label: engagement,
    }));
  }, [escrows]);

  const mapNameParams = (paramName: string) => {
    if (!paramName) return "No Filter";

    switch (paramName) {
      // Statuses
      case "all":
        return "No Filter";
      case "working":
        return "Working";
      case "pendingRelease":
        return "Pending Release";
      case "released":
        return "Released";
      case "resolved":
        return "Resolved";
      case "inDispute":
        return "In Dispute";

      // Amounts
      case "0-100":
        return "$0 - $100";
      case "100-500":
        return "$100 - $500";
      case "500-1000":
        return "$500 - $1000";
      case "1000+":
        return "Over $1000";

      // Active
      case "active":
        return "Active";
      case "trashed":
        return "Trash";
    }
  };

  return {
    search,
    status,
    amountRange,
    engagement,
    active,
    uniqueEngagements,
    searchParams,
    setSearch,
    updateQuery,
    deleteParams,
    mapNameParams,
  };
};
