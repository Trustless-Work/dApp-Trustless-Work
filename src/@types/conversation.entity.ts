export interface Conversation {
  id: string;
  name: string;
  email: string;
  avatar: string;
  lastMessage: string;
  timestamp: Date;
  unreadCount: number;
  isOnline: boolean;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "contact";
  timestamp: Date;
  type: "text" | "image" | "file";
  isRead: boolean;
}

export interface ChatSession {
  conversation: Conversation;
  messages: ChatMessage[];
}
