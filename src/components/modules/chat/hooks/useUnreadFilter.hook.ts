"use client";

import { useState, useMemo } from "react";
import type { Conversation, ChatMessage } from "@/@types/conversation.entity";

export const useUnreadFilter = (
  conversations: Conversation[],
  messages: Record<string, ChatMessage[]>,
) => {
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  const filteredConversations = useMemo(() => {
    if (!showUnreadOnly) {
      return conversations;
    }

    return conversations.filter((conversation) => {
      // Check if conversation has unread count
      if (conversation.unreadCount > 0) {
        return true;
      }

      // Check if conversation has unread messages
      const conversationMessages = messages[conversation.id] || [];
      const hasUnreadMessages = conversationMessages.some(
        (msg) => !msg.isRead && msg.sender === "contact",
      );

      return hasUnreadMessages;
    });
  }, [conversations, messages, showUnreadOnly]);

  const unreadCount = useMemo(() => {
    return conversations.reduce((total, conversation) => {
      const conversationMessages = messages[conversation.id] || [];
      const unreadMessages = conversationMessages.filter(
        (msg) => !msg.isRead && msg.sender === "contact",
      ).length;

      return total + Math.max(conversation.unreadCount, unreadMessages);
    }, 0);
  }, [conversations, messages]);

  const toggleUnreadFilter = () => {
    setShowUnreadOnly((prev) => !prev);
  };

  return {
    showUnreadOnly,
    setShowUnreadOnly,
    toggleUnreadFilter,
    filteredConversations,
    unreadCount,
  };
};
