"use client";

import { ChevronsUpDownIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { UserAvatar } from "@/components/ui/user-avatar";
import type { UserResponse } from "@/features/auth/types/auth.types";
import {
  getUserCommandValue,
  getUserSecondaryLabel,
} from "@/features/organizations/helpers/member-from-user.helper";
import { getUserDisplayName } from "@/helpers/user-display.helper";

type UserSearchComboboxProps = {
  users: UserResponse[];
  value: string | null;
  onValueChange: (userId: string | null) => void;
  disabled?: boolean;
  placeholder?: string;
};

export const UserSearchCombobox = ({
  users,
  value,
  onValueChange,
  disabled = false,
  placeholder = "Search users...",
}: UserSearchComboboxProps) => {
  const [open, setOpen] = useState(false);
  const selectedUser = users.find((user) => user.id === value) ?? null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className="w-full justify-between font-normal"
        >
          {selectedUser ? (
            <span className="flex min-w-0 items-center gap-2">
              <UserAvatar user={selectedUser} size="sm" className="size-6" />
              <span className="truncate">
                {getUserDisplayName(selectedUser)}
              </span>
            </span>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDownIcon className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command>
          <CommandInput placeholder="Search by name, email, or ID..." />
          <CommandList>
            <CommandEmpty>No users found.</CommandEmpty>
            <CommandGroup>
              {users.map((user) => (
                <CommandItem
                  key={user.id}
                  value={getUserCommandValue(user)}
                  onSelect={() => {
                    onValueChange(user.id === value ? null : user.id);
                    setOpen(false);
                  }}
                  className="gap-2"
                >
                  <UserAvatar user={user} size="sm" className="size-8" />
                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate font-medium">
                      {getUserDisplayName(user)}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {getUserSecondaryLabel(user)}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
