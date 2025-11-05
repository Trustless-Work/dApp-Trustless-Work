"use client";

import React from "react";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Checkbox } from "@/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/ui/popover";
import { Calendar } from "@/ui/calendar";
import type { DateRange as DayPickerDateRange } from "react-day-picker";
import {
  RefreshCcw,
  Trash2,
  Search,
  DollarSign,
  Filter as FilterIcon,
  Calendar as CalendarIcon,
  SlidersHorizontal,
  Download,
  FileSpreadsheet,
} from "lucide-react";
import { exportEscrowsToPDF } from "@/lib/pdf-export";
import type { Escrow } from "@/types/escrow.entity";
import type { GetEscrowsFromIndexerResponse } from "@trustless-work/escrow/types";
import {
  Select as OrderSelect,
  SelectTrigger as OrderSelectTrigger,
  SelectContent as OrderSelectContent,
  SelectItem as OrderSelectItem,
  SelectValue as OrderSelectValue,
} from "@/ui/select";
import type { Role } from "@trustless-work/escrow/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/ui/dropdown-menu";

type FiltersProps = {
  // values
  title: string;
  engagementId: string;
  isActive: boolean;
  validateOnChain: boolean;
  type: "single-release" | "multi-release" | "all";
  status:
    | "working"
    | "pendingRelease"
    | "released"
    | "resolved"
    | "inDispute"
    | "all";
  minAmount: string;
  maxAmount: string;
  dateRange: DayPickerDateRange;
  formattedRangeLabel: string;
  role?: Role;

  // setters
  setTitle: (v: string) => void;
  setEngagementId: (v: string) => void;
  setIsActive: (v: boolean) => void;
  setValidateOnChain: (v: boolean) => void;
  setType: (v: "single-release" | "multi-release" | "all") => void;
  setStatus: (
    v:
      | "working"
      | "pendingRelease"
      | "released"
      | "resolved"
      | "inDispute"
      | "all",
  ) => void;
  setMinAmount: (v: string) => void;
  setMaxAmount: (v: string) => void;
  setDateRange: (r: DayPickerDateRange) => void;
  setRole?: (v: Role | undefined) => void;

  // actions
  onClearFilters: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;

  // ordering
  orderBy: "createdAt" | "updatedAt" | "amount";
  orderDirection: "asc" | "desc";
  setOrderBy: (v: "createdAt" | "updatedAt" | "amount") => void;
  setOrderDirection: (v: "asc" | "desc") => void;

  // options
  validateOnChainDisabled?: boolean;

  // export
  escrows?: (Escrow | GetEscrowsFromIndexerResponse)[];
  roleLabel?: string;
};

