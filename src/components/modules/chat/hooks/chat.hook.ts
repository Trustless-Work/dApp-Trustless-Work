"use client";

import { useState, useCallback } from "react";
import type { Conversation, ChatMessage } from "@/@types/conversation.entity";
import { MOCK_CONVERSATIONS, MOCK_CHAT_MESSAGES } from "../constants/mock-conversations.constant";

export const useChat = () => {
  const [conversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>(MOCK_CHAT_MESSAGES);
  const [searchQuery, setSearchQuery] = useState("");
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  const selectedConversation = selectedConversationId 
    ? conversations.find(c => c.id === selectedConversationId) 
    : null;

  const selectedMessages = selectedConversationId 
    ? messages[selectedConversationId] || [] 
    : [];

  const filteredConversations = conversations.filter(conversation => {
    // Filter by search query
    const matchesSearch = conversation.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conversation.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by unread status if enabled
    if (showUnreadOnly) {
      const conversationMessages = messages[conversation.id] || [];
      const hasUnreadMessages = conversationMessages.some(msg => !msg.isRead && msg.sender === "contact");
      return matchesSearch && (conversation.unreadCount > 0 || hasUnreadMessages);
    }
    
    return matchesSearch;
  });

  const selectConversation = useCallback((conversationId: string) => {
    setSelectedConversationId(conversationId);
    
    // Mark messages as read when conversation is selected
    setMessages(prev => ({
      ...prev,
      [conversationId]: (prev[conversationId] || []).map(msg => ({
        ...msg,
        isRead: true
      }))
    }));
  }, []);

  const sendMessage = useCallback((text: string) => {
    if (!selectedConversationId || !text.trim()) return;

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      text: text.trim(),
      sender: "user",
      timestamp: new Date(),
      type: "text",
      isRead: true,
    };

    setMessages(prev => ({
      ...prev,
      [selectedConversationId]: [...(prev[selectedConversationId] || []), newMessage]
    }));

    // Simulate a response after a short delay
    setTimeout(() => {
      const responses = [
        "Thanks for your message! I'll get back to you soon.",
        "Received! Let me check on that for you.",
        "Got it! I'll review this and respond shortly.",
        "Thanks! I'll take a look and get back to you.",
      ];
      
      const responseMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        text: responses[Math.floor(Math.random() * responses.length)],
        sender: "contact",
        timestamp: new Date(),
        type: "text",
        isRead: false,
      };

      setMessages(prev => ({
        ...prev,
        [selectedConversationId]: [...(prev[selectedConversationId] || []), responseMessage]
      }));
    }, 1000 + Math.random() * 2000); // Random delay between 1-3 seconds
  }, [selectedConversationId]);

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
    sendMessage,
    clearSelection,
  };
}; 