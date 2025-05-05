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

const MyEscrowsFilter = () => {
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
    <form className="flex flex-col space-y-5">
      <div className="flex flex-col md:flex-row justify-between w-full gap-10">
        <div className="flex flex-col md:flex-row gap-10 w-full md:w-1/4">
          <div className="flex items-center space-x-2 w-full">
            <Input
              id="search"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search className="h-5 w-5" />
          </div>
          <Button
            variant="destructive"
            className="flex items-center space-x-2"
            onClick={(e) => {
              e.preventDefault();
              deleteParams();
            }}
          >
            <Trash2 className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex items-center gap-4">
          {/* Actions */}
          <Link
            href="/dashboard/help#roles"
            className="text-xs text-muted-foreground font-bold text-end hover:underline"
          >
            {getRoleActionIcons(activeTab)}
          </Link>

          <CreateButton
            className="mr-auto w-full md:w-auto"
            label="Create Escrow"
            url={"/dashboard/escrow/initialize-escrow"}
            id="step-2"
          />
        </div>
      </div>

      <Divider type="horizontal" />

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 w-full md:w-4/5">
        {/* Status */}
        <div className="flex flex-col">
          <label
            className="text-xs text-muted-foreground font-bold mb-2 ml-2"
            htmlFor="status"
          >
            Status
          </label>
          <Select
            value={status}
            onValueChange={(value) => updateQuery("status", value)}
          >
            <SelectTrigger>
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
            Amount Range
          </label>
          <Select
            value={amountRange}
            onValueChange={(value) => updateQuery("amount", value)}
          >
            <SelectTrigger>
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
            Engagements
          </label>
          <Select
            value={engagement}
            onValueChange={(value) => updateQuery("engagement", value)}
          >
            <SelectTrigger>
              {searchParams.get("engagement") || "Select Engagement"}
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
            Visibility
          </label>
          <Select
            value={active}
            onValueChange={(value) => updateQuery("active", value)}
          >
            <SelectTrigger>{mapNameParams(active)}</SelectTrigger>
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
            Created At
          </label>
          <DatePickerWithRange />
        </div>
      </div>
    </form>
  );
};

export default MyEscrowsFilter;
