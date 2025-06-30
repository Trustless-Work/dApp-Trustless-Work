"use client";

import { MessageCircle, Search } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useChat } from "../../hooks/chat.hook";
import { ConversationList } from "../components/ConversationList";
import { ChatInterface } from "../components/ChatInterface";

export default function Chats() {
  const {
    conversations,
    selectedConversation,
    selectedMessages,
    searchQuery,
    setSearchQuery,
    showUnreadOnly,
    setShowUnreadOnly,
    selectConversation,
    sendMessage,
    clearSelection,
  } = useChat();

  return (
    <div className="h-[calc(100vh-220px)] flex gap-4">
      {/* Conversations Sidebar */}
      <Card className={`w-80 flex flex-col ${selectedConversation ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b space-y-4">
          <div className="flex w-full items-center justify-between">
            <div className="text-foreground text-base font-medium flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Chats
            </div>
            <Label className="flex items-center gap-2 text-sm">
              <span>Unread</span>
              <Switch 
                className="shadow-none" 
                checked={showUnreadOnly}
                onCheckedChange={setShowUnreadOnly}
              />
            </Label>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Search conversations..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-hidden">
          <ConversationList
            conversations={conversations}
            selectedConversationId={selectedConversation?.id || null}
            onSelectConversation={selectConversation}
          />
        </div>
      </Card>

      {/* Chat Interface */}
      <Card className={`flex-1 flex flex-col ${selectedConversation ? 'flex' : 'hidden md:flex'}`}>
        {selectedConversation ? (
          <ChatInterface
            conversation={selectedConversation}
            messages={selectedMessages}
            onSendMessage={sendMessage}
            onClose={clearSelection}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-muted/30">
            <div className="text-center space-y-4 max-w-md mx-auto p-8">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto">
                <MessageCircle className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Welcome to Chats</h3>
                <p className="text-muted-foreground text-sm">
                  Select a conversation from the sidebar to start messaging with your contacts about escrow projects and collaborations.
                </p>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
} 