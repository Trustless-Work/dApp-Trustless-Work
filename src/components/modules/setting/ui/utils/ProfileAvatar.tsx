"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera, Trash2 } from "lucide-react";

interface ProfileAvatarProps {
  profileImage?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  onUpload: (file: File) => void;
  onDelete: () => void;
}

export const ProfileAvatar = ({
  profileImage,
  firstName,
  lastName,
  onUpload,
  onDelete,
}: ProfileAvatarProps) => {
  return (
    <div className="flex flex-col items-center mb-8">
      <div className="relative group">
        <Avatar className="h-32 w-32 border-2 border-background shadow-sm">
          <AvatarImage
            className="object-cover"
            src={profileImage || "/placeholder.svg"}
            alt={firstName || "User"}
          />
          <AvatarFallback className="text-xl">
            {firstName ? firstName.charAt(0) : ""}
            {lastName ? lastName.charAt(0) : ""}
          </AvatarFallback>
        </Avatar>

        <label className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer">
          <Camera className="h-5 w-5 mb-1" />
          <span className="text-xs font-medium">Change</span>
          <Input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onUpload(file);
            }}
          />
        </label>
      </div>

      {profileImage && (
        <Button
          variant="ghost"
          size="sm"
          className="mt-2 text-xs text-destructive hover:text-destructive/90 hover:bg-destructive/10"
          onClick={onDelete}
        >
          <Trash2 className="h-3.5 w-3.5 mr-1" />
          Remove photo
        </Button>
      )}
    </div>
  );
};
