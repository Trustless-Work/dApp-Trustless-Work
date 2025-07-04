"use client";

import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatHeader } from "./ChatHeader";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { DateSeparator } from "../DateSeparator";
import type {
  Conversation,
  ChatMessage as ChatMessageType,
} from "@/@types/conversation.entity";

interface ChatInterfaceProps {
  conversation: Conversation;
  messages: ChatMessageType[];
  onSendMessage: (message: string) => void;
  onClose?: () => void;
}

export function ChatInterface({
  conversation,
  messages,
  onSendMessage,
  onClose,
}: ChatInterfaceProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current && scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]",
      );
      if (scrollContainer) {
        scrollContainer.scrollTo({
          top: scrollContainer.scrollHeight,
          behavior: "smooth",
        });
      }
    }
  }, [messages]);

  const groupedMessages = messages.reduce(
    (groups, message) => {
      const date = message.timestamp.toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
      return groups;
    },
    {} as Record<string, ChatMessageType[]>,
  );

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <ChatHeader conversation={conversation} onClose={onClose} />

      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-1">
          {Object.entries(groupedMessages).map(([date, dateMessages]) => (
            <div key={date}>
              <DateSeparator date={new Date(date)} />
              {dateMessages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  senderName={conversation.name}
                  senderAvatar={conversation.avatar}
                />
              ))}
            </div>
          ))}

          {messages.length === 0 && (
            <div className="flex items-center justify-center h-32 text-muted-foreground">
              <p>Start your conversation with {conversation.name}</p>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <ChatInput onSendMessage={onSendMessage} />
    </div>
  );
}
