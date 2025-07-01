import { ScrollArea } from "@/components/ui/scroll-area";
import type { Message } from "@/@types/message.entity";
import { DateSeparator } from "./DateSeparator";
import { MessageBubble } from "./MessageBubble";

interface MessageListProps {
  messages: Message[];
}

const groupMessagesByDate = (
  messages: Message[],
): Record<string, Message[]> => {
  return messages.reduce(
    (groups, message) => {
      const date = message.timestamp.toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
      return groups;
    },
    {} as Record<string, Message[]>,
  );
};

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
