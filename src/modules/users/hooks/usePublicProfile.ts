"use client";

import { useEffect, useState } from "react";
import { User } from "@/types/user.entity";
import { AuthService } from "../../auth/services/auth.service";

interface UsePublicProfileResult {
  user: User | null;
  loading: boolean;
  error: string | null;
  fullName: string;
  initials: string;
}

export function usePublicProfile(
  walletAddress: string,
): UsePublicProfileResult {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

  const fullName =
    user?.firstName || user?.lastName
      ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
      : "Anonymous User";

  const initials =
    `${user?.firstName?.charAt(0) || ""}${user?.lastName?.charAt(0) || ""}` ||
    "?";

  return { user, loading, error, fullName, initials };
}
