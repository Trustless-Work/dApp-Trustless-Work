import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import CreateButton from "@/shared/utils/Create";
import Divider from "@/shared/utils/Divider";
import {
  Search,
  Trash2,
  Shield,
  Database,
  RefreshCcw,
  Download,
  FileSpreadsheet,
} from "lucide-react";
import { useEscrowFilter } from "../../hooks/useEscrowFilter";
import { getRoleActionIcons } from "@/shared/GetRoleActions";
import { useEscrowUIBoundedStore } from "../../store/ui";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/ui/dialog";
import { exportEscrowsToPDF } from "@/lib/pdf-export";
import type { Escrow } from "@/types/escrow.entity";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/ui/select";
import { DatePickerWithRange } from "@/ui/calendar-range";
import { getActiveOptionsFilters } from "../../constants/filters-options.constant";
import { useMemo, useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";

interface MyEscrowsFilterProps {
  escrows?: Escrow[];
  role?: string;
}
const MyEscrowsFilter = ({
  escrows = [],
  role = "signer",
}: MyEscrowsFilterProps) => {
  const { t } = useTranslation();
  const activeTab = useEscrowUIBoundedStore((state) => state.activeTab);
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);

  const handleExportPDF = () => {
    exportEscrowsToPDF(escrows, {
      title: `My Escrows - ${role.toUpperCase()} Role`,
      orientation: "landscape",
    });
  };

  const {
    search,
    engagement,
    active,
    uniqueEngagements,
    searchParams,
    mapNameParams,
    updateQuery,
    setSearch,
    deleteParams,
  } = useEscrowFilter(escrows);

  const activeOptions = useMemo(() => getActiveOptionsFilters(t), [t]);

  const handleRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      await queryClient.invalidateQueries({ queryKey: ["escrows"] });
    } finally {
      // slight delay so user can perceive the spin
      setTimeout(() => setRefreshing(false), 400);
    }
  }, [queryClient]);

  return (
    <>
      <form className="flex flex-col space-y-4 w-full">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Search and Clear Section */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full lg:w-auto">
            <div className="relative flex-1 min-w-0">
              <Input
                id="search"
                placeholder={t("myEscrows.filter.search.placeholder")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pr-8 w-full"
              />
              <Search className="h-4 w-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none" />
            </div>
            <Button
              variant="destructive"
              size="icon"
              className="shrink-0 self-end sm:self-auto"
              onClick={(e) => {
                e.preventDefault();
                deleteParams();
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Actions Section */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 lg:gap-4 justify-end">
            {/* Export Button */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 bg-transparent"
                >
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={handleExportPDF}
                  className="cursor-pointer"
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

            {/* Refresh Button */}
            <Button
              variant="outline"
              onClick={(e) => {
                e.preventDefault();
                handleRefresh();
              }}
              className="flex items-center gap-2"
            >
              <RefreshCcw
                className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
              />
            </Button>

            {/* Blockchain Sync Dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <motion.button
                  type="button"
                  className="flex items-center justify-center gap-2 px-3 py-2 text-xs text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors duration-200 whitespace-nowrap"
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="font-medium inline">
                    {t("myEscrows.blockchainSync.title")}
                  </span>
                </motion.button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <div className="flex items-center gap-3">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", damping: 15 }}
                      className="flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/50"
                    >
                      <div className="flex items-center gap-1">
                        <Shield className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        <Database className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      </div>
                    </motion.div>
                    <DialogTitle className="text-emerald-900 dark:text-emerald-100">
                      {t("myEscrows.blockchainSync.title")}
                    </DialogTitle>
                  </div>
                </DialogHeader>
                <DialogDescription className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {t("myEscrows.blockchainSync.description")}
                </DialogDescription>
              </DialogContent>
            </Dialog>

            {/* Role Actions Link */}
            <Link
              href="/dashboard/help#roles"
              className="flex items-center justify-center text-xs text-muted-foreground font-bold hover:underline px-3 py-2 rounded-lg hover:bg-muted/50 transition-colors"
            >
              {getRoleActionIcons(activeTab, t)}
            </Link>

            {/* Create Button */}
            <CreateButton
              label={t("myEscrows.filter.actions.create")}
              url={"/dashboard/escrow/initialize-escrow"}
              id="step-2"
            />
          </div>
        </div>

        <Divider type="horizontal" />

        <div className="grid grid-cols-4 gap-4">
          {/* Engagement */}
          <div className="flex flex-col">
            <label
              className="text-xs text-muted-foreground font-bold mb-2 ml-2"
              htmlFor="engagement"
            >
              {t("myEscrows.filter.engagement.label")}
            </label>
            <Select
              value={engagement}
              onValueChange={(value) => updateQuery("engagement", value)}
            >
              <SelectTrigger className="w-full">
                {searchParams.get("engagement") ||
                  t("myEscrows.filter.engagement.select")}
              </SelectTrigger>
              <SelectContent>
                {uniqueEngagements.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Visibility */}
          <div className="flex flex-col">
            <label
              className="text-xs text-muted-foreground font-bold mb-2 ml-2"
              htmlFor="active"
            >
              {t("myEscrows.filter.visibility.label")}
            </label>
            <Select
              value={active}
              onValueChange={(value) => updateQuery("active", value)}
            >
              <SelectTrigger className="w-full">
                {mapNameParams(active)}
              </SelectTrigger>
              <SelectContent>
                {activeOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Created At */}
          <div className="flex flex-col">
            <label
              className="text-xs text-muted-foreground font-bold mb-2 ml-2"
              htmlFor="dateRange"
            >
              {t("myEscrows.filter.date.label")}
            </label>
            <div className="w-full">
              <DatePickerWithRange className="w-full" />
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default MyEscrowsFilter;
