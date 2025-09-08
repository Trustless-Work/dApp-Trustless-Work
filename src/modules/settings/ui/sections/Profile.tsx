"use client";

import type { UserPayload } from "@/types/user.entity";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/ui/card";
import { Separator } from "@/ui/separator";
import { useGlobalAuthenticationStore } from "@/store/data";
import useProfile from "../../hooks/useProfileSection";
import { ProfileAvatar } from "../utils/ProfileAvatar";
import { ProfileForm } from "../forms/ProfileForm";
import { formatDateFromFirebase } from "@/lib/format";

interface ProfileProps {
  onSave: (data: UserPayload) => void;
}

export const Profile = ({ onSave }: ProfileProps) => {
  const { handleProfileImageUpload, handleProfileImageDelete, isUploadingImage } = useProfile({
    onSave,
  });
  const loggedUser = useGlobalAuthenticationStore((state) => state.loggedUser);

  return (
    <Card className="max-w-4xl mx-auto shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-medium">Profile</CardTitle>
            <CardDescription className="text-sm mt-1">
              Manage your personal information and preferences
            </CardDescription>
          </div>
          <span className="text-xs text-muted-foreground">
            Created:{" "}
            {formatDateFromFirebase(
              loggedUser?.createdAt?._seconds ?? 0,
              loggedUser?.createdAt?._nanoseconds ?? 0,
            )}
          </span>
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="pt-6">
        <ProfileAvatar
          profileImage={loggedUser?.profileImage}
          firstName={loggedUser?.firstName}
          lastName={loggedUser?.lastName}
          onUpload={handleProfileImageUpload}
          onDelete={handleProfileImageDelete}
          isUploading={isUploadingImage}
        />

        <ProfileForm onSave={onSave} />
      </CardContent>
    </Card>
  );
};
