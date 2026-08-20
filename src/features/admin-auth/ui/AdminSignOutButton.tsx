"use client";

import { LogOutIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useAdminSignOut } from "@/features/admin-auth/hooks/useAdminSignOut";

export const AdminSignOutButton = () => {
  const { signOut, isSigningOut } = useAdminSignOut();

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={isSigningOut}
      onClick={() => {
        void signOut();
      }}
    >
      {isSigningOut ? (
        <Spinner data-icon="inline-start" />
      ) : (
        <LogOutIcon data-icon="inline-start" />
      )}
      Sign out
    </Button>
  );
};
