import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CreateButton from "@/components/utils/ui/Create";
import Divider from "@/components/utils/ui/Divider";
import { Search, Trash2, Shield, Database } from "lucide-react";
import { useEscrowFilter } from "./hooks/escrow-filter.hook";
import { getRoleActionIcons } from "@/utils/get-role-actions";
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
} from "@/components/ui/dialog";
import { Download, FileSpreadsheet } from "lucide-react";
import { exportEscrowsToPDF } from "@/utils/pdf-export";
import type { Escrow } from "@/@types/escrow.entity";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  const handleExportPDF = () => {
    exportEscrowsToPDF(escrows, {
      title: `My Escrows - ${role.toUpperCase()} Role`,
      orientation: "landscape",
    });
  };
  const {
    search,
    // status,
    // amountRange,
    // engagement,
    // active,
    // uniqueEngagements,
    // searchParams,
    // mapNameParams,
    // updateQuery,
    setSearch,
    deleteParams,
  } = useEscrowFilter();

  // const amountOptions = getAmountOptionsFilters(t);
  // const statusOptions = getStatusOptionsFilters(t);
  // const activeOptions = getActiveOptionsFilters(t);

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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Status */}
          {/* <div className="flex flex-col">
            <label
              className="text-xs text-muted-foreground font-bold mb-2 ml-2"
              htmlFor="status"
            >
              {t("myEscrows.filter.status.label")}
            </label>
            <Select
              value={status}
              onValueChange={(value) => updateQuery("status", value)}
            >
              <SelectTrigger className="w-full">
                {mapNameParams(searchParams.get("status") || "")}
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div> */}

          {/* Amount */}
          {/* <div className="flex flex-col">
            <label
              className="text-xs text-muted-foreground font-bold mb-2 ml-2"
              htmlFor="amount"
            >
              {t("myEscrows.filter.amount.label")}
            </label>
            <Select
              value={amountRange}
              onValueChange={(value) => updateQuery("amount", value)}
            >
              <SelectTrigger className="w-full">
                {mapNameParams(searchParams.get("amount") || "")}
              </SelectTrigger>
              <SelectContent>
                {amountOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div> */}

          {/* Engagement */}
          {/* <div className="flex flex-col">
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
          </div> */}

          {/* Visibility */}
          {/* <div className="flex flex-col">
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
          </div> */}

          {/* Created At */}
          {/* <div className="flex flex-col">
            <label
              className="text-xs text-muted-foreground font-bold mb-2 ml-2"
              htmlFor="dateRange"
            >
              {t("myEscrows.filter.date.label")}
            </label>
            <div className="w-full">
              <DatePickerWithRange className="w-full" />
            </div>
          </div> */}
        </div>
      </form>
    </>
  );
};

export default MyEscrowsFilter;
