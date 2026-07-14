"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  countActiveEscrowFilters,
  escrowListFiltersToSearchParams,
  parseEscrowListFiltersFromSearchParams,
} from "@/features/escrows/schemas/escrow-list-filters.schema";
import {
  DEFAULT_ESCROW_LIST_FILTERS,
  type EscrowListFilters,
} from "@/features/escrows/types/escrow.types";

const TEXT_DEBOUNCE_MS = 300;

const TEXT_KEYS = [
  "engagementId",
  "participant",
  "platformId",
  "subjectId",
] as const;

type TextFilterKey = (typeof TEXT_KEYS)[number];

function isTextFilterKey(key: keyof EscrowListFilters): key is TextFilterKey {
  return (TEXT_KEYS as readonly string[]).includes(key);
}

export function useEscrowListSearchParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters = useMemo(
    () => parseEscrowListFiltersFromSearchParams(searchParams),
    [searchParams],
  );

  const [draft, setDraft] = useState<EscrowListFilters>(filters);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setDraft(filters);
  }, [filters]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  const replaceFilters = useCallback(
    (next: EscrowListFilters) => {
      const params = escrowListFiltersToSearchParams(next);
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    },
    [pathname, router],
  );

  const setFilters = useCallback(
    (next: EscrowListFilters | ((prev: EscrowListFilters) => EscrowListFilters)) => {
      const resolved = typeof next === "function" ? next(draft) : next;
      setDraft(resolved);

      const hasTextChange = TEXT_KEYS.some(
        (key) => resolved[key] !== filters[key],
      );

      if (hasTextChange) {
        if (debounceRef.current) {
          clearTimeout(debounceRef.current);
        }
        debounceRef.current = setTimeout(() => {
          replaceFilters(resolved);
        }, TEXT_DEBOUNCE_MS);
        return;
      }

      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }
      replaceFilters(resolved);
    },
    [draft, filters, replaceFilters],
  );

  const setFilter = useCallback(
    <K extends keyof EscrowListFilters>(
      key: K,
      value: EscrowListFilters[K],
    ) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    [setFilters],
  );

  const setTextFilter = useCallback(
    (key: TextFilterKey, value: string) => {
      setDraft((prev) => {
        const next = { ...prev, [key]: value };
        if (debounceRef.current) {
          clearTimeout(debounceRef.current);
        }
        debounceRef.current = setTimeout(() => {
          replaceFilters(next);
        }, TEXT_DEBOUNCE_MS);
        return next;
      });
    },
    [replaceFilters],
  );

  const setContractIdsText = useCallback(
    (value: string) => {
      const contractIds = value
        .split(",")
        .map((part) => part.trim())
        .filter(Boolean);

      setDraft((prev) => {
        const next = { ...prev, contractIds };
        if (debounceRef.current) {
          clearTimeout(debounceRef.current);
        }
        debounceRef.current = setTimeout(() => {
          replaceFilters(next);
        }, TEXT_DEBOUNCE_MS);
        return next;
      });
    },
    [replaceFilters],
  );

  const resetFilters = useCallback(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
    setDraft({ ...DEFAULT_ESCROW_LIST_FILTERS, type: filters.type });
    replaceFilters({ ...DEFAULT_ESCROW_LIST_FILTERS, type: filters.type });
  }, [filters.type, replaceFilters]);

  const activeFilterCount = countActiveEscrowFilters(filters);

  return {
    filters,
    draft,
    setFilters,
    setFilter,
    setTextFilter,
    setContractIdsText,
    resetFilters,
    activeFilterCount,
    isTextFilterKey,
  };
}
