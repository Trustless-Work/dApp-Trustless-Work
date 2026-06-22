"use client";

import { useMemo } from "react";
import { useUserByAddress } from "@/modules/auth/hooks/useUserByAddress";
import { useContactsQuery } from "@/modules/contact/hooks/tanstack/useContactsQuery";
import {
  findContactByAddress,
  resolveDisplayName,
} from "@/lib/resolve-display-name";

interface UseDisplayNameByAddressOptions {
  enabled?: boolean;
  fallback?: string;
  fixedLabel?: string;
}

export function useDisplayNameByAddress(
  address?: string | null,
  options: UseDisplayNameByAddressOptions = {},
) {
  const { enabled = true, fallback = "Without Name", fixedLabel } = options;
  const shouldResolve = enabled && Boolean(address) && !fixedLabel;

  const { data: user, isLoading: isUserLoading } = useUserByAddress(
    shouldResolve ? address : null,
  );
  const { data: contacts = [], isLoading: isContactsLoading } =
    useContactsQuery();

  const contact = useMemo(
    () => findContactByAddress(contacts, address),
    [contacts, address],
  );

  const displayName = useMemo(
    () =>
      resolveDisplayName({
        address,
        user,
        contacts,
        fallback,
        fixedLabel,
      }),
    [address, user, contacts, fallback, fixedLabel],
  );

  return {
    displayName,
    contact,
    user,
    isLoading: shouldResolve && (isUserLoading || isContactsLoading),
  };
}
