"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Paperclip, Send, X } from "lucide-react";
import InputEmoji from "react-input-emoji";
import { useFileAttachment } from "../../hooks/useFileAttachment.hook";
import { FileAttachment } from "./FileAttachment";
import { FileUploadZone } from "./FileUploadZone";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSendMessage, disabled = false }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [showFileZone, setShowFileZone] = useState(false);
  
  const {
    attachedFiles,
    isUploading,
    dragActive,
    hasFiles,
    handleFileSelect,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    removeFile,
    clearFiles,
    openFilePicker,
  } = useFileAttachment({
    maxFiles: 3,
    maxFileSize: 10 * 1024 * 1024, // 10MB
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((message.trim() || hasFiles) && !disabled) {
      // Here you could handle both message and files
      if (message.trim()) {
        onSendMessage(message);
      }
      // Handle files separately or together with message
      setMessage("");
      clearFiles();
      setShowFileZone(false);
    }
  };

  const handleOnEnter = (text: string) => {
    if ((text.trim() || hasFiles) && !disabled) {
      // Here you could handle both message and files
      if (text.trim()) {
        onSendMessage(text);
      }
      // Handle files separately or together with message
      setMessage("");
      clearFiles();
      setShowFileZone(false);
    }
  };

  const toggleFileZone = () => {
    setShowFileZone(!showFileZone);
  };

  return (
    <div className="border-t bg-background">
      {/* File Attachments Preview */}
      {hasFiles && (
        <div className="p-4 border-b bg-muted/30">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium">Attached files ({attachedFiles.length})</span>
            <Button variant="ghost" size="sm" onClick={clearFiles}>
              <X className="h-4 w-4" />
              Clear all
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {attachedFiles.map((file) => (
              <FileAttachment
                key={file.id}
                file={file}
                onRemove={removeFile}
                isUploading={isUploading}
              />
            ))}
          </div>
        </div>
      )}

      {/* File Upload Zone */}
      {showFileZone && (
        <div className="p-4 border-b">
          <FileUploadZone
            onFileSelect={handleFileSelect}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            dragActive={dragActive}
            disabled={disabled}
            accept="image/*,.pdf,.doc,.docx,.txt"
          />
        </div>
      )}

      {/* Message Input */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2 p-4">
        <Button 
          type="button" 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 shrink-0"
          onClick={toggleFileZone}
          disabled={disabled}
        >
          <Paperclip className="h-4 w-4" />
        </Button>
        
        <div className="flex-1">
          <InputEmoji
            value={message}
            onChange={setMessage}
            onEnter={handleOnEnter}
            placeholder="Type a message..."
            cleanOnEnter={false}
            keepOpened={false}
            shouldReturn={false}
            shouldConvertEmojiToImage={false}
            language="en"
            theme="auto"
            fontSize={14}
            height={40}
            borderRadius={8}
            borderColor="hsl(var(--border))"
            background="hsl(var(--background))"
            color="hsl(var(--foreground))"
            placeholderColor="hsl(var(--muted-foreground))"
          />
        </div>
        
        <Button 
          type="submit" 
          size="icon" 
          className="h-8 w-8 shrink-0"
          disabled={(!message.trim() && !hasFiles) || disabled}
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
} 