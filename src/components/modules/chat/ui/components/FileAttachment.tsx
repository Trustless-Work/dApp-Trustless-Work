"use client";

import { X, File, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { AttachedFile } from "../../hooks/useFileAttachment.hook";
import { useFormatUtils } from "@/utils/hook/format.hook";

interface FileAttachmentProps {
  file: AttachedFile;
  onRemove: (fileId: string) => void;
  isUploading?: boolean;
}

export function FileAttachment({
  file,
  onRemove,
  isUploading = false,
}: FileAttachmentProps) {
  const { formatFileSize } = useFormatUtils();

  return (
    <div
      className={cn(
        "relative group border rounded-lg p-3 bg-background",
        file.error && "border-destructive bg-destructive/5",
        !file.error && "border-border",
      )}
    >
      {/* Remove button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute -top-2 -right-2 h-6 w-6 bg-background border shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => onRemove(file.id)}
        disabled={isUploading}
      >
        <X className="h-3 w-3" />
      </Button>

      <div className="flex items-start gap-3">
        {/* File preview/icon */}
        <div className="flex-shrink-0">
          {file.preview ? (
            <div className="w-12 h-12 rounded-md overflow-hidden bg-muted">
              <img
                src={file.preview}
                alt={file.name}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-md bg-muted flex items-center justify-center">
              {file.type.startsWith("image/") ? (
                <Image className="h-6 w-6 text-muted-foreground" />
              ) : (
                <File className="h-6 w-6 text-muted-foreground" />
              )}
            </div>
          )}
        </div>

        {/* File info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{file.name}</p>
          <p className="text-xs text-muted-foreground">
            {formatFileSize(file.size)}
          </p>

          {/* Error message */}
          {file.error && (
            <p className="text-xs text-destructive mt-1">{file.error}</p>
          )}

          {/* Upload progress */}
          {isUploading && file.uploadProgress !== undefined && !file.error && (
            <div className="mt-2">
              <Progress value={file.uploadProgress} className="h-1" />
              <p className="text-xs text-muted-foreground mt-1">
                {file.uploadProgress}% uploaded
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
