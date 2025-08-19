/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useEffect } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/ui/form";
import TooltipInfo from "./Tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { Button } from "@/ui/button";
import { ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/ui/command";

interface SelectFieldProps {
  control: any;
  name: string;
  label: string;
  tooltipContent: string;
  options: { value: string | undefined; label: string }[];
  className?: string;
  required?: boolean;
}

const SelectField: React.FC<SelectFieldProps> = ({
  control,
  name,
  label,
  tooltipContent,
  options,
  className,
  required,
}) => {
  const [open, setOpen] = useState(false);
  const [, setSelected] = useState(options[0]);

  const handleSelect = (option: {
    value: string | undefined;
    label: string;
  }) => {
    setSelected(option);
    setOpen(false);
  };

  // Move useEffect to component level
  useEffect(() => {
    const fieldValue = control._formValues[name];
    if (fieldValue) {
      const matchingOption = options.find((opt) => opt.value === fieldValue);
      if (matchingOption) {
        setSelected(matchingOption);
      }
    }
  }, [control._formValues, name, options]);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        // Find the option that matches the current field value
        const currentOption =
          options.find((opt) => opt.value === field.value) || options[0];

        return (
          <FormItem className={className}>
            {label && (
              <FormLabel className="flex items-center">
                {label}{" "}
                {required && <span className="text-destructive ml-1">*</span>}
                {tooltipContent && <TooltipInfo content={tooltipContent} />}
              </FormLabel>
            )}
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                  >
                    {currentOption.label}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search..." />
                  <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup>
                      {options.map((option) => (
                        <CommandItem
                          key={option.value}
                          onSelect={() => {
                            handleSelect(option);
                            field.onChange(option.value);
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
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export default SelectField;
