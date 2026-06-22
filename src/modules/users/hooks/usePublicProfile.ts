"use client";

import { useEffect, useMemo, useState } from "react";
import { User } from "@/types/user.entity";
import { AuthService } from "../../auth/services/auth.service";
import { useContactsQuery } from "@/modules/contact/hooks/tanstack/useContactsQuery";
import {
  findContactByAddress,
  getDisplayInitials,
  resolveDisplayName,
} from "@/lib/resolve-display-name";

interface UsePublicProfileResult {
  user: User | null;
  contact: ReturnType<typeof findContactByAddress>;
  loading: boolean;
  error: string | null;
  fullName: string;
  initials: string;
  isContactOnly: boolean;
}

export function usePublicProfile(
  walletAddress: string,
): UsePublicProfileResult {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { data: contacts = [], isLoading: isContactsLoading } =
    useContactsQuery();

  useEffect(() => {
    async function fetchUser() {
      setLoading(true);
      setError(null);

      try {
        const response = await new AuthService().getUser(walletAddress);

        if (!response) {
          setUser(null);
          return;
        }

        setUser(response);
      } catch (err: unknown) {
        console.error("Error loading public profile:", err);
        setError("Failed to load user.");
      } finally {
        setLoading(false);
      }
    }

    if (walletAddress) {
      fetchUser();
    }
  }, [walletAddress]);

  const contact = useMemo(
    () => findContactByAddress(contacts, walletAddress),
    [contacts, walletAddress],
  );

  const isContactOnly = !user && Boolean(contact);

  const fullName = useMemo(
    () =>
      resolveDisplayName({
        address: walletAddress,
        user,
        contacts,
        fallback: "Anonymous User",
      }),
    [walletAddress, user, contacts],
  );

  const initials = useMemo(() => {
    if (fullName === "Anonymous User") {
      return walletAddress?.slice(0, 2).toUpperCase() || "?";
    }

    return getDisplayInitials(fullName);
  }, [fullName, walletAddress]);

  return {
    user,
    contact,
    loading: loading || isContactsLoading,
    error,
    fullName,
    initials,
    isContactOnly,
  };
}
