"use client";

import { useRef } from "react";
import { Upload, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FileUploadZoneProps {
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDrop: (event: React.DragEvent<HTMLElement>) => void;
  onDragOver: (event: React.DragEvent<HTMLElement>) => void;
  onDragLeave: (event: React.DragEvent<HTMLElement>) => void;
  dragActive: boolean;
  disabled?: boolean;
  accept?: string;
  multiple?: boolean;
  compact?: boolean;
}

export function FileUploadZone({
  onFileSelect,
  onDrop,
  onDragOver,
  onDragLeave,
  dragActive,
  disabled = false,
  accept,
  multiple = true,
  compact = false,
}: FileUploadZoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  if (compact) {
    return (
      <>
        <input
          ref={fileInputRef}
          type="file"
          onChange={onFileSelect}
          accept={accept}
          multiple={multiple}
          className="hidden"
          disabled={disabled}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0"
          onClick={openFilePicker}
          disabled={disabled}
        >
          <Paperclip className="h-4 w-4" />
        </Button>
      </>
    );
  }

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        onChange={onFileSelect}
        accept={accept}
        multiple={multiple}
        className="hidden"
        disabled={disabled}
      />

      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer",
          dragActive && "border-primary bg-primary/5",
          !dragActive &&
            "border-muted-foreground/25 hover:border-muted-foreground/50",
          disabled && "opacity-50 cursor-not-allowed",
        )}
        onClick={openFilePicker}
      >
        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
        <p className="text-sm font-medium mb-1">
          {dragActive ? "Drop files here" : "Click to upload or drag and drop"}
        </p>
        <p className="text-xs text-muted-foreground">
          Images, PDFs, and documents up to 10MB
        </p>
      </div>
    </>
  );
}
