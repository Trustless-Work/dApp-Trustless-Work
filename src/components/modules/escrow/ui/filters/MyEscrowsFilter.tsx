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

const MyEscrowsFilter = () => {
  return (
    <form className="flex flex-col space-y-5">
      <div className="flex flex-col md:flex-row justify-between w-full gap-10">
        <div className="flex flex-col md:flex-row gap-10">
          <div className="flex items-center space-x-2">
            <Input id="search" placeholder="Search..." />
            <Search className="h-5 w-5" />
          </div>
          <Button variant="destructive" className="flex items-center space-x-2">
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

      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex flex-col">
          <label className="text-xs font-bold mb-2 ml-2" htmlFor="select1">
            Filter 1
          </label>
          <Select>
            <SelectTrigger>
              <span>Select an option</span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="option1">Opción 1</SelectItem>
              <SelectItem value="option2">Opción 2</SelectItem>
              <SelectItem value="option3">Opción 3</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col">
          <label className="text-xs font-bold mb-2 ml-2" htmlFor="select1">
            Filter 2
          </label>
          <Select>
            <SelectTrigger>
              <span>Select an option</span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="optionA">Opción A</SelectItem>
              <SelectItem value="optionB">Opción B</SelectItem>
              <SelectItem value="optionC">Opción C</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </form>
  );
};

export default MyEscrowsFilter;
