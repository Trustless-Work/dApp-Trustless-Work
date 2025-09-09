import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { Escrow } from "@/types/escrow.entity";

export const useEscrowFilter = (escrows: Escrow[] = []) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useTranslation();

  // Search (debounced) from URL param "q"
  const [search, setSearch] = useState(searchParams.get("q") || "");

  // Other filters are read directly from current URL params so they always stay in sync
  const status = searchParams.get("status") || "";
  const amountRange = searchParams.get("amount") || "";
  const engagement = searchParams.get("engagement") || "";
  const active = searchParams.get("active") || "";

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
    // Reset local state so inputs/selects visually clear as well
    setSearch("");
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

    return Array.from(engagementsSet).map((id) => ({ value: id, label: id }));
  }, [escrows]);

  const mapNameParams = (paramName: string) => {
    if (!paramName) return t("myEscrows.filter.status.all");

    switch (paramName) {
      // Statuses
      case "all":
        return t("myEscrows.filter.status.all");
      case "working":
        return t("myEscrows.filter.status.working");
      case "pendingRelease":
        return t("myEscrows.filter.status.pendingRelease");
      case "released":
        return t("myEscrows.filter.status.released");
      case "resolved":
        return t("myEscrows.filter.status.resolved");
      case "inDispute":
        return t("myEscrows.filter.status.inDispute");

      // Amounts
      case "0-100":
        return t("myEscrows.filter.amount.0-100");
      case "100-500":
        return t("myEscrows.filter.amount.100-500");
      case "500-1000":
        return t("myEscrows.filter.amount.500-1000");
      case "1000+":
        return t("myEscrows.filter.amount.1000+");

      // Active
      case "active":
        return t("myEscrows.filter.active.active");
      case "trashed":
        return t("myEscrows.filter.active.trashed");
      default:
        return paramName;
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
