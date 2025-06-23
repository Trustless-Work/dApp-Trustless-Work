"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";
import type { Message } from "@/@types/message.entity";
import { generateBotResponse } from "@/components/modules/chat/utils/chat.utils";
import { ChatButton } from "./ChatButton";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";

export function FloatingChat() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "¡Hola! ¿En qué puedo ayudarte hoy?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const handleSendMessage = (messageText: string) => {
    const newMessage: Message = {
      id: messages.length + 1,
      text: messageText,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);

    // Simular respuesta del bot después de un breve delay
    setTimeout(() => {
      const botResponse: Message = {
        id: messages.length + 2,
        text: generateBotResponse(),
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 1000);
  };

  return (
    <>
      <ChatButton isOpen={isChatOpen} onClick={toggleChat} />

      {isChatOpen && (
        <Card className="fixed bottom-24 right-6 w-80 h-[500px] shadow-lg z-40 animate-in slide-in-from-bottom-5 duration-300 border overflow-hidden">
          <CardHeader className="p-4 pb-2 space-y-1">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-medium">
                Chat de Soporte
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={toggleChat}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <div className="flex flex-col h-[calc(100%-8rem)]">
            <MessageList messages={messages} />
          </div>

          <CardFooter className="p-3 border-t bg-card">
            <MessageInput onSendMessage={handleSendMessage} />
          </CardFooter>
        </Card>
      )}
    </>
  );
}
