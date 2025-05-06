"use client";

import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { User } from "@/@types/user.entity";
import { db } from "@/core/config/firebase/firebase";
import { format, isValid, parseISO } from "date-fns";

interface UsePublicProfileResult {
  user: User | null;
  loading: boolean;
  error: string | null;
  fullName: string;
  initials: string;
  memberSince: string;
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
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("address", "==", walletAddress));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
          setUser(null);
          return;
        }

        const data = snapshot.docs[0].data() as User;
        setUser(data);
      } catch (err: any) {
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

  const formatDate = (input: any): string => {
    if (!input) return "N/A";

    try {
      if (typeof input === "string") {
        const date = parseISO(input);
        if (isValid(date)) {
          return format(date, "MM/dd/yyyy");
        }
      }

      if (typeof input === "object" && typeof input.toDate === "function") {
        const date = input.toDate();
        if (isValid(date)) {
          return format(date, "MM/dd/yyyy");
        }
      }

      return "N/A";
    } catch (e) {
      console.error("Date parsing error:", e);
      return "N/A";
    }
  };

  const fullName =
    user?.firstName || user?.lastName
      ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
      : "Anonymous User";

  const initials =
    `${user?.firstName?.charAt(0) || ""}${user?.lastName?.charAt(0) || ""}` ||
    "?";

  const memberSince = user?.createdAt ? formatDate(user.createdAt) : "N/A";

  return { user, loading, error, fullName, initials, memberSince };
}
