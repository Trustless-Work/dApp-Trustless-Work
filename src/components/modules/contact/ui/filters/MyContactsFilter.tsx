import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Search, Trash2 } from "lucide-react";
import { useState } from "react";

interface MyContactsFilterProps {
  onFilter: (query: string) => void;
  onClear: () => void;
}

const MyContactsFilter = ({ onFilter, onClear }: MyContactsFilterProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [role, setRole] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onFilter(value);
  };

  const handleClear = () => {
    setSearchTerm("");
    setRole("");
    onClear();
  };

  return (
    <form className="flex flex-col space-y-5">
      <div className="flex flex-row justify-between w-full gap-10">
        <div className="flex items-center space-x-2 w-full">
          <Input
            id="search"
            placeholder="Search Contacts..."
            value={searchTerm}
            onChange={handleInputChange}
          />
          <Search className="h-5 w-5" />
        </div>

        <Button
          variant="destructive"
          className="flex items-center space-x-2"
          onClick={(e) => {
            e.preventDefault();
            handleClear();
          }}
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex gap-4">
        <Select
          value={role}
          onValueChange={(value) => {
            setRole(value);
            onFilter(value);
          }}
        >
          <SelectTrigger>{role || "Select Role"}</SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Roles</SelectItem>
            <SelectItem value="BUYER">Buyer</SelectItem>
            <SelectItem value="SELLER">Seller</SelectItem>
            <SelectItem value="AGENT">Agent</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </form>
  );
};

export default MyContactsFilter;
