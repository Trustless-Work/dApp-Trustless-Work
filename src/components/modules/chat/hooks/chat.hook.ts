"use client";

import { useState, useCallback, useEffect } from "react";
import type { Conversation, ChatMessage } from "@/@types/conversation.entity";
import { useContactStore } from "@/core/store/data/slices/contacts.slice";
import { useGlobalAuthenticationStore } from "@/core/store/data";
import {
  getOrCreateChat,
  sendMessage as sendMessageFirebase,
  subscribeToChats,
  subscribeToMessages,
} from "../server/chat.firebase";

export const useChat = () => {
  const address = useGlobalAuthenticationStore((state) => state.address);
  const fetchContacts = useContactStore((state) => state.fetchContacts);
  const contacts = useContactStore((state) => state.contacts);

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  useEffect(() => {
    if (address) {
      fetchContacts(address);
    }
  }, [address, fetchContacts]);

  useEffect(() => {
    if (!address) return;
    const unsubscribe = subscribeToChats(address, (chats) => {
      const mapped = chats.map((chat) => {
        const other = chat.participants.find((p) => p !== address) || "";
        const contact = contacts.find((c) => c.address === other);
        return {
          id: chat.id,
          name: contact?.name || other,
          email: contact?.email || "",
          avatar: "/avatars/default.jpg",
          lastMessage: chat.lastMessage || "",
          timestamp: chat.updatedAt
            ? new Date(chat.updatedAt.seconds * 1000)
            : new Date(),
          unreadCount: 0,
          isOnline: false,
        } as Conversation;
      });
      setConversations(mapped);
    });
    return () => unsubscribe();
  }, [address, contacts]);

  useEffect(() => {
    if (!selectedConversationId) return;
    const unsubscribe = subscribeToMessages(selectedConversationId, (msgs) => {
      const mapped = msgs.map((m) => ({
        id: m.id,
        text: m.text,
        sender: m.senderId === address ? "user" : "contact",
        timestamp: m.createdAt ? new Date(m.createdAt.seconds * 1000) : new Date(),
        type: "text",
        isRead: true,
      }));
      setMessages((prev) => ({ ...prev, [selectedConversationId]: mapped }));
    });
    return () => unsubscribe();
  }, [selectedConversationId, address]);

  const selectedConversation = selectedConversationId
    ? conversations.find((c) => c.id === selectedConversationId)
    : null;

  const selectedMessages = selectedConversationId
    ? messages[selectedConversationId] || []
    : [];

  const filteredConversations = conversations.filter((conversation) => {
    // Filter by search query
    const matchesSearch =
      conversation.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conversation.email.toLowerCase().includes(searchQuery.toLowerCase());

    // Filter by unread status if enabled
    if (showUnreadOnly) {
      const conversationMessages = messages[conversation.id] || [];
      const hasUnreadMessages = conversationMessages.some(
        (msg) => !msg.isRead && msg.sender === "contact",
      );
      return (
        matchesSearch && (conversation.unreadCount > 0 || hasUnreadMessages)
      );
    }

    return matchesSearch;
  });

  const selectConversation = useCallback((conversationId: string) => {
    setSelectedConversationId(conversationId);
  }, []);

  const startConversation = useCallback(
    async (contactAddress: string) => {
      if (!address) return;
      const chatId = await getOrCreateChat(address, contactAddress);
      setSelectedConversationId(chatId);
    },
    [address],
  );

  const sendMessage = useCallback(
    async (text: string) => {
      if (!selectedConversationId || !address || !text.trim()) return;
      await sendMessageFirebase(selectedConversationId, address, text.trim());
    },
    [selectedConversationId, address],
  );

  const clearSelection = useCallback(() => {
    setSelectedConversationId(null);
  }, []);

  return {
    conversations: filteredConversations,
    selectedConversation,
    selectedMessages,
    searchQuery,
    setSearchQuery,
    showUnreadOnly,
    setShowUnreadOnly,
    selectConversation,
    startConversation,
    sendMessage,
    clearSelection,
    contacts,
  };
};
