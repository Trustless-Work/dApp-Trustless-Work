"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { FileDown } from "lucide-react";
import type { ChatMessage } from "@/@types/conversation.entity";

interface ChatMessageProps {
  message: ChatMessage;
  senderName?: string;
  senderAvatar?: string;
}

export function ChatMessage({
  message,
  senderName,
  senderAvatar,
}: ChatMessageProps) {
  const isUser = message.sender === "user";

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className={cn("flex gap-3 mb-4", isUser && "flex-row-reverse")}>
      {!isUser && (
        <Avatar className="h-8 w-8 mt-1">
          <AvatarImage src={senderAvatar} alt={senderName} />
          <AvatarFallback className="text-xs">
            {getInitials(senderName || "Contact")}
          </AvatarFallback>
        </Avatar>
      )}

      <div className={cn("flex flex-col gap-1", isUser && "items-end")}>
        <div
          className={cn(
            "max-w-xs lg:max-w-md px-3 py-2 rounded-lg text-sm space-y-2",
            isUser
              ? "bg-primary text-primary-foreground rounded-br-sm"
              : "bg-muted rounded-bl-sm",
          )}
        >
          {message.attachment && (
            <a
              href={message.attachment.data}
              download={message.attachment.name}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              {message.type === "image" ? (
                <img
                  src={message.attachment.data}
                  alt={message.attachment.name}
                  className="max-w-full rounded-md"
                />
              ) : (
                <div className="flex items-center gap-2 text-sm underline">
                  <FileDown className="h-4 w-4" />
                  <span>{message.attachment.name}</span>
                </div>
              )}
            </a>
          )}
          {message.text && <p className="break-words">{message.text}</p>}
        </div>

        <div className="flex items-center gap-1 px-1">
          <span className="text-xs text-muted-foreground">
            {formatTime(message.timestamp)}
          </span>
          {isUser && (
            <div className="flex items-center">
              {message.isRead ? (
                <div className="text-xs text-blue-500">✓✓</div>
              ) : (
                <div className="text-xs text-muted-foreground">✓</div>
              )}
            </div>
          )}
        </div>
      </div>

      {isUser && (
        <Avatar className="h-8 w-8 mt-1">
          <AvatarFallback className="text-xs bg-primary text-primary-foreground">
            You
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
