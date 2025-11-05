"use client";

import React from "react";
import { Card } from "@/ui/card";
import { Button } from "@/ui/button";
import type {
  GetEscrowsFromIndexerResponse as Escrow,
  Role,
  MultiReleaseMilestone,
} from "@trustless-work/escrow/types";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/table";
import { FileX, Loader2, Wallet, RefreshCw, AlertTriangle } from "lucide-react";
import { Filters } from "./Filters";
import { EscrowDetailDialog } from "../details/EscrowDetailDialog";
import { useEscrowDialogs } from "@/providers/EscrowDialogsProvider";
import { useEscrowContext } from "@/providers/EscrowProvider";
import { useEscrowsByRole } from "./useEscrowsByRole.shared";
import { formatTimestamp } from "../../helpers/format.helper";
import type { GetEscrowsFromIndexerByRoleParams } from "@trustless-work/escrow";

type EscrowsByRoleTableProps = {
  role?: GetEscrowsFromIndexerByRoleParams["role"];
};

export const EscrowsByRoleTable = ({ role }: EscrowsByRoleTableProps) => {
  const {
    walletAddress,
    data,
    isLoading,
    isError,
    refetch,
    isFetching,
    nextData,
    isFetchingNext,
    page,
    setPage,
    orderBy,
    setOrderBy,
    orderDirection,
    setOrderDirection,
    sorting,
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
    role: roleFromHook,
    setRole,
    onClearFilters,
    handleSortingChange,
  } = useEscrowsByRole({
    role,
    validateOnChainAlwaysTrue: true,
  });

  // Use role from props if provided, otherwise use from hook
  const effectiveRole = role ?? roleFromHook;

  const dialogStates = useEscrowDialogs();
  const { setSelectedEscrow } = useEscrowContext();

  const handleRefresh = React.useCallback(() => {
    void refetch();
  }, [refetch]);

  const setRoleStable = React.useCallback(
    (v: Role | undefined) => {
      if (v && setRole) setRole(v);
    },
    [setRole],
  );

  const columns = React.useMemo<ColumnDef<Escrow>[]>(
    () => [
      {
        header: "Title",
        accessorKey: "title",
        enableSorting: false,
        cell: ({ row }) => (
          <span
            className="max-w-[220px] truncate block"
            title={row.original.title}
          >
            {row.original.title}
          </span>
        ),
      },
      {
        header: "Engagement ID",
        accessorKey: "engagementId",
        enableSorting: false,
        meta: { className: "hidden sm:table-cell" },
        cell: ({ row }) => (
          <span
            className="max-w-[180px] truncate block"
            title={row.original.engagementId}
          >
            {row.original.engagementId}
          </span>
        ),
      },
      {
        header: "Amount",
        accessorKey: "amount",
        enableSorting: true,
        cell: ({ row }) => {
          // single release
          if (row.original.type === "single-release") {
            return row.original.amount;
          }
          // multi release
          return row.original.milestones.reduce(
            (acc, milestone) =>
              acc + (milestone as MultiReleaseMilestone).amount,
            0,
          );
        },
      },
      {
        header: "Balance",
        accessorKey: "balance",
        enableSorting: false,
        meta: { className: "hidden md:table-cell" },
        cell: ({ row }) => row.original.balance ?? 0,
      },
      {
        header: "Type",
        accessorKey: "type",
        enableSorting: false,
        meta: { className: "hidden lg:table-cell" },
      },
      {
        header: "Active",
        accessorKey: "isActive",
        enableSorting: false,
        meta: { className: "hidden md:table-cell" },
        cell: ({ row }) => (row.original.isActive ? "Yes" : "No"),
      },
      {
        header: "Trustline",
        id: "trustline",
        enableSorting: false,
        meta: { className: "hidden lg:table-cell" },
        cell: ({ row }) => (
          <span
            className="max-w-[220px] truncate block"
            title={`${row.original.trustline.name} (${row.original.trustline.address})`}
          >
            {row.original.trustline.name}
          </span>
        ),
      },
      {
        header: "Created",
        accessorKey: "createdAt",
        enableSorting: true,
        meta: { className: "hidden sm:table-cell" },
        cell: ({ row }) => formatTimestamp(row.original.createdAt),
      },
      {
        header: "Updated",
        accessorKey: "updatedAt",
        enableSorting: true,
        meta: { className: "hidden xl:table-cell" },
        cell: ({ row }) => formatTimestamp(row.original.updatedAt),
      },
      {
        header: "Actions",
        id: "actions",
        enableSorting: false,
        cell: ({ row }) => (
          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={() => {
              setSelectedEscrow(row.original);
              dialogStates.second.setIsOpen(true);
            }}
          >
            Details
          </Button>
        ),
      },
    ],
    [dialogStates.second.setIsOpen, setSelectedEscrow],
  );

  const table = useReactTable({
    data: React.useMemo(() => data ?? [], [data]),
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      sorting,
    },
    onSortingChange: handleSortingChange,
    manualSorting: true,
    enableSortingRemoval: true,
  });

  const escrows = data ?? [];

  return (
    <>
      <div className="w-full flex flex-col gap-4">
        <Filters
          title={title}
          engagementId={engagementId}
          isActive={isActive}
          validateOnChain={validateOnChain}
          type={type}
          status={status}
          minAmount={minAmount}
          maxAmount={maxAmount}
          dateRange={dateRange}
          formattedRangeLabel={formattedRangeLabel}
          role={effectiveRole}
          setTitle={setTitle}
          setEngagementId={setEngagementId}
          setIsActive={setIsActive}
          setValidateOnChain={setValidateOnChain}
          setType={setType}
          setStatus={setStatus}
          setMinAmount={setMinAmount}
          setMaxAmount={setMaxAmount}
          setDateRange={setDateRange}
          setRole={role ? undefined : setRoleStable}
          onClearFilters={onClearFilters}
          onRefresh={handleRefresh}
          isRefreshing={isFetching}
          orderBy={orderBy}
          orderDirection={orderDirection}
          setOrderBy={setOrderBy}
          setOrderDirection={setOrderDirection}
          validateOnChainDisabled={true}
          escrows={escrows}
          roleLabel={effectiveRole}
        />

        <Card className="w-full py-2 sm:py-4">
          <div className="mt-2 sm:mt-4 overflow-x-auto">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="text-xs sm:text-sm">
                    {headerGroup.headers.map((header) => {
                      const isSortable = header.column.getCanSort();
                      const sorted = header.column.getIsSorted();
                      const className =
                        typeof header.column.columnDef.meta === "object" &&
                        header.column.columnDef.meta &&
                        "className" in header.column.columnDef.meta
                          ? header.column.columnDef.meta.className
                          : "";
                      return (
                        <TableHead
                          key={header.id}
                          className={`select-none ${className}`}
                          onClick={
                            isSortable
                              ? header.column.getToggleSortingHandler()
                              : undefined
                          }
                          role={isSortable ? "button" : undefined}
                          aria-sort={
                            sorted
                              ? sorted === "desc"
                                ? "descending"
                                : "ascending"
                              : "none"
                          }
                        >
                          <div className="flex items-center gap-1">
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                            {isSortable && (
                              <span className="text-muted-foreground">
                                {sorted === "asc"
                                  ? "▲"
                                  : sorted === "desc"
                                    ? "▼"
                                    : ""}
                              </span>
                            )}
                          </div>
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {!walletAddress ? (
                  <TableRow>
                    <TableCell colSpan={table.getAllLeafColumns().length}>
                      <div className="p-6 md:p-8 flex flex-col items-center justify-center text-center">
                        <Wallet className="h-8 w-8 md:h-12 md:w-12 text-primary mb-3" />
                        <h3 className="font-medium text-foreground mb-2">
                          Connect your wallet
                        </h3>
                        <p className="text-sm text-muted-foreground max-w-sm">
                          To continue, connect your wallet and authorize the
                          application.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : isLoading ? (
                  <TableRow>
                    <TableCell colSpan={table.getAllLeafColumns().length}>
                      <div className="p-6 md:p-8 flex flex-col items-center justify-center text-center">
                        <Loader2 className="h-6 w-6 md:h-8 md:w-8 animate-spin text-primary mb-3" />
                        <p className="text-sm text-muted-foreground">
                          Loading escrows…
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : isError ? (
                  <TableRow>
                    <TableCell colSpan={table.getAllLeafColumns().length}>
                      <div className="p-6 md:p-8 flex flex-col items-center justify-center text-center">
                        <AlertTriangle className="h-8 w-8 md:h-10 md:w-10 text-destructive mb-3" />
                        <h3 className="font-medium text-foreground mb-2">
                          Error loading data
                        </h3>
                        <p className="text-sm text-muted-foreground max-w-sm mb-4">
                          An error occurred while loading the information.
                          Please try again.
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleRefresh}
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Retry
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : escrows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={table.getAllLeafColumns().length}>
                      <div className="p-6 md:p-8 flex flex-col items-center justify-center text-center">
                        <FileX className="h-8 w-8 md:h-10 md:w-10 text-muted-foreground/60 mb-3" />
                        <h3 className="font-medium text-foreground mb-2">
                          No data available
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          No escrows found for the selected filters.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  <>
                    {table.getRowModel().rows.map((row) => (
                      <TableRow key={row.id} className="text-xs sm:text-sm">
                        {row.getVisibleCells().map((cell) => {
                          const className =
                            typeof cell.column.columnDef.meta === "object" &&
                            cell.column.columnDef.meta &&
                            "className" in cell.column.columnDef.meta
                              ? (cell.column.columnDef.meta.className as string)
                              : "";
                          return (
                            <TableCell key={cell.id} className={className}>
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext(),
                              )}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))}
                  </>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="text-xs sm:text-sm text-muted-foreground">
              Page {page}
            </div>
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1 || isFetching}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                onClick={() => setPage((p) => p + 1)}
                disabled={
                  isFetching ||
                  !walletAddress ||
                  ((nextData?.length ?? 0) === 0 && !isFetchingNext)
                }
              >
                Next
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Dialog */}
      {dialogStates.second.isOpen ? (
        <EscrowDetailDialog
          isDialogOpen={dialogStates.second.isOpen}
          setIsDialogOpen={dialogStates.second.setIsOpen}
          setSelectedEscrow={setSelectedEscrow}
        />
      ) : null}
    </>
  );
};
