import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import CreateButton from "@/components/utils/ui/Create";
import Divider from "@/components/utils/ui/Divider";
import { Search, Trash2 } from "lucide-react";
import { useEscrowFilter } from "./hooks/escrow-filter.hook";
import {
  amountOptionsFilters,
  statusOptionsFilters,
  activeOptionsFilters,
} from "./constants/filters-options.constant";
import { getRoleActionIcons } from "@/utils/get-role-actions";
import { useEscrowUIBoundedStore } from "../../store/ui";
import Link from "next/link";
import { DatePickerWithRange } from "@/components/ui/calendar-range";
import { useTranslation } from "react-i18next";

const MyEscrowsFilter = () => {
  const { t } = useTranslation();
  const activeTab = useEscrowUIBoundedStore((state) => state.activeTab);

  const {
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
  } = useEscrowFilter();

  return (
    <form className="flex flex-col space-y-4 w-full">
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        <div className="flex flex-row items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-[300px]">
            <Input
              id="search"
              placeholder={t("myEscrows.filter.search.placeholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pr-8"
            />
            <Search className="h-4 w-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          </div>
          <Button
            variant="destructive"
            size="icon"
            className="shrink-0"
            onClick={(e) => {
              e.preventDefault();
              deleteParams();
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-4 justify-end">
          <Link
            href="/dashboard/help#roles"
            className="text-xs text-muted-foreground font-bold hover:underline"
          >
            {getRoleActionIcons(activeTab, t)}
          </Link>

          <CreateButton
            className="shrink-0"
            label={t("myEscrows.filter.actions.create")}
            url={"/dashboard/escrow/initialize-escrow"}
            id="step-2"
          />
        </div>
      </div>

      <Divider type="horizontal" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Status */}
        <div className="flex flex-col">
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
              {statusOptionsFilters.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Amount */}
        <div className="flex flex-col">
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
              {amountOptionsFilters.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

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
              {activeOptionsFilters.map((opt) => (
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
  );
};

export default MyEscrowsFilter;
