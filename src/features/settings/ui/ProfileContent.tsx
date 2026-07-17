"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ProfileDetailsCard } from "@/features/settings/ui/ProfileDetailsCard";
import { ProfileEditForm } from "@/features/settings/ui/ProfileEditForm";
import { PreferencesSection } from "@/features/settings/ui/PreferencesSection";
import { PreferencesSectionSkeleton } from "@/features/settings/ui/PreferencesSectionSkeleton";
import {
  VerifiedWalletsSection,
  VerifiedWalletsSkeleton,
} from "@/features/settings/ui/VerifiedWalletsSection";
import { useAuth } from "@/providers/AuthProvider";

const ProfileContentSkeleton = () => (
  <div className="flex flex-col gap-6">
    <div className="flex flex-col gap-6 md:flex-row">
      <Card className="flex w-full flex-col md:w-1/2">
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-4 w-full max-w-sm" />
          </div>
          <Skeleton className="h-8 w-16" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Skeleton className="size-16 rounded-xl" />
            <div className="min-w-0 space-y-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </CardContent>
        <CardContent className="mt-auto flex justify-end pt-0">
          <div className="flex items-center gap-1.5">
            <Skeleton className="size-3.5 shrink-0 rounded-sm" />
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-28" />
          </div>
        </CardContent>
      </Card>
      <VerifiedWalletsSkeleton />
    </div>
    <PreferencesSectionSkeleton />
  </div>
);

export const ProfileContent = () => {
  const { user, isLoading, refetch } = useAuth();
  const [mode, setMode] = useState<"view" | "edit">("view");

  if (isLoading) {
    return <ProfileContentSkeleton />;
  }

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Unable to load profile</CardTitle>
          <CardDescription>
            We could not fetch your account details. Try again in a moment.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              refetch();
            }}
          >
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-6 md:flex-row">
        {mode === "view" ? (
          <ProfileDetailsCard user={user} onEdit={() => setMode("edit")} />
        ) : (
          <ProfileEditForm
            user={user}
            onCancel={() => setMode("view")}
            onSaved={() => setMode("view")}
          />
        )}
        <VerifiedWalletsSection />
      </div>
      <PreferencesSection />
    </div>
  );
};
