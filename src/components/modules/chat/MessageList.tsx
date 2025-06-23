import { ScrollArea } from "@/components/ui/scroll-area";
import { groupMessagesByDate } from "@/lib/chat-utils";
import type { Message } from "@/lib/chat-type";
import { DateSeparator } from "./DateSeparator";
import { MessageBubble } from "./MessageBubble";

interface MessageListProps {
  messages: Message[];
}

export function MessageList({ messages }: MessageListProps) {
  const messageGroups = groupMessagesByDate(messages);

  return (
    <ScrollArea className="flex-1 px-4">
      <div className="space-y-4 py-4">
        {Object.entries(messageGroups).map(([dateKey, dayMessages]) => (
          <div key={dateKey} className="space-y-3">
            <DateSeparator date={dayMessages[0].timestamp} />
            {dayMessages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