export const Filters = ({
  title,
  engagementId,
  isActive,
  validateOnChain,
  type,
  status,
  minAmount,
  maxAmount,
  dateRange,
  formattedRangeLabel,
  role,
  isRefreshing,
  orderBy,
  orderDirection,
  setTitle,
  setEngagementId,
  setIsActive,
  setValidateOnChain,
  setType,
  setStatus,
  setMinAmount,
  setMaxAmount,
  setDateRange,
  setRole,
  onClearFilters,
  onRefresh,
  setOrderBy,
  setOrderDirection,
  validateOnChainDisabled = false,
  escrows = [],
  roleLabel,
}: FiltersProps) => {
  // Ensure validateOnChain is always true
  React.useEffect(() => {
    if (!validateOnChain) {
      setValidateOnChain(true);
    }
  }, [validateOnChain, setValidateOnChain]);

  const handleExportPDF = React.useCallback(() => {
    if (escrows.length === 0) return;
    const title = roleLabel
      ? `My Escrows - ${roleLabel.toUpperCase()} Role`
      : "My Escrows Report";
    // Cast to Escrow[] for PDF export compatibility
    exportEscrowsToPDF(escrows as Escrow[], {
      title,
      orientation: "landscape",
    });
  }, [escrows, roleLabel]);
  return (
    <div className="w-full bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-4 shadow-sm">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-foreground">Filters</h3>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-3 text-xs font-medium border-border/60 bg-background/80 hover:bg-muted/80 transition-colors cursor-pointer"
            onClick={onRefresh}
            disabled={isRefreshing}
          >
            <RefreshCcw
              className={`w-3 h-3 ${isRefreshing ? "animate-spin" : ""}`}
            />
            <span className="hidden xs:inline">Refresh</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-3 text-xs font-medium text-destructive hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
            onClick={onClearFilters}
          >
            <Trash2 className="w-3 h-3" />
            <span className="hidden xs:inline">Clear</span>
          </Button>
        </div>
      </div>

      {/* Filters Grid */}
      <div className="space-y-4">
        {/* Row 1: Search, ID, Role, Amount Range, and Type */}
        <div
          className={`grid grid-cols-1 md:grid-cols-2 ${setRole ? "lg:grid-cols-5" : "lg:grid-cols-4"} gap-3`}
        >
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-9 pl-9 text-sm border-border/60 focus:border-primary/60 bg-background/80 transition-colors w-full"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Engagement ID
            </label>
            <div className="relative">
              <FilterIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Engagement ID"
                value={engagementId}
                onChange={(e) => setEngagementId(e.target.value)}
                className="h-9 pl-9 text-sm border-border/60 focus:border-primary/60 bg-background/80 transition-colors w-full"
              />
            </div>
          </div>

          {setRole && (
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                Role
              </label>
              <div className="w-full">
                <Select value={role} onValueChange={(v) => setRole(v as Role)}>
                  <SelectTrigger className="h-9 text-sm border-border/60 bg-background/80 w-full">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="approver">Approver</SelectItem>
                    <SelectItem value="serviceProvider">
                      Service Provider
                    </SelectItem>
                    <SelectItem value="platformAddress">
                      Platform Address
                    </SelectItem>
                    <SelectItem value="releaseSigner">
                      Release Signer
                    </SelectItem>
                    <SelectItem value="disputeResolver">
                      Dispute Resolver
                    </SelectItem>
                    <SelectItem value="receiver">Receiver</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Amount Range
            </label>
            <div className="w-full">
              <div className="flex items-center gap-2 w-full">
                <div className="relative flex-1">
                  <DollarSign className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-muted-foreground" />
                  <Input
                    placeholder="Min"
                    type="number"
                    min="0"
                    value={minAmount}
                    onChange={(e) => setMinAmount(e.target.value)}
                    className="h-9 pl-7 text-sm border-border/60 focus:border-primary/60 bg-background/80 w-full"
                  />
                </div>
                <span className="text-xs text-muted-foreground px-1">-</span>
                <div className="relative flex-1">
                  <DollarSign className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-muted-foreground" />
                  <Input
                    placeholder="Max"
                    type="number"
                    min="0"
                    value={maxAmount}
                    onChange={(e) => setMaxAmount(e.target.value)}
                    className="h-9 pl-7 text-sm border-border/60 focus:border-primary/60 bg-background/80 w-full"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Type
            </label>
            <div className="w-full">
              <Select
                value={type}
                onValueChange={(v) => setType(v as typeof type)}
              >
                <SelectTrigger className="h-9 text-sm border-border/60 bg-background/80 w-full">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All types</SelectItem>
                  <SelectItem value="single-release">Single release</SelectItem>
                  <SelectItem value="multi-release">Multi release</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Row 2: Status, Date Range, Active Checkbox, and Ordering */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Status
            </label>
            <div className="w-full">
              <Select
                value={status}
                onValueChange={(v) => setStatus(v as typeof status)}
              >
                <SelectTrigger className="h-9 text-sm border-border/60 bg-background/80 w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="working">Working</SelectItem>
                  <SelectItem value="pendingRelease">
                    Pending release
                  </SelectItem>
                  <SelectItem value="released">Released</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="inDispute">In dispute</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Date Range
            </label>
            <div className="w-full">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 text-sm border-border/60 bg-background/80 hover:bg-muted/80 w-full justify-start transition-colors"
                  >
                    <CalendarIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="truncate">{formattedRangeLabel}</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <div className="p-3">
                    <Calendar
                      mode="range"
                      selected={dateRange}
                      onSelect={(range: DayPickerDateRange | undefined) =>
                        setDateRange(
                          range ?? { from: undefined, to: undefined },
                        )
                      }
                      numberOfMonths={2}
                    />
                    <div className="mt-3 flex justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setDateRange({ from: undefined, to: undefined })
                        }
                      >
                        Clear
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Active / Export
            </label>
            <div className="w-full lg:w-auto lg:min-w-fit">
              <div className="grid grid-cols-2 gap-2 w-full lg:w-auto">
                <div className="flex items-center justify-center lg:justify-start gap-2 h-9 px-3 rounded-md border border-border/60 bg-background/80 w-full lg:w-auto">
                  <Checkbox
                    checked={Boolean(isActive)}
                    onCheckedChange={(checked) => setIsActive(Boolean(checked))}
                  />
                  <span className="text-sm text-foreground font-medium whitespace-nowrap">
                    Active
                  </span>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2 bg-transparent"
                      disabled={escrows.length === 0}
                    >
                      <Download className="h-4 w-4" />
                      Export
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={handleExportPDF}
                      className="cursor-pointer"
                      disabled={escrows.length === 0}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export as PDF
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      disabled
                      className="cursor-not-allowed opacity-50"
                    >
                      <FileSpreadsheet className="h-4 w-4 mr-2" />
                      Export as Excel (Coming Soon)
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          <div className="space-y-1.5 w-full lg:col-span-2">
            <label className="text-xs font-medium text-muted-foreground">
              Sort By
            </label>
            <div className="w-full">
              <div className="flex items-center gap-2 w-full">
                <div className="flex-1">
                  <OrderSelect
                    value={orderBy}
                    onValueChange={(v) => setOrderBy(v as typeof orderBy)}
                  >
                    <OrderSelectTrigger className="h-9 text-sm border-border/60 bg-background/80 w-full">
                      <OrderSelectValue placeholder="Order by" />
                    </OrderSelectTrigger>
                    <OrderSelectContent>
                      <OrderSelectItem value="createdAt">
                        Created
                      </OrderSelectItem>
                      <OrderSelectItem value="updatedAt">
                        Updated
                      </OrderSelectItem>
                      <OrderSelectItem value="amount">Amount</OrderSelectItem>
                    </OrderSelectContent>
                  </OrderSelect>
                </div>
                <div className="flex-1">
                  <OrderSelect
                    value={orderDirection}
                    onValueChange={(v) =>
                      setOrderDirection(v as typeof orderDirection)
                    }
                  >
                    <OrderSelectTrigger className="h-9 text-sm border-border/60 bg-background/80 w-full">
                      <OrderSelectValue placeholder="Direction" />
                    </OrderSelectTrigger>
                    <OrderSelectContent>
                      <OrderSelectItem value="desc">Descending</OrderSelectItem>
                      <OrderSelectItem value="asc">Ascending</OrderSelectItem>
                    </OrderSelectContent>
                  </OrderSelect>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
