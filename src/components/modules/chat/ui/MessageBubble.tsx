import { Message } from "@/@types/message.entity";

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  return (
    <div
      className={`flex flex-col ${message.sender === "user" ? "items-end" : "items-start"}`}
    >
      <div
        className={`max-w-[85%] px-3 py-2 rounded-lg text-sm ${
          message.sender === "user"
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground"
        }`}
      >
        {message.text}
      </div>
      <span className="text-xs text-muted-foreground mt-1 px-1">
        {/* {formatTime(message.timestamp)} */}
        {message.timestamp.toLocaleTimeString()}
      </span>
    </div>
  );
}
