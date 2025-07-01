import type { Conversation, ChatMessage } from "@/@types/conversation.entity";

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: "1",
    name: "Alice Smith",
    email: "alice.smith@example.com",
    avatar: "/avatars/default.jpg",
    lastMessage: "Thanks for the quick response on the escrow setup!",
    timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    unreadCount: 2,
    isOnline: true,
  },
  {
    id: "2",
    name: "Bob Johnson",
    email: "bob.johnson@example.com",
    avatar: "/avatars/default.jpg",
    lastMessage: "Can we schedule a call to discuss the project details?",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    unreadCount: 0,
    isOnline: false,
  },
  {
    id: "3",
    name: "Emily Davis",
    email: "emily.davis@example.com",
    avatar: "/avatars/default.jpg",
    lastMessage: "The milestone has been completed. Please review.",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    unreadCount: 1,
    isOnline: true,
  },
  {
    id: "4",
    name: "Michael Wilson",
    email: "michael.wilson@example.com",
    avatar: "/avatars/default.jpg",
    lastMessage: "Looking forward to working together on this escrow.",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    unreadCount: 0,
    isOnline: false,
  },
  {
    id: "5",
    name: "Sarah Brown",
    email: "sarah.brown@example.com",
    avatar: "/avatars/default.jpg",
    lastMessage: "I've sent the initial proposal. Let me know your thoughts.",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    unreadCount: 3,
    isOnline: true,
  },
  {
    id: "6",
    name: "David Lee",
    email: "david.lee@example.com",
    avatar: "/avatars/default.jpg",
    lastMessage: "The payment has been released successfully.",
    timestamp: new Date(Date.now() - 1 * 7 * 24 * 60 * 60 * 1000), // 1 week ago
    unreadCount: 0,
    isOnline: false,
  },
];

export const MOCK_CHAT_MESSAGES: Record<string, ChatMessage[]> = {
  "1": [
    {
      id: "msg1",
      text: "Hi there! I wanted to discuss the escrow setup for our project.",
      sender: "contact",
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      type: "text",
      isRead: true,
    },
    {
      id: "msg2",
      text: "Hello Alice! I'd be happy to help you with the escrow setup. What specific details would you like to discuss?",
      sender: "user",
      timestamp: new Date(Date.now() - 25 * 60 * 1000),
      type: "text",
      isRead: true,
    },
    {
      id: "msg3",
      text: "I need to understand the milestone structure and how the approval process works.",
      sender: "contact",
      timestamp: new Date(Date.now() - 20 * 60 * 1000),
      type: "text",
      isRead: true,
    },
    {
      id: "msg4",
      text: "Great! Milestones allow you to break down payments into stages. Each milestone needs approval before funds are released.",
      sender: "user",
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      type: "text",
      isRead: true,
    },
    {
      id: "msg5",
      text: "Thanks for the quick response on the escrow setup!",
      sender: "contact",
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      type: "text",
      isRead: false,
    },
  ],
  "2": [
    {
      id: "msg6",
      text: "Hey! I've reviewed the project requirements and I'm interested in working together.",
      sender: "contact",
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      type: "text",
      isRead: true,
    },
    {
      id: "msg7",
      text: "That's great to hear! I'd love to discuss the details further.",
      sender: "user",
      timestamp: new Date(Date.now() - 2.5 * 60 * 60 * 1000),
      type: "text",
      isRead: true,
    },
    {
      id: "msg8",
      text: "Can we schedule a call to discuss the project details?",
      sender: "contact",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      type: "text",
      isRead: true,
    },
  ],
  "3": [
    {
      id: "msg9",
      text: "Hello! I wanted to update you on the project progress.",
      sender: "contact",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      type: "text",
      isRead: true,
    },
    {
      id: "msg10",
      text: "I appreciate the update! How are things progressing?",
      sender: "user",
      timestamp: new Date(Date.now() - 1.8 * 24 * 60 * 60 * 1000),
      type: "text",
      isRead: true,
    },
    {
      id: "msg11",
      text: "The milestone has been completed. Please review.",
      sender: "contact",
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      type: "text",
      isRead: false,
    },
  ],
};
