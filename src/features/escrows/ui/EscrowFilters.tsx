"use client";

import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  EscrowFilterStatus,
  EscrowFilters,
} from "@/features/escrows/types/escrow.types";

type EscrowFiltersProps = {
  filters: EscrowFilters;
  onChange: (filters: EscrowFilters) => void;
};

const STATUS_OPTIONS: { value: EscrowFilterStatus; label: string }[] = [
  { value: "all", label: "All statuses" },
  { value: "active", label: "Active" },
  { value: "released", label: "Released" },
  { value: "disputed", label: "Disputed" },
];

export const EscrowFiltersBar = ({
  filters,
  onChange,
}: EscrowFiltersProps) => {
  return (
    <div className="rounded-xl border border-border bg-card p-3 md:p-4">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_220px]">
        <div className="relative">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={filters.search}
            onChange={(event) =>
              onChange({ ...filters, search: event.target.value })
            }
            placeholder="Search by title or engagement ID"
            className="pl-9"
          />
        </div>

        <Select
          value={filters.status}
          onValueChange={(value) =>
            onChange({
              ...filters,
              status: value as EscrowFilterStatus,
            })
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
