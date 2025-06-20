import { formatDate } from "@/lib/chat-utils"

interface DateSeparatorProps {
  date: Date
}

export function DateSeparator({ date }: DateSeparatorProps) {
  return (
    <div className="flex items-center justify-center">
      <div className="bg-muted px-3 py-1 rounded-full text-xs text-muted-foreground font-medium">
        {formatDate(date)}
      </div>
    </div>
  )
}
