"use client";

import { useState, useCallback, useRef } from "react";

export interface AttachedFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  preview?: string;
  uploadProgress?: number;
  error?: string;
}

interface UseFileAttachmentOptions {
  maxFileSize?: number; // in bytes, default 10MB
  allowedTypes?: string[]; // file types allowed
  maxFiles?: number; // maximum number of files
  onUpload?: (files: AttachedFile[]) => Promise<void>;
}

export const useFileAttachment = (options: UseFileAttachmentOptions = {}) => {
  const {
    maxFileSize = 10 * 1024 * 1024, // 10MB
    allowedTypes = [
      "image/jpeg",
      "image/png", 
      "image/gif",
      "image/webp",
      "application/pdf",
      "text/plain",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ],
    maxFiles = 5,
    onUpload
  } = options;

  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Generate file preview for images
  const generatePreview = useCallback((file: File): Promise<string | undefined> => {
    return new Promise((resolve) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = () => resolve(undefined);
        reader.readAsDataURL(file);
      } else {
        resolve(undefined);
      }
    });
  }, []);

  // Validate file
  const validateFile = useCallback((file: File): string | undefined => {
    if (file.size > maxFileSize) {
      return `File size exceeds ${Math.round(maxFileSize / (1024 * 1024))}MB limit`;
    }
    
    if (!allowedTypes.includes(file.type)) {
      return "File type not supported";
    }

    if (attachedFiles.length >= maxFiles) {
      return `Maximum ${maxFiles} files allowed`;
    }

    return undefined;
  }, [maxFileSize, allowedTypes, maxFiles, attachedFiles.length]);

  // Process and add files
  const processFiles = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const newFiles: AttachedFile[] = [];

    for (const file of fileArray) {
      const error = validateFile(file);
      const preview = await generatePreview(file);
      
      const attachedFile: AttachedFile = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        preview,
        error,
        uploadProgress: 0
      };

      newFiles.push(attachedFile);
    }

    setAttachedFiles(prev => [...prev, ...newFiles]);
    return newFiles;
  }, [validateFile, generatePreview]);

  // Handle file input change
  const handleFileSelect = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      await processFiles(files);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [processFiles]);

  // Handle drag and drop
  const handleDrop = useCallback(async (event: React.DragEvent<HTMLElement>) => {
    event.preventDefault();
    setDragActive(false);

    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      await processFiles(files);
    }
  }, [processFiles]);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLElement>) => {
    event.preventDefault();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent<HTMLElement>) => {
    event.preventDefault();
    setDragActive(false);
  }, []);

  // Remove file
  const removeFile = useCallback((fileId: string) => {
    setAttachedFiles(prev => prev.filter(file => file.id !== fileId));
  }, []);

  // Clear all files
  const clearFiles = useCallback(() => {
    setAttachedFiles([]);
  }, []);

  // Open file picker
  const openFilePicker = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  // Upload files (mock implementation)
  const uploadFiles = useCallback(async () => {
    if (attachedFiles.length === 0 || isUploading) return;

    setIsUploading(true);
    
    try {
      // Simulate upload progress
      for (let i = 0; i < attachedFiles.length; i++) {
        const file = attachedFiles[i];
        
        // Skip files with errors
        if (file.error) continue;

        // Simulate upload progress
        for (let progress = 0; progress <= 100; progress += 20) {
          await new Promise(resolve => setTimeout(resolve, 200));
          
          setAttachedFiles(prev => 
            prev.map(f => 
              f.id === file.id 
                ? { ...f, uploadProgress: progress }
                : f
            )
          );
        }
      }

      // Call external upload handler if provided
      if (onUpload) {
        const validFiles = attachedFiles.filter(f => !f.error);
        await onUpload(validFiles);
      }

      // Clear files after successful upload
      clearFiles();
      
    } catch (error) {
      console.error("Upload failed:", error);
      // Mark files with upload error
      setAttachedFiles(prev =>
        prev.map(file => ({
          ...file,
          error: file.error || "Upload failed"
        }))
      );
    } finally {
      setIsUploading(false);
    }
  }, [attachedFiles, isUploading, onUpload, clearFiles]);

  // Format file size
  const formatFileSize = useCallback((bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }, []);

  // Get file icon based on type
  const getFileIcon = useCallback((type: string): string => {
    if (type.startsWith("image/")) return "🖼️";
    if (type === "application/pdf") return "📄";
    if (type.includes("word") || type.includes("document")) return "📝";
    if (type === "text/plain") return "📄";
    return "📎";
  }, []);

  return {
    // State
    attachedFiles,
    isUploading,
    dragActive,
    fileInputRef,
    
    // Actions
    handleFileSelect,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    removeFile,
    clearFiles,
    openFilePicker,
    uploadFiles,
    
    // Helpers
    formatFileSize,
    getFileIcon,
    
    // Info
    hasFiles: attachedFiles.length > 0,
    hasErrors: attachedFiles.some(f => f.error),
    validFiles: attachedFiles.filter(f => !f.error),
    canUpload: attachedFiles.length > 0 && !isUploading && attachedFiles.some(f => !f.error)
  };
}; 