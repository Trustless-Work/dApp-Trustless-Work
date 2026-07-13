"use client";

import { createContext, useContext } from "react";
import { useSession } from "@/features/auth/hooks/useSession";
import type { UserResponse } from "@/types";

type AuthContextValue = {
  user: UserResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  refetch: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

type AuthProviderProps = {
  children: React.ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { data, isLoading, refetch } = useSession();

  const value: AuthContextValue = {
    user: data ?? null,
    isAuthenticated: Boolean(data),
    isLoading,
    refetch: () => {
      void refetch();
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
