"use client";

import { MessageCircle, Plus, Search } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
    startConversation,
    sendMessage,
    deleteConversation,
    clearSelection,
    contacts,
  } = useChat();

  return (
    <div className="h-[calc(100vh-220px)] flex gap-4">
      {/* Conversations Sidebar */}
      <Card
        className={`w-80 flex flex-col ${selectedConversation ? "hidden md:flex" : "flex"}`}
      >
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
          <Popover>
            <PopoverTrigger asChild>
              <Button
                size="sm"
                variant="secondary"
                className="w-full justify-start gap-2"
              >
                <Plus className="h-4 w-4" /> New Chat
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-60">
              <Select onValueChange={startConversation}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select contact" />
                </SelectTrigger>
                <SelectContent>
                  {contacts.map((c) => (
                    <SelectItem key={c.id} value={c.address}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </PopoverContent>
          </Popover>
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
      <Card
        className={`flex-1 flex flex-col ${selectedConversation ? "flex" : "hidden md:flex"}`}
      >
        {selectedConversation ? (
          <ChatInterface
            conversation={selectedConversation}
            messages={selectedMessages}
            onSendMessage={sendMessage}
            onDeleteConversation={() =>
              deleteConversation(selectedConversation.id)
            }
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
                  Select a conversation from the sidebar to start messaging with
                  your contacts about escrow projects and collaborations.
                </p>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
