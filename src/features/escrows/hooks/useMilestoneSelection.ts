"use client";

import { useCallback, useMemo, useState } from "react";

export function useMilestoneSelection(milestoneCount: number) {
  const [selected, setSelected] = useState<ReadonlySet<number>>(
    () => new Set(),
  );

  const selectedIndexes = useMemo(
    () => Array.from(selected).sort((left, right) => left - right),
    [selected],
  );

  const allSelected =
    milestoneCount > 0 && selected.size === milestoneCount;

  const someSelected = selected.size > 0 && !allSelected;

  const isSelected = useCallback(
    (index: number) => selected.has(index),
    [selected],
  );

  const toggle = useCallback((index: number) => {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }, []);

  const toggleAll = useCallback(() => {
    setSelected((current) => {
      if (milestoneCount === 0) {
        return current;
      }

      if (current.size === milestoneCount) {
        return new Set();
      }

      return new Set(
        Array.from({ length: milestoneCount }, (_, index) => index),
      );
    });
  }, [milestoneCount]);

  const clear = useCallback(() => {
    setSelected(new Set());
  }, []);

  const setChecked = useCallback((index: number, checked: boolean) => {
    setSelected((current) => {
      const next = new Set(current);
      if (checked) {
        next.add(index);
      } else {
        next.delete(index);
      }
      return next;
    });
  }, []);

  return {
    selected,
    selectedIndexes,
    selectedCount: selected.size,
    allSelected,
    someSelected,
    isSelected,
    toggle,
    toggleAll,
    setChecked,
    clear,
  };
}
