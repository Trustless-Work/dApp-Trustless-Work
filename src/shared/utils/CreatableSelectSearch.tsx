/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState } from "react";
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
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/ui/command";
import { cn } from "@/lib/utils";

interface CreatableSelectFieldProps {
  control: any;
  name: string;
  label: string;
  tooltipContent: string;
  options: { value: string | undefined; label: string }[];
  className?: string;
  required?: boolean;
  placeholder?: string;
  searchPlaceholder?: string;
  createLabel?: (query: string) => string;
  onSelect?: (option: {
    value: string;
    label: string;
    isCustom: boolean;
  }) => void;
}

const CreatableSelectField: React.FC<CreatableSelectFieldProps> = ({
  control,
  name,
  label,
  tooltipContent,
  options,
  className,
  required,
  placeholder = "Select or type a value",
  searchPlaceholder = "Search or enter a custom value...",
  createLabel = (query) => `Use "${query}"`,
  onSelect,
}) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const matchingOption = options.find((opt) => opt.value === field.value);
        const hasCustomValue = Boolean(field.value) && !matchingOption;

        const displayLabel = matchingOption
          ? matchingOption.label
          : hasCustomValue
            ? (field.value as string)
            : placeholder;

        const trimmedQuery = query.trim();
        const queryMatchesOption = options.some(
          (opt) =>
            opt.value === trimmedQuery ||
            opt.label.toLowerCase() === trimmedQuery.toLowerCase(),
        );
        const showCreateOption = trimmedQuery.length > 0 && !queryMatchesOption;

        const handleSelectValue = (
          value: string,
          meta: { label: string; isCustom: boolean },
        ) => {
          field.onChange(value);
          onSelect?.({ value, label: meta.label, isCustom: meta.isCustom });
          setQuery("");
          setOpen(false);
        };

        return (
          <FormItem className={className}>
            {label && (
              <FormLabel className="flex items-center">
                {label}{" "}
                {required && <span className="text-destructive ml-1">*</span>}
                {tooltipContent && <TooltipInfo content={tooltipContent} />}
              </FormLabel>
            )}
            <Popover
              open={open}
              onOpenChange={(next) => {
                setOpen(next);
                if (!next) setQuery("");
              }}
            >
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn(
                      "w-full justify-between font-normal",
                      !field.value && "text-muted-foreground",
                    )}
                  >
                    <span className="truncate">{displayLabel}</span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent
                className="w-[--radix-popover-trigger-width] p-0 z-50"
                align="start"
                sideOffset={4}
              >
                <Command
                  shouldFilter={true}
                  className="rounded-md border bg-popover shadow-md"
                >
                  <CommandInput
                    placeholder={searchPlaceholder}
                    value={query}
                    onValueChange={setQuery}
                  />
                  <CommandList>
                    {!showCreateOption && (
                      <CommandEmpty>No results found.</CommandEmpty>
                    )}
                    <CommandGroup>
                      {options.map((option) => (
                        <CommandItem
                          key={option.value ?? option.label}
                          value={`${option.label} ${option.value ?? ""}`}
                          onSelect={() =>
                            handleSelectValue(option.value ?? "", {
                              label: option.label,
                              isCustom: false,
                            })
                          }
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              field.value === option.value
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                          <span className="truncate">{option.label}</span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                    {showCreateOption && (
                      <CommandGroup heading="Custom">
                        <CommandItem
                          value={`__create_${trimmedQuery}`}
                          onSelect={() =>
                            handleSelectValue(trimmedQuery, {
                              label: trimmedQuery,
                              isCustom: true,
                            })
                          }
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          <span className="truncate">
                            {createLabel(trimmedQuery)}
                          </span>
                        </CommandItem>
                      </CommandGroup>
                    )}
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

export default CreatableSelectField;
