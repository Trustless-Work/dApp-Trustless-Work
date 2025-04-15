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
} from "./constants/filters-options.constant";

const MyEscrowsFilter = () => {
  const {
    search,
    status,
    amountRange,
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

        <CreateButton
          className="mr-auto w-full md:w-auto"
          label="Create Escrow"
          url={"/dashboard/escrow/initialize-escrow"}
          id="step-2"
        />
      </div>

      <Divider type="horizontal" />

      <div className="flex flex-col md:flex-row gap-3 w-full md:w-1/3">
        <div className="flex flex-col w-full">
          <label className="text-xs font-bold mb-2 ml-2" htmlFor="status">
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

        <div className="flex flex-col w-full">
          <label className="text-xs font-bold mb-2 ml-2" htmlFor="amount">
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
      </div>
    </form>
  );
};

export default MyEscrowsFilter;
