"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/ui/avatar";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Camera, Trash2, Loader2 } from "lucide-react";

interface ProfileAvatarProps {
  profileImage?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  onUpload: (file: File) => void;
  onDelete: () => void;
  isUploading?: boolean;
}

export const ProfileAvatar = ({
  profileImage,
  firstName,
  lastName,
  onUpload,
  onDelete,
  isUploading = false,
}: ProfileAvatarProps) => {
  return (
    <div className="flex flex-col items-center mb-8">
      <div className="relative group">
        <Avatar className="h-32 w-32 border-2 border-background shadow-sm">
          {profileImage ? (
            <AvatarImage
              className="object-cover"
              src={profileImage}
              alt={firstName || "User"}
            />
          ) : (
            <AvatarFallback className="text-xl">
              {firstName ? firstName.charAt(0) : "?"}
              {lastName ? lastName.charAt(0) : "?"}
            </AvatarFallback>
          )}
        </Avatar>

        {/* Hover overlay to change image */}
        <label className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer">
          <Camera className="h-5 w-5 mb-1" />
          <span className="text-xs font-medium">Change</span>
          <Input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={isUploading}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onUpload(file);
            }}
          />
        </label>

        {/* Uploading overlay */}
        {isUploading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 rounded-full text-white">
            <Loader2 className="h-6 w-6 animate-spin mb-1" />
            <span className="text-xs">Uploading...</span>
          </div>
        )}
      </div>

      {profileImage && (
        <Button
          variant="ghost"
          size="sm"
          className="mt-2 text-xs text-destructive hover:text-destructive/90 hover:bg-destructive/10"
          onClick={onDelete}
          disabled={isUploading}
        >
          <Trash2 className="h-3.5 w-3.5 mr-1" />
          Remove photo
        </Button>
      )}
    </div>
  );
};
