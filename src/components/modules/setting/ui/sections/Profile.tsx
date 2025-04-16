"use client";

import type { UserPayload } from "@/@types/user.entity";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useGlobalAuthenticationStore } from "@/core/store/data";
import { useFormatUtils } from "@/utils/hook/format.hook";
import useProfile from "../../hooks/profile-section.hook";
import { ProfileAvatar } from "../utils/ProfileAvatar";
import { ProfileForm } from "../forms/ProfileForm";

interface ProfileProps {
  onSave: (data: UserPayload) => void;
}

export const Profile = ({ onSave }: ProfileProps) => {
  const { handleProfileImageUpload, handleProfileImageDelete } = useProfile({
    onSave,
  });
  const loggedUser = useGlobalAuthenticationStore((state) => state.loggedUser);
  const { formatDateFromFirebase } = useFormatUtils();

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
              loggedUser?.createdAt?.seconds ?? 0,
              loggedUser?.createdAt?.nanoseconds ?? 0,
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
        />

        <ProfileForm onSave={onSave} />
      </CardContent>
    </Card>
  );
};
