"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Conversation } from "@/@types/conversation.entity";

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversationId: string | null;
  onSelectConversation: (conversationId: string) => void;
}

export function ConversationList({
  conversations,
  selectedConversationId,
  onSelectConversation,
}: ConversationListProps) {
  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return "now";
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {conversations.map((conversation) => (
        <button
          key={conversation.id}
          onClick={(e) => {
            e.preventDefault();
            onSelectConversation(conversation.id);
          }}
          className={cn(
            "flex items-start gap-3 p-4 text-left hover:bg-sidebar-accent hover:text-sidebar-accent-foreground border-b last:border-b-0 transition-colors",
            selectedConversationId === conversation.id && "bg-sidebar-accent text-sidebar-accent-foreground"
          )}
        >
          <div className="relative">
            <Avatar className="h-10 w-10">
              <AvatarImage src={conversation.avatar} alt={conversation.name} />
              <AvatarFallback className="text-sm">
                {getInitials(conversation.name)}
              </AvatarFallback>
            </Avatar>
            {conversation.isOnline && (
              <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="font-medium truncate">{conversation.name}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {formatTimestamp(conversation.timestamp)}
                </span>
                {conversation.unreadCount > 0 && (
                  <Badge variant="default" className="h-5 w-5 p-0 text-xs rounded-full flex items-center justify-center min-w-[20px]">
                    {conversation.unreadCount > 9 ? "9+" : conversation.unreadCount}
                  </Badge>
                )}
              </div>
            </div>

            <p className="text-sm text-muted-foreground truncate mt-1">
              {conversation.lastMessage}
            </p>
          </div>
        </button>
      ))}

      {conversations.length === 0 && (
        <div className="p-8 text-center text-muted-foreground">
          <p>No conversations found</p>
        </div>
      )}
    </div>
  );
} 