import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/calendar-range";
import CreateButton from "@/components/utils/ui/Create";
import Divider from "@/components/utils/ui/Divider";

const MyContactsFilter = () => {
  return (
    <form className="flex flex-col space-y-4 w-full">
      {/* Header Row */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-lg font-semibold">Filter Contacts</h2>
        <CreateButton
          className="shrink-0"
          label="Create Contact"
          url="/dashboard/contact/initialize-contact"
          id="step-2"
        />
      </div>

      <Divider type="horizontal" />

      {/* Filters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Name */}
        <div className="flex flex-col">
          <label className="text-xs text-muted-foreground font-bold mb-2 ml-2">
            Name
          </label>
          <Input placeholder="Search by name" />
        </div>

        {/* Email */}
        <div className="flex flex-col">
          <label className="text-xs text-muted-foreground font-bold mb-2 ml-2">
            Email
          </label>
          <Input placeholder="Search by email" />
        </div>

        {/* Wallet Type */}
        <div className="flex flex-col">
          <label className="text-xs text-muted-foreground font-bold mb-2 ml-2">
            Wallet Type
          </label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select wallet type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Albedo">Albedo</SelectItem>
              <SelectItem value="LOBSTR">LOBSTR</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Date Range */}
        <div className="flex flex-col">
          <label className="text-xs text-muted-foreground font-bold mb-2 ml-2">
            Created At
          </label>
          <DatePickerWithRange className="w-full" />
        </div>
      </div>
    </form>
  );
};

export default MyContactsFilter;
