/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import TooltipInfo from "./Tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { Button } from "../ui/button";
import { ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { useInitializeEscrowHook } from "../modules/escrow/hooks/initialize-escrow.hook";

interface SelectFieldProps {
  control: any;
  name: string;
  label: string;
  tooltipContent: string;
  options: { value: string | undefined; label: string }[];
}

const SelectField: React.FC<SelectFieldProps> = ({
  control,
  name,
  label,
  tooltipContent,
  options,
}) => {
  const { handleFieldChange } = useInitializeEscrowHook();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(options[0]);

  const handleSelect = (option: {
    value: string | undefined;
    label: string;
  }) => {
    setSelected(option);
    handleFieldChange(name, option.value);
    setOpen(false);
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem>
            {label && (
              <FormLabel className="flex items-center">
                {label}
                {tooltipContent && <TooltipInfo content={tooltipContent} />}
              </FormLabel>
            )}
            <FormControl>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between"
                    aria-expanded={open}
                    onClick={() => setOpen(!open)}
                  >
                    {selected ? selected.label : "Select"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-52 p-0">
                  <Command>
                    <CommandInput placeholder="Search..." />
                    <CommandList>
                      <CommandEmpty>No options found.</CommandEmpty>
                      <CommandGroup>
                        {options.map((option) => (
                          <CommandItem
                            key={option.value}
                            onSelect={() => {
                              setSelected(option);
                              field.onChange(option.value);
                              handleSelect(option);
                            }}
                          >
                            {option.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export default SelectField;
