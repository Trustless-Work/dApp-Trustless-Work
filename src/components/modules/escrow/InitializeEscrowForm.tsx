"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FaRegTrashCan } from "react-icons/fa6";
import { useInitializeEscrowHook } from "@/components/modules/escrow/hooks/initialize-escrow.hook";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { statusOptions } from "@/constants/escrow/StatusOptions";
import { cn } from "@/lib/utils";

export function InitializeEscrowForm() {
  const {
    form,
    milestones,
    onSubmit,
    handleAddMilestone,
    handleRemoveMilestone,
  } = useInitializeEscrowHook();

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col space-y-6"
      >
        <FormField
          control={form.control}
          name="client"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Client</FormLabel>
              <FormControl>
                <Input placeholder="Alice Address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="serviceProvider"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Service Provider</FormLabel>
              <FormControl>
                <Input placeholder="Bob Address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="platformAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Platform Address</FormLabel>
              <FormControl>
                <Input placeholder="Platform Public Key" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input
                  type="string"
                  placeholder="Enter the escrow amount"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="releaseSigner"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Release Signer</FormLabel>
              <FormControl>
                <Input placeholder="Enter the release signer" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <FormLabel>Milestones</FormLabel>
          {milestones.map((milestone, index) => (
            <div key={index} className="flex items-center space-x-4">
              <Input
                placeholder="Milestone Description"
                value={milestone.description}
                onChange={(e) => {
                  const updatedMilestones = [...milestones];
                  updatedMilestones[index].description = e.target.value;
                  form.setValue("milestones", updatedMilestones);
                }}
              />

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-52 justify-between"
                  >
                    {milestone.status
                      ? statusOptions.find(
                          (option) => option.value === milestone.status,
                        )?.label
                      : "Select Status"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-52 p-0">
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

              <Button
                onClick={() => handleRemoveMilestone(index)}
                className="p-2 bg-transparent text-red-500 rounded-md border-none shadow-none hover:bg-transparent hover:shadow-none hover:text-red-500 focus:ring-0 active:ring-0"
                disabled={index === 0}
              >
                <FaRegTrashCan className="h-5 w-5" />
              </Button>
            </div>
          ))}
          <Button
            className="w-full md:w-1/4"
            variant="secondary"
            onClick={handleAddMilestone}
            type="button"
          >
            Add Item
          </Button>
        </div>

        <Button className="w-full md:w-1/4" type="submit">
          Initialize Escrow
        </Button>
      </form>
    </Form>
  );
}
