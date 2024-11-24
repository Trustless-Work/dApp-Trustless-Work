import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { statusOptions } from "@/constants/escrow/StatusOptions";
import { Button } from "@/components/ui/button";
import { useInitializeEscrowHook } from "../hooks/initialize-escrow.hook";

interface PopoverCategoryProps {
  milestone: { description: string; status: string };
  index: number;
}

const PopoverCategory = ({ milestone, index }: PopoverCategoryProps) => {
  const { form, milestones } = useInitializeEscrowHook();

  console.log(milestones);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-[200px] justify-between"
        >
          {milestone.status
            ? statusOptions.find((option) => option.value === milestone.status)
                ?.label
            : "Select Status"}
          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search status..." />
          <CommandList>
            <CommandEmpty>No status found.</CommandEmpty>
            <CommandGroup>
              {statusOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => {
                    const updatedMilestones = [...milestones];
                    updatedMilestones[index].status = option.value;
                    form.setValue("milestones", updatedMilestones);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      milestone.status === option.value
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default PopoverCategory;
