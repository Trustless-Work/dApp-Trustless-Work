"use client";

import React from "react";
import { startOfDay, endOfDay, format } from "date-fns";
import type { DateRange as DayPickerDateRange } from "react-day-picker";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { SortingState } from "@tanstack/react-table";
import { useEscrowsBySignerQuery } from "../../tanstack/useEscrowsBySignerQuery";
import { GetEscrowsFromIndexerResponse as Escrow } from "@trustless-work/escrow/types";
import { useGlobalAuthenticationStore } from "@/store/data";

export type EscrowOrderBy = "createdAt" | "updatedAt" | "amount";
export type EscrowOrderDirection = "asc" | "desc";
export type EscrowType = "single-release" | "multi-release" | "all";
export type EscrowStatus =
  | "working"
  | "pendingRelease"
  | "released"
  | "resolved"
  | "inDispute"
  | "all";
export type DateRange = DayPickerDateRange;

export function useEscrowsBySigner() {
  const walletAddress = useGlobalAuthenticationStore((state) => state.address);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [page, setPage] = React.useState<number>(1);
  const [orderBy, setOrderBy] = React.useState<EscrowOrderBy>("createdAt");
  const [orderDirection, setOrderDirection] =
    React.useState<EscrowOrderDirection>("desc");
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [title, setTitle] = React.useState<string>("");
  const [engagementId, setEngagementId] = React.useState<string>("");
  const [isActive, setIsActive] = React.useState<boolean>(true);
  const [validateOnChain, setValidateOnChain] = React.useState<boolean>(true);
  const [type, setType] = React.useState<EscrowType>("all");
  const [status, setStatus] = React.useState<EscrowStatus>("all");
  const [minAmount, setMinAmount] = React.useState<string>("");
  const [maxAmount, setMaxAmount] = React.useState<string>("");
  const [dateRange, setDateRange] = React.useState<DateRange>({
    from: undefined,
    to: undefined,
  });

  function useDebouncedValue<T>(value: T, delayMs: number) {
    const [debounced, setDebounced] = React.useState<T>(value);
    React.useEffect(() => {
      const id = setTimeout(() => setDebounced(value), delayMs);
      return () => clearTimeout(id);
    }, [value, delayMs]);
    return debounced;
  }

  const debouncedTitle = useDebouncedValue(title, 400);
  const debouncedEngagementId = useDebouncedValue(engagementId, 400);
  const debouncedMinAmount = useDebouncedValue(minAmount, 400);
  const debouncedMaxAmount = useDebouncedValue(maxAmount, 400);

  React.useEffect(() => {
    if (!searchParams) return;
    const qp = new URLSearchParams(searchParams.toString());
    const qpPage = Number(qp.get("page") || 1);
    const qpOrderBy = (qp.get("orderBy") as EscrowOrderBy) || "createdAt";
    const qpOrderDir =
      (qp.get("orderDirection") as EscrowOrderDirection) || "desc";
    const qpTitle = qp.get("title") || "";
    const qpEng = qp.get("engagementId") || "";
    const qpActive = qp.get("isActive");
    const qpValidateOnChain = qp.get("validateOnChain");
    const qpType = (qp.get("type") as EscrowType) || "all";
    const qpStatus = (qp.get("status") as EscrowStatus) || "all";
    const qpMin = qp.get("minAmount") || "";
    const qpMax = qp.get("maxAmount") || "";
    const qpStart = qp.get("startDate");
    const qpEnd = qp.get("endDate");

    setPage(Number.isFinite(qpPage) && qpPage > 0 ? qpPage : 1);
    setOrderBy(
      ["createdAt", "updatedAt", "amount"].includes(qpOrderBy)
        ? qpOrderBy
        : "createdAt",
    );
    setOrderDirection(qpOrderDir === "asc" ? "asc" : "desc");
    setTitle(qpTitle);
    setEngagementId(qpEng);
    setIsActive(qpActive === null ? true : qpActive === "true");
    setValidateOnChain(
      qpValidateOnChain === null ? true : qpValidateOnChain === "true",
    );
    setType(qpType);
    setStatus(qpStatus);
    setMinAmount(qpMin);
    setMaxAmount(qpMax);
    setDateRange({
      from: qpStart ? new Date(qpStart) : undefined,
      to: qpEnd ? new Date(qpEnd) : undefined,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stableSearchParams = React.useMemo(
    () => ({
      page,
      orderBy,
      orderDirection,
      title: debouncedTitle,
      engagementId: debouncedEngagementId,
      isActive,
      validateOnChain,
      type,
      status,
      minAmount: debouncedMinAmount,
      maxAmount: debouncedMaxAmount,
      startDate: dateRange.from
        ? startOfDay(dateRange.from).toISOString()
        : undefined,
      endDate: dateRange.to ? endOfDay(dateRange.to).toISOString() : undefined,
    }),
    [
      page,
      orderBy,
      orderDirection,
      debouncedTitle,
      debouncedEngagementId,
      isActive,
      validateOnChain,
      type,
      status,
      debouncedMinAmount,
      debouncedMaxAmount,
      dateRange.from,
      dateRange.to,
    ],
  );

  const debouncedSearchParams = useDebouncedValue(stableSearchParams, 200);

  const lastQueryStringRef = React.useRef("");

  React.useEffect(() => {
    if (!pathname) return;
    const qp = new URLSearchParams();
    qp.set("page", String(debouncedSearchParams.page ?? 1));
    qp.set("orderBy", String(debouncedSearchParams.orderBy ?? "createdAt"));
    qp.set(
      "orderDirection",
      String(debouncedSearchParams.orderDirection ?? "desc"),
    );
    if (debouncedSearchParams.title)
      qp.set("title", debouncedSearchParams.title);
    if (debouncedSearchParams.engagementId)
      qp.set("engagementId", debouncedSearchParams.engagementId);
    qp.set("isActive", String(debouncedSearchParams.isActive));
    qp.set("validateOnChain", String(debouncedSearchParams.validateOnChain));
    if (debouncedSearchParams.type && debouncedSearchParams.type !== "all")
      qp.set("type", debouncedSearchParams.type);
    if (debouncedSearchParams.status && debouncedSearchParams.status !== "all")
      qp.set("status", debouncedSearchParams.status);
    if (debouncedSearchParams.minAmount)
      qp.set("minAmount", String(debouncedSearchParams.minAmount));
    if (debouncedSearchParams.maxAmount)
      qp.set("maxAmount", String(debouncedSearchParams.maxAmount));
    if (debouncedSearchParams.startDate)
      qp.set("startDate", String(debouncedSearchParams.startDate));
    if (debouncedSearchParams.endDate)
      qp.set("endDate", String(debouncedSearchParams.endDate));
    const newQs = qp.toString();
    if (lastQueryStringRef.current !== newQs) {
      lastQueryStringRef.current = newQs;
      router.replace(`${pathname}?${newQs}`);
    }
  }, [pathname, router, debouncedSearchParams]);

  const formattedRangeLabel = React.useMemo(() => {
    if (!dateRange?.from && !dateRange?.to) return "Date range";
    const fromStr = dateRange.from
      ? format(dateRange.from, "LLL dd, yyyy")
      : "";
    const toStr = dateRange.to ? format(dateRange.to, "LLL dd, yyyy") : "";
    return [fromStr, toStr].filter(Boolean).join(" – ") || "Date range";
  }, [dateRange]);

  const params = React.useMemo(() => {
    return {
      signer: walletAddress ?? "",
      page,
      orderBy,
      orderDirection,
      title: debouncedTitle || undefined,
      engagementId: debouncedEngagementId || undefined,
      isActive,
      validateOnChain,
      type: (type === "all" ? undefined : type) as
        | undefined
        | "single-release"
        | "multi-release",
      status: (status === "all" ? undefined : status) as
        | undefined
        | "working"
        | "pendingRelease"
        | "released"
        | "resolved"
        | "inDispute",
      minAmount: debouncedMinAmount ? Number(debouncedMinAmount) : undefined,
      maxAmount: debouncedMaxAmount ? Number(debouncedMaxAmount) : undefined,
      startDate: dateRange.from
        ? startOfDay(dateRange.from).toISOString()
        : undefined,
      endDate: dateRange.to ? endOfDay(dateRange.to).toISOString() : undefined,
      enabled: Boolean(walletAddress),
    };
  }, [
    walletAddress,
    page,
    orderBy,
    orderDirection,
    debouncedTitle,
    debouncedEngagementId,
    isActive,
    validateOnChain,
    type,
    status,
    debouncedMinAmount,
    debouncedMaxAmount,
    dateRange,
  ]);

  /**
   * Call the query to get the escrows from the Trustless Work Indexer
   *
   * @param params - The parameters for the query
   * @returns The query result
   */
  const query = useEscrowsBySignerQuery(params);
  const nextPageQuery = useEscrowsBySignerQuery({ ...params, page: page + 1 });

  const didMountValidateRef = React.useRef(false);
  React.useEffect(() => {
    if (!didMountValidateRef.current) {
      didMountValidateRef.current = true;
      return;
    }
    query.refetch();
    nextPageQuery.refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [validateOnChain]);

  const onClearFilters = React.useCallback(() => {
    setTitle("");
    setEngagementId("");
    setIsActive(true);
    setValidateOnChain(true);
    setType("all");
    setStatus("all");
    setMinAmount("");
    setMaxAmount("");
    setDateRange({ from: undefined, to: undefined });
    setPage(1);
    setOrderBy("createdAt");
    setOrderDirection("desc");
    setSorting([]);
  }, []);

  const handleSortingChange = React.useCallback(
    (updater: SortingState | ((old: SortingState) => SortingState)) => {
      setSorting((prev) => {
        const next =
          typeof updater === "function"
            ? (updater as (old: SortingState) => SortingState)(prev)
            : updater;
        const first = next[0];
        if (first) {
          if (
            first.id === "amount" ||
            first.id === "createdAt" ||
            first.id === "updatedAt"
          ) {
            setOrderBy(first.id as EscrowOrderBy);
            setOrderDirection(first.desc ? "desc" : "asc");
          }
        } else {
          setOrderBy("createdAt");
          setOrderDirection("desc");
        }
        return next;
      });
    },
    [],
  );

  return {
    walletAddress,
    data: query.data ?? ([] as Escrow[]),
    isLoading: query.isLoading,
    isError: query.isError,
    isFetching: query.isFetching,
    refetch: query.refetch,
    nextData: nextPageQuery.data ?? [],
    isFetchingNext: nextPageQuery.isFetching,
    page,
    setPage,
    orderBy,
    setOrderBy,
    orderDirection,
    setOrderDirection,
    sorting,
    setSorting,
    title,
    setTitle,
    engagementId,
    setEngagementId,
    isActive,
    setIsActive,
    validateOnChain,
    setValidateOnChain,
    type,
    setType,
    status,
    setStatus,
    minAmount,
    setMinAmount,
    maxAmount,
    setMaxAmount,
    dateRange,
    setDateRange,
    formattedRangeLabel,
    onClearFilters,
    handleSortingChange,
  } as const;
}
