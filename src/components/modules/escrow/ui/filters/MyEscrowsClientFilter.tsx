import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import Divider from "@/components/utils/Divider";
import { Search, Trash2 } from "lucide-react";

const MyEscrowsClientFilter = () => {
  return (
    <form className="flex flex-col space-y-5">
      <div className="flex flex-col w-1/4">
        <div className="flex items-center space-x-2">
          <Input id="search" placeholder="Search..." />
          <Search className="h-5 w-5" />
        </div>
      </div>

      <Divider type="horizontal" />

      <div className="flex gap-3">
        <div className="flex flex-col">
          <label className="text-xs font-bold mb-2 ml-2" htmlFor="select1">
            Filtro 1
          </label>
          <Select>
            <SelectTrigger>
              <span>Selecciona una opción</span>
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
            Filtro 2
          </label>
          <Select>
            <SelectTrigger>
              <span>Selecciona otra opción</span>
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

export default MyEscrowsClientFilter;
